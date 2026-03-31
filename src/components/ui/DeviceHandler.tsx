'use client'

import React, { useEffect, useState } from 'react'
import { useDeviceType, hasGPUAcceleration } from '@/lib/device'
import { FaExclamationTriangle, FaPlug, FaDesktop } from 'react-icons/fa'

export const DeviceHandler = ({ children }: { children: React.ReactNode }) => {
    const { deviceType, isPC } = useDeviceType()
    const [gpuStatus, setGpuStatus] = useState<'off' | 'on' | null>(null)

    useEffect(() => {
        // Check GPU status for PC users
        if (isPC) {
            const hasGPU = hasGPUAcceleration()
            const dismissed = sessionStorage.getItem('gpu-notice-dismissed')
            if (!dismissed) {
                setGpuStatus(hasGPU ? 'on' : 'off')
            }
        }
    }, [isPC])

    const handleDismiss = () => {
        sessionStorage.setItem('gpu-notice-dismissed', 'true')
        setGpuStatus(null)
    }

    // During SSR or before detection, render children
    if (deviceType === null) {
        return <>{children}</>
    }

    // GPU Acceleration OFF - Warning with power message
    if (gpuStatus === 'off') {
        return (
            <>
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
                                onClick={handleDismiss}
                                className="px-6 py-3 bg-red-500/20 border border-red-500/40 rounded-full hover:bg-red-500/30 transition-colors text-white"
                            >
                                Continue Anyway
                            </button>
                        </div>
                    </div>
                </div>
                {children}
            </>
        )
    }

    // GPU Acceleration ON - Info with power recommendation
    if (gpuStatus === 'on') {
        return (
            <>
                <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm text-white flex flex-col items-center justify-center p-8 text-center">
                    <div className="max-w-md space-y-6">
                        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                            <FaDesktop className="text-3xl text-accent" />
                        </div>
                        
                        <h2 className="text-2xl font-bold text-white">Ready for 3D Experience</h2>
                        
                        <p className="text-white/70 leading-relaxed text-lg">
                            Your device has hardware acceleration enabled. 
                            The full 3D portfolio experience is ready!
                        </p>

                        <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 flex items-start gap-3">
                            <FaPlug className="text-accent mt-1 flex-shrink-0" />
                            <p className="text-white/80 text-sm text-left">
                                <strong>Pro Tip:</strong> Plug in your laptop to power for the best 
                                performance with 3D animations and smooth transitions.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 pt-2">
                            <button
                                onClick={handleDismiss}
                                className="px-6 py-3 bg-accent/20 border border-accent/40 rounded-full hover:bg-accent/30 transition-colors text-white"
                            >
                                Enter Portfolio
                            </button>
                        </div>
                    </div>
                </div>
                {children}
            </>
        )
    }

    // For all other cases, render children
    return <>{children}</>
}
