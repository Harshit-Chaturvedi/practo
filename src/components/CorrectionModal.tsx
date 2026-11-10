import { useState, useEffect, useRef, useCallback } from 'react'
import { X, CheckCircle2 } from 'lucide-react'
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
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  const resetForm = useCallback(() => {
    setYourName('')
    setYourEmail('')
    setCorrection('')
    setSubmitted(false)
  }, [])

  const handleClose = useCallback(() => {
    resetForm()
    onClose()
  }, [resetForm, onClose])

  useEffect(() => {
    if (isOpen) {
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
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius-button)] text-gray-500 transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-teal"
                aria-label="Close correction modal"
              >
                <X size={20} />
              </button>
            </div>

            {submitted ? (
              <motion.div
                className="flex flex-col items-center gap-3 py-8 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <CheckCircle2 className="text-teal" size={48} />
                <p className="font-heading text-lg font-semibold text-ink">
                  Thank you for your feedback!
                </p>
                <p className="text-sm text-gray-500">
                  Your correction has been submitted. We will review it shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Provider name (readonly) */}
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
                    required
                    value={yourName}
                    onChange={(e) => setYourName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-gray-400 transition-colors focus:border-teal focus:ring-1 focus:ring-teal focus-visible:outline-none"
                  />
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
                    required
                    value={yourEmail}
                    onChange={(e) => setYourEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-gray-400 transition-colors focus:border-teal focus:ring-1 focus:ring-teal focus-visible:outline-none"
                  />
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
                    required
                    rows={4}
                    value={correction}
                    onChange={(e) => setCorrection(e.target.value)}
                    placeholder="Describe the incorrect information and what it should be..."
                    className="w-full resize-y rounded-[var(--radius-input)] border border-border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-gray-400 transition-colors focus:border-teal focus:ring-1 focus:ring-teal focus-visible:outline-none"
                  />
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
