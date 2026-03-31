'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'

interface EducationSectionProps {
  isMobile?: boolean
}

export const EducationSection = memo(function EducationSection({ isMobile = false }: EducationSectionProps) {
    const sectionVariants = {
        hidden: { opacity: 0, y: isMobile ? 30 : 50 },
        visible: { opacity: 1, y: 0, transition: { duration: isMobile ? 0.5 : 0.8, ease: "easeOut" as const } }
    }

    return (
        <section id="phase-6" className={`min-h-screen flex items-center justify-center ${isMobile ? 'p-4' : 'p-8'}`}>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={sectionVariants}
                className="max-w-3xl w-full text-center pointer-events-auto"
            >
                <div className={`bg-white/5 mx-auto rounded-full flex items-center justify-center mb-8 border border-white/10 ${isMobile ? 'w-16 h-16' : 'w-20 h-20'}`}>
                    <span className={`${isMobile ? 'text-2xl' : 'text-3xl'}`}>🎓</span>
                </div>
                <h2 className={`font-bold text-white mb-2 ${isMobile ? 'text-3xl' : 'text-4xl'}`}>Education</h2>
                <p className="text-white/40 mb-12">Foundation of my technical journey</p>

                <div className={`bg-white/5 border border-white/10 rounded-2xl text-left relative overflow-hidden ${isMobile ? 'p-6' : 'p-8'}`}>
                    <div className={`absolute top-0 right-0 opacity-10 font-black leading-none select-none ${isMobile ? 'p-2 text-7xl' : 'p-4 text-9xl'}`}>26</div>
                    <h3 className={`font-bold text-white mb-2 ${isMobile ? 'text-xl' : 'text-2xl'}`}>B.Tech in Information Technology</h3>
                    <p className="text-accent text-lg mb-4">Hindustan University, Chennai</p>
                    <div className="flex justify-between items-end border-t border-white/10 pt-6 mt-6">
                        <div>
                            <span className="block text-xs uppercase tracking-widest text-white/40 mb-1">Duration</span>
                            <span className="text-white">Aug 2022 – Jul 2026</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-xs uppercase tracking-widest text-white/40 mb-1">Grade</span>
                            <span className="text-3xl font-bold text-white">8.9 <span className="text-sm font-normal text-white/40">CGPA</span></span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
})
