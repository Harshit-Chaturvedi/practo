import { forwardRef } from 'react'
import {
  UtensilsCrossed,
  Battery,
  Wind,
  AlertTriangle,
  Bone,
  PawPrint,
  type LucideProps,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface HookSlide {
  type: 'hook'
  number: number
  headline: string
  subheadline: string
  footer: string
  bgColor: string
  textColor: string
}

interface ContentSlide {
  type: 'content'
  number: number
  headline: string
  body: string
  icon: string
  bgColor: string
  textColor: string
  accentColor: string
}

interface CtaSlide {
  type: 'cta'
  number: number
  headline: string
  subheadline: string
  ctaText: string
  ctaUrl: string
  footer: string
  disclaimer: string
  bgColor: string
  textColor: string
}

export type SlideData = HookSlide | ContentSlide | CtaSlide

interface CarouselSlideProps {
  slide: SlideData
  /** When true renders at actual 1080×1350 for export. Default is preview. */
  fullSize?: boolean
}

/* ------------------------------------------------------------------ */
/*  Icon mapping                                                       */
/* ------------------------------------------------------------------ */

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  UtensilsCrossed,
  Battery,
  Wind,
  AlertTriangle,
  Bone,
  PawPrint,
}

/* ------------------------------------------------------------------ */
/*  Body text renderer — highlights [SOURCE NEEDED] tokens             */
/* ------------------------------------------------------------------ */

function renderBody(text: string, scale: number) {
  const parts = text.split(/(\[SOURCE NEEDED\])/)
  return (
    <p
      style={{
        fontSize: 32 * scale,
        lineHeight: 1.65,
      }}
      className="font-body text-ink/90"
    >
      {parts.map((part, i) =>
        part === '[SOURCE NEEDED]' ? (
          <span
            key={i}
            style={{
              padding: `${4 * scale}px ${12 * scale}px`,
              borderRadius: 8 * scale,
              fontSize: 20 * scale,
              marginLeft: 8 * scale,
              display: 'inline-block',
              verticalAlign: 'middle',
            }}
            className="bg-amber-100 text-amber-950 border border-amber-300 font-heading font-bold uppercase tracking-wider shadow-xs"
          >
            Source Needed
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </p>
  )
}

/* ------------------------------------------------------------------ */
/*  Branding footer shared across slide types                          */
/* ------------------------------------------------------------------ */

function BrandingFooter({
  scale,
  isDark = false,
}: {
  scale: number
  isDark?: boolean
}) {
  return (
    <div
      className="flex items-center justify-between w-full border-t pt-4"
      style={{
        borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#E3E0D8',
        paddingTop: 24 * scale,
      }}
    >
      <div className="flex items-center" style={{ gap: 10 * scale }}>
        <div
          className="rounded-full flex items-center justify-center text-white"
          style={{
            width: 36 * scale,
            height: 36 * scale,
            backgroundColor: isDark ? '#F59E0B' : '#0F766E',
            color: isDark ? '#1F2A2E' : '#FFFFFF',
          }}
        >
          <PawPrint size={20 * scale} />
        </div>
        <span
          style={{
            fontSize: 22 * scale,
            color: isDark ? '#FFFFFF' : '#1F2A2E',
            letterSpacing: '-0.01em',
          }}
          className="font-heading font-bold"
        >
          Practo <span style={{ color: isDark ? '#FDE68A' : '#0F766E' }}>for Animals</span>
        </span>
      </div>

      <span
        style={{
          fontSize: 20 * scale,
          color: isDark ? 'rgba(255,255,255,0.85)' : '#4B5563',
          fontWeight: 600,
        }}
        className="font-heading"
      >
        @practoforanimals
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Hook Slide                                                         */
/* ------------------------------------------------------------------ */

function HookSlideContent({
  slide,
  scale,
}: {
  slide: HookSlide
  scale: number
}) {
  return (
    <div
      className="flex flex-col items-center justify-between h-full w-full"
      style={{
        padding: 80 * scale,
        backgroundColor: '#0B4F4A', // Deep brand teal
        color: '#FFFFFF',
      }}
    >
      {/* top indicator */}
      <div className="w-full flex items-center justify-between">
        <span
          className="font-heading font-bold uppercase tracking-wider"
          style={{
            fontSize: 20 * scale,
            color: '#FDE68A',
            backgroundColor: 'rgba(253, 230, 138, 0.15)',
            border: `${1 * scale}px solid rgba(253, 230, 138, 0.4)`,
            padding: `${6 * scale}px ${16 * scale}px`,
            borderRadius: 20 * scale,
          }}
        >
          Care Guide
        </span>
        <span
          className="font-heading font-semibold"
          style={{ fontSize: 20 * scale, color: 'rgba(255,255,255,0.7)' }}
        >
          Swipe ➔
        </span>
      </div>

      {/* centre content */}
      <div className="flex flex-col items-center text-center" style={{ gap: 32 * scale }}>
        <div
          className="rounded-full flex items-center justify-center"
          style={{
            width: 130 * scale,
            height: 130 * scale,
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: `${2 * scale}px solid rgba(255,255,255,0.2)`,
          }}
        >
          <PawPrint size={72 * scale} style={{ color: '#F59E0B' }} aria-hidden="true" />
        </div>
        <h2
          className="font-heading font-extrabold leading-[1.12] text-white"
          style={{ fontSize: 72 * scale }}
        >
          {slide.headline}
        </h2>
        <p
          className="font-body"
          style={{ fontSize: 36 * scale, color: '#EEF5F3', maxWidth: 840 * scale }}
        >
          {slide.subheadline}
        </p>
      </div>

      {/* footer */}
      <BrandingFooter scale={scale} isDark />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Content Slide                                                      */
/* ------------------------------------------------------------------ */

function ContentSlideContent({
  slide,
  scale,
}: {
  slide: ContentSlide
  scale: number
}) {
  const Icon = iconMap[slide.icon]

  return (
    <div
      className="flex flex-col justify-between h-full w-full relative overflow-hidden"
      style={{
        backgroundColor: '#FBF8F3', // Cream token
        color: '#1F2A2E',           // Ink token
        padding: 80 * scale,
      }}
    >
      {/* accent stripe left */}
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{
          width: 14 * scale,
          backgroundColor: slide.accentColor === '#DC2626' ? '#DC2626' : '#0F766E',
        }}
        aria-hidden="true"
      />

      {/* top row: number badge + icon */}
      <div className="flex items-start justify-between" style={{ paddingLeft: 16 * scale }}>
        <div
          className="flex items-center justify-center font-heading font-extrabold text-white shadow-xs"
          style={{
            width: 76 * scale,
            height: 76 * scale,
            borderRadius: 20 * scale,
            backgroundColor: slide.accentColor === '#DC2626' ? '#DC2626' : '#0F766E',
            fontSize: 38 * scale,
          }}
          aria-label={`Slide ${slide.number}`}
        >
          {slide.number}
        </div>

        {Icon && (
          <div
            className="flex items-center justify-center rounded-[18px]"
            style={{
              width: 76 * scale,
              height: 76 * scale,
              backgroundColor: '#EEF5F3',
              border: `${1.5 * scale}px solid #E3E0D8`,
            }}
          >
            <Icon
              size={44 * scale}
              style={{
                color: slide.accentColor === '#DC2626' ? '#DC2626' : '#0F766E',
              }}
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      {/* main content */}
      <div
        className="flex flex-col"
        style={{ gap: 28 * scale, paddingLeft: 16 * scale }}
      >
        <h2
          className="font-heading font-extrabold leading-[1.15] text-ink"
          style={{ fontSize: 52 * scale }}
        >
          {slide.headline}
        </h2>
        {renderBody(slide.body, scale)}
      </div>

      {/* footer branding */}
      <div style={{ paddingLeft: 16 * scale }}>
        <BrandingFooter scale={scale} isDark={false} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  CTA Slide                                                          */
/* ------------------------------------------------------------------ */

function CtaSlideContent({
  slide,
  scale,
}: {
  slide: CtaSlide
  scale: number
}) {
  return (
    <div
      className="flex flex-col items-center justify-between h-full w-full"
      style={{
        padding: 80 * scale,
        backgroundColor: '#0B4F4A', // Deep brand teal
        color: '#FFFFFF',
      }}
    >
      {/* top indicator */}
      <div className="w-full flex items-center justify-end">
        <span
          className="font-heading font-semibold"
          style={{ fontSize: 20 * scale, color: 'rgba(255,255,255,0.7)' }}
        >
          Share this with a pet parent ↗
        </span>
      </div>

      {/* centre content */}
      <div className="flex flex-col items-center text-center w-full" style={{ gap: 28 * scale }}>
        <div
          className="rounded-full flex items-center justify-center shrink-0"
          style={{
            width: 110 * scale,
            height: 110 * scale,
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: `${2 * scale}px solid rgba(255,255,255,0.2)`,
          }}
        >
          <PawPrint size={56 * scale} style={{ color: '#FDE68A' }} aria-hidden="true" />
        </div>
        <h2
          className="font-heading font-extrabold leading-[1.2] text-white"
          style={{ fontSize: 50 * scale, maxWidth: 940 * scale, margin: 0 }}
        >
          {slide.headline}
        </h2>
        <p
          className="font-body"
          style={{
            fontSize: 30 * scale,
            color: '#EEF5F3',
            maxWidth: 860 * scale,
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          {slide.subheadline}
        </p>

        {/* CTA button (Amber token) */}
        <div
          className="font-heading font-bold shadow-lg"
          style={{
            backgroundColor: '#F59E0B',
            color: '#1F2A2E',
            padding: `${20 * scale}px ${54 * scale}px`,
            borderRadius: 16 * scale,
            fontSize: 32 * scale,
            letterSpacing: '-0.01em',
            marginTop: 6 * scale,
          }}
          role="presentation"
        >
          {slide.ctaText}
        </div>
      </div>

      {/* bottom: disclaimer + footer */}
      <div
        className="flex flex-col items-center text-center w-full"
        style={{ gap: 20 * scale }}
      >
        <p
          className="font-body"
          style={{
            fontSize: 20 * scale,
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 820 * scale,
            lineHeight: 1.5,
          }}
        >
          {slide.disclaimer}
        </p>
        <BrandingFooter scale={scale} isDark />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Slide Component                                               */
/* ------------------------------------------------------------------ */

const CarouselSlide = forwardRef<HTMLDivElement, CarouselSlideProps>(
  ({ slide, fullSize = false }, ref) => {
    const WIDTH = 1080
    const HEIGHT = 1350
    const PREVIEW_WIDTH = 270
    const scale = fullSize ? 1 : PREVIEW_WIDTH / WIDTH

    return (
      <div
        ref={ref}
        aria-label={`Slide ${slide.number + 1}: ${slide.type}`}
        style={{
          width: WIDTH * scale,
          height: HEIGHT * scale,
          flexShrink: 0,
          overflow: 'hidden',
          borderRadius: fullSize ? 0 : 12,
        }}
        className={fullSize ? '' : 'shadow-md'}
      >
        {slide.type === 'hook' && <HookSlideContent slide={slide} scale={scale} />}
        {slide.type === 'content' && <ContentSlideContent slide={slide} scale={scale} />}
        {slide.type === 'cta' && <CtaSlideContent slide={slide} scale={scale} />}
      </div>
    )
  },
)

CarouselSlide.displayName = 'CarouselSlide'

export default CarouselSlide
