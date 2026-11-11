import { useState, useEffect, useRef, useCallback } from 'react'
import { X, CheckCircle2, Calendar, Clock, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BookingModalProps {
  providerName: string
  providerId: string
  isOpen: boolean
  onClose: () => void
}

const DATE_SLOTS = [
  { label: 'Today', date: 'Today, 10 Nov' },
  { label: 'Tomorrow', date: 'Tomorrow, 11 Nov' },
  { label: 'Thursday', date: 'Thu, 12 Nov' },
  { label: 'Friday', date: 'Fri, 13 Nov' },
]

const TIME_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '02:00 PM',
  '04:30 PM',
  '06:00 PM',
]

export default function BookingModal({
  providerName,
  providerId,
  isOpen,
  onClose,
}: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState(DATE_SLOTS[0].date)
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0])
  const [petParentName, setPetParentName] = useState('')
  const [petParentPhone, setPetParentPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})

  const overlayRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  const resetForm = useCallback(() => {
    setSelectedDate(DATE_SLOTS[0].date)
    setSelectedTime(TIME_SLOTS[0])
    setPetParentName('')
    setPetParentPhone('')
    setSubmitted(false)
    setErrors({})
  }, [])

  const handleClose = useCallback(() => {
    resetForm()
    onClose()
    setTimeout(() => {
      openerRef.current?.focus()
    }, 50)
  }, [resetForm, onClose])

  // Focus trap & Opener tracking
  useEffect(() => {
    if (!isOpen) return
    openerRef.current = document.activeElement as HTMLElement
    const timer = setTimeout(() => firstInputRef.current?.focus(), 100)

    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !overlayRef.current) return
      const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleTab)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', handleTab)
    }
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleClose])

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: { name?: string; phone?: string } = {}
    if (petParentName.trim().length < 2) errs.name = 'Please enter your name'
    if (!/^\d{10,}$/.test(petParentPhone.replace(/\D/g, ''))) {
      errs.phone = 'Please enter a valid 10-digit phone number'
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const bookingRecord = {
      providerId,
      providerName,
      date: selectedDate,
      time: selectedTime,
      petParentName: petParentName.trim(),
      petParentPhone: petParentPhone.trim(),
      createdAt: new Date().toISOString(),
    }

    try {
      const existing = JSON.parse(
        localStorage.getItem('practo_booking_requests') || '[]'
      ) as unknown[]
      existing.push(bookingRecord)
      localStorage.setItem('practo_booking_requests', JSON.stringify(existing))
    } catch {
      // ignore localStorage quota errors
    }

    setSubmitted(true)
    setTimeout(() => {
      handleClose()
    }, 2400)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Book an appointment at ${providerName}`}
          onClick={(e) => {
            if (e.target === overlayRef.current) handleClose()
          }}
        >
          <motion.div
            className="w-full max-w-md rounded-[var(--radius-modal)] bg-white p-6 shadow-xl sm:p-8"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold text-ink">
                  Book Appointment
                </h2>
                <p className="mt-0.5 text-xs text-teal font-medium">
                  {providerName}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius-button)] text-gray-500 transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-teal"
                aria-label="Close booking modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Prototype notice */}
            <div className="mb-5 flex items-center gap-2 rounded-lg bg-amber/15 border border-amber/30 p-2.5 text-xs text-amber-900 font-medium">
              <AlertCircle size={16} className="shrink-0 text-amber-700" />
              <span>Demo prototype: no real booking is made</span>
            </div>

            {submitted ? (
              <motion.div
                className="flex flex-col items-center gap-3 py-6 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-open">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="font-heading text-lg font-bold text-ink">
                  Booking Request Recorded!
                </h3>
                <p className="text-xs text-gray-600 max-w-xs leading-relaxed">
                  Requested slot: <span className="font-semibold text-ink">{selectedDate} at {selectedTime}</span>. Saved to prototype local records.
                </p>
              </motion.div>
            ) : (
              <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Date chips */}
                <fieldset>
                  <legend className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink">
                    <Calendar size={14} className="text-teal" />
                    Select Date
                  </legend>
                  <div className="grid grid-cols-2 gap-2">
                    {DATE_SLOTS.map((s) => (
                      <button
                        key={s.date}
                        type="button"
                        onClick={() => setSelectedDate(s.date)}
                        className={`min-h-[44px] rounded-[10px] border px-3 py-2 text-xs font-medium transition-colors ${
                          selectedDate === s.date
                            ? 'border-teal bg-teal text-white shadow-sm'
                            : 'border-border bg-white text-ink hover:bg-surface'
                        }`}
                      >
                        {s.date}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* Time slot chips */}
                <fieldset>
                  <legend className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink">
                    <Clock size={14} className="text-teal" />
                    Select Time Slot
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {TIME_SLOTS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTime(t)}
                        className={`min-h-[38px] rounded-[10px] border px-3 py-1.5 text-xs font-medium transition-colors ${
                          selectedTime === t
                            ? 'border-teal bg-teal text-white shadow-sm'
                            : 'border-border bg-white text-ink hover:bg-surface'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* Name */}
                <div>
                  <label
                    htmlFor="booking-name"
                    className="mb-1 block text-xs font-semibold text-ink"
                  >
                    Your Name
                  </label>
                  <input
                    ref={firstInputRef}
                    id="booking-name"
                    type="text"
                    value={petParentName}
                    onChange={(e) => {
                      setPetParentName(e.target.value)
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
                    }}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'booking-name-error' : undefined}
                    placeholder="Enter your name"
                    className={`min-h-[44px] w-full rounded-[var(--radius-input)] border bg-white px-3.5 py-2 text-sm text-ink transition-colors focus:ring-1 focus-visible:outline-none ${
                      errors.name
                        ? 'border-red-emergency focus:border-red-emergency focus:ring-red-emergency'
                        : 'border-border focus:border-teal focus:ring-teal'
                    }`}
                  />
                  {errors.name && (
                    <p
                      id="booking-name-error"
                      aria-live="polite"
                      className="mt-1 text-xs text-red-emergency font-medium flex items-center gap-1"
                    >
                      <AlertCircle size={13} className="shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="booking-phone"
                    className="mb-1 block text-xs font-semibold text-ink"
                  >
                    Phone Number
                  </label>
                  <input
                    id="booking-phone"
                    type="tel"
                    value={petParentPhone}
                    onChange={(e) => {
                      setPetParentPhone(e.target.value)
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }))
                    }}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'booking-phone-error' : undefined}
                    placeholder="10-digit mobile number"
                    className={`min-h-[44px] w-full rounded-[var(--radius-input)] border bg-white px-3.5 py-2 text-sm text-ink transition-colors focus:ring-1 focus-visible:outline-none ${
                      errors.phone
                        ? 'border-red-emergency focus:border-red-emergency focus:ring-red-emergency'
                        : 'border-border focus:border-teal focus:ring-teal'
                    }`}
                  />
                  {errors.phone && (
                    <p
                      id="booking-phone-error"
                      aria-live="polite"
                      className="mt-1 text-xs text-red-emergency font-medium flex items-center gap-1"
                    >
                      <AlertCircle size={13} className="shrink-0" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="mt-2 min-h-[44px] w-full rounded-[var(--radius-button)] bg-teal px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-dark focus-visible:outline-2 focus-visible:outline-teal"
                >
                  Confirm Slot Request
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
