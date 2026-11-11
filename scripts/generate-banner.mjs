/**
 * Generate a branded banner image (1280x640) for the README.
 * Uses HTML/CSS rendering via puppeteer-core. No stock photos.
 */
import puppeteer from 'puppeteer-core'
import { statSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(__dirname, '..', 'docs', 'screenshots')
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1280px;
    height: 640px;
    overflow: hidden;
    font-family: 'Manrope', sans-serif;
    background: #0B4F4A;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  /* Subtle pattern overlay */
  body::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 20% 30%, rgba(245,158,11,0.06) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(15,118,110,0.1) 0%, transparent 40%);
    z-index: 1;
  }

  /* Grid decoration — removed for smaller file size */

  .banner {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 60px;
    padding: 0 80px;
    width: 100%;
  }

  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .logo-lockup {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .logo-icon {
    width: 52px;
    height: 52px;
    background: #F59E0B;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    box-shadow: 0 4px 16px rgba(245,158,11,0.3);
  }

  .logo-text {
    font-size: 32px;
    font-weight: 800;
    color: #FBF8F3;
    letter-spacing: -0.5px;
  }

  .logo-text span {
    color: #F59E0B;
  }

  .tagline {
    font-size: 18px;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    color: rgba(251,248,243,0.7);
    line-height: 1.5;
    max-width: 440px;
  }

  .badges {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 4px;
  }

  .badge {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.3px;
  }

  .badge-amber {
    background: rgba(245,158,11,0.15);
    color: #F59E0B;
    border: 1px solid rgba(245,158,11,0.3);
  }

  .badge-teal {
    background: rgba(238,245,243,0.1);
    color: rgba(251,248,243,0.8);
    border: 1px solid rgba(251,248,243,0.15);
  }

  .right {
    flex: 0 0 480px;
    display: flex;
    gap: 16px;
    align-items: center;
    perspective: 1000px;
  }

  .device {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.2);
    border: 2px solid rgba(251,248,243,0.1);
    position: relative;
  }

  .device-desktop {
    width: 300px;
    height: 190px;
    background: #FBF8F3;
    transform: rotateY(-5deg);
  }

  .device-mobile {
    width: 130px;
    height: 250px;
    background: #FBF8F3;
    border-radius: 20px;
    transform: rotateY(5deg) translateY(10px);
  }

  .device-bar {
    height: 24px;
    background: #0F766E;
    display: flex;
    align-items: center;
    padding: 0 8px;
    gap: 4px;
  }

  .device-bar .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(251,248,243,0.4);
  }

  .device-bar .url {
    font-size: 8px;
    color: rgba(251,248,243,0.6);
    font-family: 'Inter', monospace;
    margin-left: 8px;
  }

  .device-content {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .mock-hero {
    background: linear-gradient(135deg, #0F766E, #0B4F4A);
    border-radius: 6px;
    padding: 12px;
    color: #FBF8F3;
  }

  .mock-hero h4 {
    font-size: 9px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .mock-search {
    background: white;
    border-radius: 4px;
    height: 14px;
    display: flex;
    align-items: center;
    padding: 0 6px;
  }

  .mock-search-dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #4B5563;
    margin-right: 4px;
  }

  .mock-cards {
    display: flex;
    gap: 6px;
  }

  .mock-card {
    flex: 1;
    background: white;
    border: 1px solid #E3E0D8;
    border-radius: 4px;
    padding: 6px;
  }

  .mock-card-img {
    height: 24px;
    background: #EEF5F3;
    border-radius: 3px;
    margin-bottom: 4px;
  }

  .mock-card-line {
    height: 3px;
    background: #E3E0D8;
    border-radius: 2px;
    margin-bottom: 3px;
  }

  .mock-card-line.short { width: 60%; }

  .mock-btn {
    height: 10px;
    width: 40px;
    background: #F59E0B;
    border-radius: 3px;
    margin-top: 2px;
  }

  /* Mobile device mockup */
  .mobile-bar {
    height: 20px;
    background: #0F766E;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mobile-bar .notch {
    width: 50px;
    height: 10px;
    background: rgba(0,0,0,0.3);
    border-radius: 0 0 8px 8px;
  }

  .mobile-content {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .mobile-hero-block {
    background: linear-gradient(135deg, #0F766E, #0B4F4A);
    border-radius: 6px;
    padding: 10px;
    color: #FBF8F3;
  }

  .mobile-hero-block h5 {
    font-size: 8px;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .mobile-tile-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
  }

  .mobile-tile {
    background: white;
    border: 1px solid #E3E0D8;
    border-radius: 4px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 5px;
    color: #4B5563;
    font-family: 'Inter', sans-serif;
  }

  .mobile-list-item {
    background: white;
    border: 1px solid #E3E0D8;
    border-radius: 4px;
    padding: 6px;
    display: flex;
    gap: 6px;
  }

  .mobile-list-img {
    width: 28px;
    height: 28px;
    background: #EEF5F3;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .mobile-list-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
</style>
</head>
<body>
  <div class="banner">
    <div class="left">
      <div class="logo-lockup">
        <div class="logo-icon">🐾</div>
        <div class="logo-text">Practo <span>for Animals</span></div>
      </div>
      <div class="tagline">
        Animal-care discovery, AI course landing page,
        and content automation workflow — built as one cohesive
        healthtech prototype.
      </div>
      <div class="badges">
        <span class="badge badge-amber">React 19</span>
        <span class="badge badge-amber">TypeScript</span>
        <span class="badge badge-teal">Vite</span>
        <span class="badge badge-teal">Tailwind CSS</span>
        <span class="badge badge-teal">Vercel</span>
      </div>
    </div>
    <div class="right">
      <div class="device device-desktop">
        <div class="device-bar">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="url">practo-lovat.vercel.app</span>
        </div>
        <div class="device-content">
          <div class="mock-hero">
            <h4>Find trusted animal care near you</h4>
            <div class="mock-search">
              <span class="mock-search-dot"></span>
              <span class="mock-search-dot"></span>
              <span class="mock-search-dot"></span>
            </div>
          </div>
          <div class="mock-cards">
            <div class="mock-card">
              <div class="mock-card-img"></div>
              <div class="mock-card-line"></div>
              <div class="mock-card-line short"></div>
              <div class="mock-btn"></div>
            </div>
            <div class="mock-card">
              <div class="mock-card-img"></div>
              <div class="mock-card-line"></div>
              <div class="mock-card-line short"></div>
              <div class="mock-btn"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="device device-mobile">
        <div class="mobile-bar">
          <span class="notch"></span>
        </div>
        <div class="mobile-content">
          <div class="mobile-hero-block">
            <h5>AI Course for Professionals</h5>
            <div class="mock-search">
              <span style="font-size:5px;color:#F59E0B;font-weight:700;font-family:Inter">Reserve Seat</span>
            </div>
          </div>
          <div class="mobile-tile-row">
            <div class="mobile-tile">Clinics</div>
            <div class="mobile-tile">Boarding</div>
            <div class="mobile-tile">Labs</div>
          </div>
          <div class="mobile-list-item">
            <div class="mobile-list-img"></div>
            <div class="mobile-list-text">
              <div class="mock-card-line"></div>
              <div class="mock-card-line short"></div>
            </div>
          </div>
          <div class="mobile-list-item">
            <div class="mobile-list-img"></div>
            <div class="mobile-list-text">
              <div class="mock-card-line"></div>
              <div class="mock-card-line short"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 640 })
  await page.setContent(html, { waitUntil: 'networkidle0', timeout: 15000 })
  await page.evaluate(() => new Promise(r => setTimeout(r, 2000)))

  const path = resolve(outDir, 'banner.png')
  await page.screenshot({ path, type: 'png', omitBackground: false, optimizeForSpeed: false })
  const size = statSync(path).size
  console.log(`✓ banner.png — ${(size / 1024).toFixed(0)} KB`)

  await browser.close()
}

main().catch(e => { console.error(e); process.exit(1) })
