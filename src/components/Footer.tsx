import { useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart, Info, ArrowUpRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Container } from './ui/Container'

export default function Footer() {
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const location = useLocation()
  const isLearnPage = location.pathname === '/learn'

  const handlePlaceholderClick = (e: React.MouseEvent, label: string) => {
    e.preventDefault()
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current)
    }
    setToastMessage(`${label} will be live during public release.`)
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  return (
    <footer className={`relative bg-teal-dark text-white border-t border-teal-900 ${isLearnPage ? 'pb-24 md:pb-0' : ''}`}>
      {/* Toast Notification (Single live region — replaces instead of stacking) */}
      <div role="status" aria-live="polite">
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              key={toastMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-[14px] bg-ink px-4 py-3 text-xs font-medium text-white shadow-xl border border-teal-700"
            >
              <Info size={16} className="text-amber" />
              <span>{toastMessage}</span>
              <button
                type="button"
                onClick={() => {
                  if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
                  setToastMessage(null)
                }}
                className="ml-2 hover:text-white/70"
                aria-label="Dismiss message"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Container>
        <div className="py-16 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
            {/* Column 1: Brand & Mission (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-teal text-white flex items-center justify-center">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 5v14M5 12h14" strokeWidth="2.5" />
                    <circle cx="6" cy="6" r="1.5" fill="currentColor" />
                    <circle cx="18" cy="6" r="1.5" fill="currentColor" />
                    <circle cx="6" cy="18" r="1.5" fill="currentColor" />
                    <circle cx="18" cy="18" r="1.5" fill="currentColor" />
                  </svg>
                </div>
                <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                  Practo <span className="text-teal-200 font-semibold text-base">for Animals</span>
                </span>
              </div>
              <p className="text-sm text-teal-100/80 leading-relaxed max-w-sm">
                A unified animal healthcare discovery platform and hands-on AI workflow education ecosystem. Connecting pet parents, veterinary clinics, and animal caregivers with transparent listings and modern AI tooling.
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs text-teal-200">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-900/60 border border-teal-700/60">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Mumbai Pilot Online
                </span>
              </div>
            </div>

            {/* Column 2: Platform Links (2 cols) */}
            <div className="md:col-span-2 space-y-3">
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-teal-200">
                Platform
              </h3>
              <ul className="space-y-2 text-sm text-teal-100/90 font-medium">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Find Care
                  </Link>
                </li>
                <li>
                  <Link to="/learn" className="hover:text-white transition-colors">
                    AI Course
                  </Link>
                </li>
                <li>
                  <Link to="/carousel" className="hover:text-white transition-colors">
                    Content Samples
                  </Link>
                </li>
                <li>
                  <Link to="/#list-business" className="hover:text-white transition-colors">
                    List Your Business
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Resources & Tools (2 cols) */}
            <div className="md:col-span-2 space-y-3">
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-teal-200">
                Systems
              </h3>
              <ul className="space-y-2 text-sm text-teal-100/90 font-medium">
                <li>
                  <Link to="/workflow" className="hover:text-white transition-colors">
                    Workflow Pipeline
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={(e) => handlePlaceholderClick(e, 'Blog')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Clinical Blog
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={(e) => handlePlaceholderClick(e, 'Partner portal')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Partner Portal
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={(e) => handlePlaceholderClick(e, 'Careers')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Careers
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Legal & Standards (3 cols) */}
            <div className="md:col-span-3 space-y-3">
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-teal-200">
                Trust &amp; Legal
              </h3>
              <ul className="space-y-2 text-sm text-teal-100/90 font-medium">
                <li>
                  <button
                    type="button"
                    onClick={(e) => handlePlaceholderClick(e, 'Privacy policy')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={(e) => handlePlaceholderClick(e, 'Terms of service')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={(e) => handlePlaceholderClick(e, 'Medical disclaimer')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Medical Disclaimers
                  </button>
                </li>
                <li>
                  <a
                    href="https://github.com/Harshit-Chaturvedi/practo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-white transition-colors text-teal-200"
                  >
                    <span>Source Repository</span>
                    <ArrowUpRight size={13} />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-14 pt-8 border-t border-teal-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-teal-200/80">
            <p>&copy; 2026 Practo for Animals. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              <span>Crafted with</span>
              <Heart size={14} className="text-red-emergency fill-red-emergency" />
              <span>for animal wellbeing and education.</span>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
