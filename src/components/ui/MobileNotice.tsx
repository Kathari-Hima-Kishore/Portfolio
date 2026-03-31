'use client'

import { useState, useEffect } from 'react'
import { FaMobileAlt, FaDesktop } from 'react-icons/fa'
import { useDeviceType } from '@/lib/device'

export function MobileNotice() {
    const { isMobile, isTablet, isReady } = useDeviceType()
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (!isReady) return
        
        // Check if already dismissed this session
        const dismissed = sessionStorage.getItem('mobile-notice-dismissed')
        if (!dismissed && (isMobile || isTablet)) {
            setIsVisible(true)
        }
    }, [isReady, isMobile, isTablet])

    const handleDismiss = () => {
        sessionStorage.setItem('mobile-notice-dismissed', 'true')
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-900/95 border border-accent/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
                        <FaMobileAlt className="text-2xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Simplified Mobile View</h3>
                        <p className="text-white/50 text-xs">Optimized for smaller screens</p>
                    </div>
                </div>

                <p className="text-white/70 text-sm leading-relaxed mb-4">
                    You&apos;re viewing a simplified version of the portfolio. For the full 
                    <span className="text-accent font-medium"> 3D experience</span> with all interactive features, 
                    please view on a Windows or Mac desktop browser.
                </p>

                <div className="flex items-center gap-2 text-white/50 text-xs mb-6 bg-white/5 rounded-lg p-3">
                    <FaDesktop className="text-accent" />
                    <span>Desktop version includes: 3D keyboard, full animations, enhanced visuals</span>
                </div>

                <button
                    onClick={handleDismiss}
                    className="w-full py-3 bg-accent/20 border border-accent/40 rounded-xl hover:bg-accent/30 transition-colors text-white font-medium"
                >
                    Continue to Mobile View
                </button>
            </div>
        </div>
    )
}
