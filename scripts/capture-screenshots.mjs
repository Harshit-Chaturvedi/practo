/**
 * Capture screenshots for README documentation.
 * Uses puppeteer-core with the local Chrome installation.
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync, statSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(__dirname, '..', 'docs', 'screenshots')
mkdirSync(outDir, { recursive: true })

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = 'http://localhost:4173'

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
  })

  async function shot(name, url, viewport, opts = {}) {
    const page = await browser.newPage()
    await page.setViewport(viewport)
    await page.goto(`${BASE}${url}`, { waitUntil: 'networkidle0', timeout: 30000 })

    // Wait for fonts + animations to settle
    await page.evaluate(() => new Promise(r => setTimeout(r, 1500)))

    if (opts.click) {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel)
        if (el) el.click()
      }, opts.click)
      await page.evaluate(() => new Promise(r => setTimeout(r, 1200)))
    }

    if (opts.clickByText) {
      await page.evaluate((text) => {
        const buttons = [...document.querySelectorAll('button, a')]
        const el = buttons.find(b => b.textContent?.includes(text))
        if (el) el.click()
      }, opts.clickByText)
      await page.evaluate(() => new Promise(r => setTimeout(r, 1200)))
    }

    if (opts.scrollTo) {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel)
        if (el) el.scrollIntoView({ block: 'center' })
      }, opts.scrollTo)
      await page.evaluate(() => new Promise(r => setTimeout(r, 800)))
    }

    const path = resolve(outDir, `${name}.png`)
    await page.screenshot({ path, fullPage: opts.fullPage || false, type: 'png' })

    // Check file size
    const size = statSync(path).size
    console.log(`  ✓ ${name}.png — ${(size / 1024).toFixed(0)} KB`)

    await page.close()
    return path
  }

  console.log('Capturing screenshots...\n')

  // 1. Home desktop (viewport shot)
  await shot('home-desktop', '/', { width: 1280, height: 800 })

  // 2. Home mobile (filter sheet closed)
  await shot('home-mobile', '/', { width: 390, height: 844, isMobile: true, hasTouch: true })

  // 3. Map view — click the map toggle and scroll map into view
  await shot('home-map', '/', { width: 1280, height: 800 }, {
    click: 'button[aria-label="Map view"]',
    scrollTo: 'button[aria-label="Map view"]',
  })

  // 4. Learn desktop
  await shot('learn-desktop', '/learn', { width: 1280, height: 800 })

  // 5. Learn modal — click Reserve Your Seat (find by text content)
  await shot('learn-modal', '/learn', { width: 1280, height: 800 }, {
    clickByText: 'Reserve Your Seat',
  })

  // 6. Carousel — with slide viewer visible
  await shot('carousel', '/carousel', { width: 1280, height: 800 }, {
    scrollTo: '[aria-label="Slide preview carousel"]',
  })

  // 7. Workflow diagram — scrolled directly to diagram section
  await shot('workflow-diagram', '/workflow', { width: 1280, height: 800 }, {
    scrollTo: '#diagram',
  })

  await browser.close()
  console.log('\nAll screenshots saved to docs/screenshots/')
}

main().catch(e => { console.error(e); process.exit(1) })
