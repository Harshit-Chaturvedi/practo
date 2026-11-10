import { useState } from 'react'
import type { Provider } from '@/data/providers'
import { MapPin, Navigation, Calendar } from 'lucide-react'

interface InteractiveMapProps {
  providers: Provider[]
  selectedProviderId: string | null
  onSelectProvider: (id: string) => void
}

const categoryColors: Record<Provider['type'], string> = {
  clinic: '#0F766E', // teal
  hospital: '#3730A3', // indigo
  boarding: '#D97706', // amber
  diagnostics: '#7E22CE', // purple
  ambulance: '#DC2626', // red
  ngo: '#15803D', // green
}

export default function InteractiveMap({
  providers,
  selectedProviderId,
  onSelectProvider,
}: InteractiveMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Bounding box for Mumbai region with generous margins
  // Lat: 19.00 to 19.22 (height = 0.22)
  // Lng: 72.80 to 72.98 (width = 0.18)
  const minLat = 19.00
  const maxLat = 19.22
  const minLng = 72.80
  const maxLng = 72.98

  const svgWidth = 800
  const svgHeight = 520
  const padding = 50

  function project(lat: number, lng: number) {
    // Mercator-like proportional projection
    const x =
      padding +
      ((lng - minLng) / (maxLng - minLng)) * (svgWidth - 2 * padding)
    // Invert Y because latitude goes up north while SVG Y goes down
    const y =
      svgHeight -
      padding -
      ((lat - minLat) / (maxLat - minLat)) * (svgHeight - 2 * padding)
    return { x, y }
  }

  const activeProvider =
    providers.find((p) => p.id === (hoveredId || selectedProviderId)) ||
    (selectedProviderId ? providers.find((p) => p.id === selectedProviderId) : null)

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-border bg-[#F5F8F7] shadow-sm">
      {/* Prototype Map Header / Controls */}
      <div className="flex flex-wrap items-center justify-between border-b border-border bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-2.5 py-1 text-xs font-semibold text-teal">
            <MapPin size={13} />
            Prototype Map (Mumbai Region)
          </span>
          <span className="text-xs text-gray-500 hidden sm:inline">
            Click pins to inspect details &amp; highlight provider
          </span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-medium text-ink">
          {Object.entries(categoryColors).map(([type, color]) => (
            <span key={type} className="inline-flex items-center gap-1">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="capitalize">{type}</span>
            </span>
          ))}
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="h-auto w-full select-none"
          role="img"
          aria-label="Interactive map of animal care providers in Mumbai"
        >
          {/* Subtle grid background */}
          <defs>
            <pattern
              id="map-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="1"
              />
            </pattern>
            {/* Soft shadow for pins */}
            <filter id="pin-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="2"
                floodColor="#1F2A2E"
                floodOpacity="0.25"
              />
            </filter>
          </defs>

          <rect width="100%" height="100%" fill="#F8FAFC" />
          <rect width="100%" height="100%" fill="url(#map-grid)" opacity="0.6" />

          {/* Stylized Mumbai coastline & water bodies */}
          <path
            d="M 60,0 C 70,120 40,240 70,360 C 90,420 50,480 30,520 L 0,520 L 0,0 Z"
            fill="#E0F2FE"
            opacity="0.85"
          />
          <text
            x="35"
            y="260"
            fill="#0284C7"
            fontSize="11"
            fontFamily="Inter, sans-serif"
            fontWeight="600"
            letterSpacing="2"
            transform="rotate(-90 35 260)"
            opacity="0.7"
          >
            ARABIAN SEA
          </text>

          {/* Major arterial roads (Western Express Hwy & Eastern Express Hwy) */}
          <path
            d="M 240,40 Q 220,180 200,340 T 170,500"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="3.5"
            strokeDasharray="6,4"
          />
          <path
            d="M 520,30 Q 480,220 430,360 T 360,510"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="3"
            strokeDasharray="6,4"
          />

          {/* Landmark area labels */}
          <text x="180" y="70" fill="#94A3B8" fontSize="10" fontWeight="600">
            Borivali / Malad
          </text>
          <text x="160" y="190" fill="#94A3B8" fontSize="10" fontWeight="600">
            Andheri / Juhu
          </text>
          <text x="440" y="180" fill="#94A3B8" fontSize="10" fontWeight="600">
            Powai / Thane
          </text>
          <text x="170" y="320" fill="#94A3B8" fontSize="10" fontWeight="600">
            Bandra West
          </text>
          <text x="160" y="470" fill="#94A3B8" fontSize="10" fontWeight="600">
            Worli / South Mumbai
          </text>

          {/* Render Provider Pins */}
          {providers.map((p) => {
            const { x, y } = project(p.lat, p.lng)
            const isSelected = selectedProviderId === p.id
            const isHovered = hoveredId === p.id
            const color = categoryColors[p.type] || '#0F766E'
            const r = isSelected ? 12 : isHovered ? 10 : 8

            return (
              <g
                key={p.id}
                onClick={() => onSelectProvider(p.id)}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="cursor-pointer transition-transform"
                tabIndex={0}
                role="button"
                aria-label={`${p.name} (${p.typeBadge})`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectProvider(p.id)
                  }
                }}
              >
                {/* Highlight halo when selected or hovered */}
                {(isSelected || isHovered) && (
                  <circle
                    cx={x}
                    cy={y}
                    r={r + 8}
                    fill={color}
                    opacity={isSelected ? 0.25 : 0.15}
                    className="animate-pulse"
                  />
                )}

                {/* Base pin */}
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill={color}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  filter="url(#pin-shadow)"
                />

                {/* Center dot */}
                <circle cx={x} cy={y} r={r * 0.35} fill="#FFFFFF" />

                {/* Pin label (visible on selection/hover) */}
                {(isSelected || isHovered) && (
                  <g>
                    <rect
                      x={x - 60}
                      y={y - 32}
                      width="120"
                      height="20"
                      rx="4"
                      fill="#1F2A2E"
                      opacity="0.9"
                    />
                    <text
                      x={x}
                      y={y - 18}
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {p.name.length > 18 ? p.name.slice(0, 16) + '…' : p.name}
                    </text>
                  </g>
                )}
              </g>
            )
          })}
        </svg>

        {/* Selected Provider Card Overlay */}
        {activeProvider && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 rounded-xl border border-border bg-white p-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span
                  className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wider mb-1"
                  style={{
                    backgroundColor:
                      categoryColors[activeProvider.type] || '#0F766E',
                  }}
                >
                  {activeProvider.typeBadge}
                </span>
                <h4 className="font-heading text-sm font-bold text-ink">
                  {activeProvider.name}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">{activeProvider.address}</p>
              </div>
              <button
                type="button"
                onClick={() => setHoveredId(null)}
                className="text-gray-400 hover:text-ink text-xs p-1"
                aria-label="Dismiss details"
              >
                ✕
              </button>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-xs border-t border-border pt-2 text-ink">
              <span>{activeProvider.distance} away</span>
              <span className="font-semibold text-teal">{activeProvider.feeRange}</span>
            </div>

            <div className="mt-3 flex gap-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${activeProvider.lat},${activeProvider.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface transition-colors"
              >
                <Navigation size={12} />
                Directions
              </a>
              <button
                type="button"
                onClick={() => {
                  onSelectProvider(activeProvider.id)
                  const el = document.getElementById(`provider-${activeProvider.id}`)
                  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }}
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-teal px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-dark transition-colors"
              >
                <Calendar size={12} />
                View Card
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
