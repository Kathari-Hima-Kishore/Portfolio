'use client'

import { useEffect, useRef, useState, useCallback, memo, Suspense } from 'react'
import Spline from '@splinetool/react-spline'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa'
import { getPerformanceTier } from '@/lib/performance'
import { useDeviceType } from '@/lib/device'

gsap.registerPlugin(ScrollTrigger)

if (typeof window !== 'undefined') {
  // Aggressively suppress the harmless but annoying OpenType warning from Spline/opentype.js
  const originalConsoleError = console.error.bind(console);
  console.error = (...args) => {
    const msg = args.map(a => (typeof a === 'object' && a?.message ? a.message : String(a))).join(' ')
    if (msg.includes('Unsupported OpenType signature PK')) return;
    originalConsoleError(...args);
  };

  const silenceNextJsErrorOverlay = (e: ErrorEvent | PromiseRejectionEvent) => {
    const msg = 'message' in e ? e.message : (e.reason?.message || String(e.reason));
    if (msg?.includes('Unsupported OpenType signature PK')) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  };

  window.addEventListener('error', silenceNextJsErrorOverlay, true);
  window.addEventListener('unhandledrejection', silenceNextJsErrorOverlay, true);
}

interface SplineBackgroundProps {
  isLoading: boolean
  activePhase: number
  onLoaded?: () => void
}

/**
 * ── Adaptive render resolution ─────────────────────────────────────────────
 *
 * The scene is the visual centrepiece, so we want its WebGL drawing buffer at
 * the HIGHEST resolution the GPU can sustain while the page still holds ~60fps.
 * That ceiling is machine-specific (this machine's Intel iGPU is fill-rate bound
 * far earlier than a discrete GPU), so rather than hard-coding a factor we
 * measure the real frame rate and converge on it:
 *
 *   floor   = the device's native DPR   (we never render BELOW native)
 *   ceiling = native DPR * MAX_SUPERSAMPLE_FACTOR   (supersampling)
 *
 * We start at the floor and climb while frames are comfortably fast. A step
 * that drops frames is remembered as the ceiling so the scene never flickers
 * between resolutions afterwards.
 */
const MAX_SUPERSAMPLE_FACTOR = 1.6
/** Absolute ceiling so an ultra-high-DPR display can't explode the buffer. */
const MAX_PIXEL_RATIO = 2.5

/** Frames per second the controller aims to stay inside. */
const TARGET_FPS_LOW = 55 // at/under this we step resolution down (or fail a probe)
const TARGET_FPS_HIGH = 58 // above this, sustained, we may step up
/** How long each frame-rate sample covers. */
const ADAPT_TICK_MS = 900
/** Ignore the opening ticks while the scene fades in / shaders compile. */
const ADAPT_WARMUP_MS = 1800
/** Consecutive good/bad samples required before acting (damps transients). */
const ADAPT_GOOD_SAMPLES = 2
const ADAPT_BAD_SAMPLES = 3
/** Resolution step, in pixel-ratio units. */
const ADAPT_STEP = 0.2
/** Probe window: ticks measured at a candidate resolution before deciding. */
const ADAPT_PROBE_TICKS = 2

/** The device's native drawing-buffer pixel ratio. Never render below this. */
function nativePixelRatio(): number {
  const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1
  return Math.max(dpr, 1)
}
/** Highest pixel ratio we will ever try (native * supersample, hard-capped). */
function ceilingPixelRatio(): number {
  return Math.min(nativePixelRatio() * MAX_SUPERSAMPLE_FACTOR, MAX_PIXEL_RATIO)
}

export const SplineBackground = memo(function SplineBackground({
  isLoading,
  activePhase,
  onLoaded,
}: SplineBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [tier] = useState(() => getPerformanceTier())
  const { shouldLoadSpline } = useDeviceType()
  const splineInstanceRef = useRef<any>(null)
  const rendererRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const splineWrapperRef = useRef<HTMLDivElement>(null)
  const triggersRef = useRef<ScrollTrigger[]>([])
  const [audioEnabled, setAudioEnabled] = useState(false)
  const isManuallyMuted = useRef(true)

  // ...Hooks must all be declared before any early returns...

  // ── Audio init ──────────────────────────────────────────────────────────
  const initAudio = useCallback(async () => {
    let success = false
    const audioContexts = (window as any)._audioContexts || []

    if (audioContexts.length > 0) {
      await Promise.all(
        audioContexts.map(async (ctx: AudioContext) => {
          try {
            if (ctx.state !== 'closed') {
              await ctx.resume()
              if (ctx.state === 'running') success = true
            }
          } catch { }
        })
      )
    } else {
      const AC = window.AudioContext || (window as any).webkitAudioContext
      if (AC) {
        try {
          const ctx = new AC()
          await ctx.resume()
          success = true
        } catch (e) {
          console.warn('Audio init failed', e)
        }
      }
    }

    const app = splineInstanceRef.current
    if (app) {
      const runtime = app.runtime || app._runtime || app
      if (runtime?.audioContext) {
        try {
          if (runtime.audioContext.state !== 'closed') {
            await runtime.audioContext.resume()
          }
        } catch { }
      }
    }

    if (success) setAudioEnabled(true)
  }, [])

  const handleInteraction = useCallback(() => {
    if (!audioEnabled && !isManuallyMuted.current) initAudio()
  }, [initAudio, audioEnabled])

  // One-shot global interaction listeners
  useEffect(() => {
    const events = ['click', 'touchstart', 'keydown', 'mousemove', 'wheel'] as const
    const handler = () => {
      if (!audioEnabled && !isManuallyMuted.current) initAudio()
    }
    events.forEach(e => window.addEventListener(e, handler, { once: true, passive: true }))
    return () => events.forEach(e => window.removeEventListener(e, handler))
  }, [initAudio, audioEnabled])

  // Mute enforcement — only run when audio is supposed to be OFF
  // Use 500ms interval instead of 200ms to halve CPU burn
  useEffect(() => {
    if (audioEnabled) return
    const interval = setInterval(() => {
      const ctxs: AudioContext[] = (window as any)._audioContexts || []
      for (const ctx of ctxs) {
        if (ctx.state === 'running') ctx.suspend().catch(() => { })
      }
    }, 500)
    return () => clearInterval(interval)
  }, [audioEnabled])

  // Configure the WebGL renderer's quality once it exists. Returns true when
  // the renderer was found. Idempotent, and safe to call repeatedly: the
  // runtime re-enables some of its own effects between frames.
  const applyPerfPatches = useCallback((splineApp: any) => {
    try {
      // The runtime exposes its renderer as `_renderer` (there is no public
      // `renderer` getter). Falling back to `renderer` guards future versions.
      const renderer = splineApp?._renderer || splineApp?.renderer
      if (!renderer) return false
      rendererRef.current = renderer

      // Disable the high-res transmission (glass) render target. Independent of
      // the drawing-buffer resolution, so it costs no sharpness.
      try { renderer.hdTransmission = false } catch { }

      // Bypass the runtime's TAA (temporal AA) pass. The Spline editor/viewer
      // uses SMAA instead; TAA both softens the image (~18% less high-frequency
      // detail) and burns a full-resolution pass. The runtime flips `.enabled`
      // back on each frame, so we no-op the draw and stop it swapping buffers —
      // keeping the composer's read/write chain intact.
      const taa = renderer.pipeline?.taaPass
      if (taa && !taa.__bypassed) {
        taa.__bypassed = true
        taa.enabled = false
        taa.render = () => { }
        taa.needsSwap = false
      }

      // Cache the shadow map. All 38 shadow casters in this scene are static
      // and it has no object animations, so the map is identical every frame.
      // Render it once, then skip the per-frame shadow pass entirely (a large,
      // lossless win). Re-triggered on resize / tab resume for safety.
      const sm = renderer.shadowMap
      if (sm && sm.autoUpdate !== false) {
        sm.autoUpdate = false
        sm.needsUpdate = true
      }

      return true
    } catch (err) {
      console.error('Spline config error:', err)
      return false
    }
  }, [])

  // Apply a drawing-buffer pixel ratio. `setPixelRatio()` alone is a no-op for
  // the framebuffer here — the runtime's `setSize()` guard ignores an unchanged
  // logical size — so we follow it with the runtime's own nudge resize
  // (`_resize(true)`, its built-in 1px jiggle), which reallocates every render
  // target at the new ratio.
  const applyPixelRatio = useCallback((ratio: number) => {
    const renderer = rendererRef.current
    const instance = splineInstanceRef.current
    if (!renderer || !instance) return
    const clamped = Math.min(Math.max(ratio, nativePixelRatio()), ceilingPixelRatio())
    if (Math.abs((renderer.getPixelRatio?.() ?? 0) - clamped) < 0.001) return
    try {
      renderer.setPixelRatio(clamped)
      instance._resize?.(true)
    } catch (err) {
      console.error('Spline resize error:', err)
    }
  }, [])

  // Spline onLoad
  const onLoad = useCallback((splineApp: any) => {
    splineInstanceRef.current = splineApp
    try {
      applyPerfPatches(splineApp)

      // Disable costly orbit controls
      const controls = splineApp?._orbitControls || splineApp?._controls
      if (controls) {
        controls.enableZoom = false
        controls.enablePan = false
        controls.enableRotate = false
        controls.enableDamping = false
        controls.update?.()
      }

      // Stop canvas from stealing focus
      const canvas = (splineApp?.canvas || splineApp?._renderer?.domElement) as HTMLCanvasElement | undefined
      if (canvas) {
        canvas.setAttribute('tabindex', '-1')
        canvas.style.outline = 'none'
      }
    } catch (err) {
      console.error('Spline config error:', err)
    }
    setIsLoaded(true)
    onLoaded?.()
  }, [applyPerfPatches, onLoaded])

  // If `onLoad` fires before the runtime has wired up `_renderer` (rare), keep
  // retrying briefly so the quality settings still land. The runtime's own
  // resize path preserves renderer settings afterwards, so no resize hook is
  // needed.
  useEffect(() => {
    if (!isLoaded) return
    const app = splineInstanceRef.current
    if (!app) return

    const timers: ReturnType<typeof setTimeout>[] = []
    let tries = 0
    const tryApply = () => {
      tries++
      const ok = applyPerfPatches(app)
      if (!ok && tries < 8) timers.push(setTimeout(tryApply, 250))
    }
    tryApply()

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [isLoaded, applyPerfPatches])

  // ── Adaptive resolution controller ──────────────────────────────────────
  // Converges on the highest drawing-buffer resolution that holds ~60fps,
  // never going below the display's native DPR. See the constants above.
  useEffect(() => {
    if (!isLoaded) return
    const app = splineInstanceRef.current
    const renderer = rendererRef.current
    const canvas = (app?.canvas || renderer?.domElement) as HTMLCanvasElement | undefined
    if (!app || !renderer || !canvas) return

    const floor = nativePixelRatio()
    const ceiling = ceilingPixelRatio()

    // Start at the floor and climb. (Starting at the ceiling would show a
    // low-fps flash on GPU-bound machines before it stepped back down.)
    applyPixelRatio(floor)

    let frames = 0
    let lastTick = performance.now()
    let warmupUntil = lastTick + ADAPT_WARMUP_MS
    let settleUntil = 0
    let good = 0
    let bad = 0
    let ceilingLearned = ceiling // highest ratio that has not failed a probe
    let candidate = floor
    let saved = floor
    let probeLeft = 0
    let probing = false
    let stopped = false

    const onRendered = () => { frames++ }
    canvas.addEventListener('rendered', onRendered)

    let lastScrollAt = performance.now()
    const onScroll = () => { lastScrollAt = performance.now() }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Stand down while the scene is frozen, the tab is hidden, or the user is
    // actively scrolling — those frame dips are not the steady-state cost.
    const shouldPause = (now: number) =>
      document.hidden ||
      containerRef.current?.style.visibility === 'hidden' ||
      now - lastScrollAt < 400

    const tick = () => {
      const now = performance.now()
      const n = frames
      const dt = now - lastTick
      frames = 0
      lastTick = now
      if (stopped) return

      // Re-assert our renderer settings (the runtime re-enables TAA each frame).
      applyPerfPatches(app)

      if (now < warmupUntil || now < settleUntil || shouldPause(now) || n === 0) return

      const fps = (n * 1000) / dt
      const current = renderer.getPixelRatio?.() ?? floor

      if (probing) {
        probeLeft--
        if (probeLeft > 0) return
        probing = false
        if (fps >= TARGET_FPS_LOW) {
          // Candidate held up — it becomes the new baseline.
          saved = current
          good = 0
        } else {
          // Candidate was too heavy — remember it as the ceiling and step back.
          ceilingLearned = Math.min(ceilingLearned, Math.max(floor, current - ADAPT_STEP))
          applyPixelRatio(Math.min(saved, ceilingLearned))
          settleUntil = now + ADAPT_TICK_MS
        }
        return
      }

      if (fps < TARGET_FPS_LOW) {
        bad++
        good = 0
      } else if (fps > TARGET_FPS_HIGH) {
        good++
        bad = 0
      } else {
        good = 0
        bad = 0
      }

      // Sustained frame drops at the current resolution: step back down.
      if (bad >= ADAPT_BAD_SAMPLES && current > floor + 0.001) {
        const next = Math.max(floor, current - ADAPT_STEP)
        ceilingLearned = Math.min(ceilingLearned, next)
        applyPixelRatio(next)
        saved = next
        bad = 0
        settleUntil = now + ADAPT_TICK_MS
        return
      }

      // Sustained headroom and room to grow: probe the next step up.
      if (good >= ADAPT_GOOD_SAMPLES && current < ceilingLearned - 0.001) {
        candidate = Math.min(current + ADAPT_STEP, ceilingLearned)
        saved = current
        applyPixelRatio(candidate)
        probing = true
        probeLeft = ADAPT_PROBE_TICKS
        good = 0
        settleUntil = now + ADAPT_TICK_MS
      }
    }

    const timer = setInterval(tick, ADAPT_TICK_MS)

    return () => {
      stopped = true
      clearInterval(timer)
      canvas.removeEventListener('rendered', onRendered)
      window.removeEventListener('scroll', onScroll)
    }
  }, [isLoaded, applyPerfPatches, applyPixelRatio])

  // ── GSAP scroll animations ──────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded || !containerRef.current || !splineWrapperRef.current) return

    const container = containerRef.current
    const wrapper = splineWrapperRef.current

    // If still loading, just hide the container but don't unmount
    if (isLoading) {
      gsap.set(container, { opacity: 0 })
      return
    }
    
    // Show container when loading is done
    gsap.set(container, { opacity: 1 })

    triggersRef.current.forEach(t => t.kill())
    triggersRef.current = []

    // Detect a remount while the page is already scrolled past the hero
    // (e.g. scrolling back up from a later section). Replaying the entrance
    // from scale 0.1 would pop; the scroll trigger below positions the scene.
    const phase1 = document.getElementById('phase-1')
    const pastHero = phase1 ? phase1.getBoundingClientRect().bottom <= 0 : false

    // Phase 1 entrance (first load only)
    const entrance = pastHero
      ? null
      : gsap.fromTo(
          wrapper,
          { opacity: 0, scale: 0.1, x: '25%' },
          { opacity: 1, scale: 0.60, x: '25%', duration: 1.2, ease: 'power1.out', delay: 0.2 },
        )

    if (pastHero) {
      // Match the hero resting state instantly; the scrub takes over below.
      // Fade the scene in instead of snapping it to full opacity, so a
      // remount (e.g. jumping back from a later section) never pops.
      gsap.set(wrapper, { scale: 0.60, x: '25%' })
      gsap.fromTo(wrapper, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power1.out' })
    }

    // Idle float — simpler on medium (no rotation to save compositor work)
    // Use a separate timeline that can be smoothly scrubbed
    const idleFloatTimeline = gsap.timeline({ paused: true })
    idleFloatTimeline.to(wrapper, {
      y: '-10px',
      rotation: tier === 'high' ? 1 : 0,
      duration: 2.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })

    // Start the idle animation
    const idleFloat = gsap.to(idleFloatTimeline, {
      progress: 1,
      duration: 2.5,
      ease: 'none',
      repeat: -1,
      yoyo: true,
    })

    triggersRef.current.push(
      ScrollTrigger.create({
        trigger: '#phase-1',
        start: 'top top',
        end: 'bottom top',
        onLeave: () => {
          // Smoothly fade out idle animation rather than killing abruptly
          gsap.to(idleFloat, { timeScale: 0, duration: 0.5, onComplete: () => { idleFloat.pause(); return; } })
        },
        onEnterBack: () => {
          // Smoothly resume idle animation
          idleFloat.resume()
          gsap.to(idleFloat, { timeScale: 1, duration: 0.5 })
        },
      }),
    )

    // Phase 1→2 scrub — one continuous transition in BOTH directions.
    // It ends exactly at the full-size resting state (scale 1, x 0%), so
    // reaching the Skills section never causes a hard snap. The previous
    // onEnter/onLeaveBack gsap.set() calls fought this scrub and produced
    // the "enlarge then snap" / "zoom in then slide sideways" glitches.
    const phase1To2Tween = gsap.fromTo(
      wrapper,
      { scale: 0.60, x: '25%' },
      { scale: 1, x: '0%', ease: 'none' }
    )

    triggersRef.current.push(
      ScrollTrigger.create({
        trigger: '#phase-2',
        start: 'top bottom',
        end: 'top center',
        scrub: 1,
        animation: phase1To2Tween,
        // Hand control from the entrance animation to the scrub the moment
        // the user actually reaches the transition, in either direction.
        onEnter: () => entrance?.kill(),
        onEnterBack: () => entrance?.kill(),
      }),
    )

    // Phase 2→3 fade — keep visible longer for smoother experience
    triggersRef.current.push(
      ScrollTrigger.create({
        trigger: '#phase-3',
        start: 'top 90%', // Start fading later
        end: 'top 40%',   // Fade over longer distance
        scrub: 1.5,       // Very smooth scrub
        animation: gsap.to(container, { opacity: 0, ease: 'power2.out' }),
        onLeave: () => {
          container.style.visibility = 'hidden'
          // Freeze (not disable) the scene once it's off-viewport: halting the
          // WebGL render loop keeps the last frame intact and the app mounted,
          // so scrolling back up resumes instantly, while the rest of the site
          // gets the GPU entirely to itself.
          splineInstanceRef.current?.stop?.()
        },
        // Let the scrubbed fade drive opacity on the way back up; setting it
        // to 1 here caused a flash before the scrub restored the real value.
        onEnterBack: () => {
          container.style.visibility = 'visible'
          // Un-freeze the exact same, still-mounted instance.
          splineInstanceRef.current?.play?.()
        },
      }),
    )

    return () => {
      entrance?.kill()
      idleFloat.pause()
      idleFloatTimeline.kill()
      triggersRef.current.forEach(t => t.kill())
      triggersRef.current = []
    }
  }, [isLoaded, isLoading, tier])

  // ── Pause the render loop while the tab is hidden ──────────────────────
  useEffect(() => {
    if (!isLoaded) return
    const onVisibility = () => {
      const app = splineInstanceRef.current
      if (!app) return
      if (document.hidden) {
        app.stop?.()
      } else if (containerRef.current && containerRef.current.style.visibility !== 'hidden') {
        // Re-render the cached shadow map once on resume, in case anything
        // invalidated it while we were away.
        const sm = rendererRef.current?.shadowMap
        if (sm && sm.autoUpdate === false) sm.needsUpdate = true
        app.play?.()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [isLoaded])

  if (isLoading) return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0"
      style={{
        visibility: 'hidden',
      }}
    />
  )

  // Skip Spline loading for mobile devices and tablets in portrait mode
  if (!shouldLoadSpline) return null

  return (
    <>
      <div
        ref={containerRef}
        className="fixed inset-0 z-0"
        onMouseEnter={handleInteraction}
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
        style={{
          willChange: 'opacity',
          backfaceVisibility: 'hidden',
          pointerEvents: activePhase === 1 ? 'none' : 'auto',
        }}
      >
        <div
          ref={splineWrapperRef}
          className="w-full h-full"
          style={{
            opacity: 0,
            transform: 'scale(0.6) translateX(25%)',
            transformOrigin: 'center center',
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
          }}
        >
          <Suspense fallback={null}>
            <Spline
              scene="/mething_copy.spline"
              onLoad={onLoad}
              className="w-full h-full"
            />
          </Suspense>
        </div>

        {/* Sound toggle — Phase 2+ */}
        {activePhase >= 2 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              const ctxs: AudioContext[] = (window as any)._audioContexts || []
              if (audioEnabled) {
                ctxs.forEach(ctx => {
                  if (ctx.state !== 'closed') ctx.suspend()
                })
                isManuallyMuted.current = true
                setAudioEnabled(false)
              } else {
                ctxs.forEach(ctx => {
                  if (ctx.state !== 'closed') ctx.resume()
                })
                isManuallyMuted.current = false
                initAudio()
              }
            }}
            className="fixed bottom-8 left-8 z-[9999] flex items-center gap-3 px-5 py-3 bg-black/40 backdrop-blur-md rounded-full text-white/80 hover:text-white hover:bg-black/60 transition-all border border-white/10 group cursor-pointer"
          >
            {audioEnabled
              ? <FaVolumeUp className="text-lg group-hover:scale-110 transition-transform" />
              : <FaVolumeMute className="text-lg group-hover:scale-110 transition-transform" />
            }
            <span className="text-sm font-medium tracking-wide">
              {audioEnabled ? 'Sound On' : 'Sound Off'}
            </span>
          </button>
        )}
      </div>
    </>
  )
})