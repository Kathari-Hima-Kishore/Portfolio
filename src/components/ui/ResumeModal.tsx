'use client'

import { useState, useEffect, useCallback } from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import { FiExternalLink, FiDownload, FiX } from 'react-icons/fi'

const RESUME_URL = '/Kathari_Hima_Kishore_SWE_Resume.pdf?v=2'
const RESUME_FILENAME = 'Kathari_Hima_Kishore_SWE_Resume.pdf'

interface ResumeModalProps {
  isMobile?: boolean
}

export function ResumeModal({ isMobile = false }: ResumeModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const open = () => setIsOpen(true)
  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    if (isOpen) {
      document.addEventListener('keydown', handler)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [isOpen, close])

  const openInNewTab = () => {
    window.open(RESUME_URL, '_blank', 'noopener,noreferrer')
    close()
  }

  const downloadResume = async () => {
    try {
      const res = await fetch(RESUME_URL)
      if (!res.ok) throw new Error('fetch failed')
      const blob = await res.blob()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = RESUME_FILENAME
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    } catch {
      window.open(RESUME_URL, '_blank')
    }
    close()
  }

  return (
    <>
      <button
        onClick={open}
        className={`ghost-sweep ghost-sweep-classic px-6 py-3.5 text-sm ${isMobile ? 'flex-1 justify-center' : ''}`}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        <span className="txt">Resume</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4"
            style={{ background: 'rgba(6, 6, 8, 0.7)' }}
            onClick={(e) => { if (e.target === e.currentTarget) close() }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-surface border-brutal border-text shadow-brutal w-full max-w-sm relative rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={close}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-text-muted hover:text-text transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>

              <div className="p-7 pb-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center border border-white/10">
                  <svg viewBox="0 0 16 16" className="w-10 h-10 text-accent-light" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 4.5c.69 0 1.25-.56 1.25-1.25S8.69 2 8 2s-1.25.56-1.25 1.25S7.31 4.5 8 4.5z"/>
                    <path d="M8 4.5c.597 0 1.13.382 1.32.949l.087.26a.156.156 0 0 1-.15.291H6.743a.156.156 0 0 1-.15-.291l.087-.26A1.44 1.44 0 0 1 8 4.5z"/>
                    <path d="M5 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                    <path d="M5 10.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                    <path d="M5.5 12a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M2.33 1.64c-.327.642-.327 1.48-.327 3.16v6.4c0 1.68 0 2.52.327 3.16.288.564.747 1.02 1.31 1.31.642.327 1.48.327 3.16.327h2.4c1.68 0 2.52 0 3.16-.327.564-.288 1.02-.746 1.31-1.31.327-.642.327-1.48.327-3.16v-6.4c0-1.68 0-2.52-.327-3.16-.288-.564-.746-1.02-1.31-1.31-.642-.327-1.48-.327-3.16-.327h-2.4c-1.68 0-2.52 0-3.16.327-.564.288-1.02.747-1.31 1.31zm6.87-.638h-2.4c-.857 0-1.44 0-1.89.038-.438.035-.663.1-.819.18a2.09 2.09 0 0 0-.874.873c-.08.156-.145.381-.18.819-.037.45-.038 1.03-.038 1.89v6.4c0 .857 0 1.44.038 1.89.035.438.1.663.18.819.192.376.498.682.874.874.156.08.381.145.819.18.45.037 1.03.038 1.89.038h2.4c.857 0 1.44 0 1.89-.038.438-.035.663-.1.819-.18a2.09 2.09 0 0 0 .874-.873c.08-.156.145-.381.18-.819.037-.45.038-1.03.038-1.89v-6.4c0-.857 0-1.44-.038-1.89-.035-.438-.1-.663-.18-.819a2.09 2.09 0 0 0-.874-.874c-.156-.08-.381-.145-.819-.18-.45-.037-1.03-.038-1.89-.038z"/>
                  </svg>
                </div>

                <h2 className="text-xl font-bold text-text mb-6">Resume</h2>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={openInNewTab}
                    className="w-full py-3 flex items-center justify-center gap-2.5 font-semibold text-sm bg-accent-light text-bg border-brutal border-text shadow-[3px_3px_0px_#f0f0f2] hover:shadow-[1px_1px_0px_#f0f0f2] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    <FiExternalLink className="w-4 h-4" />
                    Open in new tab
                  </button>

                  <button
                    onClick={downloadResume}
                    className="w-full py-3 flex items-center justify-center gap-2.5 font-semibold text-sm bg-transparent text-text border-brutal border-text shadow-[3px_3px_0px_#f0f0f2] hover:shadow-[1px_1px_0px_#f0f0f2] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    <FiDownload className="w-4 h-4" />
                    Download resume
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
