import { useState, useEffect, useCallback, useRef, type FormEvent } from 'react'
import { X, Check, ChevronLeft, ChevronRight, MessageCircle, CalendarPlus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { batchOptions } from '@/data/course'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface LeadCaptureModalProps {
  open: boolean
  onClose: () => void
  intent?: 'reserve' | 'syllabus'
}

interface ContactInfo {
  fullName: string
  whatsapp: string
  email: string
}

interface AboutYou {
  role: string
  interests: string[]
  batch: string
}

interface FieldErrors {
  fullName?: string
  whatsapp?: string
  email?: string
  role?: string
  interests?: string
  batch?: string
}

const ROLE_OPTIONS = ['Student', 'Working Professional', 'Freelancer', 'Business Owner'] as const
const INTEREST_OPTIONS = ['AI Tools', 'Automation', 'Website Building', 'Content Creation', 'Data Analysis'] as const

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getUtmParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search)
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
  const utm: Record<string, string> = {}
  utmKeys.forEach((key) => {
    const val = params.get(key)
    if (val) utm[key] = val
  })
  return utm
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function LeadCaptureModal({ open, onClose }: LeadCaptureModalProps) {
  const [step, setStep] = useState(1)
  const [contact, setContact] = useState<ContactInfo>({ fullName: '', whatsapp: '', email: '' })
  const [about, setAbout] = useState<AboutYou>({ role: '', interests: [], batch: '' })
  const [errors, setErrors] = useState<FieldErrors>({})
  const modalRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  const handleClose = useCallback(() => {
    setStep(1)
    setContact({ fullName: '', whatsapp: '', email: '' })
    setAbout({ role: '', interests: [], batch: '' })
    setErrors({})
    onClose()
  }, [onClose])

  /* Focus trap */
  useEffect(() => {
    if (!open) return

    const timer = setTimeout(() => firstInputRef.current?.focus(), 100)

    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !modalRef.current) return
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
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
  }, [open, step])

  /* Escape to close */
  useEffect(() => {
    if (!open) return
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [open, handleClose])

  /* Body scroll lock */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  /* ---- Validation ---- */

  const validateStep1 = useCallback((): boolean => {
    const errs: FieldErrors = {}
    if (contact.fullName.trim().length < 2) errs.fullName = 'Name must be at least 2 characters'
    if (!/^\d{10,}$/.test(contact.whatsapp.replace(/\D/g, ''))) errs.whatsapp = 'Enter a valid phone number (10+ digits)'
    if (!validateEmail(contact.email)) errs.email = 'Enter a valid email address'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }, [contact])

  const validateStep2 = useCallback((): boolean => {
    const errs: FieldErrors = {}
    if (!about.role) errs.role = 'Please select a role'
    if (about.interests.length === 0) errs.interests = 'Select at least one interest'
    if (!about.batch) errs.batch = 'Please select a batch'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }, [about])

  /* ---- Submission ---- */

  const handleSubmit = useCallback(async () => {
    if (!validateStep2()) return

    const leadData = {
      ...contact,
      ...about,
      utm: getUtmParams(),
      submittedAt: new Date().toISOString(),
    }

    /* localStorage */
    try {
      const existing = JSON.parse(localStorage.getItem('practo_leads') || '[]') as unknown[]
      existing.push(leadData)
      localStorage.setItem('practo_leads', JSON.stringify(existing))
    } catch {
      /* silently continue */
    }

    /* Webhook */
    const webhookUrl = import.meta.env.VITE_LEAD_WEBHOOK_URL as string | undefined
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData),
        })
      } catch {
        /* fail silently – lead already saved locally */
      }
    }

    setStep(3)
  }, [contact, about, validateStep2])

  /* ---- Interest toggle ---- */

  const toggleInterest = (interest: string) => {
    setAbout((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  /* ---- Step indicator ---- */

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-3 mb-6" aria-label="Form progress">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
              s < step
                ? 'bg-green-open text-white'
                : s === step
                  ? 'bg-indigo text-white'
                  : 'bg-gray-200 text-gray-500'
            }`}
            aria-current={s === step ? 'step' : undefined}
          >
            {s < step ? <Check size={16} /> : s}
          </div>
          {s < 3 && <div className={`w-8 h-0.5 ${s < step ? 'bg-green-open' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  )

  /* ---- Render steps ---- */

  function renderStep1() {
    return (
      <div className="space-y-4">
        <h3 className="font-heading text-xl font-bold text-ink text-center">Contact Info</h3>

        <div>
          <label htmlFor="lead-name" className="block text-sm font-medium text-ink mb-1">
            Full Name
          </label>
          <input
            ref={firstInputRef}
            id="lead-name"
            type="text"
            required
            value={contact.fullName}
            onChange={(e) => setContact((p) => ({ ...p, fullName: e.target.value }))}
            className={`w-full min-h-[44px] px-4 py-2.5 rounded-[12px] border ${
              errors.fullName ? 'border-red-emergency' : 'border-border'
            } bg-white text-ink focus:border-indigo focus:outline-none transition-colors`}
            placeholder="Your full name"
          />
          {errors.fullName && <p className="text-red-emergency text-xs mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="lead-whatsapp" className="block text-sm font-medium text-ink mb-1">
            WhatsApp Number
          </label>
          <input
            id="lead-whatsapp"
            type="tel"
            required
            value={contact.whatsapp}
            onChange={(e) => setContact((p) => ({ ...p, whatsapp: e.target.value }))}
            className={`w-full min-h-[44px] px-4 py-2.5 rounded-[12px] border ${
              errors.whatsapp ? 'border-red-emergency' : 'border-border'
            } bg-white text-ink focus:border-indigo focus:outline-none transition-colors`}
            placeholder="9876543210"
          />
          {errors.whatsapp && <p className="text-red-emergency text-xs mt-1">{errors.whatsapp}</p>}
        </div>

        <div>
          <label htmlFor="lead-email" className="block text-sm font-medium text-ink mb-1">
            Email
          </label>
          <input
            id="lead-email"
            type="email"
            required
            value={contact.email}
            onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
            className={`w-full min-h-[44px] px-4 py-2.5 rounded-[12px] border ${
              errors.email ? 'border-red-emergency' : 'border-border'
            } bg-white text-ink focus:border-indigo focus:outline-none transition-colors`}
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-red-emergency text-xs mt-1">{errors.email}</p>}
        </div>
      </div>
    )
  }

  function renderStep2() {
    return (
      <div className="space-y-5">
        <h3 className="font-heading text-xl font-bold text-ink text-center">About You</h3>

        {/* Role */}
        <fieldset>
          <legend className="block text-sm font-medium text-ink mb-2">I am a...</legend>
          <div className="grid grid-cols-2 gap-2">
            {ROLE_OPTIONS.map((role) => (
              <label
                key={role}
                className={`flex items-center justify-center min-h-[44px] px-3 py-2 rounded-[12px] border text-sm font-medium cursor-pointer transition-colors ${
                  about.role === role
                    ? 'border-indigo bg-indigo/10 text-indigo'
                    : 'border-border bg-white text-ink hover:border-indigo/40'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={role}
                  checked={about.role === role}
                  onChange={() => setAbout((p) => ({ ...p, role }))}
                  className="sr-only"
                />
                {role}
              </label>
            ))}
          </div>
          {errors.role && <p className="text-red-emergency text-xs mt-1">{errors.role}</p>}
        </fieldset>

        {/* Interests */}
        <fieldset>
          <legend className="block text-sm font-medium text-ink mb-2">I&apos;m most interested in...</legend>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => (
              <label
                key={interest}
                className={`inline-flex items-center min-h-[44px] px-4 py-2 rounded-[20px] border text-sm font-medium cursor-pointer transition-colors ${
                  about.interests.includes(interest)
                    ? 'border-indigo bg-indigo/10 text-indigo'
                    : 'border-border bg-white text-ink hover:border-indigo/40'
                }`}
              >
                <input
                  type="checkbox"
                  value={interest}
                  checked={about.interests.includes(interest)}
                  onChange={() => toggleInterest(interest)}
                  className="sr-only"
                />
                {about.interests.includes(interest) && <Check size={14} className="mr-1.5" />}
                {interest}
              </label>
            ))}
          </div>
          {errors.interests && <p className="text-red-emergency text-xs mt-1">{errors.interests}</p>}
        </fieldset>

        {/* Batch */}
        <fieldset>
          <legend className="block text-sm font-medium text-ink mb-2">Preferred batch</legend>
          <div className="space-y-2">
            {batchOptions.map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center min-h-[44px] px-4 py-2.5 rounded-[12px] border text-sm font-medium cursor-pointer transition-colors ${
                  about.batch === opt.id
                    ? 'border-indigo bg-indigo/10 text-indigo'
                    : 'border-border bg-white text-ink hover:border-indigo/40'
                }`}
              >
                <input
                  type="radio"
                  name="batch"
                  value={opt.id}
                  checked={about.batch === opt.id}
                  onChange={() => setAbout((p) => ({ ...p, batch: opt.id }))}
                  className="sr-only"
                />
                <span className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center shrink-0 ${
                  about.batch === opt.id ? 'border-indigo' : 'border-gray-300'
                }`}>
                  {about.batch === opt.id && <span className="w-2 h-2 rounded-full bg-indigo" />}
                </span>
                {opt.label}
              </label>
            ))}
          </div>
          {errors.batch && <p className="text-red-emergency text-xs mt-1">{errors.batch}</p>}
        </fieldset>
      </div>
    )
  }

  function renderStep3() {
    return (
      <div className="flex flex-col items-center text-center space-y-5 py-4">
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full bg-green-open flex items-center justify-center"
        >
          <Check size={40} className="text-white" strokeWidth={3} />
        </motion.div>

        <h3 className="font-heading text-2xl font-bold text-ink">You&apos;re on the list!</h3>
        <p className="text-gray-600 text-sm max-w-xs">
          We&apos;ll be in touch soon via WhatsApp and email.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
          <a
            href="#"
            className="flex-1 inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 bg-amber text-ink font-semibold rounded-[14px] hover:bg-amber-dark transition-colors"
          >
            <MessageCircle size={18} />
            Join WhatsApp Group
          </a>
          <a
            href="#"
            className="flex-1 inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 border-2 border-indigo text-indigo font-semibold rounded-[14px] hover:bg-indigo/5 transition-colors"
          >
            <CalendarPlus size={18} />
            Add to Calendar
          </a>
        </div>
      </div>
    )
  }

  /* ---- Nav buttons ---- */

  function handleNext(e: FormEvent) {
    e.preventDefault()
    if (step === 1 && validateStep1()) {
      setStep(2)
      setErrors({})
    } else if (step === 2) {
      handleSubmit()
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Lead capture form"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-white rounded-[20px] shadow-xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto z-10"
          >
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-ink rounded-full hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {renderStepIndicator()}

            <form onSubmit={handleNext} noValidate>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}

              {step < 3 && (
                <div className="flex gap-3 mt-6">
                  {step === 2 && (
                    <button
                      type="button"
                      onClick={() => { setStep(1); setErrors({}) }}
                      className="flex-1 inline-flex items-center justify-center gap-1 min-h-[44px] px-4 py-2.5 border-2 border-border text-ink font-semibold rounded-[14px] hover:bg-gray-100 transition-colors"
                    >
                      <ChevronLeft size={16} />
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-1 min-h-[44px] px-4 py-2.5 bg-indigo text-white font-semibold rounded-[14px] hover:bg-indigo-light transition-colors"
                  >
                    {step === 1 ? 'Next' : 'Submit'}
                    {step === 1 && <ChevronRight size={16} />}
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full min-h-[44px] px-4 py-2.5 text-gray-500 hover:text-ink text-sm font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
