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


export const SplineBackground = memo(function SplineBackground({
  isLoading,
  activePhase,
  onLoaded,
}: SplineBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [tier] = useState(() => getPerformanceTier())
  const { shouldLoadSpline } = useDeviceType()
  const splineInstanceRef = useRef<any>(null)
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

  // Spline onLoad
  const onLoad = useCallback((splineApp: any) => {
    splineInstanceRef.current = splineApp
    try {
      // Reduce pixel ratio for medium tier — halves WebGL fill rate
      const renderer = splineApp?.renderer
      if (renderer && tier === 'medium') {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
      }

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
      const canvas = renderer?.domElement as HTMLCanvasElement | undefined
      if (canvas) {
        canvas.setAttribute('tabindex', '-1')
        canvas.style.outline = 'none'
      }
    } catch (err) {
      console.error('Spline config error:', err)
    }
    setIsLoaded(true)
    onLoaded?.()
  }, [tier, onLoaded])

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

    // Phase 1 entrance
    gsap.fromTo(
      wrapper,
      { opacity: 0, scale: 0.6, x: '25%' },
      { opacity: 1, scale: 0.65, x: '25%', duration: 1.2, ease: 'power1.out', delay: 0.2 },
    )

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

    // Phase 1→2 scrub — smooth transition from hero centered to full width
    // Use a smoother scrub and add intermediate keyframes for fluid motion
    const phase1To2Tween = gsap.fromTo(
      wrapper,
      { scale: 0.65, x: '25%' },
      { scale: 1, x: '0%', ease: 'none' } // Use 'none' for scrubbed animations
    )

    triggersRef.current.push(
      ScrollTrigger.create({
        trigger: '#phase-2',
        start: 'top bottom',
        end: 'top center',
        scrub: 1, // Higher scrub value for smoother, more gradual transition
        animation: phase1To2Tween,
      }),
    )

    // Phase 2 - keep object visible and full size during Skills section
    triggersRef.current.push(
      ScrollTrigger.create({
        trigger: '#phase-2',
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          gsap.set(wrapper, { scale: 1, x: '0%', opacity: 1 })
        },
        onLeaveBack: () => {
          // When scrolling back to Phase 2 from Phase 3
          gsap.set(wrapper, { scale: 1, x: '0%', opacity: 1 })
        },
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
        onLeave: () => { container.style.visibility = 'hidden' },
        onEnterBack: () => { 
          container.style.visibility = 'visible'
          gsap.set(container, { opacity: 1 })
        },
      }),
    )

    return () => {
      idleFloat.pause()
      idleFloatTimeline.kill()
      triggersRef.current.forEach(t => t.kill())
      triggersRef.current = []
    }
  }, [isLoaded, isLoading, tier])

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