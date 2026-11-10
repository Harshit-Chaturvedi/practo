import puppeteer from 'puppeteer-core'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const screenshotsDir = path.join(rootDir, 'verification_screenshots')

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true })
}

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

async function run() {
  console.log('Starting preview server...')
  const preview = spawn('npx.cmd', ['vite', 'preview', '--port', '4174'], {
    cwd: rootDir,
    stdio: 'pipe',
    shell: true,
  })

  await new Promise((r) => setTimeout(r, 3000))

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  })

  const routes = [
    { name: 'home', path: '/' },
    { name: 'learn', path: '/learn' },
    { name: 'carousel', path: '/carousel' },
    { name: 'workflow', path: '/workflow' },
  ]

  const viewports = [
    { name: 'desktop-1280', width: 1280, height: 900 },
    { name: 'mobile-360', width: 360, height: 740 },
  ]

  const consoleErrors = []

  try {
    const page = await browser.newPage()

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[Console Error] ${msg.text()}`)
      }
    })

    page.on('pageerror', (err) => {
      consoleErrors.push(`[Page Error] ${err.message}`)
    })

    for (const route of routes) {
      for (const vp of viewports) {
        await page.setViewport({ width: vp.width, height: vp.height })
        const url = `http://localhost:4174${route.path}`
        console.log(`Checking ${route.name} at ${vp.name}...`)
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
        await new Promise((r) => setTimeout(r, 1000))

        const screenshotPath = path.join(screenshotsDir, `${route.name}-${vp.name}.png`)
        await page.screenshot({ path: screenshotPath, fullPage: false })
      }
    }

    // Test Home page filter interaction and modal
    await page.setViewport({ width: 1280, height: 900 })
    await page.goto('http://localhost:4174/', { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 1000))

    // Click Category tile "Clinics"
    const clinicButton = await page.$('button[aria-label*="Clinics"]')
    if (clinicButton) {
      await clinicButton.click()
      await new Promise((r) => setTimeout(r, 500))
    }

    // Click "Submit a correction" on first card
    const correctionBtn = await page.$('button[aria-label*="Submit a correction"]')
    if (correctionBtn) {
      await correctionBtn.click()
      await new Promise((r) => setTimeout(r, 500))
      await page.screenshot({ path: path.join(screenshotsDir, 'home-correction-modal.png') })
      // Close modal with escape
      await page.keyboard.press('Escape')
      await new Promise((r) => setTimeout(r, 500))
    }

    // Test Learn page lead modal
    await page.goto('http://localhost:4174/learn', { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 1000))
    const buttons = await page.$$('button')
    for (const b of buttons) {
      const text = await page.evaluate(el => el.textContent, b)
      if (text && text.includes('Reserve Your Seat')) {
        await b.click()
        break
      }
    }
    await new Promise((r) => setTimeout(r, 600))
    await page.screenshot({ path: path.join(screenshotsDir, 'learn-lead-modal-step1.png') })

    console.log('Console Errors captured:', consoleErrors)
    console.log('All verification checks completed!')
  } finally {
    await browser.close()
    preview.kill()
  }
}

run().catch((err) => {
  console.error('Error during verification:', err)
  process.exit(1)
})
