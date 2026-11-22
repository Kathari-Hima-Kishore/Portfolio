'use client'

import { useEffect, useRef } from 'react'
import { useLenis } from 'lenis/react'

/**
 * PC-only "deck" snapping.
 *
 * Every section is one viewport tall, separated by dead gaps (288px at the
 * reference size). Without snapping, a small nudge leaves the viewport parked
 * in a gap, halfway between two sections. Instead, the moment the user nudges
 * the wheel 1-2 steps toward the next (or previous) section, we glide straight
 * to that section's start, skipping the gap entirely.
 *
 * Because the glide is the only motion the user sees, a faint right-edge cue
 * mirrors wheel input as it arrives (direction + a small throughput bar), so a
 * scroll that hasn't crossed the snap threshold never feels broken.
 *
 * Only active on genuine desktops (`isPC`); phones and tablets keep their
 * native, untouched scrolling.
 */

interface SectionSnapProps {
  /** Master switch — mount-side gate (isPC && isReady && !isLoading). */
  enabled?: boolean
}

/** Accumulated same-direction wheel delta (px) that arms a snap. */
const NUDGE_THRESHOLD = 24
/** Quiet time after the last wheel event before the accumulator resets. */
const IDLE_RESET_MS = 220
/** Snap glide duration (s). */
const SNAP_DURATION = 0.85
/** Extra freeze after the glide so trailing momentum can't fight the lock. */
const SNAP_TAIL_MS = 120
/** How long the input cue lingers after the last wheel event. */
const CUE_FADE_MS = 700
/** Peak opacity of the cue — deliberately low; it is reassurance, not chrome. */
const CUE_PEAK_OPACITY = 0.5

/** True while any overlay/lightbox that owns scrolling is open. */
function isOverlayOpen(): boolean {
  if (typeof document === 'undefined') return false
  const body = document.body
  if (body.classList.contains('lightbox-open')) return true
  if (body.style.overflow === 'hidden') return true
  if (document.querySelector('.modall')) return true
  if (document.querySelector('[aria-modal="true"]')) return true
  return false
}

/** Absolute scroll positions worth resting at: section tops (+ tall-section
 *  bottoms) and the very end of the page. */
function getSnapTargets(): number[] {
  const vh = window.innerHeight
  const docH = document.documentElement.scrollHeight
  const list: number[] = []

  document.querySelectorAll<HTMLElement>('section[id^="phase-"]').forEach((el) => {
    const rect = el.getBoundingClientRect()
    const top = rect.top + window.scrollY
    list.push(top)
    // Section taller than the viewport: let its bottom become a rest point so
    // content near the end is still reachable before jumping on.
    if (rect.height > vh + 8) list.push(top + rect.height - vh)
  })

  list.push(docH - vh)

  return Array.from(new Set(list.map((v) => Math.round(v)))).sort((a, b) => a - b)
}

export function SectionSnap({ enabled = true }: SectionSnapProps) {
  const lenis = useLenis()

  const accRef = useRef(0)
  const dirRef = useRef(0)
  const lastAtRef = useRef(0)
  const freezeUntilRef = useRef(0)

  // Wheel-input cue (right edge).
  const cueRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const upRef = useRef<HTMLSpanElement>(null)
  const downRef = useRef<HTMLSpanElement>(null)
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  /** Mirror a wheel nudge into the edge cue: direction + throughput bar. */
  const showCue = (dir: number, progress: number) => {
    const cue = cueRef.current
    const fill = fillRef.current
    if (!cue || !fill) return

    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)

    cue.style.opacity = String(CUE_PEAK_OPACITY)
    fill.style.transformOrigin = dir > 0 ? 'top' : 'bottom'
    fill.style.transform = `scaleY(${Math.max(0.08, Math.min(1, progress))})`
    if (upRef.current) upRef.current.style.opacity = dir < 0 ? '0.9' : '0.2'
    if (downRef.current) downRef.current.style.opacity = dir > 0 ? '0.9' : '0.2'

    fadeTimerRef.current = setTimeout(() => {
      if (cueRef.current) cueRef.current.style.opacity = '0'
    }, CUE_FADE_MS)
  }

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!enabled || !lenis) return

    const onWheel = (e: WheelEvent) => {
      const now = performance.now()
      const dy = e.deltaY

      // While a snap is animating, swallow wheel input (both the flag Lenis
      // honours and native default scroll) so trailing momentum can't fight
      // the locked glide — but keep the cue lit so input still feels received.
      if (now < freezeUntilRef.current) {
        ;(e as any).lenisStopPropagation = true
        e.preventDefault()
        if (dy) showCue(dy > 0 ? 1 : -1, 1)
        return
      }

      if (isOverlayOpen()) return
      if (!dy) return

      const dir = dy > 0 ? 1 : -1
      if (dir !== dirRef.current || now - lastAtRef.current > IDLE_RESET_MS) {
        accRef.current = 0
      }
      dirRef.current = dir
      lastAtRef.current = now
      accRef.current += Math.abs(dy)

      showCue(dir, accRef.current / NUDGE_THRESHOLD)

      if (accRef.current < NUDGE_THRESHOLD) return

      // Armed. Find the next rest position strictly in the gesture direction.
      const currentY = typeof lenis.scroll === 'number' ? lenis.scroll : window.scrollY
      const targets = getSnapTargets()
      const eps = 2
      let target: number | undefined
      if (dir > 0) {
        target = targets.find((v) => v > currentY + eps)
      } else {
        for (let i = targets.length - 1; i >= 0; i--) {
          if (targets[i] < currentY - eps) {
            target = targets[i]
            break
          }
        }
      }

      accRef.current = 0

      // Already at an end — let Lenis handle the overscroll natively.
      if (target == null) return

      ;(e as any).lenisStopPropagation = true
      e.preventDefault()
      freezeUntilRef.current = now + SNAP_DURATION * 1000 + SNAP_TAIL_MS
      showCue(dir, 1)

      lenis.scrollTo(target, {
        duration: SNAP_DURATION,
        lock: true,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
      })
    }

    window.addEventListener('wheel', onWheel, { capture: true, passive: false })
    return () => window.removeEventListener('wheel', onWheel, { capture: true })
  }, [enabled, lenis])

  if (!enabled) return null

  return (
    <div
      ref={cueRef}
      aria-hidden="true"
      className="fixed right-2 top-1/2 -translate-y-1/2 z-[100] pointer-events-none flex flex-col items-center gap-2"
      style={{ opacity: 0, transition: 'opacity 320ms ease-out' }}
    >
      <span ref={upRef} className="text-white/80 leading-none" style={{ opacity: 0.2, transition: 'opacity 150ms linear' }}>
        <svg width="8" height="5" viewBox="0 0 8 5" aria-hidden="true">
          <path d="M4 0L8 5H0z" fill="currentColor" />
        </svg>
      </span>

      <div className="w-[3px] h-14 rounded-full bg-white/10 overflow-hidden">
        <div
          ref={fillRef}
          className="w-full h-full bg-accent"
          style={{ transform: 'scaleY(0)', transformOrigin: 'bottom', transition: 'transform 90ms linear' }}
        />
      </div>

      <span ref={downRef} className="text-white/80 leading-none" style={{ opacity: 0.2, transition: 'opacity 150ms linear' }}>
        <svg width="8" height="5" viewBox="0 0 8 5" aria-hidden="true">
          <path d="M0 0H8L4 5z" fill="currentColor" />
        </svg>
      </span>
    </div>
  )
}
