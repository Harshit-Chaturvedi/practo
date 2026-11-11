import { useState, useEffect, useRef, useCallback } from 'react'
import { X, CheckCircle2, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CorrectionModalProps {
  providerName: string
  isOpen: boolean
  onClose: () => void
}

export default function CorrectionModal({ providerName, isOpen, onClose }: CorrectionModalProps) {
  const [yourName, setYourName] = useState('')
  const [yourEmail, setYourEmail] = useState('')
  const [correction, setCorrection] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; correction?: string }>({})

  const overlayRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  const resetForm = useCallback(() => {
    setYourName('')
    setYourEmail('')
    setCorrection('')
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

  useEffect(() => {
    if (isOpen) {
      openerRef.current = document.activeElement as HTMLElement
      // Focus first interactive input after open
      const timeout = setTimeout(() => {
        firstInputRef.current?.focus()
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleClose])

  // Focus trap
  useEffect(() => {
    if (!isOpen || !overlayRef.current) return
    const overlay = overlayRef.current
    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      const focusableElements = overlay.querySelectorAll<HTMLElement>(focusableSelector)
      if (focusableElements.length === 0) return
      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [isOpen])

  // Prevent body scroll when modal is open
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
    const errs: { name?: string; email?: string; correction?: string } = {}
    if (!yourName.trim()) {
      errs.name = 'Please enter your name'
    }
    if (!yourEmail.trim() || !/^\S+@\S+\.\S+$/.test(yourEmail.trim())) {
      errs.email = 'Please enter a valid email address'
    }
    if (!correction.trim() || correction.trim().length < 5) {
      errs.correction = 'Please describe what needs correcting (at least 5 characters)'
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setErrors({})
    setSubmitted(true)
    setTimeout(() => {
      handleClose()
    }, 2000)
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) {
      handleClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-label={`Submit a correction for ${providerName}`}
        >
          <motion.div
            className="w-full max-w-md rounded-[var(--radius-modal)] bg-white p-6 shadow-lg sm:p-8"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25 }}
          >
            {/* Header */}
            <div className="mb-5 flex items-start justify-between">
              <h2 className="font-heading text-xl font-semibold text-ink">
                Submit a Correction
              </h2>
              <button
                ref={closeButtonRef}
                onClick={handleClose}
                className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-teal"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            {submitted ? (
              <motion.div
                className="py-8 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface text-teal">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-heading text-lg font-semibold text-ink">
                  Thank You!
                </h3>
                <p className="mt-2 text-sm text-text-muted">
                  Your correction for <span className="font-medium text-ink">{providerName}</span> has been received. Our team will verify and update the listing.
                </p>
              </motion.div>
            ) : (
              <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Provider (read-only) */}
                <div>
                  <label
                    htmlFor="correction-provider"
                    className="mb-1.5 block text-sm font-medium text-ink"
                  >
                    Provider
                  </label>
                  <input
                    id="correction-provider"
                    type="text"
                    value={providerName}
                    readOnly
                    className="w-full rounded-[var(--radius-input)] border border-border bg-gray-100 px-3.5 py-2.5 text-sm text-gray-600"
                  />
                </div>

                {/* Your name */}
                <div>
                  <label
                    htmlFor="correction-name"
                    className="mb-1.5 block text-sm font-medium text-ink"
                  >
                    Your Name
                  </label>
                  <input
                    ref={firstInputRef}
                    id="correction-name"
                    type="text"
                    value={yourName}
                    onChange={(e) => {
                      setYourName(e.target.value)
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
                    }}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'correction-name-error' : undefined}
                    placeholder="Enter your name"
                    className={`w-full rounded-[var(--radius-input)] border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-text-muted/60 transition-colors focus:ring-1 focus-visible:outline-none ${
                      errors.name
                        ? 'border-red-emergency focus:border-red-emergency focus:ring-red-emergency'
                        : 'border-border focus:border-teal focus:ring-teal'
                    }`}
                  />
                  {errors.name && (
                    <p
                      id="correction-name-error"
                      aria-live="polite"
                      className="mt-1 text-xs text-red-emergency font-medium flex items-center gap-1"
                    >
                      <AlertCircle size={13} className="shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Your email */}
                <div>
                  <label
                    htmlFor="correction-email"
                    className="mb-1.5 block text-sm font-medium text-ink"
                  >
                    Your Email
                  </label>
                  <input
                    id="correction-email"
                    type="email"
                    value={yourEmail}
                    onChange={(e) => {
                      setYourEmail(e.target.value)
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                    }}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'correction-email-error' : undefined}
                    placeholder="you@example.com"
                    className={`w-full rounded-[var(--radius-input)] border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-text-muted/60 transition-colors focus:ring-1 focus-visible:outline-none ${
                      errors.email
                        ? 'border-red-emergency focus:border-red-emergency focus:ring-red-emergency'
                        : 'border-border focus:border-teal focus:ring-teal'
                    }`}
                  />
                  {errors.email && (
                    <p
                      id="correction-email-error"
                      aria-live="polite"
                      className="mt-1 text-xs text-red-emergency font-medium flex items-center gap-1"
                    >
                      <AlertCircle size={13} className="shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* What needs correcting */}
                <div>
                  <label
                    htmlFor="correction-text"
                    className="mb-1.5 block text-sm font-medium text-ink"
                  >
                    What needs correcting?
                  </label>
                  <textarea
                    id="correction-text"
                    rows={4}
                    value={correction}
                    onChange={(e) => {
                      setCorrection(e.target.value)
                      if (errors.correction) setErrors((prev) => ({ ...prev, correction: undefined }))
                    }}
                    aria-invalid={Boolean(errors.correction)}
                    aria-describedby={errors.correction ? 'correction-text-error' : undefined}
                    placeholder="Describe the incorrect information and what it should be..."
                    className={`w-full resize-y rounded-[var(--radius-input)] border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-text-muted/60 transition-colors focus:ring-1 focus-visible:outline-none ${
                      errors.correction
                        ? 'border-red-emergency focus:border-red-emergency focus:ring-red-emergency'
                        : 'border-border focus:border-teal focus:ring-teal'
                    }`}
                  />
                  {errors.correction && (
                    <p
                      id="correction-text-error"
                      aria-live="polite"
                      className="mt-1 text-xs text-red-emergency font-medium flex items-center gap-1"
                    >
                      <AlertCircle size={13} className="shrink-0" />
                      <span>{errors.correction}</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="mt-1 min-h-[44px] w-full rounded-[var(--radius-button)] bg-teal px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
                >
                  Submit Correction
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
