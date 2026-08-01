'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiExternalLink, FiX } from 'react-icons/fi'
import { createPortal } from 'react-dom'
import { PdfViewer } from '@/components/ui/PdfViewer'

const AZ900_CERT_URL = '/az900-certificate.pdf'
const AZ900_VERIFY_URL = "https://learn.microsoft.com/api/credentials/share/en-us/Kathari-Hima-Kishore/D32E0A702F2C4D8D?sharingId=1B1402BA7D3D483A"

interface CertLightboxProps {
  isMobile?: boolean
}

export function CertLightbox({ isMobile = false }: CertLightboxProps) {
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
      document.body.classList.add('lightbox-open')
    }
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
      document.body.classList.remove('lightbox-open')
    }
  }, [isOpen, close])

  return (
    <>
      <button
        onClick={open}
        className={`ghost-sweep ghost-sweep-classic px-6 py-3.5 text-sm ${isMobile ? 'flex-1 justify-center' : ''}`}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" />
          <polyline points="1 4 12 13 23 4" />
        </svg>
        <span className="txt">Certificate</span>
      </button>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[999] flex items-center justify-center p-4"
              style={{ background: 'rgba(6, 6, 8, 0.7)', transform: 'translateZ(0)' }}
              onClick={(e) => { if (e.target === e.currentTarget) close() }}
            >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-surface border-brutal border-text shadow-brutal w-full max-w-sm md:max-w-3xl relative rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={close}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-text-muted hover:text-text transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>

              <div className="p-7 pb-6">
                <div className="flex items-center gap-4 mb-6 pr-10">
                  <svg viewBox="0 0 96 96" className="w-10 h-10 md:w-12 md:h-12 shrink-0" aria-hidden="true">
                    <path d="M33.338 6.544h26.038l-27.03 80.087a4.152 4.152 0 0 1-3.933 2.824H8.149a4.145 4.145 0 0 1-3.928-5.47L29.404 9.368a4.152 4.152 0 0 1 3.934-2.825z" fill="#114a8b"/>
                    <path d="M71.175 60.261h-41.29a1.911 1.911 0 0 0-1.305 3.309l26.532 24.764a4.171 4.171 0 0 0 2.846 1.121h23.38z" fill="#0078d4"/>
                    <path d="M66.595 9.364a4.145 4.145 0 0 0-3.928-2.82H33.648a4.146 4.146 0 0 1 3.928 2.82l25.184 74.62a4.146 4.146 0 0 1-3.928 5.472h29.02a4.146 4.146 0 0 0 3.927-5.472z" fill="#3ccbf4"/>
                  </svg>
                  <div>
                    <p className="text-accent uppercase tracking-[0.25em] text-[11px] font-semibold mb-1">Microsoft Certified</p>
                    <h3 className="text-lg md:text-xl font-bold text-text">Azure Fundamentals (AZ-900)</h3>
                  </div>
                </div>

                <div className="rounded-lg overflow-hidden border border-white/10 bg-bg relative">
                  {AZ900_CERT_URL ? (
                    <PdfViewer url={AZ900_CERT_URL} />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-text-muted text-center p-8">
                      <svg viewBox="0 0 24 24" className="w-12 h-12 opacity-40" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <p className="text-sm">Your AZ-900 certificate PDF renders here.</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center mt-6">
                  <a
                    href={AZ900_VERIFY_URL || 'https://learn.microsoft.com/en-us/users/me/credentials'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => close()}
                    className="ghost-sweep ghost-sweep-classic w-full max-w-[300px] px-6 py-3.5 text-sm justify-center"
                  >
                    <FiExternalLink className="w-4 h-4" />
                    <span className="txt">Verify on Microsoft Website</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
