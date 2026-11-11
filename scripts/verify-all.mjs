import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const auditDir = path.join(rootDir, 'audit', 'qa-fixes')

if (!fs.existsSync(auditDir)) {
  fs.mkdirSync(auditDir, { recursive: true })
}

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const viewports = [
  { name: 'mobile', width: 360, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
]

const routes = [
  { name: 'home', path: '/' },
  { name: 'learn', path: '/learn' },
  { name: 'carousel', path: '/carousel' },
  { name: 'workflow', path: '/workflow' },
]

async function main() {
  console.log('Connecting to preview server at http://localhost:4173...')

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  })

  const results = []

  try {
    for (const route of routes) {
      for (const vp of viewports) {
        const page = await browser.newPage()
        const consoleErrors = []
        page.on('console', (msg) => {
          if (msg.type() === 'error') consoleErrors.push(msg.text())
        })
        page.on('pageerror', (err) => {
          consoleErrors.push(err.message)
        })

        await page.setViewport({ width: vp.width, height: vp.height })
        const url = `http://localhost:4173${route.path}`
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
        await new Promise((r) => setTimeout(r, 600))

        const evalResult = await page.evaluate(() => {
          const scrollW = document.documentElement.scrollWidth
          const innerW = window.innerWidth
          const noHScroll = scrollW <= innerW

          // Count elements with computed opacity 0 in main
          const main = document.querySelector('main') || document.querySelector('#root > div')
          let zeroOpacityCount = 0
          if (main) {
            const allEls = main.querySelectorAll('*')
            for (const el of allEls) {
              const rect = el.getBoundingClientRect()
              if (rect.top >= 0 && rect.top <= window.innerHeight && rect.width > 0 && rect.height > 0) {
                const style = window.getComputedStyle(el)
                if (style.opacity === '0' || style.visibility === 'hidden') {
                  zeroOpacityCount++
                }
              }
            }
          }

          const pageTitle = document.title
          const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
          const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || ''

          return {
            scrollW,
            innerW,
            noHScroll,
            zeroOpacityCount,
            pageTitle,
            metaDesc,
            ogTitle,
          }
        })

        const shotPath = path.join(auditDir, `${route.name}-${vp.name}.png`)
        await page.screenshot({ path: shotPath, fullPage: false })

        results.push({
          route: route.name,
          viewport: `${vp.name} (${vp.width}x${vp.height})`,
          noHScroll: evalResult.noHScroll ? 'PASS' : `FAIL (${evalResult.scrollW} > ${evalResult.innerW})`,
          consoleErrors: consoleErrors.length === 0 ? '0' : consoleErrors.join('; '),
          visibleAtScroll0: evalResult.zeroOpacityCount === 0 ? 'PASS (0 hidden)' : `FAIL (${evalResult.zeroOpacityCount} hidden)`,
          pageTitle: evalResult.pageTitle,
          screenshot: path.basename(shotPath),
        })

        await page.close()
      }
    }

    // 404 Page Check
    const page404 = await browser.newPage()
    await page404.setViewport({ width: 1280, height: 800 })
    await page404.goto('http://localhost:4173/non-existent-page-test-12345', { waitUntil: 'networkidle0' })
    const res404 = await page404.evaluate(() => {
      const h1 = document.querySelector('h1')?.textContent || ''
      const hasBackHome = !!Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('Back to Home'))
      return { title: document.title, h1, hasBackHome }
    })
    const shot404 = path.join(auditDir, 'notfound-desktop.png')
    await page404.screenshot({ path: shot404 })
    await page404.close()

    console.log('\n--- VERIFICATION AUDIT RESULTS ---')
    console.table(results)

    console.log('\n--- 404 CHECK ---')
    console.log(`404 Route Title: "${res404.title}"`)
    console.log(`404 H1: "${res404.h1}"`)
    console.log(`404 Back to Home button present: ${res404.hasBackHome}`)

    await browser.close()
  } catch (err) {
    console.error('Audit failed:', err)
    await browser.close()
    process.exit(1)
  }
}

main()
