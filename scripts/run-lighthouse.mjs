import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const reportsDir = path.join(rootDir, 'audit', 'qa-fixes')

const routes = [
  { name: 'home', url: 'http://localhost:4173/' },
  { name: 'learn', url: 'http://localhost:4173/learn' },
  { name: 'carousel', url: 'http://localhost:4173/carousel' },
  { name: 'workflow', url: 'http://localhost:4173/workflow' },
]

console.log('Running Lighthouse mobile audits on 4 routes...')
const summary = []

for (const r of routes) {
  const jsonPath = path.join(reportsDir, `lh-${r.name}.json`)
  const cmd = `npx lighthouse ${r.url} --form-factor=mobile --screenEmulation.mobile=true --only-categories=performance,accessibility,best-practices,seo --output=json --output-path="${jsonPath}" --chrome-flags="--headless=new --no-sandbox --disable-gpu"`
  
  console.log(`Auditing ${r.name} (${r.url})...`)
  try {
    execSync(cmd, { stdio: 'pipe' })
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
    const cats = data.categories
    summary.push({
      route: r.name,
      performance: Math.round(cats.performance.score * 100),
      accessibility: Math.round(cats.accessibility.score * 100),
      bestPractices: Math.round(cats['best-practices'].score * 100),
      seo: Math.round(cats.seo.score * 100),
    })
  } catch (err) {
    console.error(`Failed auditing ${r.name}:`, err.message)
  }
}

console.log('\n--- LIGHTHOUSE MOBILE SCORES ---')
console.table(summary)
