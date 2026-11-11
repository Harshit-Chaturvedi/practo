import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { jsPDF } from 'jspdf'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const courseData = [
  {
    number: 1,
    title: 'AI Tools & Prompting',
    description: 'Master the art of working with AI assistants to dramatically speed up your daily workflows.',
    topics: [
      'Prompt engineering fundamentals',
      'ChatGPT, Claude, and Gemini for work',
      'AI for research, writing, and analysis',
      'Building custom GPTs and workflows',
    ],
    outcome: 'Write effective prompts that get consistent, high-quality results',
  },
  {
    number: 2,
    title: 'Automation with Make & n8n',
    description: 'Build no-code automations that save hours of repetitive work every week.',
    topics: [
      'Automation thinking and process mapping',
      'Make.com scenarios from scratch',
      'n8n self-hosted workflows',
      'Connecting apps: forms, sheets, email, Slack',
    ],
    outcome: 'Automate a real multi-step business workflow end to end',
  },
  {
    number: 3,
    title: 'Building Sites with AI',
    description: 'Ship professional websites and landing pages using AI-powered tools.',
    topics: [
      'AI website builders: v0, Bolt, Lovable',
      'Vite + React + Tailwind fundamentals',
      'AI-assisted coding with Cursor and Copilot',
      'Deploying to Vercel and Netlify',
    ],
    outcome: 'Build and deploy a responsive website from idea to live URL',
  },
  {
    number: 4,
    title: 'AI Content Creation',
    description: 'Create scroll-stopping social media content and brand assets at scale.',
    topics: [
      'AI copywriting for social media',
      'Image generation with Midjourney and DALL-E',
      'Video creation with AI tools',
      'Brand consistency and content calendars',
    ],
    outcome: 'Produce a week of branded content in under 2 hours',
  },
  {
    number: 5,
    title: 'Data Basics for Non-Techies',
    description: 'Learn to collect, analyse, and visualise data to make informed decisions.',
    topics: [
      'Spreadsheet power: pivot tables, formulas',
      'Google Sheets + AI analysis',
      'Simple dashboards and data storytelling',
      'Tracking metrics that matter',
    ],
    outcome: 'Turn raw data into actionable insights and clear visuals',
  },
  {
    number: 6,
    title: 'Capstone Project',
    description: 'Bring it all together by building a real project from start to finish.',
    topics: [
      'Problem identification and scoping',
      'End-to-end project using all modules',
      'Peer review and iteration',
      'Portfolio-ready presentation',
    ],
    outcome: 'A portfolio-ready project that demonstrates all skills learned',
  },
]

const batches = [
  { label: 'Self-Paced', price: 'To be announced', date: 'To be announced', desc: '6 video modules + project templates' },
  { label: 'Live Cohort', price: 'To be announced', date: 'To be announced', desc: 'Live weekly mentor labs + capstone review' },
  { label: 'Team / Enterprise', price: 'Custom pricing', date: 'Flexible schedule', desc: 'Custom curriculum + dedicated Slack' },
]

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4', // 210 x 297 mm
})

// Brand Theme Colors (Teal / Amber palette — No Indigo)
const tealDark = [11, 79, 74]   // #0B4F4A
const teal = [15, 118, 110]      // #0F766E
const amber = [245, 158, 11]     // #F59E0B
const ink = [31, 42, 46]         // #1F2A2E
const gray = [75, 85, 99]        // #4B5563 (text-muted)
const cream = [251, 248, 243]    // #FBF8F3
const border = [227, 224, 216]   // #E3E0D8

// ================= PAGE 1 =================
// Header Banner (Teal Dark)
doc.setFillColor(tealDark[0], tealDark[1], tealDark[2])
doc.rect(0, 0, 210, 42, 'F')

// Amber accent bar
doc.setFillColor(amber[0], amber[1], amber[2])
doc.rect(0, 41, 210, 1.5, 'F')

doc.setTextColor(255, 255, 255)
doc.setFont('helvetica', 'bold')
doc.setFontSize(22)
doc.text('Practo for Animals — AI Education', 15, 18)

doc.setFont('helvetica', 'normal')
doc.setFontSize(11)
doc.text('6-Week Applied AI & Workflow Automation Masterclass — Syllabus', 15, 28)

doc.setFontSize(9)
doc.setTextColor(204, 251, 241) // teal-100
doc.text('Website: practo-lovat.vercel.app/learn  |  Cohort Batch: Founding 2026', 15, 36)

// Overview section
doc.setTextColor(ink[0], ink[1], ink[2])
doc.setFont('helvetica', 'bold')
doc.setFontSize(13)
doc.text('Course Overview & Target Outcomes', 15, 52)

doc.setFont('helvetica', 'normal')
doc.setFontSize(9.5)
doc.setTextColor(gray[0], gray[1], gray[2])
const overviewText = 'Designed for clinicians, students, professionals, and care coordinators seeking to master real-world AI assistants, automations (Make/n8n), rapid web deployment, and automated communications without requiring prior programming experience.'
doc.text(doc.splitTextToSize(overviewText, 180), 15, 59)

// Modules 1 to 3
let y = 74
doc.setFont('helvetica', 'bold')
doc.setFontSize(12)
doc.setTextColor(tealDark[0], tealDark[1], tealDark[2])
doc.text('Part I: Foundations, Systems & Web (Weeks 1 – 3)', 15, y)
y += 6

courseData.slice(0, 3).forEach((mod) => {
  doc.setFillColor(cream[0], cream[1], cream[2])
  doc.roundedRect(15, y, 180, 50, 3, 3, 'F')
  doc.setDrawColor(border[0], border[1], border[2])
  doc.roundedRect(15, y, 180, 50, 3, 3, 'S')

  // Left teal accent indicator
  doc.setFillColor(teal[0], teal[1], teal[2])
  doc.roundedRect(15, y, 3.5, 50, 1.5, 1.5, 'F')

  doc.setTextColor(teal[0], teal[1], teal[2])
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text(`Module ${mod.number}: ${mod.title}`, 22, y + 8)

  doc.setTextColor(ink[0], ink[1], ink[2])
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.text(doc.splitTextToSize(mod.description, 168), 22, y + 15)

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(ink[0], ink[1], ink[2])
  doc.text('Key Topics:', 22, y + 25)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(gray[0], gray[1], gray[2])
  const wrappedTopics = doc.splitTextToSize(mod.topics.join('  •  '), 145)
  doc.text(wrappedTopics, 42, y + 25)

  doc.setTextColor(tealDark[0], tealDark[1], tealDark[2])
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.text(`Project Outcome: ${mod.outcome}`, 22, y + 43)

  y += 56
})

doc.setFont('helvetica', 'normal')
doc.setFontSize(8)
doc.setTextColor(gray[0], gray[1], gray[2])
doc.text('Page 1 of 2  •  Practo for Animals Course Syllabus', 15, 288)

// ================= PAGE 2 =================
doc.addPage()

// Page 2 header (Teal Dark)
doc.setFillColor(tealDark[0], tealDark[1], tealDark[2])
doc.rect(0, 0, 210, 24, 'F')

doc.setFillColor(amber[0], amber[1], amber[2])
doc.rect(0, 23, 210, 1, 'F')

doc.setTextColor(255, 255, 255)
doc.setFont('helvetica', 'bold')
doc.setFontSize(13)
doc.text('Practo for Animals — Curriculum Part II & Enrollment Details', 15, 15)

y = 33
doc.setFont('helvetica', 'bold')
doc.setFontSize(12)
doc.setTextColor(tealDark[0], tealDark[1], tealDark[2])
doc.text('Part II: Creative Production, Analytics & Capstone (Weeks 4 – 6)', 15, y)
y += 6

courseData.slice(3, 6).forEach((mod) => {
  doc.setFillColor(cream[0], cream[1], cream[2])
  doc.roundedRect(15, y, 180, 50, 3, 3, 'F')
  doc.setDrawColor(border[0], border[1], border[2])
  doc.roundedRect(15, y, 180, 50, 3, 3, 'S')

  // Left teal accent indicator
  doc.setFillColor(teal[0], teal[1], teal[2])
  doc.roundedRect(15, y, 3.5, 50, 1.5, 1.5, 'F')

  doc.setTextColor(teal[0], teal[1], teal[2])
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text(`Module ${mod.number}: ${mod.title}`, 22, y + 8)

  doc.setTextColor(ink[0], ink[1], ink[2])
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.text(doc.splitTextToSize(mod.description, 168), 22, y + 15)

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(ink[0], ink[1], ink[2])
  doc.text('Key Topics:', 22, y + 25)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(gray[0], gray[1], gray[2])
  const wrappedTopics = doc.splitTextToSize(mod.topics.join('  •  '), 145)
  doc.text(wrappedTopics, 42, y + 25)

  doc.setTextColor(tealDark[0], tealDark[1], tealDark[2])
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.text(`Project Outcome: ${mod.outcome}`, 22, y + 43)

  y += 56
})

// Cohort & Pricing section
y += 2
doc.setTextColor(ink[0], ink[1], ink[2])
doc.setFont('helvetica', 'bold')
doc.setFontSize(12)
doc.text('Cohort Formats & Pricing', 15, y)
y += 6

const colW = 57
batches.forEach((b, idx) => {
  const x = 15 + idx * (colW + 4.5)
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(x, y, colW, 36, 2, 2, 'F')
  doc.setDrawColor(border[0], border[1], border[2])
  doc.roundedRect(x, y, colW, 36, 2, 2, 'S')

  doc.setTextColor(teal[0], teal[1], teal[2])
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.text(b.label, x + 4, y + 7)

  doc.setFontSize(10)
  doc.setTextColor(amber[0], amber[1], amber[2])
  doc.text(b.price, x + 4, y + 14)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(gray[0], gray[1], gray[2])
  doc.text(`Cohort: ${b.date}`, x + 4, y + 20)
  doc.text(doc.splitTextToSize(b.desc, colW - 8), x + 4, y + 26)
})

y += 44
// Bottom call to action card
doc.setFillColor(tealDark[0], tealDark[1], tealDark[2])
doc.roundedRect(15, y, 180, 18, 3, 3, 'F')
doc.setTextColor(255, 255, 255)
doc.setFont('helvetica', 'bold')
doc.setFontSize(9.5)
doc.text('Reserve Your Seat or Inquire:', 22, y + 7)
doc.setFont('helvetica', 'normal')
doc.setFontSize(8.5)
doc.setTextColor(204, 251, 241) // teal-100
doc.text('Visit: practo-lovat.vercel.app/learn  •  Email: admissions@practoforanimals.com', 22, y + 13)

doc.setFont('helvetica', 'normal')
doc.setFontSize(8)
doc.setTextColor(gray[0], gray[1], gray[2])
doc.text('Page 2 of 2  •  Practo for Animals Course Syllabus', 15, 288)

const outDir = path.resolve(rootDir, 'public')
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}
const outPath = path.resolve(outDir, 'syllabus.pdf')
fs.writeFileSync(outPath, Buffer.from(doc.output('arraybuffer')))
console.log(`Generated syllabus PDF at: ${outPath} (${fs.statSync(outPath).size} bytes)`)
