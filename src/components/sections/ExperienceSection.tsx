'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'

interface ExperienceSectionProps {
  isMobile?: boolean
}

export const ExperienceSection = memo(function ExperienceSection({ isMobile = false }: ExperienceSectionProps) {
    const sectionVariants = {
        hidden: { opacity: 0, y: isMobile ? 30 : 50 },
        visible: { opacity: 1, y: 0, transition: { duration: isMobile ? 0.5 : 0.8, ease: "easeOut" as const } }
    }

    return (
        <section id="phase-3" className={`min-h-screen flex items-center justify-center mb-32 ${isMobile ? 'p-4' : 'p-8'}`}>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
                className="max-w-6xl w-full pointer-events-auto"
            >
                <h2 className={`font-black text-white mb-12 ${isMobile ? 'text-3xl' : 'text-5xl'}`}>Experience</h2>
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">

                    {/* Experience 1 */}
                    <div className={`relative flex items-center group is-active ${isMobile ? 'flex-col gap-4' : 'justify-between md:justify-normal md:odd:flex-row-reverse'}`}>
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-surface shadow shrink-0 ${isMobile ? '' : 'md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2'}`}>
                            <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                        </div>
                        <div className={`brutal-card p-6 rounded-2xl ${isMobile ? 'w-full' : 'w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)]'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white text-xl">Microsoft AI Azure Intern</h3>
                                <span className="text-xs border border-white/30 px-2 py-1 rounded text-white">May - Jun 2025</span>
                            </div>
                            <div className="text-sm text-gray-400 mb-4">AICTE (Microsoft Initiative)</div>
                            <ul className="text-white/70 text-sm list-disc list-inside space-y-2">
                                {isMobile ? (
                                    <>
                                        <li>Led engineering of 5+ cloud-native microservices on Azure, integrating Azure AI Foundry APIs.</li>
                                        <li>Architected scalable Python middleware on Azure App Service with Azure SQL Database.</li>
                                    </>
                                ) : (
                                    <>
                                        <li>Led the engineering of 5+ cloud-native microservices on Microsoft Azure, orchestrating the integration of Azure AI Foundry APIs into full-stack applications.</li>
                                        <li>Architected scalable Python middleware deployed on Azure App Service, integrating Azure SQL Database with optimized connection pooling.</li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Experience 2 */}
                    <div className={`relative flex items-center group is-active ${isMobile ? 'flex-col gap-4' : 'justify-between md:justify-normal md:odd:flex-row-reverse'}`}>
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-surface shadow shrink-0 ${isMobile ? '' : 'md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2'}`}>
                            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        </div>
                        <div className={`brutal-card p-6 rounded-2xl ${isMobile ? 'w-full' : 'w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)]'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white text-xl">Python Development Intern</h3>
                                <span className={`text-xs border border-white/30 px-2 py-1 rounded ${isMobile ? 'text-white' : 'text-white/60'}`}>Jul - Aug 2023</span>
                            </div>
                            <div className="text-sm text-gray-400 mb-4">SpaceZee Technologies</div>
                            <ul className="text-white/70 text-sm list-disc list-inside space-y-2">
                                <li>Streamlined data collection by architecting data pipelines and web scraping tools, aggregating real-time data from 10+ sources.</li>
                                <li>Improved data quality to 98% accuracy by processing 5,000+ records daily through validation pipelines.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
})
