import { useRef, useState, useCallback } from 'react'
import { Download, FileDown, Loader2, Sparkles, ChevronLeft, ChevronRight, Info } from 'lucide-react'
import CarouselSlide, { type SlideData } from '@/components/CarouselSlide'
import carouselData from '@/data/carousel.json'
import SEO from '@/components/SEO'
import { Container, SectionHeader, Button, Badge } from '@/components/ui'

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
  const scrollerRef = useRef<HTMLDivElement>(null)

  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [exportingSlide, setExportingSlide] = useState<number | null>(null)
  const [exportingPdf, setExportingPdf] = useState(false)

  /* ---- Slide navigation ------------------------------------------ */

  const scrollToSlide = useCallback((index: number) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const slideElements = scroller.querySelectorAll<HTMLElement>('[role="listitem"]')
    const target = slideElements[index]
    if (target) {
      const left = target.offsetLeft - scroller.offsetLeft
      scroller.scrollTo({ left, behavior: 'smooth' })
      setActiveSlideIndex(index)
    }
  }, [])

  const handlePrev = useCallback(() => {
    const next = Math.max(0, activeSlideIndex - 1)
    scrollToSlide(next)
  }, [activeSlideIndex, scrollToSlide])

  const handleNext = useCallback(() => {
    const next = Math.min(data.slides.length - 1, activeSlideIndex + 1)
    scrollToSlide(next)
  }, [activeSlideIndex, scrollToSlide])

  const handleScroll = useCallback(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const slideElements = scroller.querySelectorAll<HTMLElement>('[role="listitem"]')
    const scrollLeft = scroller.scrollLeft
    let closestIndex = 0
    let minDiff = Infinity
    slideElements.forEach((el, idx) => {
      const diff = Math.abs(el.offsetLeft - scroller.offsetLeft - scrollLeft)
      if (diff < minDiff) {
        minDiff = diff
        closestIndex = idx
      }
    })
    setActiveSlideIndex(closestIndex)
  }, [])

  /* ---- helpers --------------------------------------------------- */

  const captureSlide = useCallback(
    async (index: number): Promise<string> => {
      const node = exportNodesRef.current[index]
      if (!node) throw new Error(`Slide ${index} ref not found`)
      const { toPng } = await import('html-to-image')
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
      const [{ toJpeg }, { jsPDF }] = await Promise.all([
        import('html-to-image'),
        import('jspdf'),
      ])

      /* Capture all slides as compressed JPEG (quality 0.9) */
      const images: string[] = []
      for (let i = 0; i < data.slides.length; i++) {
        const node = exportNodesRef.current[i]
        if (!node) throw new Error(`Slide ${i} ref not found`)
        const jpegData = await toJpeg(node, {
          width: SLIDE_W,
          height: SLIDE_H,
          quality: 0.9,
          cacheBust: true,
        })
        images.push(jpegData)
      }

      /* Create PDF — use mm units, size proportional to 1080:1350 */
      const pdfW = 216 // mm  (1080 / 5)
      const pdfH = 270 // mm  (1350 / 5)

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfW, pdfH],
        compress: true,
      })

      images.forEach((img, idx) => {
        if (idx > 0) pdf.addPage([pdfW, pdfH], 'portrait')
        pdf.addImage(img, 'JPEG', 0, 0, pdfW, pdfH, undefined, 'FAST')
      })

      pdf.save('practo-carousel.pdf')
    } catch (err) {
      console.error('PDF export failed', err)
    } finally {
      setExportingPdf(false)
    }
  }, [])

  /* ---- Render ---------------------------------------------------- */

  return (
    <main className="bg-cream min-h-screen">
      <SEO
        title="Interactive Carousel & Social Slide Studio | Practo for Animals"
        description="7-slide high-retention social carousel guide for pet emergencies, canine heatstroke care, and verified clinic referrals. Export to PNG and multi-page PDF."
      />
      {/* -------- page header -------- */}
      <div className="border-b border-border bg-surface/70 backdrop-blur-sm">
        <Container size="default" className="py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <Badge variant="teal">AI Content Generation</Badge>
                <Badge variant="neutral">Instagram 4:5 Portrait</Badge>
              </div>
              <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
                AI Social Carousel Preview
              </h1>
              <p className="mt-3 text-text-muted text-base max-w-xl leading-relaxed">
                Structured clinical awareness slides generated programmatically from schema-validated JSON with lossless multi-format exports.
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleExportPdf}
              disabled={exportingPdf}
              leftIcon={exportingPdf ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
              className="shrink-0"
            >
              {exportingPdf ? 'Compiling PDF…' : 'Export Full Deck (PDF)'}
            </Button>
          </div>

          {/* Topic strip */}
          <div className="mt-8 flex flex-wrap items-center gap-3 bg-white border border-border rounded-[14px] px-5 py-3 shadow-xs">
            <Sparkles size={16} className="text-teal shrink-0" aria-hidden="true" />
            <span className="font-heading text-sm font-bold text-ink">
              Topic: {data.topic}
            </span>
            <span className="text-text-muted text-xs sm:text-sm">
              • {data.slides.length} slides • 1080 × 1350px • Manrope + Inter Design Tokens
            </span>
          </div>
        </Container>
      </div>

      {/* -------- slide preview deck -------- */}
      <Container size="default" className="py-12 sm:py-16">
        <SectionHeader
          eyebrow="Interactive Strip"
          title="Slide Preview Deck"
          description="Rendered at scaled 4:5 aspect ratio. Click 'Export PNG' for individual 1080×1350 assets or use the PDF builder above."
          align="left"
          className="mb-8"
        />

        {/* Carousel controls bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={activeSlideIndex === 0}
              aria-label="Previous slide"
              leftIcon={<ChevronLeft size={16} />}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={activeSlideIndex === data.slides.length - 1}
              aria-label="Next slide"
              rightIcon={<ChevronRight size={16} />}
            >
              Next
            </Button>
            <span className="text-xs font-semibold text-text-muted ml-2">
              Slide {activeSlideIndex + 1} of {data.slides.length}
            </span>
          </div>

          {/* Slide indicator dots */}
          <div className="flex items-center gap-0.5" role="tablist" aria-label="Slide indicators">
            {data.slides.map((s, idx) => (
              <button
                key={s.number}
                type="button"
                role="tab"
                aria-selected={activeSlideIndex === idx}
                aria-label={`Go to slide ${idx + 1}: ${s.type}`}
                onClick={() => scrollToSlide(idx)}
                className="flex items-center justify-center min-w-[32px] min-h-[36px] p-1 cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
              >
                <span
                  className={`h-2.5 rounded-full transition-all duration-200 ${
                    activeSlideIndex === idx
                      ? 'w-8 bg-teal'
                      : 'w-2.5 bg-border hover:bg-teal/40'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* slide preview strip (horizontally scrollable) */}
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory scrollbar-thin"
          role="list"
          aria-label="Carousel slide previews"
        >
          {data.slides.map((slide, idx) => (
            <div
              key={slide.number}
              className="flex flex-col items-center gap-3 snap-start shrink-0"
              role="listitem"
            >
              {/* label */}
              <Badge variant="neutral" className="text-xs uppercase tracking-wider font-bold">
                {slide.type === 'hook'
                  ? 'Slide 1: Hook'
                  : slide.type === 'cta'
                    ? 'Slide 7: CTA'
                    : `Slide ${slide.number + 1}: Content`}
              </Badge>

              {/* preview card */}
              <div className="rounded-[16px] overflow-hidden shadow-md ring-1 ring-border">
                <CarouselSlide slide={slide} />
              </div>

              {/* export button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportPng(idx)}
                disabled={exportingSlide === idx}
                leftIcon={exportingSlide === idx ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                className="w-full text-xs"
              >
                {exportingSlide === idx ? 'Generating…' : 'Export PNG'}
              </Button>
            </div>
          ))}
        </div>

        {/* Disclaimer below carousel */}
        <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs sm:text-sm text-text-muted">
          <Info size={16} className="text-teal shrink-0" aria-hidden="true" />
          <span>Educational content, not a substitute for a veterinarian.</span>
        </div>
      </Container>

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
    </main>
  )
}
