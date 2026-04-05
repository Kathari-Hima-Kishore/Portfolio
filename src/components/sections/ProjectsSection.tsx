'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'
import { FaGithub } from 'react-icons/fa'
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
        <section id="phase-4" className={`min-h-screen flex items-center justify-center mb-32 ${isMobile ? 'p-2' : 'p-8'}`}>
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
                            <h3 className="font-bold text-white mb-4 text-2xl">CodeForge</h3>
                            <p className="text-white/70 leading-relaxed mb-4 text-sm">
                                Real-time collaborative IDE with zero setup. Code together, execute in 8+ languages, and deploy to Docker — all from your browser.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {["Next.js", "TypeScript", "Socket.IO", "Firebase", "Docker"].map(tech => (
                                    <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/60">{tech}</span>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <a href="https://github.com/Kathari-Hima-kishore/CodeForge" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">
                                    <FaGithub size={14} /> GitHub
                                </a>
                            </div>
                        </>
                    ) : (
                        <>
                            <span className="text-accent tracking-widest uppercase text-sm font-bold mb-2 block">Featured Project</span>
                            <h2 className={`font-black text-white mb-6 ${isMobile ? 'text-2xl' : 'text-4xl md:text-5xl'}`}>CodeForge</h2>
                            <p className="text-white/70 leading-relaxed mb-6">
                                A <strong>browser-based collaborative IDE</strong> that eliminates setup barriers. Code together in real-time with Monaco Editor (VS Code), execute in <strong>8+ programming languages</strong>, and deploy to <strong>Docker</strong> — all from your browser with zero configuration.
                            </p>

                            <div className="mb-6 space-y-2">
                                <div className="flex items-start gap-2 text-sm text-white/60">
                                    <span className="text-accent">▹</span>
                                    <span><strong>Real-time Collaboration:</strong> Instant file sync (&lt;100ms), integrated chat, and user presence system.</span>
                                </div>
                                <div className="flex items-start gap-2 text-sm text-white/60">
                                    <span className="text-accent">▹</span>
                                    <span><strong>Multi-language Execution:</strong> Python, JavaScript, TypeScript, Java, C/C++, and more with streaming output.</span>
                                </div>
                                <div className="flex items-start gap-2 text-sm text-white/60">
                                    <span className="text-accent">▹</span>
                                    <span><strong>Session Persistence:</strong> Auto-save to Firestore with instant restore on reconnect.</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {["Next.js 15", "React 19", "TypeScript", "Socket.IO", "Firebase", "Monaco Editor", "Docker", "Tailwind CSS"].map(tech => (
                                    <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/60">{tech}</span>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <a href="https://github.com/Kathari-Hima-kishore/CodeForge" target="_blank" rel="noopener noreferrer" className="brutal-btn px-6 py-3 rounded-xl flex items-center gap-2">
                                    <FaGithub size={14} /> GitHub Repo
                                </a>
                            </div>
                        </>
                    )}
                </div>

                <div className={`w-full md:w-1/2 ${isMobile ? 'h-[300px]' : 'h-[400px]'} brutal-card rounded-2xl relative overflow-hidden group mt-6 md:mt-0`}>
                    {isMobile && (
                        <div className="absolute top-3 left-3 z-10 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white/80 border border-white/20">
                            Homepage
                        </div>
                    )}
                    <Image
                        src="/codeforge-home.png"
                        alt="CodeForge Homepage"
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
