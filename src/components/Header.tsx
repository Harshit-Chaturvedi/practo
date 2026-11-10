import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, MapPin, ChevronDown } from 'lucide-react'
import { Button } from './ui/Button'
import { Container } from './ui/Container'

const navLinks = [
  { label: 'Find Care', href: '/' },
  { label: 'Services', href: '/#services' },
  { label: 'AI Course', href: '/learn' },
  { label: 'Carousel', href: '/carousel' },
  { label: 'Workflow', href: '/workflow' },
]

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata']

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState('Mumbai')
  const location = useLocation()

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
            {/* City selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCityOpen(!cityOpen)}
                className="flex items-center gap-1 text-xs sm:text-sm font-heading font-semibold text-text-muted hover:text-ink px-2 sm:px-3 py-2 rounded-[12px] border border-border bg-white hover:bg-surface transition-colors min-h-[44px]"
                aria-label={`City: ${selectedCity}`}
                aria-expanded={cityOpen}
              >
                <MapPin size={14} className="text-teal shrink-0" />
                <span className="truncate max-w-[65px] sm:max-w-none">{selectedCity}</span>
                <ChevronDown size={13} className="text-text-muted shrink-0" />
              </button>
              {cityOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setCityOpen(false)} />
                  <div
                    className="absolute right-0 top-full mt-1.5 bg-white border border-border rounded-[14px] shadow-lg py-1.5 z-50 min-w-[170px]"
                    role="listbox"
                  >
                    {cities.map((city) => (
                      <button
                        key={city}
                        role="option"
                        aria-selected={city === selectedCity}
                        onClick={() => {
                          setSelectedCity(city)
                          setCityOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-medium hover:bg-surface transition-colors min-h-[40px] ${
                          city === selectedCity
                            ? 'text-teal font-semibold bg-teal-50'
                            : 'text-ink'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* List Your Business CTA */}
            <Link to="/#list-business" className="hidden sm:inline-block">
              <Button variant="secondary" size="sm">
                List Business
              </Button>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-text-muted hover:text-ink min-h-[44px] min-w-[44px] flex items-center justify-center rounded-[12px] hover:bg-surface"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <nav className="lg:hidden border-t border-border bg-white px-4 py-4 shadow-md" aria-label="Mobile navigation">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-[12px] text-sm font-heading font-semibold transition-colors min-h-[44px] ${
                  location.pathname === link.href
                    ? 'bg-teal-50 text-teal-800'
                    : 'text-text-muted hover:text-ink hover:bg-surface'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                to="/#list-business"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full"
              >
                <Button variant="secondary" size="md" className="w-full">
                  List Your Business — Free
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
