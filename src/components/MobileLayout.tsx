'use client'

import { ReactNode } from 'react'

interface MobileLayoutProps {
  children: ReactNode
}

/**
 * MobileLayout - Wrapper for mobile/portrait optimized layout
 *
 * Key differences from desktop:
 * - Single column layout (no grid with empty columns)
 * - Reduced padding and gaps
 * - Touch-friendly spacing
 * - No 3D keyboard background
 */
export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="mobile-layout">
      {children}
    </div>
  )
}
