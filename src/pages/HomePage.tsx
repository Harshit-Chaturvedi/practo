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
  Map,
  Star,
  ShieldCheck,
  IndianRupee,
  Users,
  Ambulance,
  SearchX,
} from 'lucide-react'
import { providers, animalTypes, languageOptions } from '@/data/providers'
import type { Provider } from '@/data/providers'
import ProviderCard from '@/components/ProviderCard'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ProviderType = Provider['type']
type SortOption = 'nearest' | 'rating' | 'name'
type ViewMode = 'list' | 'map'
type PriceBand = 'budget' | 'mid' | 'premium'

interface CategoryTile {
  id: ProviderType
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORY_TILES: CategoryTile[] = [
  { id: 'clinic', label: 'Clinics', icon: Stethoscope },
  { id: 'hospital', label: 'Hospitals', icon: Building2 },
  { id: 'boarding', label: 'Boarding', icon: Home },
  { id: 'diagnostics', label: 'Diagnostics', icon: Microscope },
  { id: 'ambulance', label: 'Ambulances', icon: Siren },
  { id: 'ngo', label: 'NGOs & Shelters', icon: Heart },
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
    title: 'Search',
    description: 'Tell us your location, animal type, and what you need.',
    icon: Search,
  },
  {
    number: 2,
    title: 'Compare',
    description: 'Browse verified providers with transparent details.',
    icon: SlidersHorizontal,
  },
  {
    number: 3,
    title: 'Connect',
    description: 'Call, get directions, or book directly.',
    icon: Ambulance,
  },
]

const TRUST_ITEMS = [
  { label: 'Verified listings', icon: ShieldCheck },
  { label: 'Transparent pricing', icon: IndianRupee },
  { label: 'No fake reviews', icon: Star },
  { label: 'Community-powered', icon: Users },
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
        className="flex min-h-[44px] w-full items-center gap-2 rounded-[var(--radius-input)] border border-border bg-white px-3.5 py-2.5 text-left text-sm transition-colors hover:border-teal focus-visible:outline-2 focus-visible:outline-teal"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {icon}
        <span className={value ? 'text-ink' : 'text-gray-400'}>
          {value || label}
        </span>
        <ChevronDown
          size={16}
          className={`ml-auto text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={ariaLabel}
            className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-[var(--radius-input)] border border-border bg-white py-1 shadow-md"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <li
              role="option"
              aria-selected={!value}
              className="min-h-[44px] cursor-pointer px-3.5 py-2.5 text-sm text-gray-400 hover:bg-surface"
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
              All
            </li>
            {options.map((opt) => (
              <li
                key={opt}
                role="option"
                aria-selected={value === opt}
                className={`min-h-[44px] cursor-pointer px-3.5 py-2.5 text-sm transition-colors hover:bg-surface ${value === opt ? 'bg-surface font-medium text-teal' : 'text-ink'}`}
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
// Toggle Switch
// ---------------------------------------------------------------------------

interface ToggleSwitchProps {
  checked: boolean
  onChange: (val: boolean) => void
  label: string
}

function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">
      <span className="text-ink">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal ${
          checked ? 'bg-teal' : 'bg-gray-300'
        }`}
        onClick={() => onChange(!checked)}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  )
}

// ---------------------------------------------------------------------------
// HomePage
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

  // View state
  const [sortBy, setSortBy] = useState<SortOption>('nearest')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

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
    // Apply hero bar selections to filters
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

    // Category tile
    if (activeCategory) {
      result = result.filter((p) => p.type === activeCategory)
    }

    // Animal filter
    if (filterAnimals.length > 0) {
      result = result.filter((p) =>
        filterAnimals.some((a) => p.animals.includes(a))
      )
    }

    // Service filter
    if (filterServices.length > 0) {
      result = result.filter((p) =>
        filterServices.some((s) => p.services.includes(s))
      )
    }

    // Need dropdown
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

    // Toggles
    if (openNow) result = result.filter((p) => p.isOpen)
    if (is24x7) result = result.filter((p) => p.is24x7)
    if (hasEmergency) result = result.filter((p) => p.hasEmergency)
    if (hasHomeVisit) result = result.filter((p) => p.hasHomeVisit)
    if (verifiedOnly) result = result.filter((p) => p.verified)

    // Distance
    if (maxDistance < 10) {
      result = result.filter((p) => p.distanceKm <= maxDistance)
    }

    // Rating
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating)
    }

    // Price band (heuristic based on fee text)
    if (priceBand) {
      result = result.filter((p) => {
        const fee = p.feeRange.toLowerCase()
        if (priceBand === 'budget')
          return fee.includes('free') || fee.startsWith('₹') && !fee.includes('5,000') && !fee.includes('10,000') && !fee.includes('8,000') && !fee.includes('4,000')
        if (priceBand === 'premium')
          return fee.includes('5,000') || fee.includes('10,000') || fee.includes('8,000') || fee.includes('4,000')
        return true // mid = show all
      })
    }

    // Languages
    if (filterLanguages.length > 0) {
      result = result.filter((p) =>
        filterLanguages.some((l) => p.languages.includes(l))
      )
    }

    // Sort
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
  // Filter Panel Content (shared between desktop sidebar and mobile sheet)
  // ---------------------------------------------------------------------------
  function renderFilterPanel() {
    return (
      <div className="flex flex-col gap-6">
        {/* Animal type checkboxes */}
        <fieldset>
          <legend className="mb-2 font-heading text-sm font-semibold text-ink">
            Animal Type
          </legend>
          <div className="flex flex-col gap-1.5">
            {animalTypes.map((animal) => (
              <label
                key={animal}
                className="flex min-h-[36px] cursor-pointer items-center gap-2 text-sm text-ink"
              >
                <input
                  type="checkbox"
                  checked={filterAnimals.includes(animal)}
                  onChange={() =>
                    toggleCheckbox(animal, filterAnimals, setFilterAnimals)
                  }
                  className="h-4 w-4 rounded border-border text-teal accent-teal"
                />
                {animal}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Service type checkboxes */}
        <fieldset>
          <legend className="mb-2 font-heading text-sm font-semibold text-ink">
            Service Type
          </legend>
          <div className="flex max-h-48 flex-col gap-1.5 overflow-y-auto">
            {allServiceNames.map((service) => (
              <label
                key={service}
                className="flex min-h-[36px] cursor-pointer items-center gap-2 text-sm text-ink"
              >
                <input
                  type="checkbox"
                  checked={filterServices.includes(service)}
                  onChange={() =>
                    toggleCheckbox(service, filterServices, setFilterServices)
                  }
                  className="h-4 w-4 rounded border-border text-teal accent-teal"
                />
                {service}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Toggles */}
        <div className="flex flex-col gap-3">
          <ToggleSwitch
            checked={openNow}
            onChange={setOpenNow}
            label="Open Now"
          />
          <ToggleSwitch checked={is24x7} onChange={setIs24x7} label="24×7" />
          <ToggleSwitch
            checked={hasEmergency}
            onChange={setHasEmergency}
            label="Emergency"
          />
          <ToggleSwitch
            checked={hasHomeVisit}
            onChange={setHasHomeVisit}
            label="Home Visit"
          />
          <ToggleSwitch
            checked={verifiedOnly}
            onChange={setVerifiedOnly}
            label="Verified Only"
          />
        </div>

        {/* Distance slider */}
        <div>
          <label
            htmlFor="distance-slider"
            className="mb-2 block font-heading text-sm font-semibold text-ink"
          >
            Max Distance: {maxDistance} km
          </label>
          <input
            id="distance-slider"
            type="range"
            min={0}
            max={10}
            step={0.5}
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="w-full accent-teal"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0 km</span>
            <span>10 km</span>
          </div>
        </div>

        {/* Rating */}
        <div>
          <label
            htmlFor="rating-slider"
            className="mb-2 block font-heading text-sm font-semibold text-ink"
          >
            Min Rating: {minRating > 0 ? `${minRating}+` : 'Any'}
          </label>
          <div className="flex gap-1">
            {[0, 3, 3.5, 4, 4.5].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setMinRating(r)}
                className={`min-h-[36px] min-w-[44px] rounded-[var(--radius-button)] border px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-teal ${
                  minRating === r
                    ? 'border-teal bg-teal text-white'
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
        <div>
          <span className="mb-2 block font-heading text-sm font-semibold text-ink">
            Price Band
          </span>
          <div className="flex gap-1.5">
            {(
              [
                { id: null as PriceBand | null, label: 'All' },
                { id: 'budget' as PriceBand, label: 'Budget' },
                { id: 'mid' as PriceBand, label: 'Mid' },
                { id: 'premium' as PriceBand, label: 'Premium' },
              ] as const
            ).map((band) => (
              <button
                key={band.label}
                type="button"
                onClick={() => setPriceBand(band.id)}
                className={`min-h-[36px] rounded-[var(--radius-button)] border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-teal ${
                  priceBand === band.id
                    ? 'border-teal bg-teal text-white'
                    : 'border-border bg-white text-ink hover:bg-surface'
                }`}
              >
                {band.label}
              </button>
            ))}
          </div>
        </div>

        {/* Languages */}
        <fieldset>
          <legend className="mb-2 font-heading text-sm font-semibold text-ink">
            Languages
          </legend>
          <div className="flex flex-col gap-1.5">
            {languageOptions.map((lang) => (
              <label
                key={lang}
                className="flex min-h-[36px] cursor-pointer items-center gap-2 text-sm text-ink"
              >
                <input
                  type="checkbox"
                  checked={filterLanguages.includes(lang)}
                  onChange={() =>
                    toggleCheckbox(lang, filterLanguages, setFilterLanguages)
                  }
                  className="h-4 w-4 rounded border-border text-teal accent-teal"
                />
                {lang}
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
      {/* ================================================================ */}
      {/* 1. HERO SECTION                                                  */}
      {/* ================================================================ */}
      <section
        className="bg-surface px-4 pb-14 pt-12 sm:px-6 md:pb-20 md:pt-16"
        aria-label="Hero"
      >
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            className="font-heading text-3xl font-bold leading-tight text-ink sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Find trusted animal care near you
          </motion.h1>
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-base text-gray-500 sm:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Discover verified clinics, hospitals, boarding, diagnostics,
            ambulances, and shelters for your pets and animals.
          </motion.p>

          {/* Search bar */}
          <motion.div
            className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-stretch"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Location input */}
            <div className="relative flex-1 min-w-[160px]">
              <MapPin
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Location"
                aria-label="Search by location"
                className="min-h-[44px] w-full rounded-[var(--radius-input)] border border-border bg-white py-2.5 pl-10 pr-3.5 text-sm text-ink placeholder:text-gray-400 transition-colors focus:border-teal focus:ring-1 focus:ring-teal focus-visible:outline-none"
              />
            </div>

            {/* Animal type dropdown */}
            <SelectField
              label="Animal Type"
              value={animalDropdown}
              options={ANIMAL_DROPDOWN_OPTIONS}
              onChange={setAnimalDropdown}
              ariaLabel="Select animal type"
            />

            {/* Need dropdown */}
            <SelectField
              label="Need"
              value={needDropdown}
              options={NEED_OPTIONS}
              onChange={setNeedDropdown}
              ariaLabel="Select what you need"
            />

            {/* CTA */}
            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-button)] bg-teal px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
              aria-label="Find a Vet"
            >
              <Search size={18} />
              Find a Vet
            </button>
          </motion.div>

          {/* Emergency chip */}
          <motion.div
            className="mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <button
              type="button"
              onClick={handleEmergencyClick}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-[var(--radius-chip)] bg-red-emergency px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-emergency"
              aria-label="Emergency — Find Ambulance"
            >
              <Siren size={18} />
              Emergency / Find Ambulance
            </button>
          </motion.div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 2. CATEGORY TILES                                                */}
      {/* ================================================================ */}
      <section
        id="services"
        className="px-4 py-10 sm:px-6 md:py-14"
        aria-label="Browse by category"
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-center font-heading text-xl font-semibold text-ink sm:text-2xl">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORY_TILES.map((tile) => {
              const Icon = tile.icon
              const isActive = activeCategory === tile.id
              return (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => handleCategoryClick(tile.id)}
                  className={`group flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-[var(--radius-card)] border px-3 py-4 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal ${
                    isActive
                      ? 'border-teal bg-teal text-white shadow-md'
                      : 'border-border bg-surface text-ink hover:border-teal hover:shadow-sm'
                  }`}
                  aria-pressed={isActive}
                  aria-label={`Filter by ${tile.label}`}
                >
                  <Icon
                    size={28}
                    className={
                      isActive
                        ? 'text-white'
                        : 'text-teal group-hover:scale-110 transition-transform'
                    }
                  />
                  {tile.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 3. RESULTS SECTION                                               */}
      {/* ================================================================ */}
      <section
        ref={resultsRef}
        className="px-4 pb-14 sm:px-6"
        aria-label="Search results"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* --- DESKTOP FILTER SIDEBAR --- */}
            <aside
              className="hidden w-72 shrink-0 lg:block"
              aria-label="Filters"
            >
              <div className="sticky top-24 rounded-[var(--radius-card)] border border-border bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-heading text-base font-semibold text-ink">
                    Filters
                  </h3>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="min-h-[36px] text-xs font-medium text-teal underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-teal"
                  >
                    Clear all
                  </button>
                </div>
                {renderFilterPanel()}
              </div>
            </aside>

            {/* --- MOBILE FILTER BUTTON + BOTTOM SHEET --- */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-[var(--radius-button)] border border-border bg-white px-4 py-2.5 text-sm font-medium text-ink shadow-sm transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-teal"
                aria-label="Open filters"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
            </div>

            {/* Mobile bottom sheet */}
            <AnimatePresence>
              {mobileFiltersOpen && (
                <motion.div
                  className="fixed inset-0 z-40 flex flex-col justify-end bg-black/40 lg:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => {
                    if (e.target === e.currentTarget)
                      setMobileFiltersOpen(false)
                  }}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Filters"
                >
                  <motion.div
                    className="max-h-[85vh] overflow-y-auto rounded-t-[var(--radius-modal)] bg-white p-5"
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-heading text-lg font-semibold text-ink">
                        Filters
                      </h3>
                      <button
                        type="button"
                        onClick={() => setMobileFiltersOpen(false)}
                        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius-button)] text-gray-500 hover:bg-surface focus-visible:outline-2 focus-visible:outline-teal"
                        aria-label="Close filters"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    {renderFilterPanel()}
                    <div className="mt-6 flex gap-3">
                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="min-h-[44px] flex-1 rounded-[var(--radius-button)] border border-border bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-teal"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={() => setMobileFiltersOpen(false)}
                        className="min-h-[44px] flex-1 rounded-[var(--radius-button)] bg-teal px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-dark focus-visible:outline-2 focus-visible:outline-teal"
                      >
                        Apply
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* --- RESULTS AREA --- */}
            <div className="flex-1">
              {/* Top bar: count, sort, view toggle */}
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-ink">
                    {filteredProviders.length}
                  </span>{' '}
                  {filteredProviders.length === 1 ? 'result' : 'results'} found
                </p>

                <div className="flex items-center gap-2">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="min-h-[44px] rounded-[var(--radius-input)] border border-border bg-white px-3 py-2 text-sm text-ink focus:border-teal focus:ring-1 focus:ring-teal focus-visible:outline-none"
                    aria-label="Sort results"
                  >
                    <option value="nearest">Nearest</option>
                    <option value="rating">Rating</option>
                    <option value="name">Name</option>
                  </select>

                  {/* View toggle */}
                  <div className="flex overflow-hidden rounded-[var(--radius-button)] border border-border">
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      className={`flex min-h-[44px] min-w-[44px] items-center justify-center px-3 transition-colors focus-visible:outline-2 focus-visible:outline-teal ${
                        viewMode === 'list'
                          ? 'bg-teal text-white'
                          : 'bg-white text-ink hover:bg-surface'
                      }`}
                      aria-label="List view"
                      aria-pressed={viewMode === 'list'}
                    >
                      <List size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('map')}
                      className={`flex min-h-[44px] min-w-[44px] items-center justify-center px-3 transition-colors focus-visible:outline-2 focus-visible:outline-teal ${
                        viewMode === 'map'
                          ? 'bg-teal text-white'
                          : 'bg-white text-ink hover:bg-surface'
                      }`}
                      aria-label="Map view"
                      aria-pressed={viewMode === 'map'}
                    >
                      <Map size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* View content */}
              {viewMode === 'map' ? (
                <div
                  className="flex min-h-[400px] items-center justify-center rounded-[var(--radius-card)] border border-border bg-white shadow-sm"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                  }}
                  role="img"
                  aria-label="Map view placeholder"
                >
                  <div className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] bg-white/90 p-8 text-center shadow-sm">
                    <Map size={40} className="text-teal" />
                    <p className="font-heading text-lg font-semibold text-ink">
                      Map View
                    </p>
                    <p className="max-w-xs text-sm text-gray-500">
                      Integrate with mapping API to show provider locations on
                      an interactive map.
                    </p>
                  </div>
                </div>
              ) : filteredProviders.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] border border-border bg-white p-8 text-center">
                  <SearchX size={40} className="text-gray-300" />
                  <p className="font-heading text-lg font-semibold text-ink">
                    No results found
                  </p>
                  <p className="max-w-xs text-sm text-gray-500">
                    Try adjusting your filters or search criteria to find
                    providers near you.
                  </p>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="mt-2 min-h-[44px] rounded-[var(--radius-button)] border border-teal px-5 py-2.5 text-sm font-medium text-teal transition-colors hover:bg-teal hover:text-white focus-visible:outline-2 focus-visible:outline-teal"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredProviders.map((provider, i) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      index={i}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 4. HOW IT WORKS                                                  */}
      {/* ================================================================ */}
      <section
        className="bg-white px-4 py-14 sm:px-6 md:py-20"
        aria-label="How it works"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-10 font-heading text-2xl font-bold text-ink sm:text-3xl">
            How It Works
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {HOW_STEPS.map((step) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  className="flex flex-col items-center gap-3"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4, delay: step.number * 0.1 }}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal text-white shadow-sm">
                    <span className="font-heading text-lg font-bold">
                      {step.number}
                    </span>
                  </div>
                  <Icon size={28} className="text-teal" />
                  <h3 className="font-heading text-lg font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="max-w-xs text-sm text-gray-500">
                    {step.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 5. TRUST STRIP                                                   */}
      {/* ================================================================ */}
      <section
        className="bg-surface px-4 py-10 sm:px-6"
        aria-label="Trust indicators"
      >
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="flex flex-col items-center gap-2 text-center"
              >
                <Icon size={28} className="text-teal" />
                <span className="text-sm font-medium text-ink">
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      {/* ================================================================ */}
      {/* 6. LIST YOUR BUSINESS CTA                                        */}
      {/* ================================================================ */}
      <section
        id="list-business"
        className="bg-teal px-4 py-14 sm:px-6 md:py-20"
        aria-label="List your business"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            Are you a vet, clinic, or animal service provider?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-teal-light/90">
            Join our growing community of trusted animal-care providers. Reach
            pet parents actively searching for services like yours — completely
            free.
          </p>
          <button
            type="button"
            className="mt-8 inline-flex min-h-[44px] items-center gap-2 rounded-[var(--radius-button)] bg-amber px-8 py-3 text-sm font-bold text-ink shadow-sm transition-colors hover:bg-amber-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
          >
            List Your Business — It&#39;s Free
          </button>
        </div>
      </section>
    </div>
  )
}
