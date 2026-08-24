'use client'

import { motion } from 'framer-motion'
import { memo, useState, useRef } from 'react'
import { FaGithub, FaLinkedin, FaPaperPlane, FaArrowRight } from 'react-icons/fa'
import { useDeviceType } from '@/lib/device'
import { TabletContactSection } from './TabletContactSection'

interface ContactSectionProps {
  isMobile?: boolean
}

export const ContactSection = memo(function ContactSection({ isMobile = false }: ContactSectionProps) {
    const [result, setResult] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [fieldValues, setFieldValues] = useState({
        name: '',
        email: '',
        message: ''
    })
    const formRef = useRef<HTMLDivElement>(null)
    const { deviceType, orientation } = useDeviceType()

    // Device detection
    const isTablet = deviceType === 'tablet'
    const isPortrait = orientation === 'portrait'
    const useMobileLayout = isMobile || (isTablet && isPortrait)

    // Return tablet-specific component for tablets
    if (isTablet) {
        return <TabletContactSection isPortrait={isPortrait} />
    }

    const sectionVariants = {
        hidden: { opacity: 0, y: isMobile ? 30 : 50 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { 
                duration: isMobile ? 0.5 : 0.8, 
                ease: "easeOut" as const,
                staggerChildren: 0.1
            } 
        }
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitting(true)
        setResult("Sending...")

        const form = event.target as HTMLFormElement
        const data = {
            name: (form.elements.namedItem("name") as HTMLInputElement).value,
            email: (form.elements.namedItem("email") as HTMLInputElement).value,
            message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
            access_key: "9949f8e2-47ee-4d5a-b815-dfa1c077ff77",
        }

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })

            const res = await response.json()
            console.log("Web3Forms response:", res)

            if (res.success) {
                setResult("✓ Message sent successfully!")
                ;(event.target as HTMLFormElement).reset()
                setFieldValues({ name: '', email: '', message: '' })
                
                setTimeout(() => {
                    setResult("")
                }, 3000)
            } else {
                console.error("Web3Forms error:", res)
                setResult("Error: " + (res.message || "Please try again."))
            }
        } catch (error) {
            console.error("Network error:", error)
            setResult("Network error. Please check connection.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Handle field value changes
    const handleInputChange = (field: keyof typeof fieldValues, value: string) => {
        setFieldValues(prev => ({ ...prev, [field]: value }))
    }

    return (
        <section id="phase-8" className={`min-h-screen flex items-center justify-center ${useMobileLayout ? 'p-4' : 'p-8'}`}>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
                className={`max-w-4xl w-full pointer-events-auto ${useMobileLayout ? '' : 'px-4'}`}
            >
                {/* Header - positioned above form */}
                <div className="mb-4 w-full max-w-2xl mx-auto text-left">
                    <motion.div variants={sectionVariants}>
                        <h2 className="font-black text-white mb-3 text-left text-3xl md:text-5xl">
                            LET&apos;S CONNECT
                        </h2>
                        
                        <motion.p 
                            variants={sectionVariants}
                            className="text-white/60 mb-8 max-w-xl text-left uppercase tracking-widest text-xs md:text-sm"
                        >
                            HIRING FOR A ROLE OR PROJECT? MY INBOX IS ALWAYS OPEN
                        </motion.p>
                    </motion.div>

                    {/* Main Form Container - positioned directly below header */}
                    <motion.div 
                        ref={formRef}
                        className="relative w-full max-w-2xl"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={sectionVariants}
                    >
                        <motion.div 
                            className={`brutal-card p-6 md:p-8 transition-all duration-300`}
                        >
                        {/* Animated Grid Background */}
                        <motion.div 
                            className="absolute inset-0 -z-10 brutal-grid"
                            animate={{ 
                                opacity: [0.1, 0.2, 0.1],
                                scale: [1, 1.02, 1]
                            }}
                            transition={{ 
                                duration: 3, 
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />

                        {/* Glowing corner accents */}
                        <motion.div 
                            className="absolute top-4 left-4 w-3 h-3 bg-accent rounded-sm"
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.div 
                            className="absolute top-4 right-4 w-3 h-3 bg-accent rounded-sm"
                            animate={{ opacity: [0.7, 0.3, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        />
                        <motion.div 
                            className="absolute bottom-4 left-4 w-3 h-3 bg-accent rounded-sm"
                            animate={{ opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        />
                        <motion.div 
                            className="absolute bottom-4 right-4 w-3 h-3 bg-accent rounded-sm"
                            animate={{ opacity: [0.8, 0.4, 0.8] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                        />

                        <form onSubmit={onSubmit} className="space-y-6">
                            {/* Name & Email Fields */}
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Name Field */}
                                <div className="text-left">
                                    <label
                                        htmlFor="name"
                                        className="block text-white/60 mb-2 uppercase tracking-widest text-xs font-bold"
                                    >
                                        NAME
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={fieldValues.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="w-full bg-black/50 border-2 border-white rounded-none px-4 py-3 text-white font-bold focus:outline-none focus:border-accent"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                
                                {/* Email Field */}
                                <div className="text-left">
                                    <label
                                        htmlFor="email"
                                        className="block text-white/60 mb-2 uppercase tracking-widest text-xs font-bold"
                                    >
                                        EMAIL
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={fieldValues.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="w-full bg-black/50 border-2 border-white rounded-none px-4 py-3 text-white font-bold focus:outline-none focus:border-accent"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>
                            
                            {/* Message Field */}
                            <div className="text-left">
                                <label
                                    htmlFor="message"
                                    className="block text-white/60 mb-2 uppercase tracking-widest text-xs font-bold"
                                >
                                    MESSAGE
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={4}
                                    value={fieldValues.message}
                                    onChange={(e) => handleInputChange('message', e.target.value)}
                                    className="w-full bg-black/50 border-2 border-white rounded-none px-4 py-3 text-white font-bold focus:outline-none focus:border-accent resize-none"
                                    placeholder="Share your thoughts or opportunity details..."
                                />
                            </div>

                            {/* Submit Section */}
                            <div className="pt-4 border-t border-white/20">
                                <div className="flex items-center justify-start gap-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="ghost-sweep ghost-sweep-classic px-6 py-2.5 text-sm uppercase tracking-widest font-black relative overflow-hidden"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2 z-10">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                SENDING...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2 z-10">
                                                <FaPaperPlane />
                                                SEND MESSAGE
                                                <FaArrowRight size={14} />
                                            </span>
                                        )}
                                    </button>
                                </div>
                                
                                {/* Result Message */}
                                {result && (
                                    <div className={`mt-4 text-sm font-bold uppercase tracking-widest ${
                                        result.includes('✓') 
                                            ? 'text-green-400' 
                                            : result.includes('Error') 
                                            ? 'text-red-400' 
                                            : 'text-accent-light'
                                    }`}>
                                        {result}
                                    </div>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
                </div>

                {/* Social Links */}
                <motion.div 
                    variants={sectionVariants}
                    className="flex justify-center gap-6 mb-12 mt-12"
                >
                    <a 
                        href="https://github.com/Kathari-Hima-kishore" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-16 h-16 bg-black border-2 border-white/30 flex items-center justify-center text-white/60 hover:text-white transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#ffffff] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_#ffffff]"
                    >
                        <FaGithub size={24} />
                    </a>
                    
                    <a 
                        href="https://www.linkedin.com/in/kathari-hima-kishore/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-16 h-16 bg-black border-2 border-white/30 flex items-center justify-center text-white/60 hover:text-white transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#ffffff] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_#ffffff]"
                    >
                        <FaLinkedin size={24} />
                    </a>
                </motion.div>

                {/* Footer */}
                <motion.div variants={sectionVariants}>
                    <footer className="text-white/20 text-sm uppercase tracking-widest border-t border-white/10 pt-8">
                        <p>© 2026 KATHARI HIMA KISHORE</p>
                        <p className="text-white/10 mt-1">REACT · NEXT · SPLINE · TAILWIND</p>
                        {!useMobileLayout && !isTablet && (
                            <p className="text-white/5 mt-1 text-xs">ENHANCED ANIMATIONS · SPRING PHYSICS</p>
                        )}
                    </footer>
                </motion.div>
            </motion.div>
        </section>
    )
})