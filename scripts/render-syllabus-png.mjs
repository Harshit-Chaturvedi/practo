import fs from 'fs'
import puppeteer from 'puppeteer-core'

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const pdfBase64 = fs.readFileSync('public/syllabus.pdf').toString('base64')

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1400, height: 2000 })

    const html = `<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <style>body { margin: 0; background: #fff; }</style>
  </head>
  <body>
    <canvas id="p1"></canvas>
    <canvas id="p2"></canvas>
    <script>
      const pdfData = atob("${pdfBase64}");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      pdfjsLib.getDocument({ data: pdfData }).promise.then(async (pdf) => {
        for (let i = 1; i <= 2; i++) {
          const p = await pdf.getPage(i);
          const viewport = p.getViewport({ scale: 2 });
          const canvas = document.getElementById("p" + i);
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          await p.render({ canvasContext: ctx, viewport }).promise;
        }
        window.__DONE = true;
      }).catch(err => {
        console.error(err);
        window.__ERROR = err.message;
      });
    </script>
  </body>
</html>`

    await page.setContent(html)
    await page.waitForFunction('window.__DONE === true || window.__ERROR', { timeout: 30000 })

    const p1 = await page.$('#p1')
    await p1.screenshot({ path: 'audit/qa-fixes/syllabus-page-1.png' })
    const p2 = await page.$('#p2')
    await p2.screenshot({ path: 'audit/qa-fixes/syllabus-page-2.png' })
    console.log('Successfully saved syllabus-page-1.png and syllabus-page-2.png')
  } finally {
    await browser.close()
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
