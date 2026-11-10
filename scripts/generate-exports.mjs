import puppeteer from 'puppeteer-core'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { jsPDF } from 'jspdf'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const exportsDir = path.join(rootDir, 'exports')

if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir, { recursive: true })
}

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

async function run() {
  console.log('Starting preview server...')
  const preview = spawn('npx.cmd', ['vite', 'preview', '--port', '4173'], {
    cwd: rootDir,
    stdio: 'pipe',
    shell: true,
  })

  // Wait 3 seconds for server to start
  await new Promise((r) => setTimeout(r, 3000))

  console.log('Launching browser...')
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 1800, deviceScaleFactor: 1 })

    console.log('Navigating to carousel page...')
    await page.goto('http://localhost:4173/carousel', { waitUntil: 'networkidle0', timeout: 30000 })
    await new Promise((r) => setTimeout(r, 2000))

    // Query all hidden full-size slide containers
    // In CarouselPage, they are inside: style="left: -9999px; top: 0"
    // Let's find each slide element by evaluating in page
    console.log('Extracting slides...')
    const slideElements = await page.$$('div[aria-hidden="true"] > div[aria-label*="Slide"]')
    console.log(`Found ${slideElements.length} full-size slide elements`)

    const pngPaths = []

    for (let i = 0; i < slideElements.length; i++) {
      const el = slideElements[i]
      // Make it visible at top-left for clean screenshot
      await page.evaluate((element) => {
        element.style.position = 'fixed'
        element.style.left = '0px'
        element.style.top = '0px'
        element.style.zIndex = '99999'
      }, el)

      await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 })
      await new Promise((r) => setTimeout(r, 200))

      const filename = `slide-${i + 1}.png`
      const filePath = path.join(exportsDir, filename)
      await el.screenshot({ path: filePath, type: 'png' })
      console.log(`Saved ${filename}`)
      pngPaths.push(filePath)

      // Hide it back
      await page.evaluate((element) => {
        element.style.position = ''
        element.style.left = ''
        element.style.top = ''
        element.style.zIndex = ''
      }, el)
    }

    // Now generate PDF using jsPDF with JPEG compression (quality 0.9)
    console.log('Generating PDF with JPEG compression...')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [1080, 1350],
      compress: true,
    })

    for (let i = 0; i < slideElements.length; i++) {
      const el = slideElements[i]
      await page.evaluate((element) => {
        element.style.position = 'fixed'
        element.style.left = '0px'
        element.style.top = '0px'
        element.style.zIndex = '99999'
      }, el)

      await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 })
      await new Promise((r) => setTimeout(r, 200))

      const jpegBuffer = await el.screenshot({ type: 'jpeg', quality: 90 })
      const base64 = `data:image/jpeg;base64,${jpegBuffer.toString('base64')}`

      if (i > 0) {
        pdf.addPage([1080, 1350], 'portrait')
      }
      pdf.addImage(base64, 'JPEG', 0, 0, 1080, 1350, undefined, 'FAST')

      await page.evaluate((element) => {
        element.style.position = ''
        element.style.left = ''
        element.style.top = ''
        element.style.zIndex = ''
      }, el)
    }

    const pdfPath = path.join(exportsDir, 'practo-carousel.pdf')
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))
    fs.writeFileSync(pdfPath, pdfBuffer)
    console.log(`Saved PDF to ${pdfPath} (${pdfBuffer.length} bytes)`)

    console.log('Export generation completed successfully!')
  } finally {
    await browser.close()
    preview.kill()
  }
}

run().catch((err) => {
  console.error('Error generating exports:', err)
  process.exit(1)
})
