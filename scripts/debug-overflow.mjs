import puppeteer from 'puppeteer-core'
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

async function check() {
  const preview = spawn('npx.cmd', ['vite', 'preview', '--port', '4185'], {
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

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 360, height: 740 })
    await page.goto('http://localhost:4185/', { waitUntil: 'networkidle0' })

    const overflowing = await page.evaluate(() => {
      const docWidth = document.documentElement.clientWidth
      const elements = document.querySelectorAll('*')
      const results = []
      for (const el of elements) {
        const rect = el.getBoundingClientRect()
        if (rect.right > docWidth + 1) {
          results.push({
            tag: el.tagName,
            id: el.id,
            className: (el.className || '').toString().slice(0, 80),
            right: rect.right,
            width: rect.width,
          })
        }
      }
      return results.slice(0, 10)
    })

    console.log('Overflowing elements at 360px:', JSON.stringify(overflowing, null, 2))
  } finally {
    await browser.close()
    preview.kill()
    process.exit(0)
  }
}

check()
