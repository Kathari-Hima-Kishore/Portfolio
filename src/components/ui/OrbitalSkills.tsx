'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCode, FaServer, FaCloud, FaTools, FaTimes } from 'react-icons/fa'

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
    id: 'frontend',
    name: 'Frontend',
    icon: <FaCode />,
    color: 'from-blue-500 to-cyan-400',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    skills: ['HTML & CSS', 'Tailwind CSS', 'JavaScript', 'React.js', 'TypeScript'],
    angle: 0,
  },
  {
    id: 'backend',
    name: 'Backend',
    icon: <FaServer />,
    color: 'from-green-500 to-emerald-400',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    skills: ['Python', 'Node.js', 'SQL', 'REST APIs', 'Express'],
    angle: 90,
  },
  {
    id: 'cloud',
    name: 'Cloud',
    icon: <FaCloud />,
    color: 'from-purple-500 to-violet-400',
    glowColor: 'rgba(139, 92, 246, 0.5)',
    skills: ['Microsoft Azure', 'Google Firebase', 'Docker', 'Git/GitHub', 'CI/CD'],
    angle: 180,
  },
  {
    id: 'tools',
    name: 'Tools',
    icon: <FaTools />,
    color: 'from-orange-500 to-amber-400',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    skills: ['Beeceptor', 'Spline', 'Jira', 'Miro', 'Figma'],
    angle: 270,
  },
]

// Static positions for SSR to prevent hydration mismatch
const STATIC_POSITIONS = [
  { x: 120, y: 0 },    // Frontend (0°)
  { x: 0, y: 120 },    // Backend (90°)
  { x: -120, y: 0 },   // Cloud (180°)
  { x: 0, y: -120 },   // Tools (270°)
]

export function OrbitalSkills() {
  const [expandedNode, setExpandedNode] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [nodePositions, setNodePositions] = useState(STATIC_POSITIONS)

  const orbitRadius = 120 // Distance from center

  // Fix hydration: only calculate positions on client side
  useEffect(() => {
    setIsClient(true)
    const positions = skillNodes.map((node) => {
      const rad = (node.angle * Math.PI) / 180
      return {
        x: Math.cos(rad) * orbitRadius,
        y: Math.sin(rad) * orbitRadius,
      }
    })
    setNodePositions(positions)
  }, [])

  const getNodePosition = (index: number) => {
    if (!isClient) return STATIC_POSITIONS[index]
    return nodePositions[index]
  }

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
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
              onClick={() => setExpandedNode(isExpanded ? null : node.id)}
              className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${node.color} 
                         flex items-center justify-center text-white text-xl shadow-lg
                         border border-white/20 backdrop-blur-sm z-10`}
              whileHover={{ scale: isOtherNode ? 1 : 1.15 }}
              whileTap={{ scale: isOtherNode ? 1 : 0.95 }}
              style={{
                boxShadow: `0 0 30px ${node.glowColor}, inset 0 1px 0 rgba(255,255,255,0.3)`,
                pointerEvents: isOtherNode ? 'none' : 'auto',
              }}
            >
              {node.icon}
              
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

            {/* Expanded skill list - centered under the node */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="fixed z-50 w-[200px]"
                  style={{ 
                    left: '50%', 
                    top: 'calc(50% - 20px)',
                    marginLeft: '-100px',
                    transform: 'translateY(-50%)'
                  }}
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
  )
}
