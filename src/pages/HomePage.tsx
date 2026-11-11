import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  Search,
  Stethoscope,
  Building2,
  Home,
  Microscope,
  Siren,
  Heart,
  SlidersHorizontal,
  X,
  ChevronDown,
  List,
  Map as MapIcon,
  Star,
  ShieldCheck,
  IndianRupee,
  Users,
  SearchX,
  Sparkles,
  Info,
} from 'lucide-react'
import { providers, animalTypes, languageOptions } from '@/data/providers'
import type { Provider } from '@/data/providers'
import ProviderCard from '@/components/ProviderCard'
import InteractiveMap from '@/components/InteractiveMap'
import SEO from '@/components/SEO'
import { Container, Button, SectionHeader, ToggleSwitch } from '@/components/ui'

// ---------------------------------------------------------------------------
// Types & Constants
// ---------------------------------------------------------------------------

type ProviderType = Provider['type']
type SortOption = 'nearest' | 'rating' | 'name'
type ViewMode = 'list' | 'map'
type PriceBand = 'budget' | 'mid' | 'premium'

interface CategoryTile {
  id: ProviderType
  label: string
  description: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

const CATEGORY_TILES: CategoryTile[] = [
  { id: 'clinic', label: 'Clinics', description: 'Consultations & checkups', icon: Stethoscope },
  { id: 'hospital', label: 'Hospitals', description: '24/7 ICU & surgery', icon: Building2 },
  { id: 'boarding', label: 'Boarding', description: 'Overnight & daycare', icon: Home },
  { id: 'diagnostics', label: 'Diagnostics', description: 'X-Ray, blood tests & scans', icon: Microscope },
  { id: 'ambulance', label: 'Ambulances', description: 'Emergency transport', icon: Siren },
  { id: 'ngo', label: 'NGOs & Shelters', description: 'Rescue & adoptions', icon: Heart },
]

const NEED_OPTIONS = [
  'Consultation',
  'Vaccination',
  'Surgery',
  'Emergency',
  'Boarding',
  'Diagnostics',
  'Adoption',
]

const ANIMAL_DROPDOWN_OPTIONS = [
  'Dogs',
  'Cats',
  'Birds',
  'Rabbits',
  'Reptiles',
  'Exotic animals',
  'Large animals',
]

const HOW_STEPS = [
  {
    number: 1,
    title: 'Search Needs & Location',
    description: 'Filter verified veterinary clinics, emergency hospitals, or boarding by your pet and neighborhood.',
    icon: Search,
  },
  {
    number: 2,
    title: 'Compare Clear Pricing',
    description: 'Review transparent consultation fees, verified hours, spoken languages, and treatment capabilities.',
    icon: SlidersHorizontal,
  },
  {
    number: 3,
    title: 'Book or Call Instantly',
    description: 'Reserve prototype appointment slots, get one-tap directions, or reach out to emergency helplines.',
    icon: Stethoscope,
  },
]

const TRUST_ITEMS = [
  { label: 'Verified clinical listings', icon: ShieldCheck, detail: 'Manual review cycle' },
  { label: 'Transparent fee bands', icon: IndianRupee, detail: 'No hidden charges' },
  { label: 'Zero fabricated reviews', icon: Star, detail: 'Authentic records only' },
  { label: 'Community-led data', icon: Users, detail: 'Crowdsourced corrections' },
]

// ---------------------------------------------------------------------------
// Custom Select Component
// ---------------------------------------------------------------------------

interface SelectFieldProps {
  label: string
  value: string
  options: string[]
  onChange: (val: string) => void
  icon?: React.ReactNode
  ariaLabel: string
}

function SelectField({
  label,
  value,
  options,
  onChange,
  icon,
  ariaLabel,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div ref={ref} className="relative flex-1 min-w-[140px]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-[44px] w-full items-center gap-2 rounded-[12px] border border-border bg-white px-3.5 py-2.5 text-left text-sm transition-colors hover:border-teal focus-visible:outline-teal"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {icon}
        <span className={value ? 'text-ink font-medium' : 'text-text-muted'}>
          {value || label}
        </span>
        <ChevronDown
          size={16}
          className={`ml-auto text-text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={ariaLabel}
            className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-[12px] border border-border bg-white py-1 shadow-md"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <li
              role="option"
              aria-selected={!value}
              className="min-h-[40px] cursor-pointer px-3.5 py-2 text-sm text-text-muted hover:bg-surface"
              onClick={() => {
                onChange('')
                setOpen(false)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onChange('')
                  setOpen(false)
                }
              }}
              tabIndex={0}
            >
              All {label}s
            </li>
            {options.map((opt) => (
              <li
                key={opt}
                role="option"
                aria-selected={value === opt}
                className={`min-h-[40px] cursor-pointer px-3.5 py-2 text-sm transition-colors hover:bg-surface ${
                  value === opt ? 'bg-teal-50 font-semibold text-teal-800' : 'text-ink'
                }`}
                onClick={() => {
                  onChange(opt)
                  setOpen(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onChange(opt)
                    setOpen(false)
                  }
                }}
                tabIndex={0}
              >
                {opt}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// HomePage Component
// ---------------------------------------------------------------------------

export default function HomePage() {
  // Hero search state
  const [locationQuery, setLocationQuery] = useState('')
  const [animalDropdown, setAnimalDropdown] = useState('')
  const [needDropdown, setNeedDropdown] = useState('')

  // Category tile state
  const [activeCategory, setActiveCategory] = useState<ProviderType | null>(null)

  // Filter state
  const [filterAnimals, setFilterAnimals] = useState<string[]>([])
  const [filterServices, setFilterServices] = useState<string[]>([])
  const [openNow, setOpenNow] = useState(false)
  const [is24x7, setIs24x7] = useState(false)
  const [hasEmergency, setHasEmergency] = useState(false)
  const [hasHomeVisit, setHasHomeVisit] = useState(false)
  const [maxDistance, setMaxDistance] = useState(10)
  const [minRating, setMinRating] = useState(0)
  const [priceBand, setPriceBand] = useState<PriceBand | null>(null)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [filterLanguages, setFilterLanguages] = useState<string[]>([])

  // Call Toast notification state (Single live region - replaces previous instead of stacking)
  const [activeCallToast, setActiveCallToast] = useState<{ id: string; name: string; phone: string } | null>(null)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleCallClick = useCallback((provider: Provider) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current)
    }
    setActiveCallToast({ id: provider.id, name: provider.name, phone: provider.phoneDisplay })
    toastTimerRef.current = setTimeout(() => {
      setActiveCallToast(null)
    }, 3500)
  }, [])

  // View state
  const [sortBy, setSortBy] = useState<SortOption>('nearest')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [selectedMapProviderId, setSelectedMapProviderId] = useState<string | null>(null)

  const resultsRef = useRef<HTMLElement>(null)

  // Close mobile filter sheet on escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileFiltersOpen(false)
    }
    if (mobileFiltersOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEscape)
    }
  }, [mobileFiltersOpen])

  // Emergency chip handler
  const handleEmergencyClick = useCallback(() => {
    setActiveCategory('ambulance')
    setHasEmergency(true)
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Hero search handler
  const handleSearch = useCallback(() => {
    if (animalDropdown) {
      setFilterAnimals([animalDropdown])
    }
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [animalDropdown])

  // Category tile click
  const handleCategoryClick = useCallback(
    (id: ProviderType) => {
      setActiveCategory((prev) => (prev === id ? null : id))
    },
    []
  )

  // Checkbox toggle helper
  function toggleCheckbox(
    value: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    setter(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
    )
  }

  function clearAllFilters() {
    setFilterAnimals([])
    setFilterServices([])
    setOpenNow(false)
    setIs24x7(false)
    setHasEmergency(false)
    setHasHomeVisit(false)
    setMaxDistance(10)
    setMinRating(0)
    setPriceBand(null)
    setVerifiedOnly(false)
    setFilterLanguages([])
    setActiveCategory(null)
    setAnimalDropdown('')
    setNeedDropdown('')
    setLocationQuery('')
  }

  // Unique service names from data
  const allServiceNames = useMemo(() => {
    const set = new Set<string>()
    providers.forEach((p) => p.services.forEach((s) => set.add(s)))
    return Array.from(set).sort()
  }, [])

  // ----------- Filtering & Sorting -----------
  const filteredProviders = useMemo(() => {
    let result = [...providers]

    if (activeCategory) {
      result = result.filter((p) => p.type === activeCategory)
    }

    if (filterAnimals.length > 0) {
      result = result.filter((p) =>
        filterAnimals.some((a) => p.animals.includes(a))
      )
    }

    if (filterServices.length > 0) {
      result = result.filter((p) =>
        filterServices.some((s) => p.services.includes(s))
      )
    }

    if (needDropdown) {
      const need = needDropdown.toLowerCase()
      result = result.filter(
        (p) =>
          p.services.some((s) => s.toLowerCase().includes(need)) ||
          (need === 'emergency' && p.hasEmergency) ||
          (need === 'boarding' && p.type === 'boarding') ||
          (need === 'diagnostics' && p.type === 'diagnostics') ||
          (need === 'adoption' &&
            p.services.some((s) => s.toLowerCase().includes('adoption')))
      )
    }

    if (openNow) result = result.filter((p) => p.isOpen)
    if (is24x7) result = result.filter((p) => p.is24x7)
    if (hasEmergency) result = result.filter((p) => p.hasEmergency)
    if (hasHomeVisit) result = result.filter((p) => p.hasHomeVisit)
    if (verifiedOnly) result = result.filter((p) => p.verified)

    if (maxDistance < 10) {
      result = result.filter((p) => p.distanceKm <= maxDistance)
    }

    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating)
    }

    if (priceBand) {
      result = result.filter((p) => {
        const fee = p.feeRange.toLowerCase()
        if (priceBand === 'budget')
          return fee.includes('free') || (fee.startsWith('₹') && !fee.includes('5,000') && !fee.includes('10,000') && !fee.includes('8,000') && !fee.includes('4,000'))
        if (priceBand === 'premium')
          return fee.includes('5,000') || fee.includes('10,000') || fee.includes('8,000') || fee.includes('4,000')
        return true
      })
    }

    if (filterLanguages.length > 0) {
      result = result.filter((p) =>
        filterLanguages.some((l) => p.languages.includes(l))
      )
    }

    switch (sortBy) {
      case 'nearest':
        result.sort((a, b) => a.distanceKm - b.distanceKm)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return result
  }, [
    activeCategory,
    filterAnimals,
    filterServices,
    needDropdown,
    openNow,
    is24x7,
    hasEmergency,
    hasHomeVisit,
    verifiedOnly,
    maxDistance,
    minRating,
    priceBand,
    filterLanguages,
    sortBy,
  ])

  // ---------------------------------------------------------------------------
  // Filter Panel Content
  // ---------------------------------------------------------------------------
  function renderFilterPanel() {
    return (
      <div className="flex flex-col gap-6">
        {/* Animal type checkboxes */}
        <fieldset>
          <legend className="mb-2 font-heading text-xs uppercase tracking-wider font-bold text-ink">
            Animal Type
          </legend>
          <div className="flex flex-col gap-1.5">
            {animalTypes.map((animal) => (
              <label
                key={animal}
                className="flex min-h-[36px] cursor-pointer items-center gap-2.5 text-sm text-ink hover:text-teal transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filterAnimals.includes(animal)}
                  onChange={() =>
                    toggleCheckbox(animal, filterAnimals, setFilterAnimals)
                  }
                  className="h-4 w-4 rounded border-border text-teal accent-teal focus-visible:outline-teal"
                />
                <span>{animal}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Service type checkboxes */}
        <fieldset>
          <legend className="mb-2 font-heading text-xs uppercase tracking-wider font-bold text-ink">
            Service Specialities
          </legend>
          <div className="flex max-h-48 flex-col gap-1.5 overflow-y-auto pr-1">
            {allServiceNames.map((service) => (
              <label
                key={service}
                className="flex min-h-[36px] cursor-pointer items-center gap-2.5 text-sm text-ink hover:text-teal transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filterServices.includes(service)}
                  onChange={() =>
                    toggleCheckbox(service, filterServices, setFilterServices)
                  }
                  className="h-4 w-4 rounded border-border text-teal accent-teal focus-visible:outline-teal"
                />
                <span>{service}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Toggles */}
        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <ToggleSwitch
            checked={openNow}
            onChange={setOpenNow}
            label="Open Now"
          />
          <ToggleSwitch checked={is24x7} onChange={setIs24x7} label="24×7 Operations" />
          <ToggleSwitch
            checked={hasEmergency}
            onChange={setHasEmergency}
            label="Emergency Ready"
          />
          <ToggleSwitch
            checked={hasHomeVisit}
            onChange={setHasHomeVisit}
            label="Home Visit Available"
          />
          <ToggleSwitch
            checked={verifiedOnly}
            onChange={setVerifiedOnly}
            label="Verified Listings Only"
          />
        </div>

        {/* Distance slider */}
        <div className="border-t border-border pt-4">
          <label
            htmlFor="distance-slider"
            className="mb-2 block font-heading text-xs uppercase tracking-wider font-bold text-ink"
          >
            Max Distance: <span className="text-teal font-extrabold">{maxDistance} km</span>
          </label>
          <input
            id="distance-slider"
            type="range"
            min={0}
            max={10}
            step={0.5}
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="w-full accent-teal cursor-pointer"
          />
          <div className="flex justify-between text-xs text-text-muted mt-1 font-medium">
            <span>0 km</span>
            <span>10 km</span>
          </div>
        </div>

        {/* Rating buttons */}
        <div className="border-t border-border pt-4">
          <span className="mb-2 block font-heading text-xs uppercase tracking-wider font-bold text-ink">
            Minimum Rating
          </span>
          <div className="flex gap-1.5">
            {[0, 3, 3.5, 4, 4.5].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setMinRating(r)}
                className={`min-h-[38px] flex-1 rounded-[10px] border text-xs font-heading font-semibold transition-colors focus-visible:outline-teal ${
                  minRating === r
                    ? 'border-teal bg-teal text-white shadow-xs'
                    : 'border-border bg-white text-ink hover:bg-surface'
                }`}
                aria-label={r === 0 ? 'Any rating' : `Minimum ${r} stars`}
              >
                {r === 0 ? 'Any' : `${r}★`}
              </button>
            ))}
          </div>
        </div>

        {/* Price Band */}
        <div className="border-t border-border pt-4">
          <span className="mb-2 block font-heading text-xs uppercase tracking-wider font-bold text-ink">
            Fee Tier
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {(
              [
                { id: null as PriceBand | null, label: 'All Tiers' },
                { id: 'budget' as PriceBand, label: 'Budget' },
                { id: 'mid' as PriceBand, label: 'Standard' },
                { id: 'premium' as PriceBand, label: 'Specialist' },
              ] as const
            ).map((band) => (
              <button
                key={band.label}
                type="button"
                onClick={() => setPriceBand(band.id)}
                className={`min-h-[38px] rounded-[10px] border px-2 py-1 text-xs font-heading font-semibold transition-colors focus-visible:outline-teal ${
                  priceBand === band.id
                    ? 'border-teal bg-teal text-white shadow-xs'
                    : 'border-border bg-white text-ink hover:bg-surface'
                }`}
              >
                {band.label}
              </button>
            ))}
          </div>
        </div>

        {/* Languages */}
        <fieldset className="border-t border-border pt-4">
          <legend className="mb-2 font-heading text-xs uppercase tracking-wider font-bold text-ink">
            Spoken Languages
          </legend>
          <div className="flex flex-col gap-1.5">
            {languageOptions.map((lang) => (
              <label
                key={lang}
                className="flex min-h-[36px] cursor-pointer items-center gap-2.5 text-sm text-ink hover:text-teal transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filterLanguages.includes(lang)}
                  onChange={() =>
                    toggleCheckbox(lang, filterLanguages, setFilterLanguages)
                  }
                  className="h-4 w-4 rounded border-border text-teal accent-teal focus-visible:outline-teal"
                />
                <span>{lang}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="Practo for Animals — Trusted Veterinary Care & Emergency Directory in Mumbai"
        description="Find verified animal clinics, 24/7 ICU hospitals, ambulances, and rescue NGOs across Mumbai with verified doctor hours and fees."
      />
      {/* ================================================================ */}
      {/* 1. HERO SECTION (Split Layout)                                   */}
      {/* ================================================================ */}
      <section className="bg-surface border-b border-border py-14 sm:py-20" aria-label="Hero">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Search & Mission (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-heading font-bold uppercase tracking-wider">
                <Sparkles size={14} className="text-teal" />
                Verified Animal Healthcare Directory
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight leading-[1.12]">
                Find trusted animal care near you
              </h1>

              <p className="text-text-muted text-base sm:text-lg max-w-xl leading-relaxed">
                Connect with verified clinics, 24/7 emergency veterinary hospitals, boarding sanctuaries, diagnostics, and animal welfare shelters across Mumbai.
              </p>

              {/* 3-Field Search Card */}
              <div className="rounded-[20px] border border-border bg-white p-4 sm:p-5 shadow-md space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Location input */}
                  <div className="relative">
                    <MapPin
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-teal"
                    />
                    <input
                      type="text"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      placeholder="Neighborhood or pin"
                      aria-label="Search by location"
                      className="min-h-[44px] w-full rounded-[12px] border border-border bg-white py-2.5 pl-10 pr-3.5 text-sm text-ink placeholder:text-text-muted/60 transition-colors focus:border-teal focus:ring-2 focus:ring-teal/20 focus-visible:outline-none"
                    />
                  </div>

                  {/* Animal dropdown */}
                  <SelectField
                    label="Animal Type"
                    value={animalDropdown}
                    options={ANIMAL_DROPDOWN_OPTIONS}
                    onChange={setAnimalDropdown}
                    ariaLabel="Select animal type"
                  />

                  {/* Need dropdown */}
                  <SelectField
                    label="Care Need"
                    value={needDropdown}
                    options={NEED_OPTIONS}
                    onChange={setNeedDropdown}
                    ariaLabel="Select what you need"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-border/60">
                  {/* Emergency chip */}
                  <button
                    type="button"
                    onClick={handleEmergencyClick}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[12px] bg-red-emergency px-4 py-2.5 text-xs sm:text-sm font-heading font-bold text-white shadow-xs hover:bg-red-700 transition-colors focus-visible:outline-red-emergency"
                    aria-label="Emergency — Find Ambulance"
                  >
                    <Siren size={17} />
                    Emergency / Find Ambulance
                  </button>

                  {/* Primary Find Vet CTA */}
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleSearch}
                    leftIcon={<Search size={18} />}
                  >
                    Find a Vet
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column: Purposeful Healthtech Illustration (5 cols) */}
            <div className="lg:col-span-5 hidden lg:flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-[24px] bg-gradient-to-br from-white to-teal-50 border border-border p-8 shadow-lg flex flex-col justify-between overflow-hidden">
                {/* Background decorative rings */}
                <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-teal-100/50 -z-0" />
                <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-amber-100/40 -z-0" />

                <div className="relative z-10 space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-teal-800 text-xs font-heading font-bold shadow-xs border border-border">
                    <ShieldCheck size={14} className="text-teal" />
                    Transparent Standards
                  </span>
                  <h3 className="font-heading text-xl font-bold text-ink">
                    Clinical integrity meets modern discovery
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Designed for anxious pet parents needing immediate clarity: zero fabricated reviews, real verified fee bands, and live operational hours.
                  </p>
                </div>

                {/* SVG Illustration: Medical cross + heart + pet paw */}
                <div className="relative z-10 py-6 flex items-center justify-center">
                  <svg width="180" height="140" viewBox="0 0 180 140" fill="none" className="drop-shadow-md">
                    {/* Stethoscope arc */}
                    <path
                      d="M30 30 C30 90, 80 110, 90 110 C100 110, 150 90, 150 30"
                      stroke="#0F766E"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    <circle cx="30" cy="30" r="8" fill="#14B8A6" />
                    <circle cx="150" cy="30" r="8" fill="#14B8A6" />
                    {/* Center shield badge */}
                    <rect x="65" y="45" width="50" height="55" rx="10" fill="#FFFFFF" stroke="#E3E0D8" strokeWidth="2" />
                    {/* Heart & cross inside */}
                    <path d="M90 60 v25 M77.5 72.5 h25" stroke="#0F766E" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="90" cy="118" r="10" fill="#F59E0B" />
                  </svg>
                </div>

                <div className="relative z-10 grid grid-cols-2 gap-2 text-[11px] font-heading font-semibold text-ink border-t border-border/80 pt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>13 Verified Providers</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Real-time Mumbai Map</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ================================================================ */}
      {/* 2. CATEGORY TILES                                                */}
      {/* ================================================================ */}
      <section id="services" className="py-16 sm:py-20" aria-label="Browse by category">
        <Container>
          <SectionHeader
            eyebrow="Specialised Care"
            title="Browse by Care Category"
            description="Explore dedicated veterinary infrastructure mapped by emergency readiness, in-patient facilities, and diagnostic gear."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {CATEGORY_TILES.map((tile) => {
              const Icon = tile.icon
              const isActive = activeCategory === tile.id
              return (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => handleCategoryClick(tile.id)}
                  className={`group flex min-h-[120px] flex-col items-center justify-center p-4 rounded-[16px] border text-center transition-all duration-200 focus-visible:outline-teal ${
                    isActive
                      ? 'border-teal bg-teal text-white shadow-md'
                      : 'border-border bg-white text-ink hover:border-teal/50 hover:shadow-sm'
                  }`}
                  aria-pressed={isActive}
                >
                  <div
                    className={`w-12 h-12 rounded-[12px] flex items-center justify-center mb-2.5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-surface text-teal'
                    }`}
                  >
                    <Icon size={24} />
                  </div>
                  <span className="font-heading font-bold text-sm leading-snug">
                    {tile.label}
                  </span>
                  <span
                    className={`text-[11px] mt-1 line-clamp-2 leading-tight ${
                      isActive ? 'text-teal-100' : 'text-text-muted'
                    }`}
                  >
                    {tile.description}
                  </span>
                </button>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ================================================================ */}
      {/* 3. RESULTS SECTION                                               */}
      {/* ================================================================ */}
      <section ref={resultsRef} className="pb-20 sm:pb-28" aria-label="Search results">
        <Container>
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Desktop Filter Sidebar (w-72) */}
            <aside className="hidden lg:block w-72 shrink-0" aria-label="Filters">
              <div className="sticky top-24 rounded-[16px] border border-border bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-1.5 font-heading text-sm font-bold text-ink">
                    <SlidersHorizontal size={16} className="text-teal" />
                    <span>Refine Results</span>
                  </div>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-xs font-semibold text-teal hover:underline"
                  >
                    Reset all
                  </button>
                </div>
                {renderFilterPanel()}
              </div>
            </aside>

            {/* Mobile Filter Button */}
            <div className="flex items-center gap-3 lg:hidden w-full justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileFiltersOpen(true)}
                leftIcon={<SlidersHorizontal size={16} />}
              >
                Filters &amp; Refine ({filteredProviders.length})
              </Button>
            </div>

            {/* Mobile Bottom Sheet */}
            <AnimatePresence>
              {mobileFiltersOpen && (
                <div
                  className="fixed inset-0 z-50 flex flex-col justify-end bg-ink/50 backdrop-blur-sm lg:hidden"
                  onClick={(e) => {
                    if (e.target === e.currentTarget) setMobileFiltersOpen(false)
                  }}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Filter listings"
                >
                  <motion.div
                    className="max-h-[85vh] overflow-y-auto rounded-t-[20px] bg-white p-5 shadow-xl"
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                      <h3 className="font-heading text-base font-bold text-ink">
                        Refine Providers
                      </h3>
                      <button
                        type="button"
                        onClick={() => setMobileFiltersOpen(false)}
                        className="p-2 text-text-muted hover:text-ink"
                        aria-label="Close filters"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    {renderFilterPanel()}
                    <div className="mt-6 flex gap-3 border-t border-border pt-4">
                      <Button
                        variant="outline"
                        size="md"
                        onClick={clearAllFilters}
                        className="flex-1"
                      >
                        Clear
                      </Button>
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => setMobileFiltersOpen(false)}
                        className="flex-1"
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Main Results Area */}
            <div className="flex-1 w-full">
              {/* Header: Result count + Sort + View toggle */}
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 bg-white border border-border rounded-[14px] px-4 py-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <p className="text-sm text-text-muted">
                    <strong className="font-heading font-bold text-ink">
                      {filteredProviders.length}
                    </strong>{' '}
                    {filteredProviders.length === 1 ? 'provider' : 'providers'} found
                  </p>
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-heading font-bold text-amber-900 border border-amber-200">
                    Demo Pilot
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Sort dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="min-h-[40px] rounded-[10px] border border-border bg-white px-3 py-1.5 text-xs sm:text-sm font-heading font-semibold text-ink focus:border-teal focus:ring-1 focus:ring-teal focus-visible:outline-none"
                    aria-label="Sort results"
                  >
                    <option value="nearest">Nearest First</option>
                    <option value="rating">Highest Rated</option>
                    <option value="name">Alphabetical</option>
                  </select>

                  {/* List / Map View Toggle */}
                  <div className="flex overflow-hidden rounded-[10px] border border-border">
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      className={`flex min-h-[40px] min-w-[40px] items-center justify-center px-3 transition-colors focus-visible:outline-teal ${
                        viewMode === 'list'
                          ? 'bg-teal text-white'
                          : 'bg-white text-ink hover:bg-surface'
                      }`}
                      aria-label="List view"
                      aria-pressed={viewMode === 'list'}
                    >
                      <List size={17} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('map')}
                      className={`flex min-h-[40px] min-w-[40px] items-center justify-center px-3 transition-colors focus-visible:outline-teal ${
                        viewMode === 'map'
                          ? 'bg-teal text-white'
                          : 'bg-white text-ink hover:bg-surface'
                      }`}
                      aria-label="Map view"
                      aria-pressed={viewMode === 'map'}
                    >
                      <MapIcon size={17} />
                    </button>
                  </div>
                </div>
              </div>

              {/* View Output */}
              {viewMode === 'map' ? (
                <div className="space-y-6">
                  <InteractiveMap
                    providers={filteredProviders}
                    selectedProviderId={selectedMapProviderId}
                    onSelectProvider={(id) => setSelectedMapProviderId(id)}
                  />
                  {filteredProviders.length === 0 ? (
                    <div className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-[16px] border border-border bg-white p-6 text-center">
                      <SearchX size={32} className="text-gray-300" />
                      <p className="font-heading text-sm font-bold text-ink">
                        No pins match current filters
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h4 className="font-heading text-sm font-bold text-ink uppercase tracking-wider text-text-muted">
                        Matched Providers on Map ({filteredProviders.length})
                      </h4>
                      {filteredProviders.map((provider, i) => (
                        <ProviderCard
                          key={provider.id}
                          provider={provider}
                          index={i}
                          isSelected={selectedMapProviderId === provider.id}
                          onSelect={() => setSelectedMapProviderId(provider.id)}
                          onCallClick={handleCallClick}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : filteredProviders.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-[16px] border border-border bg-white p-8 text-center shadow-xs">
                  <SearchX size={44} className="text-gray-300" />
                  <h3 className="font-heading text-lg font-bold text-ink">
                    No matching providers found
                  </h3>
                  <p className="max-w-xs text-sm text-text-muted">
                    Try clearing specialities, extending distance, or clearing animal filters.
                  </p>
                  <Button variant="secondary" size="sm" onClick={clearAllFilters} className="mt-2">
                    Reset All Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProviders.map((provider, i) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      index={i}
                      onCallClick={handleCallClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ================================================================ */}
      {/* 4. HOW IT WORKS (Alternating Background: White)                 */}
      {/* ================================================================ */}
      <section className="bg-white border-y border-border py-20 sm:py-24" aria-label="How it works">
        <Container>
          <SectionHeader
            eyebrow="Simple Workflow"
            title="How Practo for Animals Works"
            description="Built to eliminate guesswork during emergency triage or routine wellness visits."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_STEPS.map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.number}
                  className="flex flex-col items-center text-center p-6 rounded-[16px] bg-surface border border-border/80"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-teal text-white font-heading font-extrabold text-base mb-4 shadow-xs">
                    {step.number}
                  </div>
                  <Icon size={24} className="text-teal mb-3" />
                  <h3 className="font-heading text-lg font-bold text-ink mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ================================================================ */}
      {/* 5. TRUST STRIP (Surface Mint)                                    */}
      {/* ================================================================ */}
      <section className="bg-surface py-14 sm:py-16" aria-label="Trust indicators">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.label}
                  className="flex flex-col items-center text-center p-4 rounded-[14px] bg-white border border-border/80 shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-[10px] bg-teal-50 text-teal flex items-center justify-center mb-2.5">
                    <Icon size={22} />
                  </div>
                  <span className="font-heading font-bold text-sm text-ink leading-tight">
                    {item.label}
                  </span>
                  <span className="text-[11px] text-text-muted mt-0.5">
                    {item.detail}
                  </span>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ================================================================ */}
      {/* 6. LIST YOUR BUSINESS CTA (Dark Teal Band)                       */}
      {/* ================================================================ */}
      <section
        id="list-business"
        className="bg-teal-dark border-t border-teal-900 py-18 sm:py-24 text-white scroll-mt-20"
        aria-label="List your business"
      >
        <Container size="narrow">
          <div className="text-center space-y-6">
            <span className="inline-block px-3 py-1 rounded-full bg-teal-900 text-teal-200 text-xs font-heading font-bold uppercase tracking-wider border border-teal-700">
              Provider Partnership
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Are you a licensed veterinary clinic, shelter, or ambulance operator?
            </h2>
            <p className="text-teal-100/90 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Join our verified directory. Connect with pet owners across your city who are looking for trusted treatments, 24/7 emergency care, and diagnostic appointments.
            </p>
            <div className="pt-2">
              <Button variant="primary" size="lg">
                List Your Clinic — Free Pilot Enrolment
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Global Call Notification Live Region — Replaces instead of stacking */}
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-6 right-6 z-50 pointer-events-none max-w-sm"
      >
        <AnimatePresence>
          {activeCallToast && (
            <motion.div
              key={`${activeCallToast.id}-${activeCallToast.phone}`}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto flex items-center justify-between gap-3 rounded-[14px] bg-ink px-4 py-3 text-xs text-white shadow-xl border border-teal-700"
            >
              <div className="flex items-center gap-2">
                <Info size={16} className="shrink-0 text-amber" />
                <span>
                  <strong>{activeCallToast.phone}:</strong> Demo listing — calling is disabled in this prototype.
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
                  setActiveCallToast(null)
                }}
                className="text-text-muted hover:text-white p-1 shrink-0 transition-colors"
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
