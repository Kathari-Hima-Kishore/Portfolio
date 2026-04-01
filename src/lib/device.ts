'use client'

import { useEffect, useState } from 'react'

export type DeviceType = 'mobile' | 'tablet' | 'pc' | null
export type DeviceOrientation = 'portrait' | 'landscape'

// Breakpoints
const MOBILE_MAX = 768
const TABLET_MAX = 1024

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
 * Get device type based on screen width AND user agent/touch capabilities
 * More accurate detection for tablets and hybrid devices
 */
export function getDeviceType(): DeviceType {
  if (typeof window === 'undefined') return null

  const width = window.innerWidth
  const userAgent = navigator.userAgent.toLowerCase()
  
  // Check for mobile patterns in user agent
  const isMobileUA = /mobile|iphone|ipod|android.*mobile|windows phone|blackberry|opera mini/i.test(userAgent)
  const isTabletUA = /ipad|android(?!.*mobile)|tablet|kindle|silk|playbook/i.test(userAgent)
  
  // Check for touch capability (coarse pointer)
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches
  
  // If user agent says it's mobile, trust that
  if (isMobileUA) {
    return 'mobile'
  }
  
  // If user agent says it's tablet, trust that
  if (isTabletUA) {
    return 'tablet'
  }
  
  // For devices without clear UA signatures, use screen width + touch capability
  if (width < MOBILE_MAX) {
    return 'mobile'
  } else if (width < TABLET_MAX) {
    // If it has touch but width is tablet range, it's likely a tablet
    if (hasTouch || hasCoarsePointer) {
      return 'tablet'
    }
    return 'tablet'  // Default to tablet for this range
  } else {
    // Large screen but has touch? Likely a large tablet (iPad Pro, etc)
    if (hasTouch && hasCoarsePointer && !/windows|macintosh|mac os x/i.test(userAgent)) {
      return 'tablet'
    }
    return 'pc'
  }
}

/**
 * Get device orientation
 */
export function getDeviceOrientation(): DeviceOrientation {
  if (typeof window === 'undefined') return 'landscape'

  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
}

/**
 * Check if device is in portrait mode (mobile or tablet)
 */
export function isPortrait(): boolean {
  return getDeviceOrientation() === 'portrait'
}

/**
 * Check if device is mobile OR tablet in portrait mode
 * This is used to determine if we should skip loading the Spline keyboard
 */
export function shouldLoadSpline(): boolean {
  const deviceType = getDeviceType()
  const orientation = getDeviceOrientation()

  // Don't load Spline for mobile devices
  if (deviceType === 'mobile') {
    return false
  }

  // Don't load Spline for tablets in portrait mode
  if (deviceType === 'tablet' && orientation === 'portrait') {
    return false
  }

  // For PC and tablet-landscape, check GPU acceleration
  const gpuStatus = detectGPUAcceleration()
  if (gpuStatus === 'none' || gpuStatus === 'software') {
    console.warn('[Device] Software rendering detected - Spline may impact performance')
  }

  return true
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

    // Listen for resize and orientation changes
    window.addEventListener('resize', updateDeviceInfo)
    window.addEventListener('orientationchange', updateDeviceInfo)

    return () => {
      window.removeEventListener('resize', updateDeviceInfo)
      window.removeEventListener('orientationchange', updateDeviceInfo)
    }
  }, [])

  const isMobile = deviceType === 'mobile'
  const isTablet = deviceType === 'tablet'
  const isPC = deviceType === 'pc'

  // Determine if Spline should load (defaults to false until ready to prevent hydration issues)
  const shouldLoad = (() => {
    if (!isReady) return false // Don't load Spline until we know the device type
    if (isMobile) return false
    if (isTablet && orientation === 'portrait') return false
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

/**
 * Hook specifically for responsive design
 * Returns true if we should use mobile layout
 */
export function useIsMobileLayout(): boolean {
  const { deviceType, orientation } = useDeviceType()

  // Use mobile layout for:
  // - Mobile devices
  // - Tablets in portrait mode
  if (deviceType === 'mobile') return true
  if (deviceType === 'tablet' && orientation === 'portrait') return true

  return false
}
