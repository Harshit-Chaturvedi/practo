import { motion } from "framer-motion";
import {
  Wrench,
  Bot,
  PenLine,
  PaintBucket,
  CalendarClock,
  FormInput,
  Database,
  LayoutDashboard,
  CalendarCheck,
  Star,
  MessageCircle,
  Smartphone,
  BarChart3,
  Send,
  Mail,
  BellRing,
  Sheet,
  Webhook,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import WorkflowDiagram from "../components/WorkflowDiagram";

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

interface ToolRow {
  tool: string;
  category: string;
  whyUseIt: string;
  tradeoff: string;
}

const tools: ToolRow[] = [
  { tool: "Make.com", category: "Automation", whyUseIt: "Visual builder, 1 000+ integrations, reliable", tradeoff: "Paid after free tier; vendor lock-in" },
  { tool: "n8n", category: "Automation", whyUseIt: "Self-hostable, open-source, full control", tradeoff: "Steeper learning curve; needs hosting" },
  { tool: "Claude", category: "AI Writing", whyUseIt: "Excellent long-form, follows brand voice well", tradeoff: "API costs scale with volume" },
  { tool: "ChatGPT", category: "AI Writing", whyUseIt: "Versatile, large plugin ecosystem", tradeoff: "Output can be generic without careful prompting" },
  { tool: "Canva", category: "Design", whyUseIt: "Brand kit, templates, team collaboration", tradeoff: "Limited custom code; export quality varies" },
  { tool: "Figma", category: "Design", whyUseIt: "Precise control, developer handoff, components", tradeoff: "Requires design skills; no auto-publish" },
  { tool: "Buffer", category: "Scheduling", whyUseIt: "Clean UI, analytics, multi-platform", tradeoff: "Limited free plan; no AI features" },
  { tool: "Metricool", category: "Scheduling", whyUseIt: "AI captions, competitor analysis, all-in-one", tradeoff: "UI less polished; newer product" },
  { tool: "Tally", category: "Forms", whyUseIt: "Beautiful forms, free, integrations", tradeoff: "Less powerful logic than Typeform" },
  { tool: "Airtable", category: "Database", whyUseIt: "Flexible views, automations, API", tradeoff: "Expensive at scale; complex permissions" },
];

interface TechItem {
  name: string;
  rationale: string;
}

const techStack: TechItem[] = [
  { name: "Vite + React + TypeScript", rationale: "Fast dev, type safety" },
  { name: "Tailwind CSS", rationale: "Utility-first, design system alignment" },
  { name: "React Router", rationale: "Client-side routing" },
  { name: "Framer Motion", rationale: "Micro-animations" },
  { name: "lucide-react", rationale: "Consistent icon set" },
  { name: "html-to-image + jsPDF", rationale: "Carousel export" },
  { name: "localStorage", rationale: "Lead data persistence (no backend needed)" },
];

interface CTARow {
  page: string;
  primaryCTA: string;
  secondaryCTA: string;
  trigger: string;
  goal: string;
}

const ctaStrategy: CTARow[] = [
  { page: "Home", primaryCTA: "Find a Vet", secondaryCTA: "Emergency / Find Ambulance", trigger: "Search intent", goal: "Connect user with provider" },
  { page: "Home", primaryCTA: "List Your Business", secondaryCTA: "Submit a correction", trigger: "Provider intent", goal: "Supply-side growth" },
  { page: "Learn", primaryCTA: "Reserve Your Seat", secondaryCTA: "Download Syllabus", trigger: "Interest signal", goal: "Lead capture" },
  { page: "Carousel", primaryCTA: "Export PNG / PDF", secondaryCTA: "Visit Practo for Animals", trigger: "Content value", goal: "Brand awareness + lead" },
  { page: "Workflow", primaryCTA: "—", secondaryCTA: "—", trigger: "Knowledge share", goal: "Demonstrate capability" },
];

interface LeadStep {
  step: number;
  label: string;
  detail: string;
  icon: LucideIcon;
}

const leadSteps: LeadStep[] = [
  { step: 1, label: "User fills form", detail: "Lead Capture Modal", icon: FormInput },
  { step: 2, label: "Webhook fires", detail: "Make / n8n via VITE_LEAD_WEBHOOK_URL", icon: Webhook },
  { step: 3, label: "Data recorded", detail: "Google Sheet / CRM", icon: Sheet },
  { step: 4, label: "WhatsApp welcome", detail: "Twilio / Wati", icon: Send },
  { step: 5, label: "Email confirmation", detail: "SendGrid / Resend", icon: Mail },
  { step: 6, label: "Automated reminders", detail: "D-3, D-1, D-0 before batch", icon: BellRing },
];

interface NextCard {
  title: string;
  description: string;
  icon: LucideIcon;
}

const nextBuilds: NextCard[] = [
  { title: "Provider Dashboard", description: "Self-serve listing management, analytics, appointment calendar", icon: LayoutDashboard },
  { title: "Booking System", description: "Real-time slot availability, online payments, confirmation flow", icon: CalendarCheck },
  { title: "Review System", description: "Verified visit reviews only, structured ratings, provider responses", icon: Star },
  { title: "AI Triage Chatbot", description: "Symptom checker to recommend urgency level and nearby providers", icon: MessageCircle },
  { title: "Mobile App", description: "React Native app with push notifications and offline access", icon: Smartphone },
  { title: "Analytics & Insights", description: "Search trends, provider demand mapping, content performance", icon: BarChart3 },
];

/* Category colour badge helper */
function categoryColor(cat: string): string {
  switch (cat) {
    case "Automation":
      return "bg-[#0F766E]/10 text-[#0F766E]";
    case "AI Writing":
      return "bg-[#3730A3]/10 text-[#3730A3]";
    case "Design":
      return "bg-[#F59E0B]/15 text-[#92400E]";
    case "Scheduling":
      return "bg-[#0F766E]/10 text-[#0F766E]";
    case "Forms":
      return "bg-[#E0E7FF] text-[#3730A3]";
    case "Database":
      return "bg-[#FDE68A]/40 text-[#92400E]";
    default:
      return "bg-[#EEF5F3] text-[#1F2A2E]";
  }
}

function categoryIcon(cat: string): LucideIcon {
  switch (cat) {
    case "Automation":
      return Wrench;
    case "AI Writing":
      return Bot;
    case "Design":
      return PaintBucket;
    case "Scheduling":
      return CalendarClock;
    case "Forms":
      return PenLine;
    case "Database":
      return Database;
    default:
      return Wrench;
  }
}

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                   */
/* ------------------------------------------------------------------ */

function Section({
  title,
  subtitle,
  children,
  id,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="space-y-6" aria-labelledby={id ? `${id}-heading` : undefined}>
      <div>
        <h2
          id={id ? `${id}-heading` : undefined}
          className="text-2xl font-bold text-[#1F2A2E] font-heading sm:text-3xl"
        >
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-[#1F2A2E]/60 text-sm sm:text-base">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function WorkflowPage() {
  return (
    <main className="min-h-screen bg-[#FBF8F3]">
      {/* Hero header */}
      <header className="border-b border-[#E3E0D8] bg-white/60 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center sm:py-16">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-bold text-[#1F2A2E] font-heading sm:text-4xl lg:text-5xl"
          >
            Content Automation Workflow
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mx-auto mt-3 max-w-xl text-[#1F2A2E]/60 text-base sm:text-lg"
          >
            How we&apos;d automate content creation from idea to published post
          </motion.p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-12 sm:py-16">
        {/* ── 1. Workflow Diagram ─────────────────────────────── */}
        <Section title="Workflow Overview" subtitle="10-step pipeline from idea to live content" id="diagram">
          <div className="overflow-x-auto rounded-[16px] border border-[#E3E0D8] bg-white p-6 shadow-sm sm:p-8">
            <WorkflowDiagram />
          </div>
        </Section>

        {/* ── 2. Recommended Tools ───────────────────────────── */}
        <Section title="Recommended Tools" subtitle="Evaluated for cost, flexibility, and integration fit" id="tools">
          {/* Desktop table */}
          <div className="hidden lg:block overflow-hidden rounded-[16px] border border-[#E3E0D8] shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#EEF5F3] text-[#1F2A2E]/80">
                  <th className="px-5 py-3.5 font-heading font-semibold">Tool</th>
                  <th className="px-5 py-3.5 font-heading font-semibold">Category</th>
                  <th className="px-5 py-3.5 font-heading font-semibold">Why Use It</th>
                  <th className="px-5 py-3.5 font-heading font-semibold">Trade-off</th>
                </tr>
              </thead>
              <tbody>
                {tools.map((t, i) => {
                  const CatIcon = categoryIcon(t.category);
                  return (
                    <tr
                      key={t.tool}
                      className={`border-t border-[#E3E0D8] ${i % 2 === 1 ? "bg-[#FBF8F3]" : "bg-white"}`}
                    >
                      <td className="px-5 py-3.5 font-semibold text-[#1F2A2E]">{t.tool}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColor(t.category)}`}>
                          <CatIcon className="h-3.5 w-3.5" />
                          {t.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#1F2A2E]/70">{t.whyUseIt}</td>
                      <td className="px-5 py-3.5 text-[#1F2A2E]/60 italic">{t.tradeoff}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile/tablet cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
            {tools.map((t) => {
              const CatIcon = categoryIcon(t.category);
              return (
                <div key={t.tool} className="rounded-[14px] border border-[#E3E0D8] bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[#1F2A2E] font-heading">{t.tool}</h3>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${categoryColor(t.category)}`}>
                      <CatIcon className="h-3 w-3" />
                      {t.category}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#1F2A2E]/70">{t.whyUseIt}</p>
                  <p className="mt-1 text-xs text-[#1F2A2E]/50 italic">{t.tradeoff}</p>
                </div>
              );
            })}
          </div>
        </Section>

        {/* ── 3. Tech Stack ──────────────────────────────────── */}
        <Section title="Tech Stack" subtitle="What powers this project" id="tech-stack">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {techStack.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="rounded-[14px] border border-[#E3E0D8] bg-[#EEF5F3] px-4 py-3.5 shadow-sm"
              >
                <p className="text-sm font-semibold text-[#1F2A2E] font-heading">{item.name}</p>
                <p className="mt-0.5 text-xs text-[#1F2A2E]/60">{item.rationale}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ── 4. CTA Strategy ────────────────────────────────── */}
        <Section title="CTA Strategy" subtitle="Every page has a purpose — here's the map" id="cta-strategy">
          {/* Desktop table */}
          <div className="hidden md:block overflow-hidden rounded-[16px] border border-[#E3E0D8] shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#EEF5F3] text-[#1F2A2E]/80">
                  <th className="px-5 py-3.5 font-heading font-semibold">Page</th>
                  <th className="px-5 py-3.5 font-heading font-semibold">Primary CTA</th>
                  <th className="px-5 py-3.5 font-heading font-semibold">Secondary CTA</th>
                  <th className="px-5 py-3.5 font-heading font-semibold">Trigger</th>
                  <th className="px-5 py-3.5 font-heading font-semibold">Goal</th>
                </tr>
              </thead>
              <tbody>
                {ctaStrategy.map((row, i) => (
                  <tr
                    key={`${row.page}-${row.primaryCTA}`}
                    className={`border-t border-[#E3E0D8] ${i % 2 === 1 ? "bg-[#FBF8F3]" : "bg-white"}`}
                  >
                    <td className="px-5 py-3.5 font-semibold text-[#1F2A2E] font-heading">{row.page}</td>
                    <td className="px-5 py-3.5 text-[#0F766E] font-medium">{row.primaryCTA}</td>
                    <td className="px-5 py-3.5 text-[#1F2A2E]/70">{row.secondaryCTA}</td>
                    <td className="px-5 py-3.5 text-[#1F2A2E]/60">{row.trigger}</td>
                    <td className="px-5 py-3.5 text-[#1F2A2E]/60">{row.goal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-3 md:hidden">
            {ctaStrategy.map((row) => (
              <div
                key={`${row.page}-${row.primaryCTA}`}
                className="rounded-[14px] border border-[#E3E0D8] bg-white p-4 shadow-sm"
              >
                <p className="font-semibold text-[#1F2A2E] font-heading">{row.page}</p>
                <div className="mt-2 space-y-1 text-sm">
                  <p>
                    <span className="text-[#1F2A2E]/50">Primary:</span>{" "}
                    <span className="font-medium text-[#0F766E]">{row.primaryCTA}</span>
                  </p>
                  <p>
                    <span className="text-[#1F2A2E]/50">Secondary:</span>{" "}
                    <span className="text-[#1F2A2E]/70">{row.secondaryCTA}</span>
                  </p>
                  <p>
                    <span className="text-[#1F2A2E]/50">Trigger:</span>{" "}
                    <span className="text-[#1F2A2E]/60">{row.trigger}</span>
                  </p>
                  <p>
                    <span className="text-[#1F2A2E]/50">Goal:</span>{" "}
                    <span className="text-[#1F2A2E]/60">{row.goal}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 5. Lead Capture Automation Flow ────────────────── */}
        <Section
          title="Lead Capture Automation Flow"
          subtitle="From form submission to confirmed enrollment"
          id="lead-flow"
        >
          <div className="rounded-[16px] border border-[#E3E0D8] bg-white p-5 shadow-sm sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {leadSteps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.step}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.3 }}
                    className="flex items-start gap-3"
                  >
                    {/* Step circle */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0F766E] text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1F2A2E] font-heading">
                        <span className="mr-1 text-[#0F766E]">{s.step}.</span>
                        {s.label}
                      </p>
                      <p className="text-xs text-[#1F2A2E]/60">{s.detail}</p>
                    </div>
                    {/* Arrow on larger screens */}
                    {i < leadSteps.length - 1 && i % 3 !== 2 && (
                      <ArrowRight className="hidden lg:block h-4 w-4 mt-2.5 shrink-0 text-[#0F766E]/40" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Section>

        {/* ── 6. What I'd Build Next ─────────────────────────── */}
        <Section title="What I'd Build Next" subtitle="A roadmap for turning this prototype into a product" id="next">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nextBuilds.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.article
                  key={card.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.35 }}
                  className="rounded-[16px] border border-[#E3E0D8] bg-[#EEF5F3] p-5 shadow-sm"
                  aria-label={card.title}
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#0F766E]/10">
                    <Icon className="h-5 w-5 text-[#0F766E]" />
                  </div>
                  <h3 className="text-base font-semibold text-[#1F2A2E] font-heading">{card.title}</h3>
                  <p className="mt-1 text-sm text-[#1F2A2E]/60 leading-relaxed">{card.description}</p>
                </motion.article>
              );
            })}
          </div>
        </Section>
      </div>

      {/* Footer sliver */}
      <footer className="border-t border-[#E3E0D8] bg-white/60 py-6 text-center">
        <p className="text-xs text-[#1F2A2E]/40">
          Built with Vite, React, TypeScript &amp; Tailwind CSS
        </p>
      </footer>
    </main>
  );
}
