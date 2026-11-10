# Strict Audit Report: Practo for Animals & AI Education Ecosystem

**Candidate Assignment Evaluation:** Product Development, Design & AI Systems Intern  
**Audit Target:** `C:\Users\harsh\Documents\antigravity\Practo`  
**Repository Remote:** `https://github.com/Harshit-Chaturvedi/practo.git` (Commit: `36ab478b854efbc4332ac688893f5d146450ab5a`)  
**Auditor Mode:** Strict Senior Product Designer + Full-Stack Reviewer (Read-Only Verification Pass)  
**Date:** November 10, 2026  

---

## 1. Executive Summary & Weighted Scorecard

| Evaluation Criterion | Weight | Candidate Score | Weighted Score | Performance Summary |
|---|---|---|---|---|
| **UI/UX & Visual Design** | 30% | **76 / 100** | **22.8 / 30.0** | Clean, grounded design system with strong typography and spacing; docked by tablet navigation blowout (horizontal overflow at 768px across all routes), static placeholder map, and low text contrast on subtle sub-elements. |
| **Product Thinking & CTA Strategy** | 20% | **82 / 100** | **16.4 / 20.0** | Distinct primary/secondary CTA hierarchy across discovery and learning; penalized for dead end `href="#"` buttons in the conversion funnel ("Join WhatsApp Group", "Add to Calendar"), inert "Book" buttons, and duplicate syllabus modal trigger. |
| **AI Workflow & Automation** | 25% | **88 / 100** | **22.0 / 25.0** | Realistic 10-node content generation pipeline, well-structured trade-off matrix, resilient dual-write lead capture architecture with robust UTM param extraction and non-blocking webhook fallbacks. |
| **Technical Execution & Tool Choice** | 15% | **92 / 100** | **13.8 / 15.0** | Flawless compile (`tsc -b && vite build` in 695ms, 0 errors), 0 linter warnings (`oxlint`), clean lazy-loaded routing, responsive bottom sheets with keyboard traps and body lock. Huge 30.6MB client-side PDF export is a performance bottleneck. |
| **Initiative & Communication** | 10% | **80 / 100** | **8.0 / 10.0** | Comprehensive README, clean commit structure, and dedicated architectural documentation; penalized for fabricated claim of "approximately 4.5 hours" in cover note and unsupported "10x" marketing copy. |
| **OVERALL COMPOSITE SCORE** | **100%** | — | **83.0 / 100** | **Strong First-Round Contender (Tier 1 Pass)** with specific high-impact tactical fixes required before final client submission. |

---

## 2. Inventory & Build Health Check

### Repository & File Structure
```
Practo/
├── .gitignore
├── .oxlintrc.json
├── COVER_NOTE.md
├── README.md
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── vite.config.ts
├── exports/
│   ├── practo-carousel.pdf (30,623,902 bytes, 7 pages)
│   └── slide-1.png ... slide-7.png (1080x1350px each)
├── public/
│   ├── _redirects
│   ├── favicon.svg
│   └── icons.svg
├── scripts/
│   ├── generate-exports.mjs
│   └── verify-ui.mjs
├── verification_screenshots/ (10 desktop/mobile reference frames)
└── src/
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    ├── components/
    │   ├── CarouselSlide.tsx
    │   ├── CorrectionModal.tsx
    │   ├── Footer.tsx
    │   ├── Header.tsx
    │   ├── Layout.tsx
    │   ├── LeadCaptureModal.tsx
    │   ├── ProviderCard.tsx
    │   └── WorkflowDiagram.tsx
    ├── data/
    │   ├── carousel.json
    │   ├── course.ts
    │   └── providers.ts
    └── pages/
        ├── CarouselPage.tsx
        ├── HomePage.tsx
        ├── LearnPage.tsx
        └── WorkflowPage.tsx
```

### Build & Lint Verification
- **`npm run build` (`tsc -b && vite build`)**: **PASS** (Zero compile errors, built in 695ms).
  - Bundled asset output:
    - `dist/assets/HomePage-288Q5rgt.js`: 41.38 kB (gzip: 11.90 kB)
    - `dist/assets/LearnPage-WXw30L63.js`: 18.06 kB (gzip: 5.67 kB)
    - `dist/assets/CarouselPage-Cl8iPC9Q.js`: **424.31 kB** (gzip: 139.06 kB) — *Bloated due to bundled client rendering canvas engine*.
    - `dist/assets/WorkflowPage-DD5kTng6.js`: 17.51 kB (gzip: 5.10 kB)
    - `dist/assets/index-DQnRDP_4.css`: 35.81 kB (gzip: 7.21 kB)
- **`npm run lint` (`oxlint`)**: **PASS** (0 warnings, 0 errors across all 19 checked source files).

---

## 3. Critical Issues (Must Fix Before Submitting)

1. `[Header / src/components/Header.tsx:37]` **Tablet Viewport Horizontal Overflow (768px Blowout)**
   - **Problem:** The sticky navigation header ruptures horizontally on tablet viewports (768px), causing `document.documentElement.scrollWidth` to stretch to **942px** (174px wider than the screen).
   - **Evidence:** Tested at 768×1024. The navigation links switch from hidden to visible at `md:` (`min-width: 768px`). At exactly 768px, Logo (`203px`) + 6 Nav links (`502px`) + City Selector (`105px`) + "List Your Business" Button (`132px`) = **942px**, exceeding screen width by 22.6%. The rightmost CTA hangs off-screen and forces a horizontal scrollbar across **all 4 routes**.
   - **Suggested Fix:** Change the breakpoint in [Header.tsx](file:///c:/Users/harsh/Documents/antigravity/Practo/src/components/Header.tsx#L37) from `hidden md:flex` to `hidden lg:flex`, and adjust the mobile hamburger toggle from `md:hidden` to `lg:hidden`.

2. `[Lead Capture / src/components/LeadCaptureModal.tsx:404-414]` **Dead-End Secondary CTAs on Step 3 Success State**
   - **Problem:** The final celebration step presents two high-intent action buttons ("Join WhatsApp Group" and "Add to Calendar") that do not function.
   - **Evidence:** Both anchors have `href="#"`. Clicking them navigates to `#` (or scrolls to top) instead of opening a community invite link or downloading an `.ics` / Google Calendar intent URL.
   - **Suggested Fix:** In [LeadCaptureModal.tsx](file:///c:/Users/harsh/Documents/antigravity/Practo/src/components/LeadCaptureModal.tsx#L404-L414), replace `href="#"` with an explicit external placeholder link like `href="https://chat.whatsapp.com/sample-invite"` (`target="_blank"`) or a simulated interactive modal toast; generate a dynamic Google Calendar template link (`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Practo+AI+Cohort...`).

3. `[Exports / exports/practo-carousel.pdf]` **Massive PDF File Bloat (30.6 MB for 7 Slides)**
   - **Problem:** The generated carousel PDF is 30,623,902 bytes (30.6 MB), which will bounce over standard email attachment limits (usually 25 MB) and cause browser lag on mobile downloads.
   - **Evidence:** `html-to-image` renders PNG raster data at uncompressed bit depths which `jspdf` embeds directly without JPEG compression or downsampling.
   - **Suggested Fix:** In [CarouselPage.tsx](file:///c:/Users/harsh/Documents/antigravity/Practo/src/pages/CarouselPage.tsx#L93-L102), configure `toJpeg(node, { quality: 0.88 })` instead of `toPng()`, or compress the images before passing to `pdf.addImage(img, 'JPEG', 0, 0, pdfW, pdfH, undefined, 'FAST')`.

---

## 4. Major Issues

1. `[Home / src/components/ProviderCard.tsx:140-147]` **Inert "Book" Appointment Button**
   - **Problem:** The "Book" CTA on all 13 provider cards has zero event handlers or destination.
   - **Evidence:** `<button type="button" className="...">Book</button>` contains neither an `onClick` callback nor an anchor link. Clicking it yields no feedback, leaving users confused about how booking works.
   - **Suggested Fix:** Either attach an `onClick` opening a lightweight "Booking Modal" (selecting slot/time), or link to `tel:${provider.phone}` / anchor with an explicit notification badge indicating "Direct online booking coming soon".

2. `[Learn / src/pages/LearnPage.tsx:191-197]` **"Download Syllabus" CTA Opens Seat Reservation Form Instead of Delivering Syllabus**
   - **Problem:** Clicking "Download Syllabus" triggers the generic lead capture modal with title "Contact Info", providing no syllabus asset.
   - **Evidence:** `onClick={openModal}` triggers the exact same modal state as "Reserve Your Seat".
   - **Suggested Fix:** Pass an intent prop to `LeadCaptureModal` (`intent="syllabus"`), customize Step 3 to trigger an immediate automated file download (`/downloads/Practo_AI_Syllabus.pdf`), or show an explicit step stating "We've emailed the syllabus to your inbox".

3. `[Home / src/pages/HomePage.tsx:962-984]` **Map View is a Static CSS Placeholder**
   - **Problem:** Toggling from "List" to "Map" view renders an empty box with a grid background and an icon instead of an interactive map.
   - **Evidence:** [HomePage.tsx:962](file:///c:/Users/harsh/Documents/antigravity/Practo/src/pages/HomePage.tsx#L962) renders a decorative `div` with a linear-gradient background. Given that providers possess explicit latitude/longitude coordinates (`lat: 19.136, lng: 72.836`), this feels unfinished to a reviewer.
   - **Suggested Fix:** Embed a free OpenStreetMap Leaflet iframe or render lightweight SVG map pins plotted across a relative bounding box of Mumbai.

4. `[Design & A11y / src/pages/HomePage.tsx:561, 88]` **Low Contrast Ratios on Meta Text (`text-gray-400` on White / Surface)**
   - **Problem:** Operating hours, slider labels, and "Last verified" text fail WCAG AA contrast guidelines for normal text (< 4.5:1).
   - **Evidence:** Spot-check calculation: `#9CA3AF` (`text-gray-400`) on `#FFFFFF` yields **2.54:1** (WCAG AA requires 4.5:1).
   - **Suggested Fix:** Replace `text-gray-400` with `text-gray-500` (#6B7280, contrast **4.83:1**) or `text-ink/60` across all metadata spans.

5. `[Home / src/data/providers.ts:48]` **Obvious Dummy Phone Numbers (`+91-XXXXXXXXXX`)**
   - **Problem:** All 13 provider listings use the literal telephone string `+91-XXXXXXXXXX`. Clicking "Call" launches a dialer intent with literal letters (`tel:+91-XXXXXXXXXX`).
   - **Evidence:** In `src/data/providers.ts`, all providers feature `phone: '+91-XXXXXXXXXX'`. On mobile devices, triggering this link results in a failed cellular call.
   - **Suggested Fix:** Replace with formatted standard fictional helpline numbers such as `+91 22 5550 0101` through `0113` (using standard reserved test prefixes) so dialers handle the string gracefully.

---

## 5. Minor Polish

1. `[Header / src/components/Header.tsx:6-12]` **Anchor Navigation Causes Abrupt Jumping**
   - **Problem:** Clicking "Explore Services" (`/#services`) or "For Businesses" (`/#list-business`) jumps abruptly down the page without smooth scrolling.
   - **Evidence:** Standard hash link navigation without CSS `scroll-behavior: smooth` or React Router hash scrolling.
   - **Suggested Fix:** Add `html { scroll-behavior: smooth; }` to `src/index.css`.

2. `[Footer / src/components/Footer.tsx:40-52]` **Empty Footer Anchor Links**
   - **Problem:** "Blog", "Partner with us", "Careers", "Privacy Policy", "Terms of Service", and "Accessibility" are all `href="#"`.
   - **Evidence:** Seven links in the footer reset the browser scroll position to the top when clicked.
   - **Suggested Fix:** Point legal links to `#` with `onClick={(e) => e.preventDefault()}` or display a clean "Coming soon in pilot" toast.

3. `[Learn / src/data/course.ts:16]` **Unsupported "10x" Marketing Trope**
   - **Problem:** Module 1 description reads: *"Master the art of working with AI assistants to 10x your productivity."*
   - **Evidence:** `src/data/course.ts:16`. This violates the assignment prompt instruction against unsupported claims ("e.g. 10x").
   - **Suggested Fix:** Reword to: *"Master the art of working with AI assistants to dramatically accelerate your daily workflows."*

4. `[Learn / src/pages/LearnPage.tsx:465]` **Unsubstantiated Learner Base Claim**
   - **Problem:** Section 9 states: *"Join hundreds of learners building real-world AI skills."*
   - **Evidence:** `src/pages/LearnPage.tsx:465`. The page simultaneously advertises that Batch 1 has not yet launched (`[START DATE]` and genuine placeholder for testimonials), creating a logical contradiction.
   - **Suggested Fix:** Reword to: *"Join the founding cohort of forward-thinking learners building real-world AI skills."*

5. `[Carousel / src/data/carousel.json:18-62]` **Redundant Unstyled `[SOURCE NEEDED]` Bracket Tags**
   - **Problem:** The `[SOURCE NEEDED]` tags are baked directly into the prose strings as raw text rather than being parsed into styled editorial badges.
   - **Evidence:** Visible in `exports/slide-2.png` through `slide-6.png` as inline raw characters.
   - **Suggested Fix:** In `CarouselSlide.tsx`, regex-parse `[SOURCE NEEDED]` and render it as an amber chip (`text-amber-800 bg-amber-100 border border-amber-300 rounded px-1.5 py-0.5 text-xs font-semibold`).

---

## 6. Honesty & Content Risk Assessment

| File & Line | Content Flag | Severity | Remediation |
|---|---|---|---|
| `COVER_NOTE.md:11` | *"Total time taken: approximately 4.5 hours from initial design system setup..."* | **High Risk** | **AI Hallucination.** Time duration claims in cover letters must reflect actual candidate tracking. Remove or verify with your personal development time log. |
| `src/data/course.ts:16` | *"to 10x your productivity"* | **Medium Risk** | Explicitly flagged in prompt instructions ("unsupported claims (e.g. 10x)"). Replace with concrete workflow outcome. |
| `src/pages/LearnPage.tsx:465` | *"Join hundreds of learners building real-world AI skills"* | **Medium Risk** | Contradicts the transparent unlaunched status of Cohort 1. Replace with founding cohort invitation. |
| `src/data/providers.ts:48-350` | `+91-XXXXXXXXXX` | **Low Risk** | Clearly fictional (complies with "no fake businesses"), but causes invalid telephony URI errors. Use RFC-compliant dummy ranges (`+91 22 5550 01XX`). |

*Note on Ethical Adherence:* The candidate **strictly obeyed** the prohibition against fabricated reviews and fake statistics. The mentor section features an explicit `[Mentor Name]` placeholder, the review section displays an authentic empty state commitment ("We do not publish fabricated reviews"), and provider ratings display realistic uninflated numbers without fake quotes.

---

## 7. What is Genuinely Strong (Top 5 Commendations)

1. **Rock-Solid TypeScript & Toolchain Execution:**
   The project exhibits clean code cleanliness. Zero `any` types in core interfaces, zero ESLint/oxlint warnings, zero console errors across all routes in live browser runs, and a lightning-fast 695ms production build.
2. **Resilient, Production-Grade Lead Capture Architecture:**
   The lead capture modal captures all standard UTM query parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`), validates multi-step progression with user-friendly error messages, saves locally in `localStorage`, and features an asynchronous webhook dispatch path (`VITE_LEAD_WEBHOOK_URL`) that fails silently without blocking the user.
3. **Cohesive, Grounded Design System:**
   The palette choice (Cream `#FBF8F3`, Ink `#1F2A2E`, Primary Teal `#0F766E`, Accent Amber `#F59E0B`, Surface Mint `#EEF5F3`) departs from generic AI "purple gradient" clichés. It delivers high contrast (13.8:1 on primary text) and a warm, clinical-yet-approachable pet healthcare identity.
4. **Data-Driven 1080×1350 Carousel Engine:**
   Content slides are decoupled into clean JSON schemas (`/src/data/carousel.json`) with strict aspect ratio preservation (4:5 portrait) and functional client-side PNG/PDF generation.
5. **Realistic & Specific AI Automation Architecture (`/workflow`):**
   The 10-node content generation pipeline and 6-step lead nurturing flow reflect real-world operational know-how (specifying Make/n8n webhooks, Claude structured JSON extraction, Slack approval gates, Buffer/Metricool API scheduling, and Twilio/Wati WhatsApp triggers) with candid two-line trade-offs for each tool.

---

## 8. Route-by-Route Design & Product Critique

| Route | Visual Score (1-10) | Product Score (1-10) | Design & Product Critique |
|---|:---:|:---:|---|
| **`/` (Discovery MVP)** | **7.5 / 10** | **8.0 / 10** | **Strengths:** 3-tier search bar is immediately legible; red Emergency chip provides instant high-urgency action; category filters update list instantly; provider cards provide comprehensive metadata (type badge, verification check, distance, fee range, animals treated).<br>**Weaknesses:** Tablet header blowout (768px); Map view is an unrendered placeholder; "Book" buttons are dead; phone links are invalid dummy strings. |
| **`/learn` (Course Landing)** | **8.5 / 10** | **8.5 / 10** | **Strengths:** Bold, confident typography; excellent curriculum timeline with numbered milestone dots; modular course breakdown with clear bulleted outcomes; ethical placeholders for mentor and reviews.<br>**Weaknesses:** Sticky mobile CTA bar overlaps bottom content on small screens if not padded; "Download Syllabus" button duplicates the seat reservation modal; Step 3 links to `#`. |
| **`/carousel` (Social Export)** | **8.0 / 10** | **8.0 / 10** | **Strengths:** Beautiful horizontal card preview carousel with active snap-scrolling; pixel-perfect 1080×1350 dimension rendering; clear disclaimer on medical guidance.<br>**Weaknesses:** 30.6 MB PDF file size is unsustainable for mobile distribution; `[SOURCE NEEDED]` tags are unstyled text; large client-side bundle size. |
| **`/workflow` (AI Automation)** | **9.0 / 10** | **9.0 / 10** | **Strengths:** Outstanding visual clarity; responsive horizontal-to-vertical diagram flow; actionable tooling matrix with candid operational trade-offs; practical 6-step lead automation sequence.<br>**Weaknesses:** Lacks an interactive sandbox or copyable webhook payload preview; header has subtle horizontal overflow on tablet screens. |

---

## 9. Accessibility & Mobile Responsiveness Deep Dive

### Automated Contrast Verification (Spot-Check Results)
1. **Ink on Cream (`#1F2A2E` on `#FBF8F3`):** `13.87:1` *(Passes AAA)*
2. **Ink on Surface Mint (`#1F2A2E` on `#EEF5F3`):** `13.29:1` *(Passes AAA)*
3. **White on Primary Teal (`#FFFFFF` on `#0F766E`):** `5.47:1` *(Passes AA)*
4. **White on Red Emergency (`#FFFFFF` on `#DC2626`):** `4.83:1` *(Passes AA)*
5. **Ink on Amber CTA (`#1F2A2E` on `#F59E0B`):** `6.84:1` *(Passes AAA)*
6. **Gray-500 on White (`#6B7280` on `#FFFFFF`):** `4.83:1` *(Passes AA)*
7. **Gray-400 on White (`#9CA3AF` on `#FFFFFF`):** `2.54:1` **(FAILS AA — Minimum requirement 4.5:1)**
8. **White on Indigo (`#FFFFFF` on `#3730A3`):** `9.93:1` *(Passes AAA)*
9. **Primary Teal on White (`#0F766E` on `#FFFFFF`):** `5.47:1` *(Passes AA)*
10. **White/50 on Ink Footer (`rgba(255,255,255,0.5)` on `#1F2A2E`):** `4.84:1` *(Passes AA)*

### Interaction & Keyboard Accessibility Pass
- **Focus Indicators:** Explicit `focus-visible:outline-2 focus-visible:outline-teal` applied across interactive controls.
- **Modal Focus Traps:** `CorrectionModal` and `LeadCaptureModal` trap `Tab` / `Shift+Tab` within the dialog element.
- **Escape Key Handling:** Both modals close on `Escape`.
- **Screen Reader Semantics:** Semantic `main`, `section`, `nav`, `aside`, `header`, `footer`, and `article` tags are utilized correctly. All inputs possess corresponding labels or `aria-label` attributes.

---

## 10. Top 10 Prioritized Fixes (Ranked by Score Impact)

| Rank | File Path | Line(s) | One-Line Fix |
|:---:|---|---|---|
| **1** | [src/components/Header.tsx](file:///c:/Users/harsh/Documents/antigravity/Practo/src/components/Header.tsx#L37) | 37, 98 | Change `hidden md:flex` to `hidden lg:flex` and `md:hidden` to `lg:hidden` to eliminate the 768px tablet layout blowout. |
| **2** | [src/components/LeadCaptureModal.tsx](file:///c:/Users/harsh/Documents/antigravity/Practo/src/components/LeadCaptureModal.tsx#L404) | 404, 411 | Replace dead `href="#"` on "Join WhatsApp" and "Add to Calendar" with active sample invite/calendar template URLs. |
| **3** | [src/pages/CarouselPage.tsx](file:///c:/Users/harsh/Documents/antigravity/Practo/src/pages/CarouselPage.tsx#L93) | 93–102 | Compress slide captures using `toJpeg(node, { quality: 0.88 })` before embedding into `jsPDF` to reduce PDF from 30.6 MB to ~1.8 MB. |
| **4** | [src/components/ProviderCard.tsx](file:///c:/Users/harsh/Documents/antigravity/Practo/src/components/ProviderCard.tsx#L140) | 140–146 | Attach an interactive callback to the "Book" button that triggers a booking slot dialog or directs to the provider telephone. |
| **5** | [src/pages/LearnPage.tsx](file:///c:/Users/harsh/Documents/antigravity/Practo/src/pages/LearnPage.tsx#L191) | 191–197 | Differentiate the "Download Syllabus" button by passing an intent prop to trigger an automated direct PDF download. |
| **6** | [src/data/providers.ts](file:///c:/Users/harsh/Documents/antigravity/Practo/src/data/providers.ts#L48) | 48, 73... | Replace non-dialable `+91-XXXXXXXXXX` with standard formatted fictional helpline numbers (e.g., `+91 22 5550 0101`). |
| **7** | [src/pages/HomePage.tsx](file:///c:/Users/harsh/Documents/antigravity/Practo/src/pages/HomePage.tsx#L561) | 88, 561 | Upgrade `text-gray-400` to `text-gray-500` on operating hours and slider labels to ensure WCAG AA 4.5:1 compliance. |
| **8** | [COVER_NOTE.md](file:///c:/Users/harsh/Documents/antigravity/Practo/COVER_NOTE.md#L11) | 11 | Remove the AI-generated "approximately 4.5 hours" claim and insert the actual human engineering hours spent. |
| **9** | [src/data/course.ts](file:///c:/Users/harsh/Documents/antigravity/Practo/src/data/course.ts#L16) | 16 | Remove the unsupported "10x your productivity" marketing phrase and replace with an evidence-based outcome. |
| **10** | [src/components/CarouselSlide.tsx](file:///c:/Users/harsh/Documents/antigravity/Practo/src/components/CarouselSlide.tsx#L1) | — | Style inline `[SOURCE NEEDED]` tags into distinct amber warning chips to demonstrate intentional editorial polish. |

---

## 11. Final Recommendation to Candidate

This deliverable demonstrates **strong full-stack competence, clean code standards, and rigorous product thinking**. It sets itself apart by avoiding false reviews, honoring medical disclaimers, and establishing a genuine design system. Addressing the top three tactical flaws (fixing the 768px tablet navigation overflow, activating the dead-end CTA buttons, and optimizing the 30MB PDF export) will elevate this submission from an **83/100 to a 94+/100**, placing it squarely at the top of the internship candidate pool.
