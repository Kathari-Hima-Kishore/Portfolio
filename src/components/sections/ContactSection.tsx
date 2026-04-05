'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin } from 'react-icons/fa'

interface ContactSectionProps {
  isMobile?: boolean
}

export const ContactSection = memo(function ContactSection({ isMobile = false }: ContactSectionProps) {
    const sectionVariants = {
        hidden: { opacity: 0, y: isMobile ? 30 : 50 },
        visible: { opacity: 1, y: 0, transition: { duration: isMobile ? 0.5 : 0.8, ease: "easeOut" as const } }
    }

    return (
        <section id="phase-7" className={`min-h-screen flex items-center justify-center ${isMobile ? 'p-3' : 'p-8'}`}>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={sectionVariants}
                className="max-w-4xl w-full text-center pointer-events-auto"
            >
                <h2 className={`font-black text-white mb-6 ${isMobile ? 'text-3xl' : 'text-5xl'}`}>Let&apos;s Connect</h2>
                <p className={`text-white/60 mb-12 max-w-2xl mx-auto ${isMobile ? 'text-lg' : 'text-xl'}`}>
                    I&apos;m currently looking for new opportunities as a Full Stack Cloud Engineer. Whether you have a question or just want to say hi, I&apos;ll be delighted to get back to you!
                </p>

                <div className={`grid gap-6 mb-12 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
                    <a href="mailto:himakishorekathari@gmail.com" className="brutal-card p-6 rounded-xl group">
                        <FaEnvelope className="text-3xl text-accent mb-4 mx-auto group-hover:scale-110 transition-transform" />
                        <h3 className="text-white font-bold mb-1">Email</h3>
                        <p className="text-white/40 text-sm break-all">himakishorekathari@gmail.com</p>
                    </a>
                    <a href="tel:+918688339330" className="brutal-card p-6 rounded-xl group">
                        <FaPhone className="text-3xl text-green-400 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                        <h3 className="text-white font-bold mb-1">Phone</h3>
                        <p className="text-white/40 text-sm">+91 86883 39330</p>
                    </a>
                    <div className="brutal-card p-6 rounded-xl group">
                        <FaMapMarkerAlt className="text-3xl text-red-400 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                        <h3 className="text-white font-bold mb-1">Location</h3>
                        <p className="text-white/40 text-sm">Chennai, Tamil Nadu</p>
                    </div>
                </div>

                <div className="flex justify-center gap-6">
                    <a href="https://github.com/Kathari-Hima-kishore" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                        <FaGithub size={20} />
                    </a>
                    <a href="https://www.linkedin.com/in/kathari-hima-kishore/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-[#0077b5] hover:text-white transition-all">
                        <FaLinkedin size={20} />
                    </a>
                </div>

                <footer className="mt-24 text-white/20 text-sm">
                    © 2026 Kathari Hima Kishore. Built with React.js, Next.js, Spline & Tailwind.
                </footer>
            </motion.div>
        </section>
    )
})
