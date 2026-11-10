import { useState } from 'react'
import {
  CheckCircle2,
  Star,
  Phone,
  Navigation,
  Calendar,
  Pencil,
  Info,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Provider } from '@/data/providers'
import CorrectionModal from './CorrectionModal'
import BookingModal from './BookingModal'

interface ProviderCardProps {
  provider: Provider
  index: number
  isSelected?: boolean
  onSelect?: () => void
}

const typeBadgeColors: Record<Provider['type'], string> = {
  clinic: 'bg-teal-50 text-teal-800 border border-teal-200',
  hospital: 'bg-teal-100 text-teal-900 border border-teal-300',
  boarding: 'bg-amber-50 text-amber-900 border border-amber-200',
  diagnostics: 'bg-teal-50 text-teal-800 border border-teal-200',
  ambulance: 'bg-red-50 text-red-700 border border-red-200',
  ngo: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
}

export default function ProviderCard({
  provider,
  index,
  isSelected = false,
  onSelect,
}: ProviderCardProps) {
  const [correctionOpen, setCorrectionOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [showCallToast, setShowCallToast] = useState(false)

  const badgeColor = typeBadgeColors[provider.type] ?? 'bg-surface text-ink'

  const handleCallClick = () => {
    setShowCallToast(true)
    setTimeout(() => {
      setShowCallToast(false)
    }, 3500)
  }

  return (
    <>
      <motion.article
        id={`provider-${provider.id}`}
        onClick={onSelect}
        className={`relative flex flex-col gap-4 rounded-[var(--radius-card)] border bg-white p-5 shadow-sm transition-all sm:p-6 ${
          isSelected
            ? 'border-teal ring-2 ring-teal/30 shadow-md'
            : 'border-border hover:shadow-md'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.04 }}
        aria-label={`Provider: ${provider.name}`}
      >
        {/* Call Toast Notification */}
        <AnimatePresence>
          {showCallToast && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between gap-2 rounded-xl bg-ink p-3 text-xs text-white shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Info size={16} className="shrink-0 text-amber" />
                <span>
                  <strong>{provider.phoneDisplay}:</strong> Demo listing — calling is disabled in this prototype.
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowCallToast(false)
                }}
                className="text-gray-500 hover:text-white p-1"
                aria-label="Close message"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Row: Name, Badge, Verified */}
        <div className="flex flex-wrap items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-lg font-semibold text-ink leading-snug">
              {provider.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{provider.address}</p>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <span
              className={`inline-flex items-center rounded-[var(--radius-chip)] px-3 py-1 text-xs font-medium ${badgeColor}`}
            >
              {provider.typeBadge}
            </span>
            {provider.verified && (
              <span
                role="img"
                className="inline-flex items-center text-teal"
                aria-label="Verified provider"
                title="Verified"
              >
                <CheckCircle2 size={18} />
              </span>
            )}
          </div>
        </div>

        {/* Rating + Distance + Open/Closed */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {/* Rating */}
          <span className="inline-flex items-center gap-1 font-semibold text-ink">
            <Star size={16} className="fill-amber text-amber" />
            {provider.rating.toFixed(1)}
          </span>

          {/* Distance */}
          <span className="text-gray-500 font-medium">{provider.distance}</span>

          {/* Open/Closed */}
          {provider.isOpen ? (
            <span className="inline-flex items-center gap-1 rounded-[var(--radius-chip)] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              Open
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-[var(--radius-chip)] bg-red-50 border border-red-200 px-2.5 py-0.5 text-xs font-bold text-red-800">
              Closed
            </span>
          )}
          <span className="text-xs text-gray-500">{provider.hours}</span>
        </div>

        {/* Service Chips */}
        <div className="flex flex-wrap gap-1.5">
          {provider.services.map((service) => (
            <span
              key={service}
              className="rounded-[var(--radius-chip)] bg-surface px-2.5 py-1 text-xs font-medium text-ink"
            >
              {service}
            </span>
          ))}
        </div>

        {/* Animals + Fee range */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="text-gray-500">
            <span className="font-medium text-ink">Animals:</span>{' '}
            {provider.animals.join(', ')}
          </span>
          <span className="font-medium text-ink">{provider.feeRange}</span>
        </div>

        {/* Last verified */}
        <p className="text-xs text-gray-500">
          Last verified {provider.lastVerified}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <button
            type="button"
            onClick={handleCallClick}
            className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-[var(--radius-button)] border border-teal px-4 py-2.5 text-sm font-medium text-teal transition-colors hover:bg-teal hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
            aria-label={`Call ${provider.name} at ${provider.phoneDisplay}`}
          >
            <Phone size={16} />
            <span className="hidden xs:inline">Call</span>
          </button>

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${provider.lat},${provider.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-[var(--radius-button)] border border-border px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
            aria-label={`Get directions to ${provider.name}`}
          >
            <Navigation size={16} />
            <span className="hidden xs:inline">Directions</span>
          </a>

          <button
            type="button"
            onClick={() => setBookingOpen(true)}
            className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-[var(--radius-button)] bg-teal px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
            aria-label={`Book appointment at ${provider.name}`}
          >
            <Calendar size={16} />
            <span className="hidden xs:inline">Book</span>
          </button>

          <button
            type="button"
            onClick={() => setCorrectionOpen(true)}
            className="ml-auto inline-flex min-h-[44px] items-center gap-1 px-2 text-xs text-gray-500 underline-offset-2 transition-colors hover:text-teal hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
            aria-label={`Submit a correction for ${provider.name}`}
          >
            <Pencil size={12} />
            Submit a correction
          </button>
        </div>
      </motion.article>

      <CorrectionModal
        providerName={provider.name}
        isOpen={correctionOpen}
        onClose={() => setCorrectionOpen(false)}
      />

      <BookingModal
        providerId={provider.id}
        providerName={provider.name}
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </>
  )
}
