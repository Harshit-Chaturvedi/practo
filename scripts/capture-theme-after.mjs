import puppeteer from 'puppeteer-core'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const targetDir = path.join(rootDir, 'audit', 'theme-after')

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true })
}

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

async function run() {
  console.log('Starting preview server on port 4180...')
  const preview = spawn('npx.cmd', ['vite', 'preview', '--port', '4180'], {
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
    { name: '1280', width: 1280, height: 900 },
    { name: '360', width: 360, height: 740 },
  ]

  const consoleErrors = []
  const scrollIssues = []

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
        const url = `http://localhost:4180${route.path}`
        console.log(`Checking ${route.name} at ${vp.name}px...`)
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
        await new Promise((r) => setTimeout(r, 600))

        // Check horizontal scroll
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
        const innerWidth = await page.evaluate(() => window.innerWidth)
        if (scrollWidth > innerWidth) {
          scrollIssues.push(`${route.name} at ${vp.name}px has scrollWidth ${scrollWidth} > ${innerWidth}`)
        }

        const screenshotPath = path.join(targetDir, `${route.name}-${vp.name}.png`)
        await page.screenshot({ path: screenshotPath, fullPage: true })
      }
    }

    console.log('\n--- VERIFICATION REPORT ---')
    console.log(`Horizontal scroll issues: ${scrollIssues.length}`)
    scrollIssues.forEach((s) => console.log('  ' + s))

    console.log(`Console errors: ${consoleErrors.length}`)
    consoleErrors.forEach((e) => console.log('  ' + e))
  } catch (err) {
    console.error('Test run failed:', err)
  } finally {
    await browser.close()
    preview.kill()
    process.exit(0)
  }
}

run()
