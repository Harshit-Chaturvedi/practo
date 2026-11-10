import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const routes = [
  { name: 'home', path: '/' },
  { name: 'learn', path: '/learn' },
  { name: 'carousel', path: '/carousel' },
  { name: 'workflow', path: '/workflow' },
]

async function run() {
  console.log('Starting preview server on port 4188...')
  const preview = spawn('npx.cmd', ['vite', 'preview', '--port', '4188'], {
    cwd: rootDir,
    stdio: 'pipe',
    shell: true,
  })

  await new Promise((r) => setTimeout(r, 2500))

  const results = {}

  for (const r of routes) {
    console.log(`Auditing ${r.name} with Lighthouse mobile...`)
    const url = `http://localhost:4188${r.path}`
    const outputPath = path.join(rootDir, 'audit', `lh-${r.name}.json`)

    await new Promise((resolve) => {
      const lh = spawn(
        'npx.cmd',
        [
          'lighthouse',
          url,
          '--output=json',
          `--output-path=${outputPath}`,
          '--form-factor=mobile',
          '--screenEmulation.mobile=true',
          '--throttling-method=provided',
          '--chrome-flags="--headless=new --no-sandbox --disable-gpu"',
          `--chrome-path="${chromePath}"`,
          '--only-categories=performance,accessibility,best-practices,seo',
          '--quiet',
        ],
        {
          cwd: rootDir,
          stdio: 'inherit',
          shell: true,
        }
      )

      lh.on('close', () => {
        resolve()
      })
    })

    if (fs.existsSync(outputPath)) {
      const report = JSON.parse(fs.readFileSync(outputPath, 'utf8'))
      results[r.name] = {
        performance: Math.round((report.categories.performance?.score || 0) * 100),
        accessibility: Math.round((report.categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((report.categories['best-practices']?.score || 0) * 100),
        seo: Math.round((report.categories.seo?.score || 0) * 100),
      }
    }
  }

  console.log('\n--- LIGHTHOUSE RESULTS ---')
  console.log(JSON.stringify(results, null, 2))

  preview.kill()
  process.exit(0)
}

run()
