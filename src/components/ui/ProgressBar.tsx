'use client'

import { useEffect, useRef } from 'react'

export function ProgressBar() {
  const fillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0

    const update = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0
      if (fillRef.current) fillRef.current.style.width = `${pct}%`
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
      <div className="h-[3px] bg-white/[0.04]">
        <div
          ref={fillRef}
          className="h-full will-change-[width]"
          style={{
            width: '0%',
            background: '#a78bfa',
            boxShadow: '0 0 12px rgba(167,139,250,0.5)',
          }}
        />
      </div>
    </div>
  )
}
