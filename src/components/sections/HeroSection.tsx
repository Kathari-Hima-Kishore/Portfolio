'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'
import { FaGithub, FaEnvelope } from 'react-icons/fa'

interface HeroSectionProps {
  isMobile?: boolean
}

export const HeroSection = memo(function HeroSection({ isMobile = false }: HeroSectionProps) {
    const sectionVariants = {
        hidden: { opacity: 0, x: isMobile ? -20 : -50 },
        visible: { opacity: 1, x: 0, transition: { duration: isMobile ? 0.5 : 0.8, ease: "easeOut" as const } }
    }

    return (
        <section id="phase-1" className={`min-h-screen flex items-center justify-center pb-20 ${isMobile ? 'px-6 py-12' : 'p-8'}`}>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={sectionVariants}
                className={`max-w-7xl w-full mx-auto ${isMobile ? 'text-center' : 'grid grid-cols-1 md:grid-cols-12 gap-12'}`}
            >
                <div className={`flex flex-col justify-center ${isMobile ? 'w-full items-center' : 'items-start md:col-span-7'}`}>
                    <p className={`text-accent uppercase mb-6 font-medium text-center ${isMobile ? 'text-sm tracking-[0.25em]' : 'text-sm tracking-[0.3em]'}`}>Hello, World.</p>
                    <h1 className={`font-black text-white leading-[0.9] mb-6 ${isMobile ? 'text-5xl sm:text-6xl' : 'text-6xl md:text-8xl'}`}>
                        Kathari <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Hima Kishore</span>
                    </h1>
                    <h2 className={`text-accent-light font-light mb-8 ${isMobile ? 'text-xl sm:text-2xl' : 'text-2xl md:text-3xl'}`}>Aspiring Full Stack Cloud Engineer</h2>
                    <p className={`text-white/70 leading-relaxed mb-10 ${isMobile ? 'text-base max-w-md mx-auto' : 'text-lg md:text-xl max-w-lg'}`}>
                        Building scalable, secure, and intelligent web solutions.
                    </p>

                    <div className={`flex gap-4 pointer-events-auto ${isMobile ? 'flex-row w-full max-w-sm mx-auto' : ''}`}>
                        <a href="https://github.com/Kathari-Hima-kishore" target="_blank" rel="noopener noreferrer"
                            className={`px-6 py-3.5 rounded-full flex items-center justify-center gap-2 text-white text-sm font-medium bg-white/10 border border-white/20 hover:bg-white/20 transition-colors ${isMobile ? 'flex-1' : ''}`}>
                            <FaGithub /> GitHub
                        </a>
                        <a href="mailto:himakishorekathari@gmail.com"
                            className={`px-6 py-3.5 rounded-full flex items-center justify-center gap-2 text-white text-sm font-medium bg-accent/20 border border-accent/40 hover:bg-accent/30 transition-colors ${isMobile ? 'flex-1' : ''}`}>
                            <FaEnvelope /> Contact
                        </a>
                    </div>
                </div>
                {/* Right side is empty for the 3D object - hidden on mobile */}
                {!isMobile && <div className="hidden md:block md:col-span-5"></div>}
            </motion.div>
        </section>
    )
})
