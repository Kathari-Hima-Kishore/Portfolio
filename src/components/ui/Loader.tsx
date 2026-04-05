'use client'

interface LoaderProps {
  className?: string
  isMobile?: boolean
}

export function Loader({ className = '', isMobile = true }: LoaderProps) {
  return (
    <div className={`fixed inset-0 bg-bg flex items-center justify-center z-50 transition-opacity duration-600 ease-out ${className}`}>
      <div className="text-center">
        <div className="w-9 h-9 border-3 border-white/10 border-t-accent rounded-full animate-spin mx-auto mb-5" />
        <p className="text-text-muted text-sm tracking-widest uppercase">
          {isMobile ? 'Loading portfolio' : 'Loading 3D Portfolio'}&hellip;
        </p>
      </div>
    </div>
  )
}