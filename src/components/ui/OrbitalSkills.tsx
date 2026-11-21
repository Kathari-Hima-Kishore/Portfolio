'use client'

import { useState, useEffect, useRef, useCallback, cloneElement, isValidElement } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'
import { MobileFrontendIcon, MobileBackendIcon, MobileCloudIcon } from '@/components/ui/SkillIcons'

interface SkillNode {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  glowColor: string
  skills: string[]
  angle: number // Position in orbit (0-360)
}

const skillNodes: SkillNode[] = [
  {
    id: 'cloud',
    name: 'Cloud & DevOps',
    icon: <MobileCloudIcon />,
    color: 'from-purple-500 to-violet-400',
    glowColor: 'rgba(139, 92, 246, 0.5)',
    skills: ['Microsoft Azure', 'AWS', 'Google Firebase', 'Docker'],
    angle: 270, // North (top)
  },
  {
    id: 'frontend',
    name: 'Frontend',
    icon: <MobileFrontendIcon />,
    color: 'from-blue-500 to-cyan-400',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    skills: ['HTML & CSS', 'JavaScript', 'React.js', 'Spline'],
    angle: 150, // South-West (bottom left)
  },
  {
    id: 'backend',
    name: 'Backend & Database',
    icon: <MobileBackendIcon />,
    color: 'from-green-500 to-emerald-400',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    skills: ['Python', 'Node.js', 'SQL'],
    angle: 30, // South-East (bottom right)
  },
]

// Equilateral triangle: nodes sit 120° apart so the gap between every pair of
// tiles is identical (r * √3). The stage is scaled as a whole so the layout
// looks the same on a small phone and a large tablet.
const ORBIT_RADIUS = 120
const STAGE_W = 360
const STAGE_H = 400

const radians = (deg: number) => (deg * Math.PI) / 180
const R = ORBIT_RADIUS * Math.cos(radians(30)) // ≈ 103.9

// Static positions for SSR to prevent hydration mismatch
// Order: Cloud (N), Frontend (SW), Backend (SE)
const STATIC_POSITIONS = [
  { x: 0, y: -ORBIT_RADIUS }, // Cloud - North (top)
  { x: -R, y: ORBIT_RADIUS / 2 }, // Frontend - South-West (bottom left)
  { x: R, y: ORBIT_RADIUS / 2 }, // Backend - South-East (bottom right)
]

export function OrbitalSkills({ animateIcons }: { animateIcons?: boolean }) {
  const [expandedNode, setExpandedNode] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [nodePositions, setNodePositions] = useState(STATIC_POSITIONS)
  const [scale, setScale] = useState(1)
  const hostRef = useRef<HTMLDivElement>(null)

  // Fix hydration: only calculate positions on client side
  useEffect(() => {
    setIsClient(true)
    const positions = skillNodes.map((node) => {
      const rad = radians(node.angle)
      return {
        x: Math.cos(rad) * ORBIT_RADIUS,
        y: Math.sin(rad) * ORBIT_RADIUS,
      }
    })
    setNodePositions(positions)
  }, [])

  // Fit the whole constellation to the space it is given: never wider than the
  // column, and never taller than ~70% of the viewport (leaves room for the
  // heading). This is what keeps the phone and both tablet orientations
  // proportionally the same instead of one fixed 400px block.
  useEffect(() => {
    const el = hostRef.current
    if (!el) return

    const compute = () => {
      const width = el.clientWidth || window.innerWidth
      const height = window.innerHeight
      const byWidth = width / STAGE_W
      const byHeight = (height * 0.7) / STAGE_H
      const next = Math.min(byWidth, byHeight, 1.7)
      setScale(Math.round(Math.max(next, 0.55) * 100) / 100)
    }

    compute()
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(compute) : null
    observer?.observe(el)
    window.addEventListener('resize', compute)
    window.addEventListener('orientationchange', compute)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', compute)
      window.removeEventListener('orientationchange', compute)
    }
  }, [])

  // Close expanded node when clicking/tapping outside the card
  const handleClickOutside = useCallback((e: MouseEvent | TouchEvent) => {
    const target = e.target as Node
    if (!target) return

    const cardElement = document.querySelector('[data-expanded-card]')
    if (cardElement && cardElement.contains(target)) {
      return // Click inside the card - keep it open (even on X button or tile)
    }

    // Click outside the card - close it
    setExpandedNode(null)
  }, [])

  // Add/remove event listeners when expandedNode changes
  useEffect(() => {
    if (expandedNode) {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('touchend', handleClickOutside)
    } else {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('touchend', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('touchend', handleClickOutside)
    }
  }, [expandedNode, handleClickOutside])

  const getNodePosition = (index: number) => {
    if (!isClient) return STATIC_POSITIONS[index]
    return nodePositions[index]
  }

  return (
    <div
      ref={hostRef}
      className="relative w-full flex justify-center"
      style={{ height: STAGE_H * scale }}
    >
      <div
        className="relative flex items-center justify-center"
        style={{
          width: STAGE_W,
          height: STAGE_H,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        {/* Orbital ring - static for SSR */}
        <div
          className="absolute w-[280px] h-[280px] rounded-full border border-white/10"
          style={{
            background: 'radial-gradient(circle, rgba(108, 92, 231, 0.1) 0%, transparent 70%)',
          }}
        />

        {/* Animated ring decoration - client only */}
        {isClient && (
          <motion.div
            className="absolute w-[300px] h-[300px] rounded-full border-2 border-dashed border-white/5"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          />
        )}

      {/* Skill nodes */}
      {skillNodes.map((node, index) => {
        const pos = getNodePosition(index)
        const isExpanded = expandedNode === node.id
        const hasExpanded = expandedNode !== null
        const isOtherNode = hasExpanded && !isExpanded

        return (
          <motion.div
            key={node.id}
            className="absolute left-1/2 top-1/2 -ml-8 -mt-8"
            initial={{ x: pos.x, y: pos.y, scale: 0, opacity: 0 }}
            animate={{
              x: isExpanded ? 0 : pos.x,
              y: isExpanded ? -80 : pos.y,
              scale: isOtherNode ? 0.5 : isExpanded ? 1.2 : 1,
              opacity: isOtherNode ? 0 : isExpanded ? 1 : 1,
              zIndex: isExpanded ? 50 : 10,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            {/* Node button */}
            <motion.button
              onClick={() => {
                // Only expand the tile if it's collapsed, never collapse it
                if (!isExpanded) {
                  setExpandedNode(node.id);
                }
              }}
              className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${node.color} 
                         flex items-center justify-center text-white text-xl
                         brutal-border z-10`}
              whileHover={{ scale: isOtherNode ? 1 : 1.15 }}
              whileTap={{ scale: isOtherNode ? 1 : 0.95 }}
              style={{
                boxShadow: `4px 4px 0px ${node.glowColor}`,
                pointerEvents: isOtherNode ? 'none' : 'auto',
              }}
            >
              {isValidElement(node.icon) ? cloneElement(node.icon as React.ReactElement<{ animate?: boolean }>, { animate: animateIcons }) : node.icon}
              
              {/* Pulse ring - hide when any node is expanded */}
              {!hasExpanded && isClient && (
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-white/30"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                />
              )}
            </motion.button>

            {/* Node label - hide when expanded or other node expanded */}
            {!hasExpanded && (
              <motion.span
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/60 whitespace-nowrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                {node.name}
              </motion.span>
            )}

            {/* Expanded skill list */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  key={`card-${node.id}`}
                  data-expanded-card
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="absolute top-20 left-1/2 w-[200px] z-50"
                  style={{ marginLeft: '-100px', textAlign: 'center' }}
                >
                  <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`text-sm font-bold bg-gradient-to-r ${node.color} bg-clip-text text-transparent`}>
                        {node.name}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setExpandedNode(null)
                        }}
                        className="text-white/40 hover:text-white p-1"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {node.skills.map((skill, i) => (
                        <motion.li
                          key={skill}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="text-white/70 text-xs flex items-center gap-2"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${node.color}`} />
                          {skill}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}

      {/* Center hub */}
      <motion.div
        className="relative z-20"
        animate={isClient ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          className="w-24 h-24 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 
                     flex flex-col items-center justify-center text-center
                     border border-white/20 backdrop-blur-md"
          style={{
            boxShadow: '0 0 40px rgba(108, 92, 231, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          <span className="text-[10px] text-white/60 uppercase tracking-wider">Tech</span>
          <span className="text-[10px] text-white/60 uppercase tracking-wider">Stack</span>
        </div>

        {/* Rotating ring around hub - client only */}
        {isClient && (
          <motion.div
            className="absolute inset-0 rounded-full border border-accent/30"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            style={{ margin: '-4px' }}
          />
        )}
      </motion.div>

      {/* Connection lines to center - client only */}
      {isClient && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          {skillNodes.map((node, index) => {
            const pos = getNodePosition(index)
          return (
            <motion.line
              key={node.id}
              x1="50%"
              y1="50%"
              x2={`calc(50% + ${pos.x}px)`}
              y2={`calc(50% + ${pos.y}px)`}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          )
        })}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(108, 92, 231, 0.5)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
      )}
      </div>
    </div>
  )
}
