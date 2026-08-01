'use client'

import { useEffect, useRef, useState } from 'react'

interface PdfViewerProps {
  url: string
}

interface PdfPageData {
  page: import('pdfjs-dist').PDFPageProxy
  width: number
  height: number
}

export function PdfViewer({ url }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pages, setPages] = useState<PdfPageData[]>([])
  const [error, setError] = useState(false)
  const [fit, setFit] = useState(0)

  // ------------------------------------------------------------------
  // Load the document
  // ------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false
    let loadingTask: import('pdfjs-dist').PDFDocumentLoadingTask | null = null

    async function load() {
      try {
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs'

        const task = pdfjs.getDocument({ url })
        loadingTask = task
        const doc = await task.promise
        if (cancelled) {
          task.destroy()
          return
        }

        const data: PdfPageData[] = []
        for (let i = 1; i <= doc.numPages; i++) {
          const page = await doc.getPage(i)
          const vp = page.getViewport({ scale: 1 })
          data.push({ page, width: vp.width, height: vp.height })
        }
        if (cancelled) return
        setPages(data)
      } catch {
        if (!cancelled) setError(true)
      }
    }

    load()
    return () => {
      cancelled = true
      loadingTask?.destroy()
    }
  }, [url])

  // ------------------------------------------------------------------
  // Compute fit scale: fill container width, capped by viewport height
  // ------------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current
    if (!container || pages.length === 0) return

    const compute = () => {
      const boxW = container.clientWidth
      if (boxW === 0) return
      const w = Math.max(...pages.map((p) => p.width))
      const h = pages.reduce((s, p) => s + p.height, 0)
      const fitToWidth = boxW / w
      const fitToHeight = (window.innerHeight * 0.62) / h
      setFit(Math.min(fitToWidth, fitToHeight))
    }

    compute()
    const resizeObserver = new ResizeObserver(compute)
    resizeObserver.observe(container)
    window.addEventListener('resize', compute)
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', compute)
    }
  }, [pages])

  // ------------------------------------------------------------------
  // Render canvases at the fit scale (re-renders on fit change)
  // ------------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current
    if (!container || pages.length === 0 || fit === 0) return

    const dpr = window.devicePixelRatio || 1
    let cancelled = false
    let rendering = false
    let rerender = false
    const renderTasks: (import('pdfjs-dist').RenderTask | undefined)[] = []

    const renderAll = async () => {
      if (rendering) {
        rerender = true
        return
      }
      rendering = true

      try {
        const scale = fit * dpr
        for (let i = 0; i < pages.length; i++) {
          if (cancelled) return
          const { page, width, height } = pages[i]

          const canvas = container.querySelector<HTMLCanvasElement>(`[data-page="${i}"]`)
          if (!canvas) continue
          const ctx = canvas.getContext('2d', { alpha: false })
          if (!ctx) continue

          // Cancel any in-flight render on this canvas before re-rendering.
          renderTasks[i]?.cancel()
          renderTasks[i] = undefined

          const viewport = page.getViewport({ scale })
          canvas.width = Math.floor(viewport.width)
          canvas.height = Math.floor(viewport.height)
          canvas.style.width = `${Math.floor(width * fit)}px`
          canvas.style.height = `${Math.floor(height * fit)}px`

          const task = page.render({ canvas, canvasContext: ctx, viewport })
          renderTasks[i] = task
          await task.promise
          if (renderTasks[i] === task) renderTasks[i] = undefined
        }
      } finally {
        rendering = false
        if (rerender && !cancelled) {
          rerender = false
          renderAll()
        }
      }
    }

    renderAll()
    const resizeObserver = new ResizeObserver(() => renderAll())
    resizeObserver.observe(container)
    return () => {
      cancelled = true
      resizeObserver.disconnect()
      renderTasks.forEach((t) => t?.cancel())
    }
  }, [pages, fit])

  // ------------------------------------------------------------------
  // Rendering
  // ------------------------------------------------------------------
  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-3 text-text-muted text-center p-8">
        <svg viewBox="0 0 24 24" className="w-12 h-12 opacity-40" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <p className="text-sm">Unable to load the certificate.</p>
      </div>
    )
  }

  const loading = pages.length === 0 || fit === 0

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      onContextMenu={(e) => e.preventDefault()}
      draggable={false}
    >
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-text/20 border-t-accent rounded-full animate-spin" />
        </div>
      )}

      {!loading && (
        <div className="flex flex-col items-center gap-2 py-2">
          {pages.map((_, i) => (
            <canvas
              key={i}
              data-page={i}
              className="bg-white rounded-sm shadow-lg shrink-0"
              draggable={false}
              style={{ pointerEvents: 'none' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
