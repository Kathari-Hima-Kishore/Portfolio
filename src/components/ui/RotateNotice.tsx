'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaMobileAlt, FaArrowRight } from 'react-icons/fa'
import { useDeviceType } from '@/lib/device'

/**
 * Prompts phone users to rotate to portrait when the site is opened in
 * landscape. Tablets are intentionally excluded — they are laid out for
 * both orientations, so no prompt is shown there.
 */
export function RotateNotice() {
    const { isMobile, isReady, orientation } = useDeviceType()
    const [dismissed, setDismissed] = useState(false)

    // Once the phone is back in portrait the prompt has done its job, so
    // re-arm it for the next time the device is turned sideways.
    useEffect(() => {
        if (orientation === 'portrait') setDismissed(false)
    }, [orientation])

    if (!isReady || !isMobile || orientation !== 'landscape' || dismissed) return null

    return (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="text-center max-w-xs w-full">
                <motion.div
                    className="w-16 h-16 bg-accent/20 border border-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-5"
                    animate={{ rotate: [0, -90, -90, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <FaMobileAlt className="text-2xl text-accent" />
                </motion.div>

                <h3 className="text-lg font-bold text-white mb-2">Rotate your device</h3>

                <p className="text-white/60 text-sm mb-5">
                    This portfolio is built for <strong className="text-accent">portrait mode</strong>.
                    Please turn your phone upright for the best experience.
                </p>

                <button
                    onClick={() => setDismissed(true)}
                    className="w-full py-2.5 bg-accent/20 border border-accent/40 rounded-xl hover:bg-accent/30 transition-colors text-white text-sm font-medium flex items-center justify-center gap-2"
                >
                    Continue in landscape <FaArrowRight className="text-xs" />
                </button>
            </div>
        </div>
    )
}