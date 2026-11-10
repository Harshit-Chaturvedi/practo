import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { jsPDF } from 'jspdf'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

// Dynamic import or direct read of course data
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
  { label: 'Self-Paced', price: '[PRICE]', date: '[START DATE]', desc: '6 video modules + project templates' },
  { label: 'Live Cohort', price: '[PRICE]', date: '[START DATE]', desc: 'Live weekly mentor labs + capstone review' },
  { label: 'Team / Enterprise', price: '[PRICE]', date: '[START DATE]', desc: 'Custom curriculum + dedicated Slack' },
]

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4', // 210 x 297 mm
})

// Brand Colors
const teal = [15, 118, 110]
const indigo = [55, 48, 163]
const ink = [31, 42, 46]
const gray = [107, 114, 128]
const cream = [251, 248, 243]

// ================= PAGE 1 =================
// Header Banner
doc.setFillColor(indigo[0], indigo[1], indigo[2])
doc.rect(0, 0, 210, 42, 'F')

doc.setTextColor(255, 255, 255)
doc.setFont('helvetica', 'bold')
doc.setFontSize(22)
doc.text('Practo for Animals — AI Education', 15, 18)

doc.setFont('helvetica', 'normal')
doc.setFontSize(12)
doc.text('6-Week Applied AI & Workflow Automation Masterclass — Syllabus', 15, 28)

doc.setFontSize(9)
doc.text('Website: practoforanimals.com/learn  |  Cohort Batch: Founding 2026', 15, 36)

// Overview section
doc.setTextColor(ink[0], ink[1], ink[2])
doc.setFont('helvetica', 'bold')
doc.setFontSize(14)
doc.text('Course Overview & Target Outcomes', 15, 52)

doc.setFont('helvetica', 'normal')
doc.setFontSize(10)
const overviewText = 'Designed for students, professionals, and operators seeking to master real-world AI assistants, automations (Make/n8n), rapid web deployment, and automated marketing pipelines without requiring prior programming experience.'
doc.text(doc.splitTextToSize(overviewText, 180), 15, 60)

// Modules 1 to 3
let y = 78
doc.setFont('helvetica', 'bold')
doc.setFontSize(13)
doc.setTextColor(teal[0], teal[1], teal[2])
doc.text('Part I: Foundations, Systems & Web (Weeks 1 – 3)', 15, y)
y += 8

courseData.slice(0, 3).forEach((mod) => {
  doc.setFillColor(cream[0], cream[1], cream[2])
  doc.roundedRect(15, y, 180, 48, 3, 3, 'F')
  doc.setDrawColor(227, 224, 216)
  doc.roundedRect(15, y, 180, 48, 3, 3, 'S')

  doc.setTextColor(indigo[0], indigo[1], indigo[2])
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text(`Module ${mod.number}: ${mod.title}`, 20, y + 8)

  doc.setTextColor(ink[0], ink[1], ink[2])
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(doc.splitTextToSize(mod.description, 170), 20, y + 15)

  doc.setFont('helvetica', 'bold')
  doc.text('Key Topics:', 20, y + 25)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(gray[0], gray[1], gray[2])
  doc.text(mod.topics.join('  •  '), 20, y + 31)

  doc.setTextColor(teal[0], teal[1], teal[2])
  doc.setFont('helvetica', 'bold')
  doc.text(`Project Outcome: ${mod.outcome}`, 20, y + 41)

  y += 54
})

doc.setFont('helvetica', 'normal')
doc.setFontSize(8)
doc.setTextColor(gray[0], gray[1], gray[2])
doc.text('Page 1 of 2  •  Practo for Animals Course Syllabus', 15, 290)

// ================= PAGE 2 =================
doc.addPage()

// Page 2 header
doc.setFillColor(teal[0], teal[1], teal[2])
doc.rect(0, 0, 210, 24, 'F')

doc.setTextColor(255, 255, 255)
doc.setFont('helvetica', 'bold')
doc.setFontSize(14)
doc.text('Practo for Animals — Curriculum Part II & Enrollment Details', 15, 16)

y = 36
doc.setFont('helvetica', 'bold')
doc.setFontSize(13)
doc.setTextColor(teal[0], teal[1], teal[2])
doc.text('Part II: Creative Production, Analytics & Capstone (Weeks 4 – 6)', 15, y)
y += 8

courseData.slice(3, 6).forEach((mod) => {
  doc.setFillColor(cream[0], cream[1], cream[2])
  doc.roundedRect(15, y, 180, 48, 3, 3, 'F')
  doc.setDrawColor(227, 224, 216)
  doc.roundedRect(15, y, 180, 48, 3, 3, 'S')

  doc.setTextColor(indigo[0], indigo[1], indigo[2])
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text(`Module ${mod.number}: ${mod.title}`, 20, y + 8)

  doc.setTextColor(ink[0], ink[1], ink[2])
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(doc.splitTextToSize(mod.description, 170), 20, y + 15)

  doc.setFont('helvetica', 'bold')
  doc.text('Key Topics:', 20, y + 25)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(gray[0], gray[1], gray[2])
  doc.text(mod.topics.join('  •  '), 20, y + 31)

  doc.setTextColor(teal[0], teal[1], teal[2])
  doc.setFont('helvetica', 'bold')
  doc.text(`Project Outcome: ${mod.outcome}`, 20, y + 41)

  y += 54
})

// Cohort & Pricing section
y += 4
doc.setTextColor(ink[0], ink[1], ink[2])
doc.setFont('helvetica', 'bold')
doc.setFontSize(13)
doc.text('Cohort Formats & Pricing', 15, y)
y += 8

const colW = 57
batches.forEach((b, idx) => {
  const x = 15 + idx * (colW + 4)
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(x, y, colW, 42, 2, 2, 'F')
  doc.setDrawColor(227, 224, 216)
  doc.roundedRect(x, y, colW, 42, 2, 2, 'S')

  doc.setTextColor(indigo[0], indigo[1], indigo[2])
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text(b.label, x + 4, y + 8)

  doc.setFontSize(12)
  doc.setTextColor(ink[0], ink[1], ink[2])
  doc.text(b.price, x + 4, y + 16)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(gray[0], gray[1], gray[2])
  doc.text(`Starts: ${b.date}`, x + 4, y + 23)
  doc.text(doc.splitTextToSize(b.desc, colW - 8), x + 4, y + 30)
})

y += 50
doc.setFillColor(indigo[0], indigo[1], indigo[2])
doc.roundedRect(15, y, 180, 20, 2, 2, 'F')
doc.setTextColor(255, 255, 255)
doc.setFont('helvetica', 'bold')
doc.setFontSize(10)
doc.text('Reserve Your Seat or Inquire:', 22, y + 9)
doc.setFont('helvetica', 'normal')
doc.setFontSize(9)
doc.text('Visit: practoforanimals.com/learn  •  Email: admissions@practoforanimals.com', 22, y + 15)

doc.setFont('helvetica', 'normal')
doc.setFontSize(8)
doc.setTextColor(gray[0], gray[1], gray[2])
doc.text('Page 2 of 2  •  Practo for Animals Course Syllabus', 15, 290)

const outDir = path.resolve(rootDir, 'public')
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}
const outPath = path.resolve(outDir, 'syllabus.pdf')
fs.writeFileSync(outPath, Buffer.from(doc.output('arraybuffer')))
console.log(`Generated syllabus PDF at: ${outPath} (${fs.statSync(outPath).size} bytes)`)
