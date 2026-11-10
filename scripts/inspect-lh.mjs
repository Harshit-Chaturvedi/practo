import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

function inspectLh(route) {
  const filePath = path.join(rootDir, 'audit', `lh-${route}.json`)
  if (!fs.existsSync(filePath)) return
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const audits = data.audits
  const a11yFails = []

  for (const [key, audit] of Object.entries(audits)) {
    if (audit.score !== null && audit.score < 1) {
      // check if it belongs to accessibility
      const isA11y = data.categories.accessibility?.auditRefs?.some((ref) => ref.id === key)
      if (isA11y) {
        a11yFails.push({
          id: key,
          title: audit.title,
          description: audit.description,
          details: audit.details?.items?.map((it) => it.node?.snippet || it.node?.selector || it),
        })
      }
    }
  }

  console.log(`=== ${route} Accessibility Issues (${a11yFails.length}) ===`)
  console.log(JSON.stringify(a11yFails, null, 2))
}

inspectLh('home')
inspectLh('carousel')
