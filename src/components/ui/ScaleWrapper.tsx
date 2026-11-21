'use client'

import { useEffect, useState, useRef } from 'react'
import { getDeviceType } from '@/lib/device'

/**
 * ScaleWrapper — adaptive layout for non-1440px screens.
 *
 * Prior approach: CSS transform:scale() on the entire page body.
 * Problem: Creates one giant compositing layer, forces GPU to rasterize
 *          a 1440px-wide buffer even on 768px screens, and causes
 *          blurry text due to sub-pixel scaling.
 *
 * New approach:
 * - PC only, 1024-1439 → CSS zoom (browser-native, integer-aware, no compositing)
 * - Everything else    → No wrapper at all (passthrough)
 *
 * Phones and tablets (both orientations) use the simplified responsive
 * layout, where zooming the whole page shrinks `min-h-screen` sections
 * inside the real viewport (100vh keeps its value, then gets scaled),
 * leaving dead space below the content. So zoom is desktop-only.
 *
 * CSS zoom is read-only composited at paint time — zero extra GPU layer.
 */
export const ScaleWrapper = ({ children }: { children: React.ReactNode }) => {
    const [zoom, setZoom] = useState<number | null>(null)
    const rafRef = useRef<number | undefined>(undefined)

    useEffect(() => {
        const calc = () => {
            const w = window.innerWidth
            const BASE = 1440

            // Only genuine desktop screens scale. Mobile/tablet keep the
            // natural viewport so 100vh sections fill the screen edge to edge.
            if (getDeviceType() === 'pc' && w < BASE && w >= 1024) {
                // Round to 2 decimal places to avoid triggering repaint on micro changes
                setZoom(Math.round((w / BASE) * 100) / 100)
            } else {
                setZoom(null) // no scaling needed for mobile/tablet or large screens
            }
        }

        calc()

        // Debounce resize via RAF — avoids layout thrash during drag resize
        const onResize = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            rafRef.current = requestAnimationFrame(calc)
        }

        window.addEventListener('resize', onResize, { passive: true })
        return () => {
            window.removeEventListener('resize', onResize)
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [])

    // No scaling needed
    if (zoom === null) return <>{children}</>

    return (
        <div
            style={{
                // CSS zoom is the correct primitive here:
                // - No compositing layer overhead
                // - Sub-pixel-aware (no blurry text)
                // - ScrollTrigger still gets correct bounding rects
                zoom,
                width: '1440px',
                minHeight: '100vh',
                overflowX: 'hidden',
            }}
        >
            {children}
        </div>
    )
}
