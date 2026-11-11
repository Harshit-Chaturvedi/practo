import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '..', 'public');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  console.log('Generating og-image.png (1200x630) and apple-touch-icon.png (180x180)...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
  });

  try {
    const page = await browser.newPage();

    // 1. Generate 1200x630 og-image.png
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
    const ogHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1200px;
      height: 630px;
      background: #0B4F4A;
      color: #FFFFFF;
      font-family: 'Inter', sans-serif;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 64px 72px;
      position: relative;
    }
    .ambient-1 {
      position: absolute;
      top: -120px;
      right: -100px;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(15, 118, 110, 0.45) 0%, rgba(11, 79, 74, 0) 70%);
      pointer-events: none;
    }
    .ambient-2 {
      position: absolute;
      bottom: -150px;
      left: 100px;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(11, 79, 74, 0) 70%);
      pointer-events: none;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      z-index: 10;
    }
    .logo-lockup {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .logo-icon {
      width: 54px;
      height: 54px;
      border-radius: 16px;
      background: #0F766E;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
    }
    .logo-text {
      font-family: 'Manrope', sans-serif;
      font-weight: 800;
      font-size: 28px;
      letter-spacing: -0.5px;
      line-height: 1;
    }
    .logo-sub {
      color: #F59E0B;
      font-size: 20px;
      font-weight: 600;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 8px 16px;
      border-radius: 100px;
      font-size: 14px;
      font-weight: 600;
      color: #FBF8F3;
    }
    .content {
      position: relative;
      z-index: 10;
      margin-top: 24px;
    }
    .eyebrow {
      display: inline-block;
      text-transform: uppercase;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #F59E0B;
      margin-bottom: 12px;
    }
    h1 {
      font-family: 'Manrope', sans-serif;
      font-weight: 800;
      font-size: 52px;
      line-height: 1.15;
      letter-spacing: -1px;
      max-width: 980px;
      color: #FFFFFF;
      margin-bottom: 18px;
    }
    .desc {
      font-size: 20px;
      line-height: 1.5;
      color: #D1D5DB;
      max-width: 860px;
    }
    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      padding-top: 24px;
      position: relative;
      z-index: 10;
    }
    .pills {
      display: flex;
      gap: 12px;
    }
    .pill {
      background: rgba(15, 118, 110, 0.5);
      border: 1px solid rgba(15, 118, 110, 0.8);
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #E6FFFA;
    }
    .domain {
      font-family: 'Manrope', sans-serif;
      font-weight: 700;
      font-size: 18px;
      color: #F59E0B;
    }
  </style>
</head>
<body>
  <div class="ambient-1"></div>
  <div class="ambient-2"></div>
  
  <div class="header">
    <div class="logo-lockup">
      <div class="logo-icon">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 5v14M5 12h14" />
          <circle cx="6" cy="6" r="1.5" fill="#FFFFFF" />
          <circle cx="18" cy="6" r="1.5" fill="#FFFFFF" />
          <circle cx="6" cy="18" r="1.5" fill="#FFFFFF" />
          <circle cx="18" cy="18" r="1.5" fill="#FFFFFF" />
        </svg>
      </div>
      <div class="logo-text">
        Practo <span class="logo-sub">for Animals</span>
      </div>
    </div>
    <div class="badge">
      <span>● Mumbai Pilot Network</span>
    </div>
  </div>

  <div class="content">
    <div class="eyebrow">Veterinary Discovery & Care Architecture</div>
    <h1>Trusted Veterinary Care, 24/7 Emergency Triage & Learning</h1>
    <p class="desc">Find verified animal hospitals, emergency ambulances, diagnostic labs, and rescue NGOs with transparent doctor hours, verified fees, and AI marketing mastery.</p>
  </div>

  <div class="footer">
    <div class="pills">
      <span class="pill">24/7 ICU & Ambulance</span>
      <span class="pill">Verified Doctor Consultations</span>
      <span class="pill">Free AI Demo Class</span>
      <span class="pill">Live Apps Script Webhook</span>
    </div>
    <div class="domain">practo-lovat.vercel.app</div>
  </div>
</body>
</html>`;

    await page.setContent(ogHtml, { waitUntil: 'networkidle0' });
    const ogPath = path.join(publicDir, 'og-image.png');
    await page.screenshot({ path: ogPath, type: 'png' });
    console.log(`Saved og-image.png to ${ogPath}`);

    // 2. Generate 180x180 apple-touch-icon.png
    const page2 = await browser.newPage();
    await page2.setViewport({ width: 180, height: 180, deviceScaleFactor: 2 });
    const appleHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; }
    body { background: transparent; display: flex; align-items: center; justify-content: center; width: 180px; height: 180px; }
    svg { width: 180px; height: 180px; }
  </style>
</head>
<body>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="180" height="180">
    <rect width="48" height="48" rx="11" fill="#0F766E"/>
    <path d="M24 11v26M11 24h26" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="13" cy="13" r="2.75" fill="#FFFFFF" />
    <circle cx="35" cy="13" r="2.75" fill="#FFFFFF" />
    <circle cx="13" cy="35" r="2.75" fill="#FFFFFF" />
    <circle cx="35" cy="35" r="2.75" fill="#FFFFFF" />
  </svg>
</body>
</html>`;
    await page2.setContent(appleHtml, { waitUntil: 'domcontentloaded' });
    const applePath = path.join(publicDir, 'apple-touch-icon.png');
    await page2.screenshot({ path: applePath, type: 'png' });
    console.log(`Saved apple-touch-icon.png to ${applePath}`);

    await browser.close();
  } catch (err) {
    console.error('Error generating images:', err);
    await browser.close();
    process.exit(1);
  }
}

main();
