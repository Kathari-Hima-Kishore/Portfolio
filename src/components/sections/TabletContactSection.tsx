'use client'

import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { memo, useState, useRef, useEffect } from 'react'
import { FaGithub, FaLinkedin, FaPaperPlane, FaArrowRight, FaExpandAlt } from 'react-icons/fa'

interface TabletContactSectionProps {
  isPortrait?: boolean
}

export const TabletContactSection = memo(function TabletContactSection({ isPortrait = false }: TabletContactSectionProps) {
    const [result, setResult] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeField, setActiveField] = useState<string | null>(null)
    const [isFormExpanded, setIsFormExpanded] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })
    const formRef = useRef<HTMLDivElement>(null)

    const sectionVariants: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { 
                duration: 0.7,
                ease: "easeOut"
            } 
        }
    }

    const formContainerVariants: Variants = {
        initial: { 
            scale: isPortrait ? 1 : 0.9, 
            opacity: 0, 
            y: 20 
        },
        animate: { 
            scale: 1, 
            opacity: 1, 
            y: 0,
            transition: { 
                type: "spring",
                stiffness: 120,
                damping: 18,
                delay: 0.1
            }
        }
    }

    const expandedFormVariants: Variants = {
        initial: { 
            width: "100%",
            borderRadius: "16px",
            scale: 1
        },
        expanded: {
            width: "120%",
            borderRadius: "24px",
            scale: 1.05,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    }

    const fieldVariants: Variants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.4,
                type: "spring",
                stiffness: 150,
                damping: 12
            }
        })
    }

    const labelVariants: Variants = {
        initial: { 
            opacity: 0.6, 
            scale: 1,
            x: 0 
        },
        focus: { 
            opacity: 1, 
            scale: 1.05,
            x: 5,
            color: "var(--accent)",
            transition: { 
                type: "spring", 
                stiffness: 200, 
                damping: 10 
            }
        }
    }

    const inputVariants: Variants = {
        initial: { 
            borderColor: "rgba(255, 255, 255, 0.25)", 
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            scale: 1
        },
        focus: { 
            borderColor: "var(--accent)", 
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            scale: 1.02,
            boxShadow: "0 0 20px rgba(108, 92, 231, 0.3)",
            transition: { 
                type: "spring", 
                stiffness: 200, 
                damping: 15 
            }
        }
    }

    const buttonVariants: Variants = {
        initial: { 
            scale: 1,
            boxShadow: "4px 4px 0px var(--text)"
        },
        hover: { 
            scale: 1.05,
            boxShadow: "8px 8px 0px var(--text)",
            transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 15 
            }
        },
        tap: { 
            scale: 0.95,
            boxShadow: "2px 2px 0px var(--text)"
        }
    }

    const socialIconVariants: Variants = {
        initial: { scale: 1, rotate: 0 },
        hover: { 
            scale: 1.2,
            rotate: 360,
            transition: { 
                duration: 0.5,
                ease: "easeInOut"
            }
        }
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitting(true)
        setResult("Sending...")

        const formData = new FormData(event.target as HTMLFormElement)

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                body: formData
            })

            const data = await response.json()

            if (data.success) {
                setResult("✓ Message sent successfully!")
                ;(event.target as HTMLFormElement).reset()
                setActiveField(null)
                
                // Success animation
                setTimeout(() => {
                    setResult("")
                }, 3000)
            } else {
                setResult("Error. Please try again.")
            }
        } catch (error) {
            setResult("Network error. Please check connection.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Close active field when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(event.target as Node)) {
                setActiveField(null)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <section id="phase-8" className={`min-h-screen flex items-center justify-center ${isPortrait ? 'p-6' : 'p-8'}`}>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={sectionVariants}
                className={`max-w-5xl w-full text-center pointer-events-auto ${isPortrait ? '' : 'scale-105'}`}
            >
                {/* Header */}
                <motion.div 
                    className="mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className={`font-black text-white mb-6 text-center ${isPortrait ? 'text-5xl' : 'text-6xl'}`}>
                        LET&apos;S CONNECT
                    </h2>
                    
                    <motion.p 
                        className={`text-white/60 max-w-2xl mx-auto uppercase tracking-widest ${isPortrait ? 'text-base' : 'text-lg'}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        HIRING FOR A ROLE OR PROJECT? MY INBOX IS ALWAYS OPEN
                    </motion.p>
                </motion.div>

                {/* Expand/Collapse Button */}
                <motion.button
                    onClick={() => setIsFormExpanded(!isFormExpanded)}
                    className="mb-8 mx-auto px-6 py-3 bg-white/10 border-2 border-white/30 rounded-full flex items-center gap-3 text-white/70 hover:text-white hover:border-accent transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FaExpandAlt />
                    <span className="text-sm uppercase tracking-widest">
                        {isFormExpanded ? 'Collapse Form' : 'Expand Form'}
                    </span>
                </motion.button>

                {/* Tablet-Optimized Form */}
                <motion.div 
                    ref={formRef}
                    variants={expandedFormVariants}
                    initial="initial"
                    animate={isFormExpanded ? "expanded" : "initial"}
                    className="relative mx-auto"
                >
                    <motion.div 
                        variants={formContainerVariants}
                        initial="initial"
                        animate="animate"
                        className="brutal-card p-8"
                    >
                        {/* Animated Background Grid */}
                        <motion.div 
                            className="absolute inset-0 -z-10 brutal-grid"
                            animate={{ 
                                opacity: [0.05, 0.15, 0.05],
                                scale: [1, 1.05, 1]
                            }}
                            transition={{ 
                                duration: 4, 
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />

                        <form onSubmit={onSubmit} className="space-y-8">
                            {/* Name & Email Fields - Side by side on landscape */}
                            <div className={`grid gap-6 ${isPortrait ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                {/* Name Field */}
                                <motion.div 
                                    custom={0}
                                    variants={fieldVariants}
                                    className="text-left"
                                >
                                    <motion.label
                                        htmlFor="name"
                                        variants={labelVariants}
                                        animate={activeField === 'name' ? 'focus' : 'initial'}
                                        className="block text-white/60 mb-3 uppercase tracking-widest text-sm font-bold cursor-pointer"
                                    >
                                        NAME
                                    </motion.label>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="relative"
                                    >
                                        <motion.input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            variants={inputVariants}
                                            animate={activeField === 'name' ? 'focus' : 'initial'}
                                            onFocus={() => setActiveField('name')}
                                            onBlur={() => setActiveField(null)}
                                            className="w-full bg-black/50 border-3 border-white rounded-none px-4 py-3 text-white font-bold focus:outline-none"
                                            placeholder="Enter your name"
                                        />
                                        <motion.div 
                                            className="absolute left-0 top-0 w-1 h-full bg-accent"
                                            animate={activeField === 'name' ? { scaleY: 1 } : { scaleY: 0 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    </motion.div>
                                </motion.div>
                                
                                {/* Email Field */}
                                <motion.div 
                                    custom={1}
                                    variants={fieldVariants}
                                    className="text-left"
                                >
                                    <motion.label
                                        htmlFor="email"
                                        variants={labelVariants}
                                        animate={activeField === 'email' ? 'focus' : 'initial'}
                                        className="block text-white/60 mb-3 uppercase tracking-widest text-sm font-bold cursor-pointer"
                                    >
                                        EMAIL
                                    </motion.label>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="relative"
                                    >
                                        <motion.input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            variants={inputVariants}
                                            animate={activeField === 'email' ? 'focus' : 'initial'}
                                            onFocus={() => setActiveField('email')}
                                            onBlur={() => setActiveField(null)}
                                            className="w-full bg-black/50 border-3 border-white rounded-none px-4 py-3 text-white font-bold focus:outline-none"
                                            placeholder="your.email@example.com"
                                        />
                                        <motion.div 
                                            className="absolute left-0 top-0 w-1 h-full bg-accent"
                                            animate={activeField === 'email' ? { scaleY: 1 } : { scaleY: 0 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    </motion.div>
                                </motion.div>
                            </div>
                            
                            {/* Message Field */}
                            <motion.div 
                                custom={2}
                                variants={fieldVariants}
                                className="text-left"
                            >
                                <motion.label
                                    htmlFor="message"
                                    variants={labelVariants}
                                    animate={activeField === 'message' ? 'focus' : 'initial'}
                                    className="block text-white/60 mb-3 uppercase tracking-widest text-sm font-bold cursor-pointer"
                                >
                                    MESSAGE
                                </motion.label>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="relative"
                                >
                                    <motion.textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={isPortrait ? 5 : 4}
                                        variants={inputVariants}
                                        animate={activeField === 'message' ? 'focus' : 'initial'}
                                        onFocus={() => setActiveField('message')}
                                        onBlur={() => setActiveField(null)}
                                        className="w-full bg-black/50 border-3 border-white rounded-none px-4 py-3 text-white font-bold focus:outline-none resize-none"
                                        placeholder="Share your thoughts or opportunity details..."
                                    />
                                    <motion.div 
                                        className="absolute left-0 top-0 w-1 h-full bg-accent"
                                        animate={activeField === 'message' ? { scaleY: 1 } : { scaleY: 0 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </motion.div>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.div 
                                custom={3}
                                variants={fieldVariants}
                                className="pt-8 border-t border-white/20"
                            >
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        variants={buttonVariants}
                                        initial="initial"
                                        whileHover="hover"
                                        whileTap="tap"
                                        className="group relative px-10 py-4 bg-accent border-3 border-white text-white font-black uppercase tracking-widest text-lg"
                                    >
                                        <span className="flex items-center justify-center gap-4">
                                            <motion.span
                                                animate={isSubmitting ? { rotate: 360 } : { rotate: 0 }}
                                                transition={isSubmitting ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                                            >
                                                {isSubmitting ? (
                                                    <motion.div 
                                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    />
                                                ) : (
                                                    <FaPaperPlane className="text-xl" />
                                                )}
                                            </motion.span>
                                            <span className={`${isSubmitting ? 'opacity-70' : ''}`}>
                                                {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                                            </span>
                                            {!isSubmitting && (
                                                <motion.span
                                                    initial={{ x: -15, opacity: 0 }}
                                                    whileHover={{ x: 0, opacity: 1 }}
                                                    transition={{ type: "spring", stiffness: 200 }}
                                                >
                                                    <FaArrowRight size={14} />
                                                </motion.span>
                                            )}
                                        </span>
                                        
                                        {/* Glow effect */}
                                        <motion.div 
                                            className="absolute inset-0 -z-10 rounded-sm"
                                            animate={{
                                                boxShadow: [
                                                    "0 0 10px rgba(108, 92, 231, 0.5)",
                                                    "0 0 25px rgba(108, 92, 231, 0.8)",
                                                    "0 0 10px rgba(108, 92, 231, 0.5)"
                                                ]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </motion.button>
                                    
                                    {/* Result Message */}
                                    <AnimatePresence>
                                        {result && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                                                className={`text-center md:text-right ${isPortrait ? 'w-full' : ''}`}
                                            >
                                                <div className={`inline-block p-4 rounded-lg border ${
                                                    result.includes('✓') 
                                                        ? 'bg-green-500/10 border-green-500/30' 
                                                        : result.includes('Error') 
                                                        ? 'bg-red-500/10 border-red-500/30' 
                                                        : 'bg-accent/10 border-accent/30'
                                                }`}>
                                                    <motion.p 
                                                        className={`font-bold uppercase tracking-widest text-sm ${
                                                            result.includes('✓') 
                                                                ? 'text-green-400' 
                                                                : result.includes('Error') 
                                                                ? 'text-red-400' 
                                                                : 'text-accent-light'
                                                        }`}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.1 }}
                                                    >
                                                        {result}
                                                    </motion.p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </form>
                    </motion.div>

                    {/* Corner Decorations */}
                    <motion.div 
                        className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-accent"
                        animate={{ rotate: isFormExpanded ? 180 : 0 }}
                        transition={{ duration: 0.5 }}
                    />
                    <motion.div 
                        className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-accent"
                        animate={{ rotate: isFormExpanded ? -180 : 0 }}
                        transition={{ duration: 0.5 }}
                    />
                    <motion.div 
                        className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-accent"
                        animate={{ rotate: isFormExpanded ? -180 : 0 }}
                        transition={{ duration: 0.5 }}
                    />
                    <motion.div 
                        className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-accent"
                        animate={{ rotate: isFormExpanded ? 180 : 0 }}
                        transition={{ duration: 0.5 }}
                    />
                </motion.div>

                {/* Social Links */}
                <motion.div 
                    className="flex justify-center gap-10 mt-12 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <motion.a 
                        href="https://github.com/Kathari-Hima-kishore" 
                        variants={socialIconVariants}
                        initial="initial"
                        whileHover="hover"
                        className="relative w-20 h-20 border-3 border-white/40 flex items-center justify-center text-white/60 group"
                    >
                        <motion.div
                            className="absolute inset-0 border-3 border-accent opacity-0 group-hover:opacity-100 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <FaGithub size={28} className="relative z-10 group-hover:text-white transition-colors" />
                    </motion.a>
                    
                    <motion.a 
                        href="https://www.linkedin.com/in/kathari-hima-kishore/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        variants={socialIconVariants}
                        initial="initial"
                        whileHover="hover"
                        className="relative w-20 h-20 border-3 border-white/40 flex items-center justify-center text-white/60 group"
                    >
                        <motion.div
                            className="absolute inset-0 border-3 border-accent opacity-0 group-hover:opacity-100 rounded-full"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <FaLinkedin size={28} className="relative z-10 group-hover:text-white transition-colors" />
                    </motion.a>
                </motion.div>

                {/* Footer */}
                <motion.footer 
                    className="text-white/20 text-sm uppercase tracking-widest border-t border-white/10 pt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <p>© 2026 KATHARI HIMA KISHORE</p>
                    <p className="text-white/10 mt-2">REACT · NEXT · SPLINE · TAILWIND</p>
                    <p className="text-white/5 mt-1 text-xs">TABLET OPTIMIZED</p>
                </motion.footer>
            </motion.div>
        </section>
    )
})
