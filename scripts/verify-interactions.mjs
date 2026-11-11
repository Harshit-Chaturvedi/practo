import puppeteer from 'puppeteer-core'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const auditDir = path.join(rootDir, 'audit', 'qa-fixes')
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

async function main() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })

    // Test 1: Cross-route hash navigation from /learn to /#list-business
    console.log('Testing cross-route hash navigation...')
    await page.goto('http://localhost:4173/learn', { waitUntil: 'networkidle0' })
    await page.evaluate(() => {
      // Find list business link in header or drawer
      const link = Array.from(document.querySelectorAll('a')).find(a => a.getAttribute('href') === '/#list-business')
      if (link) link.click()
    })
    await new Promise((r) => setTimeout(r, 1200))
    const scrollPos = await page.evaluate(() => ({
      scrollY: window.scrollY,
      url: window.location.href,
      targetTop: document.getElementById('list-business')?.getBoundingClientRect().top
    }))
    console.log('Cross-route hash navigation result:', scrollPos)

    // Test 2: Call toast replacing
    console.log('Testing call toast replacing on home...')
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' })
    const callButtons = await page.$$('article button[aria-label^="Call"]')
    if (callButtons.length >= 2) {
      await callButtons[0].click()
      await new Promise(r => setTimeout(r, 200))
      const toast1 = await page.evaluate(() => document.querySelector('div[role="status"]')?.textContent)
      console.log('Toast after 1st click:', toast1)

      await callButtons[1].click()
      await new Promise(r => setTimeout(r, 200))
      const toast2 = await page.evaluate(() => document.querySelector('div[role="status"]')?.textContent)
      console.log('Toast after 2nd click:', toast2)

      const toastCount = await page.evaluate(() => document.querySelectorAll('div[role="status"] > div').length)
      console.log('Number of toast elements visible:', toastCount)
    }

    // Screenshot of home toast
    await page.screenshot({ path: path.join(auditDir, 'call-toast-live.png') })

    // Test 3: Learn hero syllabus button contrast
    console.log('Testing syllabus button contrast on /learn...')
    await page.goto('http://localhost:4173/learn', { waitUntil: 'networkidle0' })
    const buttonStyles = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Download Syllabus'))
      if (!btn) return null
      const comp = window.getComputedStyle(btn)
      return {
        text: btn.textContent.trim(),
        bg: comp.backgroundColor,
        color: comp.color,
      }
    })
    console.log('Syllabus button computed styles:', buttonStyles)

    // Test 4: Mobile drawer escape & focus at 360px
    console.log('Testing mobile drawer at 360px...')
    await page.setViewport({ width: 360, height: 800 })
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' })
    const hamburger = await page.$('button[aria-label="Open menu"]')
    if (hamburger) {
      await hamburger.click()
      await new Promise(r => setTimeout(r, 300))
      await page.screenshot({ path: path.join(auditDir, 'mobile-drawer-open.png') })
      
      const drawerOpen = await page.evaluate(() => !!document.querySelector('nav[aria-label="Mobile Navigation"]'))
      console.log('Drawer opened:', drawerOpen)

      await page.keyboard.press('Escape')
      await new Promise(r => setTimeout(r, 300))
      const drawerClosed = await page.evaluate(() => !document.querySelector('nav[aria-label="Mobile Navigation"]'))
      console.log('Drawer closed after Escape:', drawerClosed)
    }

    // Test 5: Sticky CTA bar on /learn at 360px
    console.log('Testing sticky mobile bar on /learn at 360px...')
    await page.goto('http://localhost:4173/learn', { waitUntil: 'networkidle0' })
    // At scrollY=0, hero CTA is in view, sticky bar should be hidden
    const stickyAtTop = await page.evaluate(() => {
      const bar = document.querySelector('div.fixed.bottom-0.inset-x-0')
      return {
        hasTranslateY: bar?.className.includes('translate-y-full'),
        pointerEventsNone: bar?.className.includes('pointer-events-none'),
      }
    })
    console.log('Sticky bar at top (hero CTA in view):', stickyAtTop)

    // Scroll down 1000px so hero CTA is out of view
    await page.evaluate(() => window.scrollTo(0, 1000))
    await new Promise(r => setTimeout(r, 500))
    const stickyAfterScroll = await page.evaluate(() => {
      const bar = document.querySelector('div.fixed.bottom-0.inset-x-0')
      return {
        hasTranslateY: bar?.className.includes('translate-y-full'),
        pointerEventsNone: bar?.className.includes('pointer-events-none'),
      }
    })
    console.log('Sticky bar scrolled down (hero CTA out of view):', stickyAfterScroll)
    await page.screenshot({ path: path.join(auditDir, 'learn-sticky-bar-scrolled.png') })

    await browser.close()
    console.log('Interactions verification complete!')
  } catch (err) {
    console.error('Interactions verification failed:', err)
    await browser.close()
    process.exit(1)
  }
}

main()
