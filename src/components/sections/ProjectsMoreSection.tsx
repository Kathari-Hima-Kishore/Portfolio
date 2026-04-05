'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'
import { FaExternalLinkAlt, FaCloud, FaCode, FaCalendarAlt } from 'react-icons/fa'
import { useDeviceType } from '@/lib/device'

interface ProjectsMoreSectionProps {
  isMobile?: boolean
}

export const ProjectsMoreSection = memo(function ProjectsMoreSection({ isMobile = false }: ProjectsMoreSectionProps) {
    const { orientation } = useDeviceType()
    const isPortrait = orientation === 'portrait'
    
    const sectionVariants = {
        hidden: { opacity: 0, y: isMobile ? 30 : 50 },
        visible: { opacity: 1, y: 0, transition: { duration: isMobile ? 0.5 : 0.8, ease: "easeOut" as const } }
    }

    return (
        <section id="phase-5" className={`min-h-screen flex items-center justify-center ${isMobile ? 'p-3' : 'p-8'}`}>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
                className="max-w-6xl w-full pointer-events-auto"
            >
                <h2 className={`font-black text-white mb-8 text-center ${isMobile ? 'text-2xl' : 'text-4xl'}`}>More Projects</h2>
                <div className={`grid gap-6 ${isPortrait ? 'grid-cols-1' : 'grid-cols-2'}`}>

                    {/* Event Management System */}
                    <div className={`group p-6 rounded-2xl ${isMobile ? 'bg-white/5 border border-white/10' : 'brutal-card'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 bg-accent/20 rounded-lg text-accent text-xl ${isMobile ? '' : 'brutal-border-accent'}`}><FaCalendarAlt /></div>
                            <div className="flex gap-3">
                                <a href="https://github.com/Kathari-Hima-kishore/event-management-system-with-firebase" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                    <FaCode size={18} />
                                </a>
                                <a href="https://event-management-system-with-fireba.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                    <FaExternalLinkAlt size={18} />
                                </a>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Event Management System</h3>
                        <p className="text-white/60 mb-4 text-sm leading-relaxed">
                            {isMobile 
                                ? "Modern platform with real-time sync and 3-tier RBAC system. Built with Flask and Firebase."
                                : "A modern event management platform featuring real-time data synchronization and a robust 3-tier Role-Based Access Control (RBAC) system. Built with Flask and Firebase for seamless performance."
                            }
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            <span className="text-xs text-white/40 font-mono">Python</span>
                            <span className="text-xs text-white/40 font-mono">Flask</span>
                            <span className="text-xs text-white/40 font-mono">Firebase</span>
                            {!isMobile && <span className="text-xs text-white/40 font-mono">RBAC</span>}
                        </div>
                    </div>

                    {/* AR Object Visualizer */}
                    <div className={`group p-6 rounded-2xl ${isMobile ? 'bg-white/5 border border-white/10' : 'brutal-card'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 bg-purple-500/20 rounded-lg text-purple-400 text-xl ${isMobile ? '' : 'brutal-border'}`}><FaCloud /></div>
                            <div className="flex gap-3">
                                <a href="https://github.com/Kathari-Hima-kishore/AR-3D-Visualizer" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                    <FaCode size={18} />
                                </a>
                                <a href="https://arobjectvisualizer.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                    <FaExternalLinkAlt size={18} />
                                </a>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">AR Object Visualizer</h3>
                        <p className="text-white/60 mb-4 text-sm leading-relaxed">
                            {isMobile 
                                ? "Web-based AR experience for visualizing 3D models in real-time directly in your browser."
                                : "A seamless web-based Augmented Reality experience. Visualize and interact with complex 3D models in real-time directly in your browser. Features interactive object manipulation (scale, rotate, place) without native app installation."
                            }
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            <span className="text-xs text-white/40 font-mono">React</span>
                            <span className="text-xs text-white/40 font-mono">Node.js</span>
                            <span className="text-xs text-white/40 font-mono">WebGL</span>
                            {!isMobile && <span className="text-xs text-white/40 font-mono">WebAR</span>}
                        </div>
                    </div>

                    {/* Open Chat */}
                    <div className={`group p-6 rounded-2xl ${isMobile ? 'bg-white/5 border border-white/10' : 'brutal-card'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 bg-green-500/20 rounded-lg text-green-400 text-xl ${isMobile ? '' : 'brutal-border'}`}><FaCode /></div>
                            <div className="flex gap-3">
                                <a href="https://github.com/Kathari-Hima-kishore/real-time-community-open-chat" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                    <FaCode size={18} />
                                </a>
                                <a href="https://kathari-hima-kishore.github.io/real-time-community-open-chat/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                    <FaExternalLinkAlt size={18} />
                                </a>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Real-Time Community Chat</h3>
                        <p className="text-white/60 mb-4 text-sm leading-relaxed">
                            {isMobile
                                ? "Lightweight real-time messaging platform built with pure HTML, CSS, and JavaScript."
                                : "A lightweight, real-time messaging platform designed for open community discussions. Built with pure HTML, CSS, and JavaScript for simplicity and speed."
                            }
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            <span className="text-xs text-white/40 font-mono">HTML5</span>
                            <span className="text-xs text-white/40 font-mono">CSS3</span>
                            <span className="text-xs text-white/40 font-mono">JavaScript</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
})
