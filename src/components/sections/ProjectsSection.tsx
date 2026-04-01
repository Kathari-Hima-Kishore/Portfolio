'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import Image from 'next/image'

interface ProjectsSectionProps {
  isMobile?: boolean
}

export const ProjectsSection = memo(function ProjectsSection({ isMobile = false }: ProjectsSectionProps) {
    const sectionVariants = {
        hidden: { opacity: 0, y: isMobile ? 30 : 50 },
        visible: { opacity: 1, y: 0, transition: { duration: isMobile ? 0.5 : 0.8, ease: "easeOut" as const } }
    }

    return (
        <section id="phase-4" className={`min-h-screen flex items-center justify-center ${isMobile ? 'p-4' : 'p-8'}`}>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={sectionVariants}
                className={`max-w-6xl w-full flex items-center gap-12 pointer-events-auto ${isMobile ? 'flex-col' : 'flex-col md:flex-row'}`}
            >
                <div className={`${isMobile ? 'w-full' : 'w-full md:w-1/2'}`}>
                    {isMobile ? (
                        <>
                            <h2 className="font-black text-white mb-2 text-3xl">Featured Project</h2>
                            <div className="h-px bg-white/20 mb-8"></div>
                            <h3 className="font-bold text-white mb-4 text-2xl">Event Management System</h3>
                            <p className="text-white/70 leading-relaxed mb-4 text-sm">
                                A modern platform with real-time sync and 3-tier RBAC system. Built with Flask and Firebase.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {["Python", "Flask", "Firebase", "RBAC"].map(tech => (
                                    <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/60">{tech}</span>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <a href="https://github.com/Kathari-Hima-kishore/event-management-system-with-firebase" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">
                                    <FaExternalLinkAlt size={14} /> GitHub
                                </a>
                                <a href="https://event-management-system-with-firebase.onrender.com" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg text-sm font-bold bg-accent/20 border border-accent/40 hover:bg-accent/30 transition-colors">
                                    Live Demo
                                </a>
                            </div>
                        </>
                    ) : (
                        <>
                            <span className="text-accent tracking-widest uppercase text-sm font-bold mb-2 block">Featured Project</span>
                            <h2 className={`font-black text-white mb-6 ${isMobile ? 'text-2xl' : 'text-4xl md:text-5xl'}`}>Event Management System</h2>
                            <p className="text-white/70 leading-relaxed mb-6">
                                A modern event management platform featuring real-time data synchronization and a robust <strong>3-tier Role-Based Access Control (RBAC)</strong> system. Built with <strong>Flask</strong> and <strong>Firebase</strong> for seamless performance.
                            </p>

                            <div className="mb-6 space-y-2">
                                <div className="flex items-start gap-2 text-sm text-white/60">
                                    <span className="text-accent">▹</span>
                                    <span><strong>Real-time Updates:</strong> Live enrollment tracking and dynamic event grids.</span>
                                </div>
                                <div className="flex items-start gap-2 text-sm text-white/60">
                                    <span className="text-accent">▹</span>
                                    <span><strong>Admin Tools:</strong> Event CRUD, participant management, and developer approval workflows.</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {["Python", "Flask", "Firebase Auth", "Firestore", "RBAC", "HTML/CSS/JS"].map(tech => (
                                    <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/60">{tech}</span>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <a href="https://github.com/Kathari-Hima-kishore/event-management-system-with-firebase" target="_blank" rel="noopener noreferrer" className="brutal-btn px-6 py-3 rounded-xl flex items-center gap-2">
                                    <FaExternalLinkAlt size={14} /> GitHub Repo
                                </a>
                                <a href="https://event-management-system-with-firebase.onrender.com" target="_blank" rel="noopener noreferrer" className="brutal-btn-accent px-6 py-3 rounded-xl font-bold">
                                    Live Demo
                                </a>
                            </div>
                        </>
                    )}
                </div>

                <div className="w-full md:w-1/2 h-[400px] brutal-card rounded-2xl relative overflow-hidden group">
                    {isMobile && (
                        <div className="absolute top-3 left-3 z-10 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white/80 border border-white/20">
                            UI / Homepage
                        </div>
                    )}
                    <Image
                        src="/EMS.png"
                        alt="Event Management System"
                        fill
                        className="object-contain object-center transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                </div>
            </motion.div>
        </section>
    )
})
