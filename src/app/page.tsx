'use client'

import SmoothScroll from '@/components/SmoothScroll'
import { Loader } from '@/components/ui/Loader'
import { PhaseIndicator } from '@/components/ui/PhaseIndicator'
import { useState, useEffect, Suspense, lazy } from 'react'
import { logEvent } from '@/lib/firebase'
import { useDeviceType } from '@/lib/device'
import { SplinePlaceholder } from '@/components/ui/SplinePlaceholder'

import dynamic from 'next/dynamic'

// Lazy Load Section Components
const HeroSection = dynamic(() => import('@/components/sections/HeroSection').then(mod => mod.HeroSection))
const SkillsSection = dynamic(() => import('@/components/sections/SkillsSection').then(mod => mod.SkillsSection))
const ExperienceSection = dynamic(() => import('@/components/sections/ExperienceSection').then(mod => mod.ExperienceSection))
const ProjectsSection = dynamic(() => import('@/components/sections/ProjectsSection').then(mod => mod.ProjectsSection))
const ProjectsMoreSection = dynamic(() => import('@/components/sections/ProjectsMoreSection').then(mod => mod.ProjectsMoreSection))
const EducationSection = dynamic(() => import('@/components/sections/EducationSection').then(mod => mod.EducationSection))
const ContactSection = dynamic(() => import('@/components/sections/ContactSection').then(mod => mod.ContactSection))
const StarryBackground = dynamic(() => import('@/components/StarryBackground').then(mod => mod.StarryBackground), { ssr: false })

// Pre-load Spline component once at module level
const SplineBackgroundLazy = lazy(() => import('@/components/SplineBackground').then(mod => ({ default: mod.SplineBackground })))

const PHASES = [
  { id: 1, name: 'Introduction', title: 'Welcome' },
  { id: 2, name: 'Skills', title: 'Technical Arsenal' },
  { id: 3, name: 'Experience', title: 'Professional Journey' },
  { id: 4, name: 'Featured Project', title: 'Event Management System' },
  { id: 5, name: 'More Projects', title: 'Additional Work' },
  { id: 6, name: 'Education', title: 'Academic Background' },
  { id: 7, name: 'Contact', title: 'Let\'s Connect' },
] as const

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [activePhase, setActivePhase] = useState(1)
  const [splinePreloaded, setSplinePreloaded] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)
  const [splineLoaded, setSplineLoaded] = useState(false)
  const { isReady, isMobile, isTablet, orientation } = useDeviceType()

  // Observe Hero section visibility for deferred Spline loading
  useEffect(() => {
    if (!isReady) return
    // Don't load Spline for mobile or tablet (any orientation)
    if (isMobile || isTablet) return
    
    const hero = document.getElementById('phase-1')
    if (!hero) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroVisible(entry.isIntersecting)
      },
      { rootMargin: '200px', threshold: 0.1 }
    )
    
    observer.observe(hero)
    return () => observer.disconnect()
  }, [isReady, isMobile, isTablet])

  // Preload Spline chunk in background for desktop only
  useEffect(() => {
    if (!isReady) return
    // Don't preload for mobile or tablet (any orientation)
    if (isMobile || isTablet) return
    
    // Start preloading immediately
    import('@/components/SplineBackground').then(() => {
      setSplinePreloaded(true)
    })
  }, [isReady, isMobile, isTablet])

  // Initial load timer - shorter for mobile/tablet, wait for spline preload on desktop
  useEffect(() => {
    if (!isReady) return // Wait for device detection
    // Only wait for spline preload on desktop (not mobile/tablet)
    if (!isMobile && !isTablet && !splinePreloaded) return
    
    const loadTime = isMobile ? 500 : isTablet ? 600 : 1000
    const timer = setTimeout(() => setIsLoading(false), loadTime)
    return () => clearTimeout(timer)
  }, [isMobile, isReady, splinePreloaded, isTablet])

  // Optimize: Use IntersectionObserver instead of scroll listener
  useEffect(() => {
    if (isLoading) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const phaseId = parseInt(entry.target.id.replace('phase-', ''), 10)
            if (!isNaN(phaseId)) {
              setActivePhase(phaseId)
              // Track which section the user scrolled into
              const phase = PHASES.find(p => p.id === phaseId)
              if (phase) {
                logEvent('section_view', {
                  section_id: phaseId,
                  section_name: phase.name,
                })
              }
            }
          }
        })
      },
      {
        root: null, // viewport
        rootMargin: '-20% 0px -20% 0px', // Shrink the detection area to avoid early triggers
        threshold: 0.4, // Trigger when 40% visible within the rootMargin
      }
    )

    // Observe all phase sections
    PHASES.forEach((phase) => {
      const element = document.getElementById(`phase-${phase.id}`)
      if (element) observer.observe(element)
    })

    return () => {
      observer.disconnect()
    }
  }, [isLoading])

  // Determine if we should use mobile layout - both mobile AND tablet always use simplified view
  const isMobileLayout = isMobile || isTablet

  // Show Spline during Hero (phase 1) and Skills (phase 2) sections
  const showSpline = (activePhase === 1 || activePhase === 2) && !isMobileLayout
  const showPlaceholder = showSpline && !splineLoaded && !isLoading

  // Only render Spline on desktop (> 1024px)
  return (
    <SmoothScroll>
      {isLoading && <Loader />}

      {/* Spline background - ONLY loaded on desktop during phase 1 and 2 */}
      {showPlaceholder && <SplinePlaceholder />}
      {showSpline && (
        <Suspense fallback={null}>
          <SplineBackgroundLazy 
            isLoading={isLoading} 
            activePhase={activePhase}
            onLoaded={() => setSplineLoaded(true)}
          />
        </Suspense>
      )}

      <PhaseIndicator phases={PHASES as any} activePhase={activePhase} />

      <StarryBackground />

      <main className={`relative z-10 canvas-overlay-mode flex flex-col pb-48 ${isMobileLayout ? 'gap-24 px-4' : 'gap-48 md:gap-72'}`}>
        <HeroSection isMobile={isMobileLayout} />
        <SkillsSection isMobile={isMobileLayout} />
        <ExperienceSection isMobile={isMobileLayout} />
        <ProjectsSection isMobile={isMobileLayout} />
        <ProjectsMoreSection isMobile={isMobileLayout} />
        <EducationSection isMobile={isMobileLayout} />
        <ContactSection isMobile={isMobileLayout} />
      </main>
    </SmoothScroll>
  )
}