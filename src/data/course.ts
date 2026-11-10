export interface CourseModule {
  id: string
  number: number
  title: string
  description: string
  topics: string[]
  outcome: string
  icon: string
}

export const courseModules: CourseModule[] = [
  {
    id: 'ai-tools',
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
    icon: 'Sparkles',
  },
  {
    id: 'automation',
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
    icon: 'Workflow',
  },
  {
    id: 'websites',
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
    icon: 'Globe',
  },
  {
    id: 'content',
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
    icon: 'PenTool',
  },
  {
    id: 'data',
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
    icon: 'BarChart3',
  },
  {
    id: 'capstone',
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
    icon: 'Trophy',
  },
]

export interface FAQ {
  question: string
  answer: string
}

export const faqs: FAQ[] = [
  {
    question: 'Who is this course for?',
    answer: 'This course is designed for students, early-career professionals, freelancers, and small business owners who want to leverage AI tools to work smarter. No programming experience is required.',
  },
  {
    question: 'Do I need any technical background?',
    answer: 'No. The course is designed for non-technical learners. We start from the basics and build up. If you can use a browser and a spreadsheet, you have everything you need.',
  },
  {
    question: 'How long is the course?',
    answer: 'The course runs for 6 weeks with live sessions, hands-on projects, and async support. Expect to spend 6–8 hours per week including project time.',
  },
  {
    question: 'Will I get a certificate?',
    answer: 'Yes, you will receive a certificate of completion after finishing the capstone project. The capstone itself becomes a portfolio piece you can showcase.',
  },
  {
    question: 'What if I miss a live session?',
    answer: 'All sessions are recorded and available within 24 hours. You can also ask questions in the community group and get help from mentors async.',
  },
  {
    question: 'Is there a refund policy?',
    answer: 'Yes. If you are not satisfied after the first week, you can request a full refund — no questions asked.',
  },
  {
    question: 'What tools will I need?',
    answer: 'A laptop with a browser and internet. All tools used in the course offer free tiers. We will provide setup guides for everything.',
  },
]

export interface BatchOption {
  id: string
  label: string
  startDate: string
  price: string
  features: string[]
  highlighted: boolean
}

export const batchOptions: BatchOption[] = [
  {
    id: 'self-paced',
    label: 'Self-Paced',
    startDate: '[START DATE]',
    price: '[PRICE]',
    features: [
      'All 6 modules with video content',
      'Hands-on project templates',
      'Community access',
      'Certificate of completion',
    ],
    highlighted: false,
  },
  {
    id: 'live-cohort',
    label: 'Live Cohort',
    startDate: '[START DATE]',
    price: '[PRICE]',
    features: [
      'Everything in Self-Paced',
      'Live weekly sessions with mentor',
      'Personalised feedback on projects',
      'Priority community support',
      '1-on-1 capstone review',
    ],
    highlighted: true,
  },
  {
    id: 'team',
    label: 'Team / Enterprise',
    startDate: '[START DATE]',
    price: '[PRICE]',
    features: [
      'Everything in Live Cohort',
      'Custom modules for your team',
      'Dedicated Slack channel',
      'Admin dashboard',
      'Bulk pricing available',
    ],
    highlighted: false,
  },
]
