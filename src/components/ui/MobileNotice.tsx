'use client'

import { useState, useEffect } from 'react'
import { FaMobileAlt, FaArrowRight } from 'react-icons/fa'
import { useDeviceType } from '@/lib/device'

export function MobileNotice() {
    const { isMobile, isTablet, isReady } = useDeviceType()
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (!isReady) return
        
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
        <div className="fixed inset-0 z-[9998] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-900/95 border border-accent/20 rounded-2xl p-5 max-w-xs w-full shadow-2xl text-center">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaMobileAlt className="text-xl text-accent" />
                </div>

                <h3 className="text-lg font-bold text-white mb-2">Mobile View</h3>
                
                <p className="text-white/60 text-sm mb-4">
                    This is a Simplified version. Visit on desktop for full experience.
                </p>

                <button
                    onClick={handleDismiss}
                    className="w-full py-2.5 bg-accent/20 border border-accent/40 rounded-xl hover:bg-accent/30 transition-colors text-white text-sm font-medium flex items-center justify-center gap-2"
                >
                    Continue <FaArrowRight className="text-xs" />
                </button>
            </div>
        </div>
    )
}
