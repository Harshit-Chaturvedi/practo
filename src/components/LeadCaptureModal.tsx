import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, ArrowRight, ArrowLeft, Calendar, MessageCircle, Download, FileText } from 'lucide-react'
import { batchOptions } from '@/data/course'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface LeadCaptureModalProps {
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

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ROLE_OPTIONS = [
  'Student',
  'Working Professional',
  'Freelancer',
  'Small Business Owner',
]

const INTEREST_OPTIONS = [
  'AI Tools & Prompting',
  'Workflow Automation (Make / n8n)',
  'Building Websites with AI',
  'AI Content Creation',
  'Data Basics with AI',
]

/* ------------------------------------------------------------------ */
/*  UTM helper                                                         */
/* ------------------------------------------------------------------ */

function getUtmParams() {
  const params = new URLSearchParams(window.location.search)
  const utm: Record<string, string> = {}
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    const val = params.get(key)
    if (val) utm[key] = val
  }
  return utm
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function downloadIcs() {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Practo for Animals//AI Education Demo Class//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'SUMMARY:Free AI Demo Class — Practo for Animals',
    'DESCRIPTION:Join us for a live demo on AI tools & workflows. Date to be confirmed upon cohort start [DEMO DATE].',
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'practo-ai-demo-class.ics')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function LeadCaptureModal({ open, onClose, intent = 'reserve' }: LeadCaptureModalProps) {
  const [step, setStep] = useState(1)
  const [contact, setContact] = useState<ContactInfo>({ fullName: '', whatsapp: '', email: '' })
  const [about, setAbout] = useState<AboutYou>({ role: '', interests: [], batch: '' })
  const [companyHoneypot, setCompanyHoneypot] = useState('') // Honeypot spam trap
  const [errors, setErrors] = useState<FieldErrors>({})
  const modalRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  const isSyllabus = intent === 'syllabus'

  const handleClose = useCallback(() => {
    setStep(1)
    setContact({ fullName: '', whatsapp: '', email: '' })
    setAbout({ role: '', interests: [], batch: '' })
    setCompanyHoneypot('')
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
    if (!isSyllabus && !/^\d{10,}$/.test(contact.whatsapp.replace(/\D/g, ''))) {
      errs.whatsapp = 'Enter a valid phone number (10+ digits)'
    }
    if (!validateEmail(contact.email)) errs.email = 'Enter a valid email address'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }, [contact, isSyllabus])

  const validateStep2 = useCallback((): boolean => {
    const errs: FieldErrors = {}
    if (!about.role) errs.role = 'Please select a role'
    if (about.interests.length === 0) errs.interests = 'Select at least one interest'
    if (!about.batch) errs.batch = 'Please select a batch'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }, [about])

  /* ---- Submission ---- */

  const triggerSyllabusDownload = useCallback(() => {
    const link = document.createElement('a')
    link.href = '/syllabus.pdf'
    link.download = 'Practo_For_Animals_AI_Course_Syllabus.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  const postWebhookWithRetry = async (payload: Record<string, unknown>, url: string) => {
    const attemptPost = async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      try {
        await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8', // No CORS preflight
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        })
      } finally {
        clearTimeout(timeoutId)
      }
    }

    try {
      await attemptPost()
    } catch {
      // One retry after 500ms
      try {
        await new Promise((r) => setTimeout(r, 500))
        await attemptPost()
      } catch {
        // Fail completely silently — lead is already in localStorage
      }
    }
  }

  const handleSubmit = useCallback(async () => {
    if (!isSyllabus && !validateStep2()) return

    const utm = getUtmParams()
    const nowIso = new Date().toISOString()

    // 1. Full lead object for localStorage
    const leadRecord = {
      ...contact,
      ...(isSyllabus ? { intent: 'syllabus' } : about),
      intent,
      utm,
      submittedAt: nowIso,
    }

    try {
      const existing = JSON.parse(localStorage.getItem('practo_leads') || '[]') as unknown[]
      existing.push(leadRecord)
      localStorage.setItem('practo_leads', JSON.stringify(existing))
    } catch {
      /* continue silently */
    }

    // 2. Exact payload format for the webhook
    const webhookPayload = {
      timestamp: nowIso,
      name: contact.fullName,
      whatsapp: contact.whatsapp,
      email: contact.email,
      role: isSyllabus ? 'Syllabus Requester' : about.role,
      interests: isSyllabus ? 'Syllabus' : about.interests.join(', '),
      batch: isSyllabus ? 'N/A' : about.batch,
      intent: isSyllabus ? 'syllabus' : 'seat',
      utm_source: utm.utm_source || '',
      utm_medium: utm.utm_medium || '',
      utm_campaign: utm.utm_campaign || '',
      page: window.location.pathname,
      company: companyHoneypot, // hidden honeypot spam trap
    }

    const webhookUrl = import.meta.env.VITE_LEAD_WEBHOOK_URL as string | undefined
    if (webhookUrl && webhookUrl.trim() !== '') {
      // Fire asynchronously with 5-second timeout and 1 retry
      postWebhookWithRetry(webhookPayload, webhookUrl.trim())
    }

    if (isSyllabus) {
      triggerSyllabusDownload()
      setStep(2)
    } else {
      setStep(3)
    }
  }, [contact, about, isSyllabus, intent, companyHoneypot, validateStep2, triggerSyllabusDownload])

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

  const renderStepIndicator = () => {
    const stepsArray = isSyllabus ? [1, 2] : [1, 2, 3]
    return (
      <div className="flex items-center justify-center gap-2 mb-6" aria-label="Step progress">
        {stepsArray.map((s) => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all duration-300 ${
              s === step
                ? 'w-8 bg-teal'
                : s < step
                  ? 'w-2 bg-teal'
                  : 'w-2 bg-border'
            }`}
          />
        ))}
      </div>
    )
  }

  /* ---- Sub-renders ---- */

  function renderStep1() {
    return (
      <div className="space-y-4">
        {/* Invisible honeypot field for spam prevention */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <label htmlFor="lead-company">Company</label>
          <input
            id="lead-company"
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={companyHoneypot}
            onChange={(e) => setCompanyHoneypot(e.target.value)}
          />
        </div>

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
            } bg-white text-ink focus:border-teal focus:outline-none transition-colors`}
            placeholder="Your full name"
          />
          {errors.fullName && <p className="text-red-emergency text-xs mt-1">{errors.fullName}</p>}
        </div>

        {!isSyllabus && (
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
              } bg-white text-ink focus:border-teal focus:outline-none transition-colors`}
              placeholder="9876543210"
            />
            {errors.whatsapp && <p className="text-red-emergency text-xs mt-1">{errors.whatsapp}</p>}
          </div>
        )}

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
            } bg-white text-ink focus:border-teal focus:outline-none transition-colors`}
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
                    ? 'border-teal bg-teal-50 text-teal-800'
                    : 'border-border bg-white text-ink hover:border-teal/40'
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
                    ? 'border-teal bg-teal-50 text-teal-800 font-semibold'
                    : 'border-border bg-white text-ink hover:border-teal/40'
                }`}
              >
                <input
                  type="checkbox"
                  value={interest}
                  checked={about.interests.includes(interest)}
                  onChange={() => toggleInterest(interest)}
                  className="sr-only"
                />
                {about.interests.includes(interest) && <Check size={14} className="mr-1.5 text-teal" />}
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
                    ? 'border-teal bg-teal-50 text-teal-800 font-semibold'
                    : 'border-border bg-white text-ink hover:border-teal/40'
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
                  about.batch === opt.id ? 'border-teal' : 'border-gray-300'
                }`}>
                  {about.batch === opt.id && <span className="w-2 h-2 rounded-full bg-teal" />}
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

  function renderSyllabusSuccess() {
    return (
      <div className="flex flex-col items-center text-center space-y-5 py-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-16 h-16 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center"
        >
          <Download size={32} className="text-teal" />
        </motion.div>

        <div>
          <h3 className="font-heading text-2xl font-bold text-ink">
            Syllabus Downloaded!
          </h3>
          <p className="mt-2 text-text-muted text-sm max-w-sm">
            We&apos;ve triggered your direct download of the 6-week curriculum. A copy has also been sent to{' '}
            <span className="font-medium text-ink">{contact.email}</span>.
          </p>
        </div>

        <div className="w-full bg-surface border border-border rounded-[14px] p-4 text-left space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal">What&apos;s inside</p>
          <ul className="text-xs text-text-muted space-y-1.5">
            <li className="flex items-center gap-2">
              <Check size={14} className="text-teal" /> 6 practical modules with weekly deliverables
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} className="text-teal" /> Real automation tools: Make, n8n, Claude, Canva
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} className="text-teal" /> 4 portfolio capstone projects
            </li>
          </ul>
        </div>

        <button
          onClick={handleClose}
          className="w-full min-h-[44px] px-4 py-2.5 bg-amber text-ink font-bold rounded-[14px] hover:bg-amber-dark transition-colors shadow-sm"
        >
          Done
        </button>
      </div>
    )
  }

  function renderStep3() {
    const whatsappInvite = import.meta.env.VITE_WHATSAPP_INVITE_URL as string | undefined

    const gcalTitle = encodeURIComponent('Free AI Demo Class — Practo for Animals')
    const gcalDetails = encodeURIComponent(
      'Live demo class covering practical AI workflows. Date placeholder: [DEMO DATE]. Check your email for joining instructions.'
    )
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gcalTitle}&details=${gcalDetails}`

    return (
      <div className="flex flex-col items-center text-center space-y-6 py-4">
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-16 h-16 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center"
        >
          <Check size={32} className="text-teal" />
        </motion.div>

        <div>
          <h3 className="font-heading text-2xl font-bold text-ink">
            You&apos;re on the list!
          </h3>
          <p className="mt-2 text-text-muted text-sm max-w-sm">
            We&apos;ve saved your spot. Watch for an email from us with batch details and prep materials.
          </p>
        </div>

        <div className="w-full space-y-3">
          {/* WhatsApp community invite button */}
          {whatsappInvite ? (
            <a
              href={whatsappInvite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-2.5 bg-emerald-600 text-white font-semibold rounded-[12px] hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <MessageCircle size={18} />
              Join WhatsApp Community
            </a>
          ) : (
            <div className="text-center">
              <button
                disabled
                className="flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-2.5 bg-gray-200 text-gray-500 font-semibold rounded-[12px] cursor-not-allowed opacity-75"
              >
                <MessageCircle size={18} />
                Join WhatsApp Group
              </button>
              <p className="text-xs text-text-muted mt-1">
                Invite link shared after enrolment opens
              </p>
            </div>
          )}

          {/* Add to Google Calendar button */}
          <a
            href={gcalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-2.5 border border-border text-ink font-semibold rounded-[12px] hover:bg-surface transition-colors"
          >
            <Calendar size={18} className="text-teal" />
            Add to Google Calendar
          </a>

          {/* Download ICS file button */}
          <button
            type="button"
            onClick={downloadIcs}
            className="flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-2.5 border border-dashed border-border text-text-muted font-medium rounded-[12px] hover:bg-surface hover:text-ink transition-colors text-xs"
          >
            <FileText size={16} />
            Download .ics Calendar File
          </button>
        </div>

        <button
          onClick={handleClose}
          className="text-xs text-text-muted hover:text-ink font-medium"
        >
          Close
        </button>
      </div>
    )
  }

  /* ---- Main Render ---- */

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={isSyllabus ? 'Download Course Syllabus' : 'Reserve your seat'}
        >
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={handleClose} />

          {/* Modal Card */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-white rounded-[20px] shadow-2xl border border-border p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-text-muted hover:text-ink rounded-full hover:bg-surface min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Header / Step indicator */}
            {((isSyllabus && step === 1) || (!isSyllabus && step < 3)) && (
              <>
                <div className="text-center mb-6">
                  <h2 className="font-heading text-2xl font-bold text-ink">
                    {isSyllabus
                      ? 'Download Full Syllabus'
                      : step === 1
                        ? 'Reserve Your Seat'
                        : 'Almost Done!'}
                  </h2>
                  <p className="mt-1 text-sm text-text-muted">
                    {isSyllabus
                      ? 'Get instant access to the complete 6-week module breakdown.'
                      : step === 1
                        ? 'Takes 30 seconds. No payment required today.'
                        : 'Tell us a bit about your background so we can tailor the cohort.'}
                  </p>
                </div>
                {renderStepIndicator()}
              </>
            )}

            {/* Step content */}
            {step === 1 && renderStep1()}
            {!isSyllabus && step === 2 && renderStep2()}
            {!isSyllabus && step === 3 && renderStep3()}
            {isSyllabus && step === 2 && renderSyllabusSuccess()}

            {/* Footer Buttons */}
            {step === 1 && (
              <div className="mt-8">
                {isSyllabus ? (
                  <button
                    onClick={() => {
                      if (validateStep1()) handleSubmit()
                    }}
                    className="flex items-center justify-center gap-2 w-full min-h-[44px] px-6 py-3 bg-amber text-ink font-bold rounded-[14px] hover:bg-amber-dark transition-colors shadow-sm"
                  >
                    <Download size={18} />
                    Download Syllabus (PDF)
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (validateStep1()) setStep(2)
                    }}
                    className="flex items-center justify-center gap-2 w-full min-h-[44px] px-6 py-3 bg-teal text-white font-semibold rounded-[14px] hover:bg-teal-dark transition-colors shadow-sm"
                  >
                    Next
                    <ArrowRight size={18} />
                  </button>
                )}
              </div>
            )}

            {!isSyllabus && step === 2 && (
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center gap-2 px-5 py-3 border border-border text-ink font-medium rounded-[14px] hover:bg-surface min-h-[44px] transition-colors"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 bg-amber text-ink font-bold rounded-[14px] hover:bg-amber-dark transition-colors shadow-sm"
                >
                  Complete Reservation
                  <Check size={18} />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
