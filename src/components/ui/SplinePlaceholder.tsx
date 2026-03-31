'use client'

import { motion } from 'framer-motion'

interface SplinePlaceholderProps {
  className?: string
}

export function SplinePlaceholder({ className = '' }: SplinePlaceholderProps) {
  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Wireframe keyboard shape */}
        <div 
          className="rounded-2xl border-2 border-dashed border-white/20 
                     bg-gradient-to-br from-gray-800/30 to-gray-900/30
                     backdrop-blur-sm flex flex-col items-center justify-center gap-4"
          style={{
            width: 'clamp(300px, 50vw, 600px)',
            height: 'clamp(200px, 35vh, 400px)',
          }}
        >
          {/* Keyboard outline */}
          <div className="grid grid-cols-12 gap-1 p-4 opacity-30">
            {Array.from({ length: 48 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-6 h-6 rounded bg-white/20"
                initial={{ opacity: 0.2 }}
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.02,
                }}
              />
            ))}
          </div>
          
          {/* Loading text */}
          <div className="flex flex-col items-center gap-2">
            <motion.div
              className="w-8 h-8 border-2 border-white/30 border-t-white/80 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <span className="text-white/50 text-sm font-medium tracking-wider uppercase">
              Loading 3D Experience
            </span>
          </div>
        </div>

        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-30 blur-xl -z-10"
          style={{
            background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
          }}
        />
      </motion.div>
    </div>
  )
}
