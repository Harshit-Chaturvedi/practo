import { useRef, useState, useCallback } from 'react'
import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'
import { Download, FileDown, Loader2, Image as ImageIcon } from 'lucide-react'
import CarouselSlide, { type SlideData } from '@/components/CarouselSlide'
import carouselData from '@/data/carousel.json'

/* ------------------------------------------------------------------ */
/*  Types for the JSON structure                                       */
/* ------------------------------------------------------------------ */

interface CarouselJSON {
  topic: string
  disclaimer: string
  slides: SlideData[]
}

const data = carouselData as CarouselJSON

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SLIDE_W = 1080
const SLIDE_H = 1350

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function CarouselPage() {
  /* DOM nodes of hidden full-size slides for capturing */
  const exportNodesRef = useRef<(HTMLDivElement | null)[]>([])

  const [exportingSlide, setExportingSlide] = useState<number | null>(null)
  const [exportingPdf, setExportingPdf] = useState(false)

  /* ---- helpers --------------------------------------------------- */

  const captureSlide = useCallback(
    async (index: number): Promise<string> => {
      const node = exportNodesRef.current[index]
      if (!node) throw new Error(`Slide ${index} ref not found`)
      return toPng(node, {
        width: SLIDE_W,
        height: SLIDE_H,
        pixelRatio: 1,
        cacheBust: true,
      })
    },
    [],
  )

  const downloadDataUrl = (dataUrl: string, filename: string) => {
    const link = document.createElement('a')
    link.download = filename
    link.href = dataUrl
    link.click()
  }

  /* ---- Export single PNG ----------------------------------------- */

  const handleExportPng = useCallback(
    async (index: number) => {
      setExportingSlide(index)
      try {
        const dataUrl = await captureSlide(index)
        downloadDataUrl(dataUrl, `slide-${index}.png`)
      } catch (err) {
        console.error('PNG export failed', err)
      } finally {
        setExportingSlide(null)
      }
    },
    [captureSlide],
  )

  /* ---- Export all as PDF ----------------------------------------- */

  const handleExportPdf = useCallback(async () => {
    setExportingPdf(true)
    try {
      /* Capture all slides as PNGs */
      const images: string[] = []
      for (let i = 0; i < data.slides.length; i++) {
        images.push(await captureSlide(i))
      }

      /* Create PDF — use mm units, size proportional to 1080:1350 */
      const pdfW = 216 // mm  (1080 / 5)
      const pdfH = 270 // mm  (1350 / 5)

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfW, pdfH],
      })

      images.forEach((img, idx) => {
        if (idx > 0) pdf.addPage([pdfW, pdfH], 'portrait')
        pdf.addImage(img, 'PNG', 0, 0, pdfW, pdfH)
      })

      pdf.save('practo-carousel.pdf')
    } catch (err) {
      console.error('PDF export failed', err)
    } finally {
      setExportingPdf(false)
    }
  }, [captureSlide])

  /* ---- Render ---------------------------------------------------- */

  return (
    <section className="bg-cream min-h-screen">
      {/* -------- page header -------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-ink">
              AI-Generated Content Carousel
            </h1>
            <p className="mt-2 text-gray-500 text-base max-w-xl">
              Sample social media carousel — data-driven slides from JSON
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportPdf}
            disabled={exportingPdf}
            aria-label="Export all slides as PDF"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[14px]
                       bg-teal text-white font-heading font-semibold text-sm
                       hover:bg-teal-dark active:scale-[0.97] transition
                       disabled:opacity-60 disabled:cursor-not-allowed
                       min-h-[44px] shrink-0 cursor-pointer"
          >
            {exportingPdf ? (
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            ) : (
              <FileDown size={18} aria-hidden="true" />
            )}
            {exportingPdf ? 'Generating PDF…' : 'Export All as PDF'}
          </button>
        </div>

        {/* topic badge */}
        <div className="mt-5 inline-flex items-center gap-2 bg-surface border border-border rounded-chip px-4 py-2">
          <ImageIcon size={16} className="text-teal" aria-hidden="true" />
          <span className="font-heading text-sm font-semibold text-ink">
            {data.topic}
          </span>
          <span className="text-gray-400 text-sm">
            · {data.slides.length} slides · 1080 × 1350
          </span>
        </div>
      </div>

      {/* -------- slide preview strip (horizontally scrollable) -------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div
          className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory
                     scrollbar-thin"
          role="list"
          aria-label="Carousel slide previews"
        >
          {data.slides.map((slide, idx) => (
            <div
              key={slide.number}
              className="flex flex-col items-center gap-3 snap-start"
              role="listitem"
            >
              {/* label */}
              <span className="text-xs font-heading font-semibold text-gray-500 uppercase tracking-wider">
                {slide.type === 'hook'
                  ? 'Hook'
                  : slide.type === 'cta'
                    ? 'CTA'
                    : `Slide ${slide.number}`}
              </span>

              {/* preview card */}
              <CarouselSlide slide={slide} />

              {/* export button */}
              <button
                type="button"
                onClick={() => handleExportPng(idx)}
                disabled={exportingSlide === idx}
                aria-label={`Export slide ${slide.number} as PNG`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-button
                           border border-border bg-white text-ink font-body text-xs
                           font-medium hover:bg-surface active:scale-[0.97] transition
                           disabled:opacity-60 disabled:cursor-not-allowed
                           min-h-[44px] cursor-pointer"
              >
                {exportingSlide === idx ? (
                  <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Download size={14} aria-hidden="true" />
                )}
                Export PNG
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* -------- hidden full-size slides for export capture -------- */}
      <div
        aria-hidden="true"
        className="fixed pointer-events-none"
        style={{ left: '-9999px', top: 0 }}
      >
        {data.slides.map((slide, idx) => (
          <CarouselSlide
            key={slide.number}
            ref={(el) => {
              exportNodesRef.current[idx] = el
            }}
            slide={slide}
            fullSize
          />
        ))}
      </div>
    </section>
  )
}
