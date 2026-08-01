'use client'

import { motion, useInView } from 'framer-motion'
import { memo, useRef } from 'react'
import { CertLightbox } from '@/components/ui/CertLightbox'

interface CertificationSectionProps {
  isMobile?: boolean
}

export const CertificationSection = memo(function CertificationSection({ isMobile = false }: CertificationSectionProps) {
    const sectionVariants = {
        hidden: { opacity: 0, y: isMobile ? 30 : 50 },
        visible: { opacity: 1, y: 0, transition: { duration: isMobile ? 0.5 : 0.8, ease: "easeOut" as const } }
    }

    const logoRef = useRef<HTMLDivElement>(null)
    const animated = useInView(logoRef, { amount: 0.4 })

    return (
        <section id="phase-3" className={`min-h-screen flex items-center justify-center ${isMobile ? 'p-3' : 'p-8'}`}>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={sectionVariants}
                className="max-w-6xl w-full pointer-events-auto"
            >
                <h2 className={`font-black text-text leading-tight mb-8 ${isMobile ? 'text-3xl' : 'text-5xl'}`}>
                    Certification
                </h2>
                
                <div className={`brutal-card rounded-2xl p-6 md:p-10 flex ${isMobile ? 'flex-col gap-8 items-center text-center' : 'md:flex-row gap-10 md:gap-14 items-center'}`}>
                    {/* Left · Azure logo tile — borderless, larger */}
                    <div
                        ref={logoRef}
                        className={`shrink-0 rounded-2xl flex items-center justify-center overflow-hidden relative ${animated ? 'az-animate' : ''} ${isMobile ? 'w-[40vw] h-[40vw] max-w-52 max-h-52 sm:max-w-56 sm:max-h-56' : 'w-56 h-56 md:w-64 md:h-64'}`}
                        style={{ background: 'radial-gradient(circle at 50% 35%, rgba(0,120,212,0.18), transparent 65%)' }}
                    >
                        <div className="cert-logo relative z-10 flex items-center justify-center">
                            <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" className={`${isMobile ? 'w-[32vw] h-[32vw] max-w-44 max-h-44 sm:max-w-48 sm:max-h-48' : 'w-48 h-48 md:w-56 md:h-56'}`}>
                                <defs>
                                    <linearGradient id="e399c19f-b68f-429d-b176-18c2117ff73c" x1="-1032.172" x2="-1059.213" y1="145.312" y2="65.426" gradientTransform="matrix(1 0 0 -1 1075 158)" gradientUnits="userSpaceOnUse">
                                        <stop offset="0" stopColor="#114a8b"/>
                                        <stop offset="1" stopColor="#0669bc"/>
                                    </linearGradient>
                                    <linearGradient id="ac2a6fc2-ca48-4327-9a3c-d4dcc3256e15" x1="-1023.725" x2="-1029.98" y1="108.083" y2="105.968" gradientTransform="matrix(1 0 0 -1 1075 158)" gradientUnits="userSpaceOnUse">
                                        <stop offset="0" stopOpacity=".3"/>
                                        <stop offset=".071" stopOpacity=".2"/>
                                        <stop offset=".321" stopOpacity=".1"/>
                                        <stop offset=".623" stopOpacity=".05"/>
                                        <stop offset="1" stopOpacity="0"/>
                                    </linearGradient>
                                    <linearGradient id="a7fee970-a784-4bb1-af8d-63d18e5f7db9" x1="-1027.165" x2="-997.482" y1="147.642" y2="68.561" gradientTransform="matrix(1 0 0 -1 1075 158)" gradientUnits="userSpaceOnUse">
                                        <stop offset="0" stopColor="#3ccbf4"/>
                                        <stop offset="1" stopColor="#2892df"/>
                                    </linearGradient>
                                    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" stopColor="#2892df" stopOpacity="0.55"/>
                                        <stop offset="100%" stopColor="#2892df" stopOpacity="0"/>
                                    </radialGradient>
                                    <filter id="softglow" x="-50%" y="-50%" width="200%" height="200%">
                                        <feGaussianBlur stdDeviation="2.2" result="b"/>
                                        <feMerge>
                                            <feMergeNode in="b"/>
                                            <feMergeNode in="SourceGraphic"/>
                                        </feMerge>
                                    </filter>
                                </defs>
                                <g className="stage">
                                    <circle className="pulse" cx="48" cy="48" r="2" fill="url(#glow)"/>
                                    <path className="mark" fill="url(#e399c19f-b68f-429d-b176-18c2117ff73c)" strokeWidth="1" d="M33.338 6.544h26.038l-27.03 80.087a4.152 4.152 0 0 1-3.933 2.824H8.149a4.145 4.145 0 0 1-3.928-5.47L29.404 9.368a4.152 4.152 0 0 1 3.934-2.825z"/>
                                    <path className="mark" fill="#0078d4" strokeWidth="1" d="M71.175 60.261h-41.29a1.911 1.911 0 0 0-1.305 3.309l26.532 24.764a4.171 4.171 0 0 0 2.846 1.121h23.38z"/>
                                    <path className="mark" fill="url(#ac2a6fc2-ca48-4327-9a3c-d4dcc3256e15)" strokeWidth="1" d="M33.338 6.544a4.118 4.118 0 0 0-3.943 2.879L4.252 83.917a4.14 4.14 0 0 0 3.908 5.538h20.787a4.443 4.443 0 0 0 3.41-2.9l5.014-14.777 17.91 16.705a4.237 4.237 0 0 0 2.666.972H81.24L71.024 60.261l-29.781.007L59.47 6.544z"/>
                                    <path className="mark" fill="url(#a7fee970-a784-4bb1-af8d-63d18e5f7db9)" strokeWidth="1" d="M66.595 9.364a4.145 4.145 0 0 0-3.928-2.82H33.648a4.146 4.146 0 0 1 3.928 2.82l25.184 74.62a4.146 4.146 0 0 1-3.928 5.472h29.02a4.146 4.146 0 0 0 3.927-5.472z"/>
                                </g>
                            </svg>
                        </div>
                    </div>

                    {/* Right · heading → bullets → certificate button */}
                    <div className="flex-1 min-w-0 flex flex-col items-center md:items-start">
                        <p className="text-accent uppercase text-xs font-semibold tracking-[0.3em] mb-3">Microsoft Certified</p>
                        <h2 className={`font-black text-text leading-[1.08] mb-5 ${isMobile ? 'text-lg sm:text-2xl whitespace-nowrap' : 'text-3xl md:text-4xl'}`}>
                            Azure Fundamentals (AZ-900)
                        </h2>

                        {!isMobile && (
                            <ul className="list-none flex flex-col gap-2.5 mb-8 items-start">
                                <li className="flex gap-3 items-start text-text/75 text-sm md:text-base">
                                    <span className="mt-2 w-2 h-2 shrink-0 bg-accent" style={{ boxShadow: '0 0 10px rgba(108,92,231,0.35)' }}></span>
                                    <span><b className="text-text font-semibold">Cloud models</b> — IaaS, PaaS, and SaaS for application deployment.</span>
                                </li>
                                <li className="flex gap-3 items-start text-text/75 text-sm md:text-base">
                                    <span className="mt-2 w-2 h-2 shrink-0 bg-accent" style={{ boxShadow: '0 0 10px rgba(108,92,231,0.35)' }}></span>
                                    <span><b className="text-text font-semibold">Development &amp; DevOps</b> — containers, serverless functions, web apps, and databases.</span>
                                </li>
                            </ul>
                        )}

                        <CertLightbox isMobile={isMobile} />

                        <div className="w-full flex gap-12 md:gap-10 flex-wrap mt-8 pt-5 border-t border-white/10 justify-center md:justify-start">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted">Issuer</span>
                                <span className="text-sm font-semibold text-text">Microsoft</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted">Issued</span>
                                <span className="text-sm font-semibold text-text">July 28, 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
})
