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
      className="font-body text-current"
    >
      {parts.map((part, i) =>
        part === '[SOURCE NEEDED]' ? (
          <span
            key={i}
            style={{
              padding: `${3 * scale}px ${10 * scale}px`,
              borderRadius: 8 * scale,
              fontSize: 22 * scale,
              marginLeft: 8 * scale,
              display: 'inline-block',
              verticalAlign: 'middle',
            }}
            className="bg-amber-100 text-amber-900 border border-amber-300 font-semibold uppercase tracking-wider"
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
  text,
  color,
  scale,
}: {
  text: string
  color: string
  scale: number
}) {
  return (
    <div
      className="flex items-center justify-center gap-2"
      style={{ gap: 10 * scale }}
    >
      <PawPrint
        size={28 * scale}
        style={{ color }}
        aria-hidden="true"
      />
      <span
        style={{
          fontSize: 24 * scale,
          color,
          opacity: 0.85,
          letterSpacing: '0.02em',
        }}
        className="font-heading font-semibold"
      >
        {text}
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
        backgroundColor: slide.bgColor,
        color: slide.textColor,
      }}
    >
      {/* top spacer */}
      <div aria-hidden="true" />

      {/* centre content */}
      <div className="flex flex-col items-center text-center" style={{ gap: 32 * scale }}>
        <PawPrint size={80 * scale} style={{ color: slide.textColor, opacity: 0.3 }} aria-hidden="true" />
        <h2
          className="font-heading font-bold leading-tight"
          style={{ fontSize: 72 * scale }}
        >
          {slide.headline}
        </h2>
        <p
          className="font-body"
          style={{ fontSize: 36 * scale, opacity: 0.85 }}
        >
          {slide.subheadline}
        </p>
      </div>

      {/* footer */}
      <BrandingFooter text={slide.footer} color={slide.textColor} scale={scale} />
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
        backgroundColor: slide.bgColor,
        color: slide.textColor,
        padding: 80 * scale,
      }}
    >
      {/* accent stripe left */}
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{
          width: 12 * scale,
          backgroundColor: slide.accentColor,
        }}
        aria-hidden="true"
      />

      {/* top row: number badge + icon */}
      <div className="flex items-start justify-between" style={{ paddingLeft: 16 * scale }}>
        <div
          className="flex items-center justify-center font-heading font-bold text-white"
          style={{
            width: 72 * scale,
            height: 72 * scale,
            borderRadius: '50%',
            backgroundColor: slide.accentColor,
            fontSize: 36 * scale,
          }}
          aria-label={`Slide ${slide.number}`}
        >
          {slide.number}
        </div>

        {Icon && (
          <Icon
            size={64 * scale}
            style={{ color: slide.accentColor, opacity: 0.2 }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* main content */}
      <div
        className="flex flex-col"
        style={{ gap: 28 * scale, paddingLeft: 16 * scale }}
      >
        {Icon && (
          <Icon size={56 * scale} style={{ color: slide.accentColor }} aria-hidden="true" />
        )}
        <h2
          className="font-heading font-bold leading-tight"
          style={{ fontSize: 52 * scale }}
        >
          {slide.headline}
        </h2>
        {renderBody(slide.body, scale)}
      </div>

      {/* footer branding */}
      <div style={{ paddingLeft: 16 * scale }}>
        <BrandingFooter text="Practo for Animals" color={slide.accentColor} scale={scale} />
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
        backgroundColor: slide.bgColor,
        color: slide.textColor,
      }}
    >
      {/* top spacer */}
      <div aria-hidden="true" />

      {/* centre content */}
      <div className="flex flex-col items-center text-center" style={{ gap: 40 * scale }}>
        <PawPrint size={72 * scale} style={{ color: slide.textColor, opacity: 0.3 }} aria-hidden="true" />
        <h2
          className="font-heading font-bold leading-tight"
          style={{ fontSize: 64 * scale }}
        >
          {slide.headline}
        </h2>
        <p
          className="font-body"
          style={{ fontSize: 34 * scale, opacity: 0.85 }}
        >
          {slide.subheadline}
        </p>

        {/* CTA button */}
        <div
          className="font-heading font-bold"
          style={{
            backgroundColor: '#F59E0B',
            color: '#1F2A2E',
            padding: `${24 * scale}px ${64 * scale}px`,
            borderRadius: 16 * scale,
            fontSize: 36 * scale,
          }}
          role="presentation"
        >
          {slide.ctaText}
        </div>
      </div>

      {/* bottom: disclaimer + footer */}
      <div
        className="flex flex-col items-center text-center"
        style={{ gap: 20 * scale }}
      >
        <p
          className="font-body"
          style={{
            fontSize: 20 * scale,
            opacity: 0.6,
            maxWidth: 800 * scale,
            lineHeight: 1.5,
          }}
        >
          {slide.disclaimer}
        </p>
        <BrandingFooter text={slide.footer} color={slide.textColor} scale={scale} />
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
