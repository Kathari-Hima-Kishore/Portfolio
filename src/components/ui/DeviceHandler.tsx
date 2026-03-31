'use client'

import React, { useEffect, useState } from 'react'
import { useDeviceType, hasGPUAcceleration } from '@/lib/device'
import { FaExclamationTriangle, FaPlug, FaTimes } from 'react-icons/fa'

export const DeviceHandler = ({ children }: { children: React.ReactNode }) => {
    const { deviceType, isPC } = useDeviceType()
    const [gpuNotice, setGpuNotice] = useState<'off' | 'on' | null>(null)
    const [isCharging, setIsCharging] = useState<boolean | null>(null)

    useEffect(() => {
        if (isPC) {
            const hasGPU = hasGPUAcceleration()
            const dismissed = sessionStorage.getItem('gpu-notice-dismissed')
            if (!dismissed) {
                setGpuNotice(hasGPU ? 'on' : 'off')
            }
        }
    }, [isPC])

    // Check battery status for the plug-in tip
    useEffect(() => {
        if (gpuNotice !== 'on') return
        
        if ('getBattery' in navigator) {
            (navigator as any).getBattery().then((battery: any) => {
                setIsCharging(battery.charging)
                
                // Listen for charging changes
                battery.addEventListener('chargingchange', () => {
                    setIsCharging(battery.charging)
                })
            }).catch(() => {
                // Battery API not available, assume not charging to show tip
                setIsCharging(false)
            })
        } else {
            // Battery API not supported, show tip just in case
            setIsCharging(false)
        }
    }, [gpuNotice])

    const handleDismiss = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        sessionStorage.setItem('gpu-notice-dismissed', 'true')
        setGpuNotice(null)
    }

    // Always render children - they load asynchronously in background
    return (
        <>
            {children}
            
            {/* GPU OFF Warning Modal */}
            {gpuNotice === 'off' && (
                <div className="fixed inset-0 z-[9999] bg-black text-white flex flex-col items-center justify-center p-8 text-center">
                    <div className="max-w-md space-y-6">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                            <FaExclamationTriangle className="text-3xl text-red-400" />
                        </div>
                        
                        <h2 className="text-2xl font-bold text-red-400">Performance Warning</h2>
                        
                        <p className="text-white/70 leading-relaxed text-lg">
                            Your device may not have hardware acceleration enabled. 
                            The 3D experience may run slowly.
                        </p>

                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
                            <FaPlug className="text-yellow-400 mt-1 flex-shrink-0" />
                            <p className="text-white/80 text-sm text-left">
                                <strong>Tip:</strong> Plug in your laptop to power for the best experience. 
                                Also enable hardware acceleration in your browser settings.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleDismiss}
                                className="px-6 py-3 bg-red-500/20 border border-red-500/40 rounded-full hover:bg-red-500/30 transition-colors text-white"
                            >
                                Continue Anyway
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* GPU ON - Power tip banner (only show if not charging) */}
            {gpuNotice === 'on' && isCharging === false && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] max-w-md w-[90%]">
                    <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 flex items-center gap-3 shadow-lg backdrop-blur-sm">
                        <FaPlug className="text-accent flex-shrink-0" />
                        <p className="text-white/80 text-sm flex-1">
                            <strong>Tip:</strong> Plug in your laptop to power for the best performance.
                        </p>
                        <button
                            type="button"
                            onClick={handleDismiss}
                            className="text-white/50 hover:text-white p-1"
                            aria-label="Dismiss"
                        >
                            <FaTimes size={14} />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
