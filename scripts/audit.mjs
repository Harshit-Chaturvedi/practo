import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const screensDir = path.join(rootDir, 'audit', 'screens')
fs.mkdirSync(screensDir, { recursive: true })

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = 'http://localhost:4175'

const routes = ['/', '/learn', '/carousel', '/workflow']
const viewports = [
  { name: '360', width: 360, height: 740 },
  { name: '768', width: 768, height: 1024 },
  { name: '1280', width: 1280, height: 900 },
]

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  })

  const results = {
    consoleErrors: {},
    interactionTests: [],
  }

  try {
    // ===== SCREENSHOT PASS =====
    for (const route of routes) {
      const routeName = route === '/' ? 'home' : route.slice(1)
      results.consoleErrors[routeName] = []

      for (const vp of viewports) {
        const page = await browser.newPage()
        page.on('console', msg => {
          if (msg.type() === 'error') {
            results.consoleErrors[routeName].push(`[${vp.name}] ${msg.text()}`)
          }
        })
        page.on('pageerror', err => {
          results.consoleErrors[routeName].push(`[${vp.name}] PAGE_ERROR: ${err.message}`)
        })

        await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 })
        await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle0', timeout: 20000 })
        await new Promise(r => setTimeout(r, 1500))

        // Full-page screenshot
        await page.screenshot({
          path: path.join(screensDir, `${routeName}-${vp.name}.png`),
          fullPage: true,
        })

        // Check for horizontal overflow
        const hasOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth
        })
        if (hasOverflow) {
          results.interactionTests.push(`[${routeName}][${vp.name}] HORIZONTAL OVERFLOW detected: scrollWidth > clientWidth`)
        }

        await page.close()
      }
    }

    // ===== INTERACTION TESTS (desktop) =====
    const page = await browser.newPage()
    const pageErrors = []
    page.on('console', msg => {
      if (msg.type() === 'error') pageErrors.push(msg.text())
    })
    page.on('pageerror', err => pageErrors.push(`PAGE_ERROR: ${err.message}`))
    await page.setViewport({ width: 1280, height: 900 })

    // --- HOME PAGE ---
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle0', timeout: 20000 })
    await new Promise(r => setTimeout(r, 1000))

    // Test hero search "Find a Vet" button
    const findVetBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const b = btns.find(b => b.textContent?.includes('Find a Vet'))
      return !!b
    })
    results.interactionTests.push(`[home] "Find a Vet" button exists: ${findVetBtn}`)

    // Test Emergency chip
    const emergencyBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const b = btns.find(b => b.textContent?.includes('Emergency'))
      return !!b
    })
    results.interactionTests.push(`[home] Emergency chip exists: ${emergencyBtn}`)

    // Click each category tile
    const catTiles = await page.$$('button[aria-label*="Filter by"]')
    results.interactionTests.push(`[home] Category tile count: ${catTiles.length} (expected 6)`)

    // Click Clinics tile
    if (catTiles.length > 0) {
      await catTiles[0].click()
      await new Promise(r => setTimeout(r, 300))
      const resultCount = await page.evaluate(() => {
        const txt = document.querySelector('[aria-label="Search results"]')?.textContent || ''
        const match = txt.match(/(\d+)\s*result/)
        return match ? parseInt(match[1]) : -1
      })
      results.interactionTests.push(`[home] After clicking Clinics tile, results count: ${resultCount}`)
    }

    // Test List/Map toggle
    const mapToggle = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const b = btns.find(b => b.textContent?.includes('Map'))
      if (b) { b.click(); return true }
      return false
    })
    results.interactionTests.push(`[home] Map toggle button exists and clicked: ${mapToggle}`)
    await new Promise(r => setTimeout(r, 300))

    // Test Sort dropdown
    const sortSelect = await page.$('select')
    results.interactionTests.push(`[home] Sort dropdown exists: ${!!sortSelect}`)

    // Test Correction modal
    const corrBtns = await page.$$('button[aria-label*="Submit a correction"]')
    results.interactionTests.push(`[home] "Submit a correction" buttons: ${corrBtns.length}`)
    if (corrBtns.length > 0) {
      await corrBtns[0].click()
      await new Promise(r => setTimeout(r, 500))
      const modalVisible = await page.evaluate(() => !!document.querySelector('[role="dialog"]'))
      results.interactionTests.push(`[home] Correction modal opens: ${modalVisible}`)
      // Test Escape close
      await page.keyboard.press('Escape')
      await new Promise(r => setTimeout(r, 300))
      const modalClosed = await page.evaluate(() => !document.querySelector('[role="dialog"]'))
      results.interactionTests.push(`[home] Correction modal closes on Escape: ${modalClosed}`)
    }

    // Test Call button href
    const callHref = await page.evaluate(() => {
      const a = document.querySelector('a[aria-label*="Call"]')
      return a?.getAttribute('href') || 'NOT FOUND'
    })
    results.interactionTests.push(`[home] Call link href: ${callHref}`)

    // Test Directions button href
    const dirHref = await page.evaluate(() => {
      const a = document.querySelector('a[aria-label*="directions"]')
      return a?.getAttribute('href') || 'NOT FOUND'
    })
    results.interactionTests.push(`[home] Directions link href: ${dirHref}`)

    // Test "List Your Business" section exists
    const listBiz = await page.evaluate(() => !!document.getElementById('list-business'))
    results.interactionTests.push(`[home] #list-business section exists: ${listBiz}`)

    // --- LEARN PAGE ---
    await page.goto(`${BASE}/learn`, { waitUntil: 'networkidle0', timeout: 20000 })
    await new Promise(r => setTimeout(r, 1000))

    // Open lead modal
    let modalOpened = false
    const learnBtns = await page.$$('button')
    for (const b of learnBtns) {
      const text = await page.evaluate(el => el.textContent, b)
      if (text && text.includes('Reserve Your Seat') && !text.includes('Now')) {
        await b.click()
        modalOpened = true
        break
      }
    }
    await new Promise(r => setTimeout(r, 600))
    results.interactionTests.push(`[learn] Lead modal opens: ${modalOpened}`)

    if (modalOpened) {
      // Step 1: fill valid data
      const step1Inputs = await page.$$('input')
      for (const inp of step1Inputs) {
        const type = await page.evaluate(el => el.type, inp)
        if (type === 'text') await inp.type('Test User')
        else if (type === 'tel') await inp.type('9876543210')
        else if (type === 'email') await inp.type('test@example.com')
      }
      // Click Next
      const nextBtn = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button[type="submit"]'))
        const b = btns.find(b => b.textContent?.includes('Next'))
        if (b) { b.click(); return true }
        return false
      })
      results.interactionTests.push(`[learn] Step 1 Next clicked: ${nextBtn}`)
      await new Promise(r => setTimeout(r, 400))

      // Step 2: select role
      const roleRadio = await page.$('input[type="radio"]')
      if (roleRadio) await roleRadio.click()
      // Select interest
      const interestCheck = await page.$('input[type="checkbox"]')
      if (interestCheck) await interestCheck.click()
      // Select batch radio (second group)
      const radios = await page.$$('input[type="radio"]')
      if (radios.length > 1) await radios[radios.length - 1].click()

      // Click Submit
      const submitBtn = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button[type="submit"]'))
        const b = btns.find(b => b.textContent?.includes('Submit'))
        if (b) { b.click(); return true }
        return false
      })
      results.interactionTests.push(`[learn] Step 2 Submit clicked: ${submitBtn}`)
      await new Promise(r => setTimeout(r, 800))

      // Check step 3 success screen
      const successVisible = await page.evaluate(() => {
        const el = document.body.innerText
        return el.includes("You're on the list") || el.includes("on the list")
      })
      results.interactionTests.push(`[learn] Step 3 success screen visible: ${successVisible}`)

      // Check localStorage
      const localData = await page.evaluate(() => {
        return localStorage.getItem('practo_leads')
      })
      results.interactionTests.push(`[learn] localStorage practo_leads has data: ${!!localData && localData !== '[]'}`)
      if (localData) {
        try {
          const parsed = JSON.parse(localData)
          results.interactionTests.push(`[learn] Lead data fields: ${Object.keys(parsed[0] || {}).join(', ')}`)
        } catch {}
      }

      // Close modal
      await page.keyboard.press('Escape')
      await new Promise(r => setTimeout(r, 300))
    }

    // Test UTM capture
    await page.goto(`${BASE}/learn?utm_source=test&utm_medium=audit&utm_campaign=check`, { waitUntil: 'networkidle0' })
    await new Promise(r => setTimeout(r, 500))
    // Open modal and submit to check UTM
    for (const b of await page.$$('button')) {
      const text = await page.evaluate(el => el.textContent, b)
      if (text && text.includes('Reserve Your Seat') && !text.includes('Now')) {
        await b.click()
        break
      }
    }
    await new Promise(r => setTimeout(r, 400))
    // Fill step 1 quickly
    const inputs2 = await page.$$('input')
    for (const inp of inputs2) {
      const type = await page.evaluate(el => el.type, inp)
      if (type === 'text') await inp.type('UTM Test')
      else if (type === 'tel') await inp.type('1234567890')
      else if (type === 'email') await inp.type('utm@test.com')
    }
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button[type="submit"]')).find(b => b.textContent?.includes('Next'))
      if (b) b.click()
    })
    await new Promise(r => setTimeout(r, 400))
    // Step 2 quick fill
    for (const r of await page.$$('input[type="radio"]')) { await r.click(); break }
    for (const c of await page.$$('input[type="checkbox"]')) { await c.click(); break }
    const radios2 = await page.$$('input[type="radio"]')
    if (radios2.length > 1) await radios2[radios2.length - 1].click()
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button[type="submit"]')).find(b => b.textContent?.includes('Submit'))
      if (b) b.click()
    })
    await new Promise(r => setTimeout(r, 600))
    const utmCheck = await page.evaluate(() => {
      const data = JSON.parse(localStorage.getItem('practo_leads') || '[]')
      const last = data[data.length - 1]
      return last?.utm || null
    })
    results.interactionTests.push(`[learn] UTM captured: ${JSON.stringify(utmCheck)}`)

    // Check FAQ accordion
    await page.keyboard.press('Escape')
    await new Promise(r => setTimeout(r, 300))
    await page.goto(`${BASE}/learn`, { waitUntil: 'networkidle0' })
    await new Promise(r => setTimeout(r, 500))
    const faqBtns = await page.$$('button[aria-expanded]')
    results.interactionTests.push(`[learn] FAQ accordion buttons: ${faqBtns.length}`)
    if (faqBtns.length > 0) {
      await faqBtns[0].click()
      await new Promise(r => setTimeout(r, 300))
      const expanded = await page.evaluate(() => {
        const b = document.querySelector('button[aria-expanded="true"]')
        return !!b
      })
      results.interactionTests.push(`[learn] FAQ expands on click: ${expanded}`)
    }

    // "Download Syllabus" and "Join WhatsApp Group" hrefs
    const syllabusAction = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const b = btns.find(b => b.textContent?.includes('Download Syllabus'))
      return b ? 'button (opens modal)' : 'NOT FOUND'
    })
    results.interactionTests.push(`[learn] "Download Syllabus" is: ${syllabusAction}`)

    const whatsappHref = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'))
      const l = links.find(l => l.textContent?.includes('Join WhatsApp'))
      return l?.getAttribute('href') || 'NOT FOUND'
    })
    results.interactionTests.push(`[learn] "Join WhatsApp Group" href: ${whatsappHref}`)

    const calendarHref = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'))
      const l = links.find(l => l.textContent?.includes('Add to Calendar'))
      return l?.getAttribute('href') || 'NOT FOUND'
    })
    results.interactionTests.push(`[learn] "Add to Calendar" href: ${calendarHref}`)

    // --- CAROUSEL PAGE ---
    await page.goto(`${BASE}/carousel`, { waitUntil: 'networkidle0', timeout: 20000 })
    await new Promise(r => setTimeout(r, 1500))

    // Check export buttons exist
    const exportPngBtns = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      return btns.filter(b => b.textContent?.includes('Export PNG')).length
    })
    results.interactionTests.push(`[carousel] "Export PNG" buttons: ${exportPngBtns} (expected 7)`)

    const exportPdfBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      return btns.some(b => b.textContent?.includes('Export') && b.textContent?.includes('PDF'))
    })
    results.interactionTests.push(`[carousel] "Export All as PDF" button exists: ${exportPdfBtn}`)

    // Check slide preview count
    const slideCount = await page.evaluate(() => {
      const slides = document.querySelectorAll('[aria-label*="Slide"]')
      return slides.length
    })
    results.interactionTests.push(`[carousel] Slide elements count: ${slideCount}`)

    // --- WORKFLOW PAGE ---
    await page.goto(`${BASE}/workflow`, { waitUntil: 'networkidle0', timeout: 20000 })
    await new Promise(r => setTimeout(r, 1000))

    // Check diagram nodes
    const diagramNodes = await page.evaluate(() => {
      const nodes = document.querySelectorAll('[role="listitem"]')
      return nodes.length
    })
    results.interactionTests.push(`[workflow] Diagram nodes: ${diagramNodes} (expected 10)`)

    // Check tool table
    const toolRows = await page.evaluate(() => {
      const rows = document.querySelectorAll('table tbody tr')
      return rows.length
    })
    results.interactionTests.push(`[workflow] Tool table rows: ${toolRows} (expected 10)`)

    // Check "What I'd Build Next" cards
    const nextCards = await page.evaluate(() => {
      const cards = document.querySelectorAll('[aria-label="Provider Dashboard"], [aria-label="Booking System"], [aria-label="Review System"], [aria-label="AI Triage Chatbot"], [aria-label="Mobile App"], [aria-label*="Analytics"]')
      return cards.length
    })
    results.interactionTests.push(`[workflow] "Build Next" cards: ${nextCards} (expected 6)`)

    // ===== FOCUS / ACCESSIBILITY CHECKS =====
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' })
    await new Promise(r => setTimeout(r, 500))

    // Check heading hierarchy on home
    const headings = await page.evaluate(() => {
      const hs = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      return hs.map(h => ({ tag: h.tagName, text: h.textContent?.trim().slice(0, 50) }))
    })
    results.interactionTests.push(`[home] Heading hierarchy: ${JSON.stringify(headings.slice(0, 10))}`)

    // Check h1 exists
    const h1Count = headings.filter(h => h.tag === 'H1').length
    results.interactionTests.push(`[home] H1 count: ${h1Count} (expected 1)`)

    // Form labels
    const unlabelledInputs = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"])'))
      return inputs.filter(inp => {
        const id = inp.id
        const label = id ? document.querySelector(`label[for="${id}"]`) : null
        const ariaLabel = inp.getAttribute('aria-label')
        const placeholder = inp.getAttribute('placeholder')
        return !label && !ariaLabel && !placeholder
      }).length
    })
    results.interactionTests.push(`[home] Inputs without label/aria-label/placeholder: ${unlabelledInputs}`)

    // Print console errors
    results.interactionTests.push(`\n--- CONSOLE ERRORS ---`)
    for (const [route, errs] of Object.entries(results.consoleErrors)) {
      if (errs.length > 0) {
        results.interactionTests.push(`[${route}] ${errs.length} errors: ${errs.join(' | ')}`)
      } else {
        results.interactionTests.push(`[${route}] 0 console errors`)
      }
    }

    if (pageErrors.length > 0) {
      results.interactionTests.push(`[interaction pass] ${pageErrors.length} errors: ${pageErrors.join(' | ')}`)
    }

    // Write results
    fs.writeFileSync(
      path.join(rootDir, 'audit', 'test-results.json'),
      JSON.stringify(results, null, 2)
    )

    console.log('\n===== AUDIT RESULTS =====')
    results.interactionTests.forEach(r => console.log(r))
    console.log('=========================')
    console.log('Screenshots saved to /audit/screens/')

  } finally {
    await browser.close()
  }
}

run().catch(err => {
  console.error('Audit error:', err)
  process.exit(1)
})
