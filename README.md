# Practo for Animals — Product Development, Design & AI Systems Intern Assignment

> **Live Demo:** [VERCEL URL]  
> **Production Routes:**  
> - **`/`** — Practo for Animals MVP (Care Discovery, 3-Field Search, Map & Booking Flow)  
> - **`/learn`** — Applied AI Course Landing Page (Curriculum, Lead Capture & Syllabus Download)  
> - **`/carousel`** — AI Social Content Engine (Interactive 1080×1350 Preview, PNG & PDF Exports)  
> - **`/workflow`** — Content & Data Automation Systems Architecture (Make/n8n Pipelines & Lead CRM)  

An animal-care discovery platform and AI education ecosystem prototype built with **Vite, React 19, TypeScript, Tailwind CSS, React Router, and Framer Motion**.

---

## Quick Start

### Prerequisites
- Node.js 18+ (tested on Node v20/v22)
- npm 9+

### Installation & Development
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production (TypeScript check + Vite bundle)
npm run build

# 4. Preview production build
npm run preview

# 5. Run linter
npm run lint
```

The application will be live at `http://localhost:5173`.

---

## Routes & Feature Breakdown

### 1. `/` — Practo for Animals MVP (Discovery & Search Flow)
- **Sticky Navigation**: Brand mark, "Explore Services" shortcut, "For Businesses" link, quick city selector (Mumbai, Delhi, Bangalore, etc.), and prominent "List Your Business" CTA. Responsive breakpoint configured at `lg` to prevent tablet horizontal overflow.
- **Hero Section**:
  - Clear value proposition: *"Find trusted animal care near you"*.
  - 3-field search bar: Location input, animal type selector (Dogs, Cats, Birds, etc.), and care need dropdown.
  - High-intent primary CTA *"Find a Vet"* alongside a prominent red *"Emergency / Find Ambulance"* quick-action chip.
- **6 Category Tiles**: Clinics, Hospitals, Boarding, Diagnostics, Ambulances, and NGOs & Shelters with interactive active states that filter results instantly.
- **Results & Multi-faceted Filtering**:
  - Filter panel (desktop sidebar, converted to an animated bottom sheet on mobile screens < 1024px).
  - Filters: Animal types, service specialities, Open Now / 24x7 toggles, Emergency care, Home visits, distance slider (0–10 km), minimum star rating, price bands (Budget / Mid / Premium), Verified-only badge toggle, and spoken languages.
  - **Interactive Prototype Map**: Scaled SVG pin map plotted from geographic coordinates across Mumbai (Arabian Sea shoreline, arterial expressways, and neighborhood labels). Pins are color-coded by provider category and clickable to highlight the matching provider card.
  - 13 fictional providers across all 6 service categories with realistic operational details, transparent fee bands, last-verified dates, direct Directions links, an accessible **Booking Modal** (with slot selection saving to `localStorage['practo_booking_requests']`), a simulated Call notification toast for demo clarity, and a functional "Submit a correction" modal.
- **Trust Strip & How It Works**: 3-step care discovery flow, verified listing commitments, transparent pricing, and zero fake review guarantee.
- **Supply-Side CTA Band**: High-conversion banner targeting vets and shelter operators.

### 2. `/learn` — AI Education Landing Page
- **Outcome-Led Hero**: Value proposition tailored for non-technical learners seeking to dramatically speed up daily workflows using practical AI.
- **CTAs**: *"Reserve Your Seat"* (triggers full 3-step cohort onboarding modal) and *"Download Syllabus"* (triggers streamlined name+email lead capture that downloads `/syllabus.pdf`).
- **Target Audience**: Dedicated audience segmentation cards for Students, Working Professionals, Freelancers, and Small Business Owners.
- **6 Practical Modules**: AI Tools & Prompting, Workflow Automation (Make & n8n), AI Website Construction, High-Velocity Content Creation, Non-Technical Data Analytics, and End-to-End Capstone Project.
- **Curriculum Timeline**: 6-week vertical progression highlighting milestones.
- **Ethical Content Standards**: Explicitly labelled placeholder for mentor profile and authentic learner feedback (no fabricated testimonials).
- **Pricing & Cohort Options**: Transparent cards with `[PRICE]` and `[START DATE]` placeholders.
- **Accessible FAQ Accordion**: Fully keyboard accessible with animated expansion states.
- **Sticky Mobile CTA Bar**: Unobtrusive sticky footer button on mobile viewports with adequate page padding preventing content overlap.
- **Dual-Intent Lead-Capture Modal**:
  - **For Syllabus Downloads**: Step 1 captures Full Name and Email, directly triggers a download of `/syllabus.pdf`, and confirms submission.
  - **For Seat Reservation**: Step 1 collects contact info, Step 2 collects role/interests/batch, and Step 3 provides active calendar triggers (Google Calendar template URL and client-side downloadable `.ics` file) alongside WhatsApp group community invite handling via `VITE_WHATSAPP_INVITE_URL`.
  - **Client-Side Persistence & Resilient Webhook**: Submissions are guaranteed to be saved first to `localStorage['practo_leads']`. Lead form posts to a Google Apps Script web app that appends rows to a Google Sheet (`VITE_LEAD_WEBHOOK_URL`, dispatched asynchronously as a JSON string with `Content-Type: text/plain;charset=utf-8` to avoid CORS preflight delays, a 5-second timeout, and one automated retry). Failures are handled completely silently so the user experience is never blocked.
  - **Serverless Ingestion**: The Google Apps Script receiver lives in [`google-apps-script/Code.gs`](google-apps-script/Code.gs), with setup details in [`docs/LEAD_WEBHOOK_SETUP.md`](docs/LEAD_WEBHOOK_SETUP.md).

#### Webhook Payload Specification
Every submission sent to `VITE_LEAD_WEBHOOK_URL` delivers a clean JSON payload matching this schema:

| Field | Type | Description / Sample |
|---|---|---|
| `timestamp` | `string` | ISO 8601 formatted timestamp (`"2026-11-10T22:30:00.000Z"`) |
| `name` | `string` | Learner full name (`"Priya Sharma"`) |
| `whatsapp` | `string` | Contact phone number (`"9820012345"`, empty for syllabus-only) |
| `email` | `string` | Verified email address (`"priya@example.com"`) |
| `role` | `string` | Self-reported background (`"Working Professional"`, `"Student"`, etc.) |
| `interests` | `string` | Comma-separated list (`"AI Tools & Prompting, Workflow Automation"`) |
| `batch` | `string` | Cohort preference (`"weekend-morning"`, `"weekday-evening"`) |
| `intent` | `string` | User intent flag (`"seat"` or `"syllabus"`) |
| `utm_source` | `string` | URL query attribution (`"linkedin"`, `"newsletter"`, etc.) |
| `utm_medium` | `string` | Marketing medium (`"social"`, `"cpc"`, `"email"`) |
| `utm_campaign` | `string` | Marketing campaign tag (`"launch_batch_1"`) |
| `page` | `string` | Current route path (`"/learn"`) |
| `website_url` | `string` | Hidden honeypot field (empty for humans; non-empty drops request) |

### 3. `/carousel` — AI-Generated Sample Carousel
- **Data-Driven Architecture**: Structured in `/src/data/carousel.json` with 7 slides (Hook + 5 Content Slides + CTA) formatted for standard 1080×1350px (4:5 portrait aspect ratio).
- **Topic**: *"5 Signs Your Dog Needs a Vet Today"*.
- **Medical Integrity**: Includes mandatory veterinary consultation disclaimer; unverified health claims are parsed and displayed with styled amber `Source Needed` badges (`bg-amber-100 text-amber-900 border-amber-300`).
- **Export Capabilities**:
  - Individual slide PNG export (`slide-1.png` to `slide-7.png`) rendered at full 1080×1350 resolution.
  - Multi-page compressed PDF compilation (`practo-carousel.pdf`, ~0.63 MB) using JPEG compression (quality 0.9) to ensure fast email and mobile downloads.

### 4. `/workflow` — Content Automation Pipeline & Strategy Write-Up
- **Interactive 10-Node Flow Diagram**: Visual left-to-right flow (responsive vertical stacking on mobile) mapping Idea Capture (Tally/Airtable) → Make/n8n trigger → Claude AI structuring → Copy constraints → Brand styling → Template autofill → Team approval → Asset export → Buffer/Metricool scheduling → Central content calendar logging.
- **Tools Analysis**: In-depth comparison matrix covering Make, n8n, Claude, ChatGPT, Canva, Figma, Buffer, Metricool, Tally, and Airtable with clear trade-offs.
- **CTA Strategy Blueprint**: Page-by-page mapping of primary/secondary triggers and business goals.
- **Lead Capture Automation Architecture**: Detailed 6-step flow showing webhook ingestion, CRM synchronization, WhatsApp welcome messaging, email confirmations, and automated countdown reminders.
- **"What I'd Build Next"**: Strategic 6-item product roadmap (Provider Dashboard, Direct Booking Engine, Verified Review Verification, AI Symptom Triage, React Native App, and Geospatial Analytics).

---

## Unified Design System & Token Architecture

The entire platform has been refreshed into ONE cohesive, clinical-but-warm healthtech aesthetic spanning all four routes (`/`, `/learn`, `/carousel`, `/workflow`). The previous separate indigo accent on `/learn` was deprecated to ensure the educational ecosystem and discovery app share identical brand tokens, differing only by layout structure and imagery.

| Design Token | Value / Scale | Strategic Rationale |
|---|---|---|
| **Primary Teal** | `#0F766E` (Teal 600) | Grounded, trustworthy healthcare anchor with a full 50–900 scale (`#0B4F4A` Teal 900 for hero banners, footers, and headings) |
| **Primary Accent Amber** | `#F59E0B` (Amber 500) | Warm golden amber used **strictly** for primary conversion CTAs and high-intent actions |
| **Emergency Red** | `#DC2626` (Red 600) | High-contrast alert red reserved exclusively for emergency triage, ambulance calls, and acute warning chips |
| **Primary Ink** | `#1F2A2E` | Deep warm slate-ink delivering WCAG AAA contrast ratio (13.8:1) over cream surfaces |
| **Muted Text** | `#4B5563` (Gray 600) | High-legibility neutral text meeting strict WCAG AA contrast (≥ 4.5:1) on all background surfaces |
| **Background Cream** | `#FBF8F3` | Warm, calming surface reducing clinical anxiety for pet owners |
| **Surface Mint** | `#EEF5F3` | Subtle cool-tinted surface for secondary cards, inputs, and category containers |
| **Divider Border** | `#E3E0D8` | Soft organic divider tone avoiding sterile stark borders |
| **Typography** | Manrope + Inter | **Manrope (700/800)** for authoritative yet welcoming headlines; **Inter** for clinical body legibility with `font-display: swap` |
| **8pt Spacing Grid** | 8px / 16px / 24px / 32px | Standard 8pt spacing system with container max-width `1200px` (24px desktop gutters, 16px mobile gutters) |
| **Curvature & Radii** | `12px` (inputs/buttons), `16px` (cards), `24px` (heroes) | Soft, organic radii maintaining professional precision without generic AI template feels |
| **Elevation & Motion** | Soft teal-tinted shadows | Subtle multi-level elevation (`shadow-xs`, `shadow-sm`, `shadow-md`) with 150–250ms ease-out transitions respecting `prefers-reduced-motion` |

### Shared UI Component Suite (`src/components/ui/`)
All four pages build upon a unified component library:
- **`Button`**: Primary (amber), Secondary (teal), Outline, Ghost, Danger variants with loading indicators, icon slots, and guaranteed 44px min touch height.
- **`Card`**: White, Surface, and Cream variants with optional hover borders and interactive selection states.
- **`Badge`**: Teal, Amber, Neutral, Red, and Green status chips with semantic borders.
- **`Container`**: Fluid responsive wrappers (`narrow` 896px, `default` 1200px, `wide` 1400px) with standardized gutters.
- **`SectionHeader`**: Coordinated eyebrow, title, and description lockups supporting light and dark surfaces.
- **`ModalShell`**: Reusable modal foundation powering Booking, Lead Capture, and Correction forms with keyboard focus trapping, `Escape` key dismissal, and backdrop scroll locks.
- **`Accordion` & `ToggleSwitch`**: Keyboard-navigable accessible disclosure widgets.

### Accessibility & Interaction Highlights
- **Touch Targets**: All interactive elements (buttons, inputs, category tiles, close buttons) have a minimum touch footprint of 44×44px.
- **Contrast Ratios**: Body text and metadata use `#6B7280` (`text-gray-500`) or darker, ensuring WCAG AA compliance (≥ 4.5:1).
- **Reduced Motion Support**: Smooth scrolling behavior automatically respects `prefers-reduced-motion`.
- **Modal Accessibility**: Modals implement keyboard focus trapping, `Escape` key listeners, background scroll locking, and ARIA dialog semantics.

---

## Deployment Instructions

### Deploy to Vercel
```bash
# Using Vercel CLI
npx vercel --prod
```

### Deploy to Netlify
```bash
# Using Netlify CLI
npx netlify deploy --prod --dir=dist
```
A `_redirects` file or standard SPA rewrite (`/* /index.html 200`) ensures client-side routing works on all static hosts.
