'use client'

import { useEffect, useState } from 'react'

export type DeviceType = 'mobile' | 'tablet' | 'pc' | null
export type DeviceOrientation = 'portrait' | 'landscape'

/**
 * Detects WebGL renderer type to check for hardware acceleration
 * Returns: 'hardware' | 'software' | 'none'
 */
export function detectGPUAcceleration(): 'hardware' | 'software' | 'none' {
  if (typeof window === 'undefined') return 'none'

  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    if (!gl) return 'none'

    const dbg = gl.getExtension('WEBGL_debug_renderer_info')
    if (dbg) {
      const renderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) as string
      const vendor = gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) as string
      const info = `${renderer} ${vendor}`.toLowerCase()

      // Known software renderer strings
      const softwareKeywords = [
        'swiftshader',
        'llvmpipe',
        'softpipe',
        'software',
        'microsoft basic',
      ]

      if (softwareKeywords.some((kw) => info.includes(kw))) {
        return 'software'
      }
    }

    return 'hardware'
  } catch {
    return 'none'
  }
}

/**
 * Detects the device type using a pixel-independent hybrid approach:
 * 1. User-Agent string parsing (works in every browser, including Safari/Firefox)
 * 2. navigator.maxTouchPoints for touch capability
 * 3. (pointer: coarse) media query as tiebreaker — distinguishes
 *    touch-primary devices (tablets) from touch laptops (fine pointer)
 *
 * Never uses screen/window pixel counts, so high-DPI small screens
 * are classified correctly.
 */
/**
 * Detects the device type using a pixel-independent hybrid approach:
 * 1. User-Agent string parsing (works in every browser, including Safari/Firefox)
 * 2. navigator.maxTouchPoints for touch capability
 * 3. (pointer: coarse) media query as tiebreaker — distinguishes
 *    touch-primary devices (tablets) from touch laptops (fine pointer)
 *
 * Real phones/tablets are ALWAYS classified by rules 1–3, never by pixels.
 * Only browsers with zero touch capability (desktop PCs, viewport-resizer
 * preview tools) fall through to a viewport-width check, so narrow windows
 * get the simplified layout instead of an oversized full experience.
 */
export function getDeviceType(): DeviceType {
  if (typeof window === 'undefined') return null

  const ua = navigator.userAgent.toLowerCase()
  const maxTouchPoints = navigator.maxTouchPoints || 0
  const hasTouch = maxTouchPoints > 0 || 'ontouchstart' in window

  // Modern iPads (iPadOS 13+) report as "Macintosh" in UA but expose multi-touch.
  const isIPadOS = /macintosh/.test(ua) && maxTouchPoints > 1

  // UA signature parsing — phones always include "Mobile", tablets never do
  // (Android convention), plus explicit tablet identifiers.
  const isMobileUA = /iphone|ipod|android.+mobile|windows phone|blackberry|opera mini|iemobile|webos/.test(ua)
  const isTabletUA = /ipad|tablet|kindle|silk|playbook|android(?!.*mobile)/.test(ua)

  if (isMobileUA) return 'mobile'
  if (isTabletUA || isIPadOS) return 'tablet'

  // No clear UA signature (Safari desktop-mode edge cases, etc.):
  // a coarse primary pointer means a touch-primary device → tablet,
  // while touch laptops keep a fine primary pointer (mouse/trackpad) → pc.
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches
  if (hasTouch && hasCoarsePointer) return 'tablet'

  // Zero touch capability → genuine desktop browser (or viewport-resizer preview
  // tool that doesn't emulate UA/touch).  Use viewport width as a layout fallback
  // so narrow windows and tablet-landscape presets stay readable.
  // Threshold 1280px = Tailwind "xl"; catches all iPad/tablet landscape sizes
  // (1024–1194px) while still showing the full layout at normal desktop widths.
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1280) return 'tablet'

  return 'pc'
}

/**
 * Get device orientation via the universally supported
 * matchMedia('(orientation: portrait)') API.
 */
export function getDeviceOrientation(): DeviceOrientation {
  if (typeof window === 'undefined') return 'landscape'

  if (typeof window.matchMedia === 'function') {
    return window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape'
  }

  // Ancient browser fallback
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
}

/**
 * Check if GPU acceleration is available
 */
export function hasGPUAcceleration(): boolean {
  return detectGPUAcceleration() === 'hardware'
}

/**
 * Hook for reactive device type detection
 */
export function useDeviceType(): {
  deviceType: DeviceType
  orientation: DeviceOrientation
  shouldLoadSpline: boolean
  hasGPUAcceleration: boolean
  isMobile: boolean
  isTablet: boolean
  isPC: boolean
  isReady: boolean
} {
  const [deviceType, setDeviceType] = useState<DeviceType>(null)
  const [orientation, setOrientation] = useState<DeviceOrientation>('landscape')
  const [gpuStatus, setGpuStatus] = useState<'hardware' | 'software' | 'none'>('none')
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const updateDeviceInfo = () => {
      setDeviceType(getDeviceType())
      setOrientation(getDeviceOrientation())
      setGpuStatus(detectGPUAcceleration())
      setIsReady(true)
    }

    // Initial detection
    updateDeviceInfo()

    // Real-time orientation changes via matchMedia — universally supported
    const orientationMq = window.matchMedia('(orientation: portrait)')
    const handleDeviceChange = () => updateDeviceInfo()

    if (orientationMq.addEventListener) {
      orientationMq.addEventListener('change', handleDeviceChange)
    } else if ('addListener' in orientationMq) {
      // Safari < 14 fallback
      (orientationMq as unknown as { addListener: (cb: () => void) => void }).addListener(handleDeviceChange)
    }

    // Resize matters for the desktop-only viewport fallback
    window.addEventListener('resize', handleDeviceChange)

    return () => {
      if (orientationMq.removeEventListener) {
        orientationMq.removeEventListener('change', handleDeviceChange)
      } else if ('removeListener' in orientationMq) {
        (orientationMq as unknown as { removeListener: (cb: () => void) => void }).removeListener(handleDeviceChange)
      }
      window.removeEventListener('resize', handleDeviceChange)
    }
  }, [])

  const isMobile = deviceType === 'mobile'
  const isTablet = deviceType === 'tablet'
  const isPC = deviceType === 'pc'

  // Determine if Spline should load (defaults to false until ready to prevent hydration issues)
  // Full 3D Spline runs on PC only — mobile AND tablet (any orientation) always use simplified
  const shouldLoad = (() => {
    if (!isReady) return false // Don't load Spline until we know the device type
    if (isMobile || isTablet) return false
    return true
  })()

  return {
    deviceType,
    orientation,
    shouldLoadSpline: shouldLoad,
    hasGPUAcceleration: gpuStatus === 'hardware',
    isMobile,
    isTablet,
    isPC,
    isReady,
  }
}
