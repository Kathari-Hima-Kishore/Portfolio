'use client'

import { motion } from 'framer-motion'
import { memo, useState } from 'react'
import { FaExternalLinkAlt, FaCloud, FaCode, FaCalendarAlt, FaChrome, FaFolderOpen, FaEdge } from 'react-icons/fa'
import { useDeviceType } from '@/lib/device'

interface ProjectsMoreSectionProps {
  isMobile?: boolean
}

function IconLink({ 
  href, 
  children, 
  label, 
  showLabel 
}: { 
  href: string, 
  children: React.ReactNode, 
  label: string,
  showLabel: boolean
}) {
  return (
    <div className="relative flex flex-col items-center gap-1">
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="p-2 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/10"
      >
        {children}
      </a>
      {showLabel && (
        <span className="absolute -bottom-5 text-[10px] text-white/60 font-mono whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  )
}

export const ProjectsMoreSection = memo(function ProjectsMoreSection({ isMobile = false }: ProjectsMoreSectionProps) {
    const { orientation } = useDeviceType()
    const isPortrait = orientation === 'portrait'
    const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)
    
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
                            {!isMobile ? (
                                <div className="relative w-[120px] h-[40px] flex items-center justify-center">
                                    {/* Static icons - visible by default */}
                                    <div className="absolute flex gap-5 transition-all duration-500 ease-out opacity-100 group-hover:opacity-0">
                                        <a href="https://github.com/Kathari-Hima-kishore/event-management-system-with-firebase" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                            <FaCode size={18} />
                                        </a>
                                        <a href="https://event-management-system-with-fireba.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                            <FaExternalLinkAlt size={18} />
                                        </a>
                                    </div>
                                    {/* Capsule with enlarged icons - visible on hover */}
                                    <div className="absolute flex items-center bg-white/5 rounded-full px-3 py-1.5 border border-white/10 transition-all duration-500 ease-out opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-hover:bg-white/10 group-hover:border-white/20">
                                        <div 
                                          className="relative"
                                          onMouseEnter={() => setHoveredIcon('ems-github')}
                                          onMouseLeave={() => setHoveredIcon(null)}
                                        >
                                          <a href="https://github.com/Kathari-Hima-kishore/event-management-system-with-firebase" target="_blank" rel="noopener noreferrer" className="p-2 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/10 block">
                                            <FaCode size={20} />
                                          </a>
                                          {hoveredIcon === 'ems-github' && (
                                            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-white/60 font-mono whitespace-nowrap">Source</span>
                                          )}
                                        </div>
                                        <div className="w-px h-5 bg-white/10 mx-1" />
                                        <div 
                                          className="relative"
                                          onMouseEnter={() => setHoveredIcon('ems-live')}
                                          onMouseLeave={() => setHoveredIcon(null)}
                                        >
                                          <a href="https://event-management-system-with-fireba.vercel.app/" target="_blank" rel="noopener noreferrer" className="p-2 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/10 block">
                                            <FaExternalLinkAlt size={20} />
                                          </a>
                                          {hoveredIcon === 'ems-live' && (
                                            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-white/60 font-mono whitespace-nowrap">Live</span>
                                          )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-5">
                                    <a href="https://github.com/Kathari-Hima-kishore/event-management-system-with-firebase" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                        <FaCode size={18} />
                                    </a>
                                    <a href="https://event-management-system-with-fireba.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                        <FaExternalLinkAlt size={18} />
                                    </a>
                                </div>
                            )}
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

                    {/* Tab Wrapper */}
                    <div className={`group p-6 rounded-2xl ${isMobile ? 'bg-white/5 border border-white/10' : 'brutal-card'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 bg-blue-500/20 rounded-lg text-blue-400 text-xl ${isMobile ? '' : 'brutal-border'}`}><FaFolderOpen /></div>
                            {!isMobile ? (
                                <div className="relative w-[140px] h-[40px] flex items-center justify-center">
                                    {/* Static icons - visible by default */}
                                    <div className="absolute flex gap-5 transition-all duration-500 ease-out opacity-100 group-hover:opacity-0">
                                        <a href="https://github.com/Kathari-Hima-Kishore/Tab-Wrapper" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                            <FaCode size={18} />
                                        </a>
                                        <a href="https://chromewebstore.google.com/detail/tab-wrapper/lgcmacienpoehfkmmdlagdoobgkajnmn" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                            <FaChrome size={18} />
                                        </a>
                                        <a href="https://microsoftedge.microsoft.com/addons/detail/tab-wrapper/knmghfobfanphniiidkcoaklddipiajj" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                            <FaEdge size={18} />
                                        </a>
                                    </div>
                                    {/* Capsule with enlarged icons - visible on hover */}
                                    <div className="absolute flex items-center bg-white/5 rounded-full px-3 py-1.5 border border-white/10 transition-all duration-500 ease-out opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-hover:bg-white/10 group-hover:border-white/20">
                                        <div 
                                          className="relative"
                                          onMouseEnter={() => setHoveredIcon('tab-github')}
                                          onMouseLeave={() => setHoveredIcon(null)}
                                        >
                                          <a href="https://github.com/Kathari-Hima-Kishore/Tab-Wrapper" target="_blank" rel="noopener noreferrer" className="p-2 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/10 block">
                                            <FaCode size={20} />
                                          </a>
                                          {hoveredIcon === 'tab-github' && (
                                            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-white/60 font-mono whitespace-nowrap">Source</span>
                                          )}
                                        </div>
                                        <div className="w-px h-5 bg-white/10 mx-1" />
                                        <div 
                                          className="relative"
                                          onMouseEnter={() => setHoveredIcon('tab-chrome')}
                                          onMouseLeave={() => setHoveredIcon(null)}
                                        >
                                          <a href="https://chromewebstore.google.com/detail/tab-wrapper/lgcmacienpoehfkmmdlagdoobgkajnmn" target="_blank" rel="noopener noreferrer" className="p-2 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/10 block">
                                            <FaChrome size={20} />
                                          </a>
                                          {hoveredIcon === 'tab-chrome' && (
                                            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-white/60 font-mono whitespace-nowrap">Chrome</span>
                                          )}
                                        </div>
                                        <div className="w-px h-5 bg-white/10 mx-1" />
                                        <div 
                                          className="relative"
                                          onMouseEnter={() => setHoveredIcon('tab-edge')}
                                          onMouseLeave={() => setHoveredIcon(null)}
                                        >
                                          <a href="https://microsoftedge.microsoft.com/addons/detail/tab-wrapper/knmghfobfanphniiidkcoaklddipiajj" target="_blank" rel="noopener noreferrer" className="p-2 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/10 block">
                                            <FaEdge size={20} />
                                          </a>
                                          {hoveredIcon === 'tab-edge' && (
                                            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-white/60 font-mono whitespace-nowrap">Edge</span>
                                          )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-5">
                                    <a href="https://github.com/Kathari-Hima-Kishore/Tab-Wrapper" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                        <FaCode size={18} />
                                    </a>
                                    <a href="https://chromewebstore.google.com/detail/tab-wrapper/lgcmacienpoehfkmmdlagdoobgkajnmn" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                        <FaChrome size={18} />
                                    </a>
                                    <a href="https://microsoftedge.microsoft.com/addons/detail/tab-wrapper/knmghfobfanphniiidkcoaklddipiajj" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                        <FaEdge size={18} />
                                    </a>
                                </div>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Tab Wrapper</h3>
                        <p className="text-white/60 mb-4 text-sm leading-relaxed">
                            {isMobile 
                                ? "AI-powered browser extension that automatically organizes tabs into relevant groups based on content and purpose."
                                : "An intelligent browser extension that uses AI to automatically organize your tabs into relevant, similar, or identical groups based on their content and purpose. Keep your workspace clutter-free and boost productivity."
                            }
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            <span className="text-xs text-white/40 font-mono">JavaScript </span>
                            <span className="text-xs text-white/40 font-mono"> Gen AI </span>
                            <span className="text-xs text-white/40 font-mono"> Browser APIs </span>
                            {!isMobile && <span className="text-xs text-white/40 font-mono"> Chrome Extension</span>}
                        </div>
                    </div>

                    {/* AR Object Visualizer */}
                    <div className={`group p-6 rounded-2xl ${isMobile ? 'bg-white/5 border border-white/10' : 'brutal-card'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 bg-purple-500/20 rounded-lg text-purple-400 text-xl ${isMobile ? '' : 'brutal-border'}`}><FaCloud /></div>
                            {!isMobile ? (
                                <div className="relative w-[120px] h-[40px] flex items-center justify-center">
                                    {/* Static icons - visible by default */}
                                    <div className="absolute flex gap-5 transition-all duration-500 ease-out opacity-100 group-hover:opacity-0">
                                        <a href="https://github.com/Kathari-Hima-kishore/AR-3D-Visualizer" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                            <FaCode size={18} />
                                        </a>
                                        <a href="https://arobjectvisualizer.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                            <FaExternalLinkAlt size={18} />
                                        </a>
                                    </div>
                                    {/* Capsule with enlarged icons - visible on hover */}
                                    <div className="absolute flex items-center bg-white/5 rounded-full px-3 py-1.5 border border-white/10 transition-all duration-500 ease-out opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-hover:bg-white/10 group-hover:border-white/20">
                                        <div 
                                          className="relative"
                                          onMouseEnter={() => setHoveredIcon('ar-github')}
                                          onMouseLeave={() => setHoveredIcon(null)}
                                        >
                                          <a href="https://github.com/Kathari-Hima-kishore/AR-3D-Visualizer" target="_blank" rel="noopener noreferrer" className="p-2 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/10 block">
                                            <FaCode size={20} />
                                          </a>
                                          {hoveredIcon === 'ar-github' && (
                                            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-white/60 font-mono whitespace-nowrap">Source</span>
                                          )}
                                        </div>
                                        <div className="w-px h-5 bg-white/10 mx-1" />
                                        <div 
                                          className="relative"
                                          onMouseEnter={() => setHoveredIcon('ar-live')}
                                          onMouseLeave={() => setHoveredIcon(null)}
                                        >
                                          <a href="https://arobjectvisualizer.vercel.app/" target="_blank" rel="noopener noreferrer" className="p-2 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/10 block">
                                            <FaExternalLinkAlt size={20} />
                                          </a>
                                          {hoveredIcon === 'ar-live' && (
                                            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-white/60 font-mono whitespace-nowrap">Live</span>
                                          )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-5">
                                    <a href="https://github.com/Kathari-Hima-kishore/AR-3D-Visualizer" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                        <FaCode size={18} />
                                    </a>
                                    <a href="https://arobjectvisualizer.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                        <FaExternalLinkAlt size={18} />
                                    </a>
                                </div>
                            )}
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
                            {!isMobile ? (
                                <div className="relative w-[120px] h-[40px] flex items-center justify-center">
                                    {/* Static icons - visible by default */}
                                    <div className="absolute flex gap-5 transition-all duration-500 ease-out opacity-100 group-hover:opacity-0">
                                        <a href="https://github.com/Kathari-Hima-kishore/real-time-community-open-chat" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                            <FaCode size={18} />
                                        </a>
                                        <a href="https://kathari-hima-kishore.github.io/real-time-community-open-chat/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                            <FaExternalLinkAlt size={18} />
                                        </a>
                                    </div>
                                    {/* Capsule with enlarged icons - visible on hover */}
                                    <div className="absolute flex items-center bg-white/5 rounded-full px-3 py-1.5 border border-white/10 transition-all duration-500 ease-out opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-hover:bg-white/10 group-hover:border-white/20">
                                        <div 
                                          className="relative"
                                          onMouseEnter={() => setHoveredIcon('chat-github')}
                                          onMouseLeave={() => setHoveredIcon(null)}
                                        >
                                          <a href="https://github.com/Kathari-Hima-kishore/real-time-community-open-chat" target="_blank" rel="noopener noreferrer" className="p-2 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/10 block">
                                            <FaCode size={20} />
                                          </a>
                                          {hoveredIcon === 'chat-github' && (
                                            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-white/60 font-mono whitespace-nowrap">Source</span>
                                          )}
                                        </div>
                                        <div className="w-px h-5 bg-white/10 mx-1" />
                                        <div 
                                          className="relative"
                                          onMouseEnter={() => setHoveredIcon('chat-live')}
                                          onMouseLeave={() => setHoveredIcon(null)}
                                        >
                                          <a href="https://kathari-hima-kishore.github.io/real-time-community-open-chat/" target="_blank" rel="noopener noreferrer" className="p-2 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/10 block">
                                            <FaExternalLinkAlt size={20} />
                                          </a>
                                          {hoveredIcon === 'chat-live' && (
                                            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-white/60 font-mono whitespace-nowrap">Live</span>
                                          )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-5">
                                    <a href="https://github.com/Kathari-Hima-kishore/real-time-community-open-chat" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                        <FaCode size={18} />
                                    </a>
                                    <a href="https://kathari-hima-kishore.github.io/real-time-community-open-chat/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                        <FaExternalLinkAlt size={18} />
                                    </a>
                                </div>
                            )}
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