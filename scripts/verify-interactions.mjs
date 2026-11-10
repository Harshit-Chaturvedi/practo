import puppeteer from 'puppeteer-core'
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

async function run() {
  console.log('Starting preview server on port 4182...')
  const preview = spawn('npx.cmd', ['vite', 'preview', '--port', '4182'], {
    cwd: rootDir,
    stdio: 'pipe',
    shell: true,
  })

  await new Promise((r) => setTimeout(r, 2500))

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const results = []

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 900 })

    // Test 1: Booking Modal on Home
    console.log('Testing BookingModal on /...')
    await page.goto('http://localhost:4182/', { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 500))

    const bookBtn = await page.$('button[aria-label*="Book appointment"]')
    if (bookBtn) {
      await bookBtn.click()
      await new Promise((r) => setTimeout(r, 400))
      const modal = await page.$('[role="dialog"]')
      const modalVisible = modal !== null
      results.push(`BookingModal opens: ${modalVisible}`)
      // Close with Esc
      await page.keyboard.press('Escape')
      await new Promise((r) => setTimeout(r, 300))
      const modalClosed = (await page.$('[role="dialog"]')) === null
      results.push(`BookingModal closes with Escape: ${modalClosed}`)
    } else {
      results.push('Booking button not found')
    }

    // Test 2: Category Filter on Home
    const clinicsBtn = await page.$('button[aria-label="Filter by Clinics"]')
    if (clinicsBtn) {
      await clinicsBtn.click()
      await new Promise((r) => setTimeout(r, 400))
      results.push('Category filter click successful')
    }

    // Test 3: Learn Page Reserve Modal
    console.log('Testing LeadCaptureModal on /learn...')
    await page.goto('http://localhost:4182/learn', { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 500))

    // Click Reserve Your Seat
    const allButtons = await page.$$('button')
    for (const b of allButtons) {
      const text = await page.evaluate(el => el.textContent, b)
      if (text && text.includes('Reserve Your Seat')) {
        await b.click()
        break
      }
    }
    await new Promise((r) => setTimeout(r, 400))
    const leadModal = await page.$('[role="dialog"]')
    results.push(`LeadCaptureModal opens for Reserve: ${leadModal !== null}`)
    await page.keyboard.press('Escape')
    await new Promise((r) => setTimeout(r, 300))

    // Test 4: Syllabus Intent
    for (const b of allButtons) {
      const text = await page.evaluate(el => el.textContent, b)
      if (text && text.includes('Download Syllabus')) {
        await b.click()
        break
      }
    }
    await new Promise((r) => setTimeout(r, 400))
    const syllabusModal = await page.$('[role="dialog"]')
    results.push(`LeadCaptureModal opens for Syllabus: ${syllabusModal !== null}`)
    await page.keyboard.press('Escape')

    console.log('\n--- INTERACTION AUDIT RESULTS ---')
    results.forEach((r) => console.log('  ' + r))
  } catch (err) {
    console.error('Interaction test failed:', err)
  } finally {
    await browser.close()
    preview.kill()
    process.exit(0)
  }
}

run()
