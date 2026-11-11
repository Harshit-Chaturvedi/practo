# Live End-to-End QA Report — `https://practo-lovat.vercel.app/`

- **Target URL:** `https://practo-lovat.vercel.app/`
- **Test Date (UTC):** `2026-11-11`
- **Viewports Tested:** `360×800` (phone), `768×1024` (tablet), `1280×800` (desktop) in fresh incognito-like browser contexts
- **Source Code Changes:** None (strict read/test-only QA pass; repo left untouched)
- **Screenshots Directory:** [`audit/live-qa`](file:///C:/Users/harsh/Documents/antigravity/Practo/audit/live-qa)

---

## 1. Summary Table (`PASS / FAIL` Counts)

| Route | Functional | Responsive | Accessibility (A11y) | Content & SEO | Performance (Mobile LH) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Global (Header / Footer / Routing)** | **4 PASS / 3 FAIL** *(Nav/logo/footer/reload pass; City selector cosmetic-only, cross-route `/#list-business` hash scroll fails, `/does-not-exist` blank screen)* | **3 PASS / 0 FAIL** *(`scrollWidth === innerWidth` at 360, 768, 1280 on all 4 routes; mobile menu toggle works)* | **2 PASS / 2 FAIL** *(Focus rings & fonts pass; mobile drawer fails `Esc` close, missing `aria-current="page"` & duplicate `"List Business"` DOM control)* | **0 PASS / 3 FAIL** *(Default `/vite.svg` favicon, missing OG/Twitter tags & per-route `<title>`, `/robots.txt` serves SPA HTML)* | **N/A** *(Measured per route below)* |
| **`/` (Home / Directory)** | **9 PASS / 1 FAIL** *(3-field search, Emergency chip, 6 category tiles + toggle reset, all sidebar filters, empty state + Reset all, Map/List toggle + 13 pins + filter sync, Book modal submit + `localStorage`, Correction modal pass; no custom inline validation & multi-Call toasts stack)* | **3 PASS / 1 FAIL** *(0 horizontal overflow at 360/768/1280 & mobile filter bottom sheet pass; 360px category tile subtitles truncate with ellipsis)* | **4 PASS / 1 FAIL** *(Filter toggles, range slider, hero/card contrast pass, Lighthouse A11y 100; Book modal `Esc` drops focus to `BODY`)* | **2 PASS / 0 FAIL** *(13 providers verified, `"Demo Pilot"` disclosure chip present, 0 placeholder copy)* | **3 PASS / 0 FAIL** *(Perf 91, LCP `3.1 s`, CLS `0`, `157.5 KB` JS transfer)* |
| **`/learn` (AI Course)** | **7 PASS / 1 FAIL** *(Seat modal + honeypot + UTM attribution + live Apps Script `POST` + `localStorage` + Step 3 WhatsApp disabled state / Google Cal template / `.ics` download + FAQ accordion pass; scroll-reveal `opacity: 0` hides sections until scroll)* | **2 PASS / 1 FAIL** *(0 overflow across viewports, syllabus PDF compiles; 360px sticky bar overlaps hero stats at `y=0` and bottom footer copyright at scroll end)* | **3 PASS / 1 FAIL** *(Modal focus trap, honeypot off-screen/`tabIndex="-1"`/`aria-hidden="true"`, `Esc` restores trigger focus, FAQ `Enter`/`Space`, Lighthouse A11y 100 pass; `"Download Syllabus"` buttons have `1.00:1` white-on-white contrast)* | **1 PASS / 2 FAIL** *(0 unsupported/hype claims on page; `syllabus.pdf` keeps legacy indigo styling + `[PRICE]`/`[START DATE]` placeholders + right-margin text clipping on all 6 modules)* | **3 PASS / 0 FAIL** *(Perf 92, LCP `3.0 s`, CLS `0`, `154.5 KB` JS transfer)* |
| **`/carousel` (AI Carousel)** | **3 PASS / 1 FAIL** *(7 slides 4:5 portrait, 7× `1080×1350` PNG export, `0.493 MB` 7-page PDF export with `"Compiling PDF…"` double-click lock pass; no Prev/Next controls or pagination dots)* | **3 PASS / 0 FAIL** *(0 horizontal overflow at 360/768/1280; `scroll-snap-type: x mandatory`)* | **0 PASS / 1 FAIL** *(Lighthouse A11y 96: amber `CARE GUIDE` on `#2E5B41` = `3.63:1` and `"for Animals"` on `#0B4F4A` = `4.38:1`)* | **1 PASS / 2 FAIL** *(`[SOURCE NEEDED]` chips & `0` `[BRAND]`/`TODO` placeholders pass; Slide 7 export heading `"Now"` collides over subtitle & no page-level disclaimer outside Slide 7)* | **1 PASS / 2 FAIL** *(CLS `0.017` pass; Perf 86, LCP `3.8 s`, `279.0 KB` JS transfer)* |
| **`/workflow` (Architecture)** | **4 PASS / 2 FAIL** *(10 pipeline nodes, 10-tool comparison matrix, tech stack, CTA matrix, Phase 2 roadmap pass; scroll-reveal `opacity: 0` hides 18 blocks before scroll, Node 5→10 desktop `v` arrow mismatch)* | **3 PASS / 0 FAIL** *(0 horizontal overflow at 360/768/1280; mobile matrix stacks cleanly into cards)* | **2 PASS / 0 FAIL** *(Lighthouse A11y 100, headings & contrast pass)* | **1 PASS / 1 FAIL** *(0 lorem/TODO copy pass; pipeline labels `Make / n8n` & `Airtable / Google Sheets` contradict live direct Google Apps Script webhook)* | **3 PASS / 0 FAIL** *(Perf 92, LCP `3.0 s`, CLS `0`, `149.9 KB` JS transfer)* |

---

## 2. Bugs Ordered by Severity

### Blocker

1. **`[/learn]` `"Download Syllabus"` and `"Download Full Syllabus"` CTA buttons render white text on a white background (`1.00:1` contrast — completely invisible label)**
   - **Steps to reproduce:** Load `https://practo-lovat.vercel.app/learn` at `360×800`, `768×1024`, or `1280×800` and inspect the secondary CTA button next to `"Reserve Your Seat"` in both the Hero section and the bottom CTA band.
   - **Expected vs Actual:** Expected a readable secondary button (dark teal/ink label on white, or white label on a transparent/outlined dark button). Actual element carries conflicting classes (`bg-white ... text-white`), yielding computed color `rgb(255, 255, 255)` on `rgb(255, 255, 255)` (`1.00:1` contrast) — appearing as a blank white pill.
   - **Screenshot:** `learn-1280.png`, `learn-768.png`, `learn-360.png`, `learn-1280-scrolled.png`

---

### Major

2. **`[/learn, /workflow]` Scroll-triggered reveal leaves below-the-fold sections completely invisible (`opacity: 0`) at initial load**
   - **Steps to reproduce:** Open `/learn` or `/workflow` directly at `scrollY = 0` without scrolling incrementally, or inspect full-page screenshots captured on initial load.
   - **Expected vs Actual:** Expected all section headings and content blocks to be visible (or immediately revealed cleanly). Actual behavior keeps `12` content containers on `/learn` and `18` blocks on `/workflow` at `opacity: 0` until the user scrolls them into view, resulting in large blank cream/white gaps under section headings (e.g., Target Audience, Curriculum Modules, Learning Journey timeline, Tech Stack, Enrolment Automation, and Node 2–10 placeholders with floating `v` chevrons on mobile).
   - **Screenshot:** `learn-1280.png`, `learn-768.png`, `learn-360.png`, `workflow-1280.png`, `workflow-768.png`, `workflow-360.png` (contrast with `learn-1280-scrolled.png`, `workflow-1280-scrolled.png`, `workflow-360-scrolled.png`)

3. **`[/carousel]` Exported Slide 7 PNG & PDF Page 7 heading wraps and collides over the subtitle**
   - **Steps to reproduce:** On `/carousel`, export PNG for Slide 7 (or click `"Export Full Deck (PDF)"`), then open the exported `slide-6.png` / page 7 of `practo-carousel.pdf`.
   - **Expected vs Actual:** Expected `"Don't Wait — Find a Vet Now"` to sit cleanly above `"Search trusted veterinary care near you"` with vertical spacing. Actual render wraps `"Now"` onto a second line directly colliding with the subtitle text beneath it.
   - **Screenshot:** `carousel-slide-7-export.png`, `carousel-pdf-page-7.png`

4. **`[/learn]` Downloaded `syllabus.pdf` retains legacy indigo styling, `[PRICE]` / `[START DATE]` placeholders, and clips `"Key Topics"` text off the right margin**
   - **Steps to reproduce:** On `/learn`, submit the Syllabus form (`QA Tester` / `qa.tester@example.com`), open the downloaded `syllabus.pdf` (`26,564 bytes`, 2 pages), and inspect all 6 module cards and the footer banner.
   - **Expected vs Actual:** Expected a teal/warm-amber design-system PDF with properly wrapped text inside module cards and finalized dates/pricing (or explicit pilot disclosure). Actual PDF uses old indigo header/accents/bottom CTA banner, displays `[PRICE]` and `[START DATE]`, slightly touches the bottom banner with Page 2 footer text, and overflows/clips `"Key Topics"` text across the right card border on all 6 modules across Pages 1 and 2.
   - **Screenshot:** `learn-syllabus-p1.png`, `learn-syllabus-p2.png`

5. **`[/learn]` Sticky mobile bottom bar (`AI Care Intensive / Reserve Seat`) overlaps Hero metrics on load and Footer copyright at page bottom**
   - **Steps to reproduce:** Open `/learn` at `360×800`, check `y = 0`, then scroll to the very bottom of the page.
   - **Expected vs Actual:** Expected bottom spacing (`padding-bottom`) so sticky controls never obscure content. Actual fixed bottom bar (`top: 731..800px`, `body.paddingBottom: 0px`) covers the `"6 Weeks / 4 Capstones / 1:1 Mentoring / Zero Code"` Hero row on initial load and overlaps the footer bottom line (`"Crafted with ❤️ for animal wellbeing..."`, `footerRect.bottom: 800.48`) at maximum scroll.
   - **Screenshot:** `learn-360.png`, `learn-mobile-bottom-360.png`

6. **`[/does-not-exist]` Unknown routes render HTTP `200` with a completely blank cream page**
   - **Steps to reproduce:** Navigate directly to `https://practo-lovat.vercel.app/does-not-exist`.
   - **Expected vs Actual:** Expected a branded 404 Not Found screen with a link back to `/` (or HTTP 404). Actual Vercel SPA rewrite returns `index.html` (`HTTP 200`), and the React router renders nothing (`h1: null`, `bodyText: ""`).
   - **Screenshot:** `not-found-1280.png`

7. **`[/]` Header city selector (`Mumbai` -> `Delhi`) is purely cosmetic and does not update copy, providers, or map**
   - **Steps to reproduce:** Click `"Mumbai"` in the header dropdown, select `"Delhi"`, then check Hero copy, result count, provider addresses, and Map View.
   - **Expected vs Actual:** Expected either real city filtering/state messaging or an explicit disabled/Mumbai-only pilot indicator. Actual selection updates only the dropdown button label (`Delhi`); Hero still says `"across Mumbai"`, results remain `"13 providers found"` (all Mumbai listings), and Map View still renders `"Prototype Map (Mumbai Region)"`.
   - **Screenshot:** *(Observed via live DOM & functional check; `home-map-1280.png` confirms `"Prototype Map (Mumbai Region)"`)*

8. **`[/learn -> /]` Cross-route `"List Business"` (`/#list-business`) link fails to scroll to the section**
   - **Steps to reproduce:** Navigate to `/learn` (or `/carousel`, `/workflow`) and click `"List Business"` in the top header.
   - **Expected vs Actual:** Expected navigation to `/` followed by smooth/automatic scroll to `#list-business` (`"Are you a licensed veterinary clinic..."`). Actual navigation loads `https://practo-lovat.vercel.app/#list-business` at `scrollY = 0` (top of Home hero).
   - **Screenshot:** *(Observed via live DOM check: `url === https://practo-lovat.vercel.app/#list-business`, `scrollY === 0`)*

9. **`[Global]` Mobile hamburger navigation drawer does not close on keyboard `Escape`**
   - **Steps to reproduce:** At `360×800`, open the mobile menu button in the header, verify focus enters the drawer (`"Close menu"`), and press `Escape`.
   - **Expected vs Actual:** Expected pressing `Escape` to close the open navigation drawer and restore focus to the hamburger trigger. Actual drawer stays open.
   - **Screenshot:** *(Observed via live keyboard check on `360×800`)*

10. **`[/]` `"Book Appointment"` modal drops focus to `BODY` on `Escape` and lacks custom inline validation errors**
    - **Steps to reproduce:** Click `"Book"` on any provider card (e.g., `Whiskers & Paws Clinic`), submit with empty inputs to check validation, then press `Escape` while focus is inside the modal input.
    - **Expected vs Actual:** Expected inline accessible error text for missing required fields, and `Escape` to return focus to the triggering `"Book appointment"` button. Actual empty submit relies solely on native HTML5 tooltip (the same applies to `"Submit a Correction"`), and `Escape` closes the modal while dropping `document.activeElement` to `BODY`.
    - **Screenshot:** *(Observed via live interactive & keyboard check)*

---

### Minor

11. **`[/carousel]` Lighthouse mobile Accessibility `96` due to amber-on-green/teal contrast failures on scaled preview cards**
    - **Steps to reproduce:** Run mobile Lighthouse Accessibility audit on `https://practo-lovat.vercel.app/carousel`.
    - **Expected vs Actual:** Expected `>= 4.5:1` text contrast across all preview elements (A11y `100`). Actual audit flags `#F59E0B` on `#2E5B41` (`3.63:1`, `CARE GUIDE` badge at small preview scale) and `#F59E0B` on `#0B4F4A` (`4.38:1`, `"for Animals"` footer/brand span).
    - **Screenshot:** `carousel-360.png`, `carousel-1280.png`

12. **`[/]` Mobile `360px` category tile subtitles truncate with ellipsis**
    - **Steps to reproduce:** Open `/` at `360×800` and inspect the `"Browse by Care Category"` grid.
    - **Expected vs Actual:** Expected full readable category subtitles without clipping. Actual subtitles truncate (`"Consultations &..."`, `"X-Ray, blood tests &..."`).
    - **Screenshot:** `home-360.png`

13. **`[/]` Minor UI & accessibility polish gaps on Home & Header (`Call` toast stacking, `"Ngo"` casing, duplicate DOM control, missing `aria-current`)**
    - **Steps to reproduce:** Click `"Call"` on multiple provider cards rapidly; toggle to Map View and inspect the legend; inspect top-nav links and `"List Business"` elements in DOM.
    - **Expected vs Actual:** Previous toast replaced cleanly, acronym cased `"NGO"`, single `"List Business"` element per breakpoint, `aria-current="page"` on active route link. Actual behavior stacks multiple simultaneous `role="status"` toasts, renders `"Ngo"` in the Map legend, renders both an `<a>` and `<button>` for `"List Business"` at identical desktop coordinates (`x: 1104.8, y: 14`), and omits `aria-current="page"`.
    - **Screenshot:** `home-map-1280.png`, `home-1280.png`

14. **`[/workflow]` Desktop Node 5→10 connector arrow ambiguity & webhook architecture label drift**
    - **Steps to reproduce:** Load `/workflow` at `1280×800`, scroll down to render all animated sections, and inspect the 10-step diagram and Enrolment Automation copy.
    - **Expected vs Actual:** Expected connector flowing clearly from Step 5 (end of Row 1) to Step 6 (start of Row 2), and architecture labels matching production (`Google Apps Script` webhook). Actual layout places a downward `v` chevron directly under Node 5 pointing at Node 10 even though Row 2 flows left-to-right `6 -> 7 -> 8 -> 9 -> 10`, and labels reference `"Make / n8n via VITE_LEAD_WEBHOOK_URL"` and `"Airtable / Google Sheets"`. (Note: mobile tool comparison uses stacked cards cleanly with 0 horizontal overflow.)
    - **Screenshot:** `workflow-1280-scrolled.png`, `workflow-768.png`, `workflow-360-scrolled.png`

15. **`[/carousel]` No explicit Next/Prev controls or slide counter, and no disclaimer outside Slide 7**
    - **Steps to reproduce:** Open `/carousel` at `360×800` and `1280×800` and look for deck navigation controls and medical/source disclaimers.
    - **Expected vs Actual:** Expected Prev/Next buttons or pagination indicator alongside `scroll-snap-type: x mandatory`, plus a page-level disclaimer note. Actual deck relies solely on horizontal scroll and places disclaimer text only inside Slide 7.
    - **Screenshot:** `carousel-360.png`, `carousel-1280.png`

16. **`[Global]` Missing social meta tags, route-specific `<title>`s, branded favicon, and valid `/robots.txt`**
    - **Steps to reproduce:** Inspect `<head>` metadata across all 4 routes and fetch `/robots.txt` / `/sitemap.xml`.
    - **Expected vs Actual:** Expected branded favicon, per-route `<title>`, `og:title` / `og:description` / `og:image`, and a valid plain-text `robots.txt`. Actual site serves `/vite.svg`, identical title `"Practo for Animals — Trusted Animal Care"`, no OpenGraph/Twitter tags, and SPA `index.html` at `/robots.txt` (causing Lighthouse SEO `91`: `"robots-txt is not valid (20 errors found)"`).
    - **Screenshot:** *(Observed in live DOM `<head>` & Lighthouse JSON audits)*

---

## 3. Fake QA Data to Delete

Exactly **two** live submissions reached the production Google Apps Script webhook (`https://script.google.com/macros/s/AKfycbyDaMsEJF86VY8NcvE4BFjq3qtm_9-1zz1Mdi-CKT5rRL0K92TDwuBmOchgVmNWo-DujQ/exec`) and need to be deleted from the **"Practo Leads"** Google Sheet:

1. **Google Sheet Lead #1 (`intent: "syllabus"`)**
   - **Name:** `QA Tester`
   - **Email:** `qa.tester@example.com`
   - **WhatsApp:** `""` *(empty)*
   - **Role / Interests / Batch:** `Syllabus Requester` / `Syllabus` / `N/A`
   - **UTM / Page:** `utm_source=qa`, `utm_medium=qa`, `utm_campaign=qa`, `page=/learn`
   - **Submitted At (UTC):** `2026-11-11T02:12:29.981Z`
2. **Google Sheet Lead #2 (`intent: "seat"`)**
   - **Name:** `QA Tester`
   - **Email:** `qa.tester@example.com`
   - **WhatsApp:** `9876543210`
   - **Role / Interests / Batch:** `Student` / `AI Tools & Prompting, Workflow Automation (Make / n8n)` / `live-cohort`
   - **UTM / Page:** `utm_source=qa`, `utm_medium=qa`, `utm_campaign=qa`, `page=/learn`
   - **Submitted At (UTC):** `2026-11-11T02:13:44.473Z`

**Browser-only QA submissions (NOT sent to Google Sheets — no server cleanup needed):**
- **Directory Booking Request (`localStorage['practo_booking_requests']` in ephemeral QA context):** `providerId: "7"` (`Whiskers & Paws Clinic`), Date: `Today, 10 Nov`, Time: `10:00 AM`, Pet Parent: `QA Tester`, Phone: `9876543210`, Created: `2026-11-11T02:09:26.781Z`.
- **Listing Correction Submission (in-memory modal toast only on `/`):** Provider: `Whiskers & Paws Clinic`, Submitted name/note: `QA Tester test correction note`, Email: `qa.tester@example.com`.

---

## 4. Mobile Lighthouse Scores (All 4 Routes)

| Route | Performance | Accessibility | Best Practices | SEO | LCP | CLS | JS Transfer (Resource) | Primary Deducted Audit |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `/` | **91** | **100** | **100** | **91** | `3.1 s` | `0` | `157.5 KB` (`473.8 KB`) | `robots-txt` invalid (SPA HTML served) |
| `/learn` | **92** | **100** | **100** | **91** | `3.0 s` | `0` | `154.5 KB` (`453.8 KB`) | `robots-txt` invalid (SPA HTML served) |
| `/carousel` | **86** | **96** | **100** | **91** | `3.8 s` | `0.017` | `279.0 KB` (`829.7 KB`) | Amber contrast (`3.63:1` / `4.38:1`), heavy export bundle LCP, `robots-txt` |
| `/workflow` | **92** | **100** | **100** | **91** | `3.0 s` | `0` | `149.9 KB` (`440.2 KB`) | `robots-txt` invalid (SPA HTML served) |

---

## 5. Top 5 Fixes Before Submission

1. **Fix invisible `"Download Syllabus"` / `"Download Full Syllabus"` CTA buttons on `/learn` (Blocker):** Remove conflicting `text-white` class on the `bg-white` button so it uses dark teal/ink text (e.g., `bg-white text-primary-800 hover:bg-surface` or outlined dark-surface styling) with verified `>= 4.5:1` contrast.
2. **Fix scroll-reveal `opacity: 0` trap on `/learn` and `/workflow` + sticky mobile bottom bar overlap on `/learn` (Major):** Ensure elements start visible or trigger reliably without leaving multi-screen blank gaps above/around sections, and add bottom body/footer padding (`pb-24 lg:pb-0`) on `/learn` mobile so the sticky CTA bar never covers Hero stats or Footer text.
3. **Fix `syllabus.pdf` layout & Slide 7 export heading collision (Major):** On `/learn`, restyle `syllabus.pdf` with the teal/amber palette, wrap `"Key Topics"` lines cleanly inside card bounds, and replace or clearly frame `[PRICE]` / `[START DATE]`. On `/carousel`, shrink or constrain Slide 7's headline font size / `line-height` / `margin-bottom` so `"Don't Wait — Find a Vet Now"` never collides with its subtitle in `1080×1350` exports.
4. **Fix broken routing/navigation UX: 404 fallback, cross-route `/#list-business`, City selector honesty, & `Escape` focus management (Major):** Add a catch-all React Router 404 page, handle hash scrolling cleanly after cross-route navigation to `/#list-business`, either filter/scope or clearly lock the header city picker to `"Mumbai Pilot"`, and wire `Escape` + focus-restore on the mobile drawer and `"Book"` modal.
5. **Fix SEO & Carousel Accessibility quick wins (`robots.txt`, favicon, OG tags, amber contrast) (Minor):** Serve a real `public/robots.txt` (excluded from Vercel SPA rewrites) and `sitemap.xml` to lift SEO from `91` to `100`, replace `/vite.svg` with the Practo for Animals mark + OpenGraph tags, and lighten amber highlight text on dark green/teal badges in `/carousel` so Accessibility hits `100` across all 4 routes.
