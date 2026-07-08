'use client'

import { useEffect, useRef } from 'react'

function useDrawAnimation(animate: boolean | undefined, loop = false, startDelay = 0) {
  const ref = useRef<SVGSVGElement>(null)
  const forwardRef = useRef(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const loopTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (!animate || !ref.current) return

    const svg = ref.current
    const strokes = Array.from(svg.querySelectorAll<SVGGeometryElement>('.draw-path'))
    const fills = Array.from(svg.querySelectorAll<HTMLElement>('.fill-in'))

    forwardRef.current = true

    strokes.forEach(el => {
      try {
        const len = el.getTotalLength()
        el.style.strokeDasharray = String(len)
        el.style.strokeDashoffset = String(len)
        el.style.transition = 'none'
      } catch {}
    })
    fills.forEach(el => {
      el.style.transition = 'none'
      el.style.opacity = '0'
    })

    function animateStrokes() {
      strokes.forEach((el, i) => {
        try {
          const len = el.getTotalLength()
          const target = forwardRef.current ? '0' : String(len)
          el.style.transition = `stroke-dashoffset 2.5s cubic-bezier(0.4,0,0.2,1) ${i * 0.22}s`
          el.style.strokeDashoffset = target
        } catch {}
      })

      if (loop) {
        const totalTime = (2.5 + (strokes.length - 1) * 0.22) * 1000 + 50
        if (loopTimerRef.current) clearTimeout(loopTimerRef.current)
        loopTimerRef.current = setTimeout(() => {
          forwardRef.current = !forwardRef.current
          animateStrokes()
        }, totalTime)
      }
    }

    const t1 = setTimeout(() => {
      animateStrokes()

      const strokeEnd = 2.5 + (strokes.length - 1) * 0.22
      const t2 = setTimeout(() => {
        fills.forEach((el, i) => {
          el.style.transition = `opacity 0.8s ease ${i * 0.12}s`
          el.style.opacity = '1'
        })
      }, strokeEnd * 1000 + 200)

      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = t2
    }, startDelay)

    return () => {
      clearTimeout(t1)
      if (timerRef.current) clearTimeout(timerRef.current)
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current)
      strokes.forEach(el => {
        el.style.strokeDasharray = ''
        el.style.strokeDashoffset = ''
        el.style.transition = ''
      })
      fills.forEach(el => {
        el.style.opacity = ''
        el.style.transition = ''
      })
    }
  }, [animate, loop, startDelay])

  return ref
}

function SkillIcon({ animate, loop = false, startDelay = 0, strokeWidth = 2, viewBox = '0 0 64 64', children, ...props }: {
  animate?: boolean
  loop?: boolean
  startDelay?: number
  strokeWidth?: number
  viewBox?: string
  children: React.ReactNode
}) {
  const ref = useDrawAnimation(animate, loop, startDelay)
  return (
    <svg ref={ref} viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
      {children}
    </svg>
  )
}

// ── Desktop Edition ──────────────────────────────────────────────────────────

export const DesktopFrontendIcon = ({ animate, loop }: { animate?: boolean; loop?: boolean }) => (
  <SkillIcon animate={animate} loop={loop}>
    <path className="fill-in" d="M 6 36 H 58 L 54 44 H 10 Z" fill="currentColor" fillOpacity="0.12" stroke="none" />
    <rect className="fill-in" x="14" y="12" rx="1.5" width="36" height="22" fill="currentColor" fillOpacity="0.12" stroke="none" />
    <rect className="draw-path" x="12" y="10" rx="3" width="40" height="26" strokeWidth={2.2} />
    <path className="draw-path" d="M 6 36 H 58 L 54 44 H 10 Z" strokeWidth={2.2} />
    <polyline className="draw-path" points="24,19 19,23 24,27" strokeWidth={2.2} />
    <polyline className="draw-path" points="40,19 45,23 40,27" strokeWidth={2.2} />
    <line className="draw-path" x1="34" y1="17" x2="30" y2="29" strokeWidth={2.2} />
  </SkillIcon>
)

export const DesktopBackendIcon = ({ animate, loop }: { animate?: boolean; loop?: boolean }) => (
  <SkillIcon animate={animate} loop={loop}>
    <rect className="fill-in" x="10" y="8" rx="5" width="44" height="14" fill="currentColor" fillOpacity="0.12" stroke="none" />
    <rect className="fill-in" x="10" y="25" rx="5" width="44" height="14" fill="currentColor" fillOpacity="0.12" stroke="none" />
    <rect className="fill-in" x="10" y="42" rx="5" width="44" height="14" fill="currentColor" fillOpacity="0.12" stroke="none" />
    <rect className="draw-path" x="10" y="8" rx="5" width="44" height="14" />
    <rect className="draw-path" x="10" y="25" rx="5" width="44" height="14" />
    <rect className="draw-path" x="10" y="42" rx="5" width="44" height="14" />
    <circle className="fill-in" cx="18" cy="15" r="2.2" fill="currentColor" stroke="none" />
    <circle className="fill-in" cx="18" cy="32" r="2.2" fill="currentColor" stroke="none" />
    <circle className="fill-in" cx="18" cy="49" r="2.2" fill="currentColor" opacity="0.6" stroke="none" />
    <line className="draw-path" x1="26" y1="15" x2="46" y2="15" opacity="0.35" strokeWidth="1.6" />
    <line className="draw-path" x1="26" y1="32" x2="46" y2="32" opacity="0.35" strokeWidth="1.6" />
    <line className="draw-path" x1="26" y1="49" x2="46" y2="49" opacity="0.35" strokeWidth="1.6" />
  </SkillIcon>
)

export const DesktopCloudIcon = ({ animate, loop }: { animate?: boolean; loop?: boolean }) => (
  <SkillIcon animate={animate} loop={loop}>
    <path className="fill-in" d="M 18 38 A 9 9 0 0 1 14 26 A 12 12 0 0 1 32 14 A 14 14 0 0 1 50 24 A 9 9 0 0 1 46 38 Z" fill="currentColor" fillOpacity="0.12" stroke="none" />
    <path className="draw-path" d="M 18 38 A 9 9 0 0 1 14 26 A 12 12 0 0 1 32 14 A 14 14 0 0 1 50 24 A 9 9 0 0 1 46 38" strokeWidth={2.2} />
    <path className="draw-path" d="M 21 24 A 7 7 0 0 1 29 17" strokeWidth={2} opacity="0.8" />
    <rect className="fill-in" x="16" y="32" width="32" height="22" rx="4" fill="currentColor" fillOpacity="0.12" stroke="none" />
    <rect className="draw-path" x="16" y="32" width="32" height="22" rx="4" strokeWidth={2.2} />
    <polyline className="draw-path" points="26,38 22,43 26,48" strokeWidth={2.2} />
    <polyline className="draw-path" points="38,38 42,43 38,48" strokeWidth={2.2} />
    <line className="draw-path" x1="34" y1="37" x2="30" y2="49" strokeWidth={2.2} />
  </SkillIcon>
)

export const DesktopToolsIcon = ({ animate, loop }: { animate?: boolean; loop?: boolean }) => (
  <SkillIcon animate={animate} loop={loop}>
    <rect className="fill-in" x="10" y="12" rx="3" width="44" height="40" fill="currentColor" fillOpacity="0.12" stroke="none" />
    <rect className="draw-path" x="8" y="10" rx="5" width="48" height="44" strokeWidth={2.2} />
    <line className="draw-path" x1="8" y1="21" x2="56" y2="21" strokeWidth={1.8} opacity="0.6" />
    <circle className="fill-in" cx="14" cy="15.5" r="1.5" fill="currentColor" stroke="none" />
    <circle className="fill-in" cx="19" cy="15.5" r="1.5" fill="currentColor" stroke="none" />
    <circle className="fill-in" cx="24" cy="15.5" r="1.5" fill="currentColor" stroke="none" />
    <polyline className="draw-path" points="16,30 20,33 16,36" strokeWidth={2.2} />
    <line className="draw-path" x1="24" y1="36" x2="32" y2="36" strokeWidth={2.5} />
  </SkillIcon>
)

// ── Mobile Edition ───────────────────────────────────────────────────────────

export const MobileFrontendIcon = ({ animate }: { animate?: boolean }) => (
  <SkillIcon animate={animate} loop startDelay={500}>
    <rect className="fill-in" x="20" y="14" rx="2" width="24" height="34" fill="currentColor" fillOpacity="0.12" stroke="none" />
    <rect className="draw-path" x="18" y="6" rx="6" width="28" height="52" strokeWidth={2.2} />
    <line className="draw-path" x1="26" y1="10" x2="38" y2="10" strokeWidth={1.8} opacity="0.6" />
    <line className="draw-path" x1="28" y1="52" x2="36" y2="52" strokeWidth={1.5} opacity="0.6" />
    <polyline className="draw-path" points="27,26 23,30 27,34" strokeWidth={2.2} />
    <polyline className="draw-path" points="37,26 41,30 37,34" strokeWidth={2.2} />
    <line className="draw-path" x1="33" y1="24" x2="31" y2="36" strokeWidth={2} opacity="0.8" />
  </SkillIcon>
)

export const MobileBackendIcon = ({ animate }: { animate?: boolean }) => (
  <SkillIcon animate={animate} loop startDelay={500}>
    <rect className="fill-in" x="12" y="14" rx="4" width="40" height="14" fill="currentColor" fillOpacity="0.12" stroke="none" />
    <rect className="fill-in" x="12" y="36" rx="4" width="40" height="14" fill="currentColor" fillOpacity="0.12" stroke="none" />
    <rect className="draw-path" x="12" y="14" rx="4" width="40" height="14" strokeWidth={2.2} />
    <rect className="draw-path" x="12" y="36" rx="4" width="40" height="14" strokeWidth={2.2} />
    <circle className="fill-in" cx="20" cy="21" r="2.2" fill="currentColor" stroke="none" />
    <circle className="fill-in" cx="20" cy="43" r="2.2" fill="currentColor" stroke="none" />
    <line className="draw-path" x1="32" y1="28" x2="32" y2="36" strokeWidth={2} opacity="0.5" />
  </SkillIcon>
)

export const MobileCloudIcon = ({ animate }: { animate?: boolean }) => (
  <SkillIcon animate={animate} loop startDelay={500}>
    <path className="fill-in" d="M 18 38 A 9 9 0 0 1 14 26 A 12 12 0 0 1 32 14 A 14 14 0 0 1 50 24 A 9 9 0 0 1 46 38 Z" fill="currentColor" fillOpacity="0.12" stroke="none" />
    <path className="draw-path" d="M 18 38 A 9 9 0 0 1 14 26 A 12 12 0 0 1 32 14 A 14 14 0 0 1 50 24 A 9 9 0 0 1 46 38" strokeWidth={2.2} />
    <rect className="fill-in" x="18" y="28" width="28" height="20" rx="3" fill="currentColor" fillOpacity="0.12" stroke="none" />
    <rect className="draw-path" x="18" y="28" width="28" height="20" rx="3" strokeWidth={2} />
    <polyline className="draw-path" points="26,35 23,38 26,41" strokeWidth={2} />
    <polyline className="draw-path" points="38,35 41,38 38,41" strokeWidth={2} />
    <line className="draw-path" x1="34" y1="33" x2="30" y2="43" strokeWidth={2} />
  </SkillIcon>
)

export const MobileToolsIcon = ({ animate }: { animate?: boolean }) => (
  <SkillIcon animate={animate} loop startDelay={500}>
    <rect className="fill-in" x="10" y="14" rx="2.5" width="44" height="36" fill="currentColor" fillOpacity="0.12" stroke="none" />
    <rect className="draw-path" x="8" y="12" rx="4" width="48" height="40" strokeWidth={2.2} />
    <polyline className="draw-path" points="18,28 22,31 18,34" strokeWidth={2.2} />
    <line className="draw-path" x1="26" y1="34" x2="34" y2="34" strokeWidth={2.5} />
  </SkillIcon>
)
