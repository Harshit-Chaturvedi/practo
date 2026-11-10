import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, MapPin, ChevronDown } from 'lucide-react'

const navLinks = [
  { label: 'Find Care', href: '/' },
  { label: 'Explore Services', href: '/#services' },
  { label: 'For Businesses', href: '/#list-business' },
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-teal rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5M8 14v.5M16 14v.5M11.25 16.25h1.5L12 17l-.75-.75z" />
              </svg>
            </div>
            <span className="font-heading font-bold text-lg text-ink hidden sm:block">Practo for Animals</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 rounded-[var(--radius-button)] text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? 'bg-surface text-teal'
                    : 'text-gray-600 hover:text-ink hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* City selector */}
            <div className="relative">
              <button
                onClick={() => setCityOpen(!cityOpen)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-ink px-2 py-2 rounded-[var(--radius-button)] hover:bg-gray-100 transition-colors min-h-[44px]"
                aria-label="Select city"
                aria-expanded={cityOpen}
              >
                <MapPin size={16} className="text-teal" />
                <span className="hidden sm:inline">{selectedCity}</span>
                <ChevronDown size={14} />
              </button>
              {cityOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setCityOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-white border border-border rounded-[var(--radius-card)] shadow-lg py-1 z-50 min-w-[160px]" role="listbox">
                    {cities.map((city) => (
                      <button
                        key={city}
                        role="option"
                        aria-selected={city === selectedCity}
                        onClick={() => { setSelectedCity(city); setCityOpen(false) }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-surface transition-colors min-h-[44px] ${
                          city === selectedCity ? 'text-teal font-medium bg-surface' : 'text-ink'
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
            <Link
              to="/#list-business"
              className="hidden sm:inline-flex items-center px-4 py-2.5 bg-teal text-white text-sm font-semibold rounded-[var(--radius-button)] hover:bg-teal-dark transition-colors min-h-[44px]"
            >
              List Your Business
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-ink min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-border bg-white" aria-label="Mobile navigation">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-[var(--radius-button)] text-sm font-medium transition-colors min-h-[44px] ${
                  location.pathname === link.href
                    ? 'bg-surface text-teal'
                    : 'text-gray-600 hover:text-ink hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/#list-business"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 bg-teal text-white text-sm font-semibold rounded-[var(--radius-button)] text-center min-h-[44px] mt-2"
            >
              List Your Business
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
