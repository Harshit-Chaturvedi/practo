import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, MapPin, ChevronDown, Check } from 'lucide-react'
import { Container } from './ui/Container'

const navLinks = [
  { label: 'Find Care', href: '/' },
  { label: 'Services', href: '/#services' },
  { label: 'AI Course', href: '/learn' },
  { label: 'Carousel', href: '/carousel' },
  { label: 'Workflow', href: '/workflow' },
]

const cities = [
  { name: 'Mumbai', available: true, label: 'Active Pilot' },
  { name: 'Delhi', available: false, label: 'Coming soon' },
  { name: 'Bangalore', available: false, label: 'Coming soon' },
  { name: 'Chennai', available: false, label: 'Coming soon' },
  { name: 'Hyderabad', available: false, label: 'Coming soon' },
  { name: 'Pune', available: false, label: 'Coming soon' },
  { name: 'Kolkata', available: false, label: 'Coming soon' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const location = useLocation()

  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLElement>(null)
  const cityButtonRef = useRef<HTMLButtonElement>(null)

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false)
    hamburgerRef.current?.focus()
  }, [])

  const closeCityMenu = useCallback(() => {
    setCityOpen(false)
    cityButtonRef.current?.focus()
  }, [])

  /* Keyboard listener: Escape key closes menus and restores focus */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mobileMenuOpen) {
          e.preventDefault()
          closeMobileMenu()
        } else if (cityOpen) {
          e.preventDefault()
          closeCityMenu()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen, cityOpen, closeMobileMenu, closeCityMenu])

  /* Focus management for mobile drawer */
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      // Move focus into first focusable element inside the drawer
      const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusable && focusable.length > 0) {
        focusable[0]?.focus()
      }
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  /* Trap Tab focus inside mobile drawer while open */
  const handleDrawerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !drawerRef.current) return
    const focusable = Array.from(
      drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last?.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first?.focus()
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border shadow-xs">
      <Container>
        <div className="flex items-center justify-between h-18">
          {/* Logo Lockup: Paw + Cross Mark + Typography */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink min-w-0 group" aria-label="Practo for Animals Home">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[12px] bg-teal text-white flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {/* Paw prints + Veterinary Medical Cross combo */}
                <path d="M12 5v14M5 12h14" strokeWidth="2.5" />
                <circle cx="6" cy="6" r="1.5" fill="currentColor" />
                <circle cx="18" cy="6" r="1.5" fill="currentColor" />
                <circle cx="6" cy="18" r="1.5" fill="currentColor" />
                <circle cx="18" cy="18" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-heading font-extrabold text-base sm:text-lg text-ink tracking-tight leading-none truncate">
                Practo <span className="text-teal font-semibold text-xs sm:text-sm">for Animals</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-bold tracking-wider text-text-muted mt-0.5">
                Care Discovery &amp; Learning
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3.5 py-2 rounded-[12px] text-sm font-heading font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-teal-50 text-teal-800'
                      : 'text-text-muted hover:text-ink hover:bg-surface'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right side CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Honest City selector (Mumbai pilot only) */}
            <div className="relative">
              <button
                ref={cityButtonRef}
                type="button"
                onClick={() => setCityOpen(!cityOpen)}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-heading font-semibold text-text-muted hover:text-ink px-2.5 sm:px-3 py-2 rounded-[12px] border border-border bg-white hover:bg-surface transition-colors min-h-[44px]"
                aria-label="Current pilot city: Mumbai"
                aria-expanded={cityOpen}
                aria-haspopup="listbox"
              >
                <MapPin size={14} className="text-teal shrink-0" />
                <span>Mumbai</span>
                <span className="hidden sm:inline-block text-[10px] uppercase tracking-wide bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded font-bold">
                  Pilot
                </span>
                <ChevronDown size={13} className="text-text-muted shrink-0" />
              </button>

              {cityOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-ink/10"
                    onClick={closeCityMenu}
                    aria-hidden="true"
                  />
                  <div
                    className="absolute right-0 top-full mt-1.5 bg-white border border-border rounded-[14px] shadow-xl py-2 z-50 min-w-[220px]"
                    role="listbox"
                    aria-label="Select city"
                  >
                    <div className="px-3.5 py-1.5 border-b border-border mb-1 text-[11px] text-text-muted leading-tight">
                      <p className="font-semibold text-ink">Pilot Coverage</p>
                      <p className="mt-0.5 text-[10px]">Active network limited to Mumbai region.</p>
                    </div>

                    {cities.map((city) =>
                      city.available ? (
                        <div
                          key={city.name}
                          role="option"
                          aria-selected="true"
                          className="flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-teal-800 bg-teal-50/70"
                        >
                          <span className="flex items-center gap-1.5">
                            <Check size={14} className="text-teal" />
                            {city.name}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal bg-teal-100/60 px-1.5 py-0.5 rounded">
                            {city.label}
                          </span>
                        </div>
                      ) : (
                        <div
                          key={city.name}
                          role="option"
                          aria-selected="false"
                          aria-disabled="true"
                          className="flex items-center justify-between px-3.5 py-2 text-xs text-text-muted/60 cursor-not-allowed select-none"
                        >
                          <span>{city.name}</span>
                          <span className="text-[10px] uppercase tracking-wider bg-surface px-1.5 py-0.5 rounded text-text-muted/70">
                            {city.label}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </>
              )}
            </div>

            {/* List Your Business CTA (Single clean anchor element, no nested buttons) */}
            <Link
              to="/#list-business"
              className="hidden sm:inline-flex items-center justify-center font-heading font-semibold rounded-[12px] bg-teal text-white hover:bg-teal-dark px-3.5 py-2 text-xs shadow-xs min-h-[38px] transition-colors"
            >
              List Business
            </Link>

            {/* Mobile menu button */}
            <button
              ref={hamburgerRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-text-muted hover:text-ink min-h-[44px] min-w-[44px] flex items-center justify-center rounded-[12px] hover:bg-surface cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile navigation drawer with backdrop & focus management */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-18 z-40 bg-ink/40 backdrop-blur-xs lg:hidden"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          <nav
            id="mobile-nav-drawer"
            ref={drawerRef}
            onKeyDown={handleDrawerKeyDown}
            className="relative z-50 lg:hidden border-t border-border bg-white px-4 py-4 shadow-xl"
            aria-label="Mobile navigation"
          >
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-[12px] text-sm font-heading font-semibold transition-colors min-h-[44px] ${
                      isActive
                        ? 'bg-teal-50 text-teal-800'
                        : 'text-text-muted hover:text-ink hover:bg-surface'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}

              {/* Single clean Link element for List Business */}
              <div className="pt-2">
                <Link
                  to="/#list-business"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex w-full items-center justify-center font-heading font-semibold rounded-[12px] bg-teal text-white hover:bg-teal-dark px-5 py-3 text-sm shadow-sm min-h-[44px] transition-colors"
                >
                  List Your Business — Free
                </Link>
              </div>
            </div>
          </nav>
        </>
      )}
    </header>
  )
}
