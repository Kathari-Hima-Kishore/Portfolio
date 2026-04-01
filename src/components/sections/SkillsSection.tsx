'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { memo, useState } from 'react'
import { FaCode, FaServer, FaCloud, FaTools } from 'react-icons/fa'
import { CubeButton } from '@/components/ui/CubeButton'
import { OrbitalSkills } from '@/components/ui/OrbitalSkills'
import { useDeviceType } from '@/lib/device'

interface SkillsSectionProps {
  isMobile?: boolean
}

export const SkillsSection = memo(function SkillsSection({ isMobile = false }: SkillsSectionProps) {
    const [showSkillsList, setShowSkillsList] = useState(false)
    const { deviceType, orientation } = useDeviceType()
    
    // Tablet in portrait should use mobile-like layout but scaled
    const isTabletPortrait = deviceType === 'tablet' && orientation === 'portrait'
    const useMobileLayout = isMobile || isTabletPortrait

    return (
        <section id="phase-2" className={`min-h-screen w-full relative flex items-center justify-center ${useMobileLayout ? 'p-4' : 'p-4'}`}>

            {/* Heading - Absolute Top Left */}
            <div className={`absolute z-30 pointer-events-auto ${useMobileLayout ? 'top-6 left-4' : 'top-10 left-6 md:top-16 md:left-16'}`}>
                <h2 className={`font-black text-white/80 drop-shadow-2xl tracking-tighter ${useMobileLayout ? 'text-3xl' : 'text-4xl md:text-6xl'}`}>
                    Skills & Tools
                </h2>
            </div>

            {/* Mobile/Tablet Portrait: Show Orbital Constellation */}
            {useMobileLayout ? (
                <div className={`w-full flex flex-col items-center justify-center ${isTabletPortrait ? 'mt-8 scale-125' : 'mt-16'}`}>
                    <OrbitalSkills />
                </div>
            ) : (
                <>
                    {/* Desktop: Toggle Button - Absolute Bottom Right */}
                    <div className={`absolute z-30 pointer-events-auto ${useMobileLayout ? 'bottom-6 right-4' : 'bottom-10 right-6 md:bottom-16 md:right-16'}`}>
                        <CubeButton
                            text={showSkillsList ? "Collapse" : "View List"}
                            onClick={() => setShowSkillsList(!showSkillsList)}
                        />
                    </div>

                    {/* Centered List Content */}
                    <div className="w-full flex justify-center items-center z-20 pointer-events-none">
                        <AnimatePresence>
                            {showSkillsList && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, backdropFilter: "blur(0px)" }}
                                    animate={{ opacity: 1, scale: 1, backdropFilter: "blur(12px)" }}
                                    exit={{ opacity: 0, scale: 0.9, backdropFilter: "blur(0px)" }}
                                    className={`w-full bg-surface/80 border border-white/10 rounded-3xl pointer-events-auto shadow-2xl backdrop-blur-xl ${useMobileLayout ? 'p-4 max-w-full' : 'p-6 md:p-12 max-w-6xl'}`}
                                >
                                    <div className={`grid gap-6 ${useMobileLayout ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
                                        {/* Frontend */}
                                        <div className="brutal-card p-6 rounded-2xl group">
                                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 text-blue-400 text-2xl group-hover:scale-110 transition-transform brutal-border"><FaCode /></div>
                                            <h4 className="text-xl font-bold text-white mb-3">Frontend</h4>
                                            <ul className="space-y-2 text-white/60 text-sm">
                                                <li>HTML & CSS</li>
                                                <li>Tailwind CSS</li>
                                                <li>Javascript</li>
                                                <li>React.js</li>
                                            </ul>
                                        </div>

                                        {/* Backend */}
                                        <div className="brutal-card p-6 rounded-2xl group">
                                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 text-green-400 text-2xl group-hover:scale-110 transition-transform brutal-border"><FaServer /></div>
                                            <h4 className="text-xl font-bold text-white mb-3">Backend & Database</h4>
                                            <ul className="space-y-2 text-white/60 text-sm">
                                                <li>Python</li>
                                                <li>Node.js</li>
                                                <li>SQL</li>
                                            </ul>
                                        </div>

                                        {/* Cloud */}
                                        <div className="brutal-card-accent p-6 rounded-2xl group">
                                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 text-purple-400 text-2xl group-hover:scale-110 transition-transform brutal-border-accent"><FaCloud /></div>
                                            <h4 className="text-xl font-bold text-white mb-3">Cloud & DevOps</h4>
                                            <ul className="space-y-2 text-white/60 text-sm">
                                                <li>Microsoft Azure</li>
                                                <li>Google Firebase</li>
                                                <li>Docker</li>
                                                <li>Git/Github</li>
                                            </ul>
                                        </div>

                                        {/* Tools */}
                                        <div className="brutal-card p-6 rounded-2xl group">
                                            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4 text-orange-400 text-2xl group-hover:scale-110 transition-transform brutal-border"><FaTools /></div>
                                            <h4 className="text-xl font-bold text-white mb-3">API & Tools</h4>
                                            <ul className="space-y-2 text-white/60 text-sm">
                                                <li>Beeceptor</li>
                                                <li>Spline</li>
                                                <li>Jira</li>
                                                <li>Miro</li>
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </>
            )}
        </section>
    )
})
