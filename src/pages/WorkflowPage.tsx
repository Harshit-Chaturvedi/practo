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
import { Container, SectionHeader, Card, Badge } from "@/components/ui";

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

interface ToolRow {
  tool: string;
  category: string;
  badgeVariant: "teal" | "amber" | "neutral" | "outline";
  whyUseIt: string;
  tradeoff: string;
}

const tools: ToolRow[] = [
  { tool: "Make.com", category: "Automation", badgeVariant: "teal", whyUseIt: "Visual builder, 1,000+ integrations, reliable webhook execution", tradeoff: "Paid after free tier; potential vendor lock-in" },
  { tool: "n8n", category: "Automation", badgeVariant: "teal", whyUseIt: "Self-hostable, open-source, complete data privacy and orchestration control", tradeoff: "Steeper learning curve; requires infrastructure hosting" },
  { tool: "Claude", category: "AI Writing", badgeVariant: "neutral", whyUseIt: "Excellent clinical long-form, adheres strictly to brand voice and tokens", tradeoff: "API costs scale with token volume" },
  { tool: "ChatGPT", category: "AI Writing", badgeVariant: "neutral", whyUseIt: "Versatile reasoning, extensive function-calling ecosystem", tradeoff: "Output requires strict prompt bounding to avoid generic tone" },
  { tool: "Canva", category: "Design", badgeVariant: "amber", whyUseIt: "Brand kit enforcement, collaborative templates, rapid asset assembly", tradeoff: "Limited custom headless code; raster export quality varies" },
  { tool: "Figma", category: "Design", badgeVariant: "amber", whyUseIt: "Pixel precision, design token variables, developer handoff inspection", tradeoff: "Requires design competency; no native direct publishing" },
  { tool: "Buffer", category: "Scheduling", badgeVariant: "outline", whyUseIt: "Clean multi-channel queue UI, performance analytics, lightweight", tradeoff: "Limited free tier; minimal AI-native drafting features" },
  { tool: "Metricool", category: "Scheduling", badgeVariant: "outline", whyUseIt: "Multi-platform analytics, competitor bench-marking, consolidated inbox", tradeoff: "UI is denser; steeper setup workflow" },
  { tool: "Tally", category: "Forms", badgeVariant: "neutral", whyUseIt: "Clean Notion-like forms, free custom domain hooks, webhook support", tradeoff: "Less complex multi-branch conditional logic than Typeform" },
  { tool: "Airtable", category: "Database", badgeVariant: "teal", whyUseIt: "Relational views, interface designer, native automations and robust API", tradeoff: "Expensive at enterprise record scale; complex permission tiers" },
];

interface TechItem {
  name: string;
  rationale: string;
}

const techStack: TechItem[] = [
  { name: "Vite + React + TypeScript", rationale: "Instant HMR, strict type safety, zero compile bottlenecks" },
  { name: "Tailwind CSS v4", rationale: "Design system token architecture, accessible typography & color scales" },
  { name: "React Router v6", rationale: "Declarative SPA client routing with instant page transitions" },
  { name: "Framer Motion", rationale: "Targeted micro-interactions respecting prefers-reduced-motion" },
  { name: "lucide-react", rationale: "Consistent, semantic icon glyphs with uniform 1.75 stroke width" },
  { name: "html-to-image + jsPDF", rationale: "Client-side lossless slide image & multi-page PDF generation" },
  { name: "localStorage", rationale: "Deterministic client persistence for leads and mock bookings" },
];

interface CTARow {
  page: string;
  primaryCTA: string;
  secondaryCTA: string;
  trigger: string;
  goal: string;
}

const ctaStrategy: CTARow[] = [
  { page: "Home", primaryCTA: "Find a Vet", secondaryCTA: "Emergency / Find Ambulance", trigger: "Urgent or routine search intent", goal: "Connect guardian with verified care" },
  { page: "Home", primaryCTA: "List Your Business", secondaryCTA: "Submit a correction", trigger: "Provider participation intent", goal: "Expand verified supply directory" },
  { page: "Learn", primaryCTA: "Reserve Your Seat", secondaryCTA: "Download Syllabus", trigger: "Educational interest signal", goal: "Cohort lead capture & course enrolment" },
  { page: "Carousel", primaryCTA: "Export PNG / PDF", secondaryCTA: "Explore Discovery Platform", trigger: "Content consumption value", goal: "Brand awareness & cross-product funnel" },
  { page: "Workflow", primaryCTA: "Audit Architecture", secondaryCTA: "View Tech Specs", trigger: "Technical transparency inquiry", goal: "Demonstrate engineering & AI rigor" },
];

interface LeadStep {
  step: number;
  label: string;
  detail: string;
  icon: LucideIcon;
}

const leadSteps: LeadStep[] = [
  { step: 1, label: "User Fills Form", detail: "LeadCaptureModal with UTM & intent capture", icon: FormInput },
  { step: 2, label: "Webhook Dispatches", detail: "Make / n8n via VITE_LEAD_WEBHOOK_URL", icon: Webhook },
  { step: 3, label: "Data Synchronized", detail: "Airtable / Google Sheets lead record", icon: Sheet },
  { step: 4, label: "WhatsApp Onboarding", detail: "Automated invite link via WhatsApp API", icon: Send },
  { step: 5, label: "Email Confirmation", detail: "Syllabus PDF attachment & calendar invite", icon: Mail },
  { step: 6, label: "Cohort Notifications", detail: "D-3, D-1, and D-0 live reminders", icon: BellRing },
];

interface NextCard {
  title: string;
  description: string;
  icon: LucideIcon;
}

const nextBuilds: NextCard[] = [
  { title: "Provider Dashboard", description: "Self-serve listing management, appointment calendars, verified credential uploads, and query analytics.", icon: LayoutDashboard },
  { title: "Real-Time Booking Engine", description: "Live slot synchronization, emergency bypass triage, and verified guardian confirmation flows.", icon: CalendarCheck },
  { title: "Verified Clinical Reviews", description: "Strict invoice-verified care reviews only, clinical outcome ratings, and moderated provider responses.", icon: Star },
  { title: "AI Triage Assistant", description: "Symptom evaluator assessing veterinary urgency (Red/Amber/Green) and routing to nearby 24x7 facilities.", icon: MessageCircle },
  { title: "Guardian Mobile Companion", description: "React Native mobile client with push reminders for vaccine boosters, offline emergency directory, and medical records.", icon: Smartphone },
  { title: "Care Demand Insights", description: "Aggregated spatial demand mapping identifying veterinary deserts, species-specific shortages, and emergency trends.", icon: BarChart3 },
];

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
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function WorkflowPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero header */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm">
        <Container size="default" className="py-14 sm:py-20 text-center">
          <Badge variant="teal" className="mb-4">
            System Architecture & Automation
          </Badge>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl sm:text-5xl font-extrabold text-ink font-heading tracking-tight"
          >
            Content & Data Automation Workflows
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mx-auto mt-4 max-w-2xl text-text-muted text-base sm:text-lg leading-relaxed"
          >
            A transparent architectural blueprint illustrating end-to-end multi-agent content pipelines, lead capture hooks, and product roadmap decisions.
          </motion.p>
        </Container>
      </header>

      <Container size="default" className="py-14 sm:py-20 space-y-16 sm:space-y-24">
        {/* ── 1. Workflow Diagram ─────────────────────────────── */}
        <section id="diagram" aria-labelledby="diagram-heading">
          <SectionHeader
            eyebrow="Pipeline"
            title="10-Step Content Generation Pipeline"
            description="From raw clinical prompt to branded social assets, approval gates, and multi-platform distribution."
            align="left"
            className="mb-8"
          />
          <div className="overflow-x-auto rounded-[20px] border border-border bg-white p-6 sm:p-10 shadow-sm">
            <WorkflowDiagram />
          </div>
        </section>

        {/* ── 2. Recommended Tools ───────────────────────────── */}
        <section id="tools" aria-labelledby="tools-heading">
          <SectionHeader
            eyebrow="Tooling Evaluation"
            title="Recommended Tech & Tooling Matrix"
            description="Evaluated systematically across implementation speed, API flexibility, operating expense, and lock-in risk."
            align="left"
            className="mb-8"
          />

          {/* Desktop table */}
          <div className="hidden lg:block overflow-hidden rounded-[16px] border border-border bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-surface text-ink/80 border-b border-border">
                  <th className="px-6 py-4 font-heading font-bold text-xs uppercase tracking-wider">Tool</th>
                  <th className="px-6 py-4 font-heading font-bold text-xs uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 font-heading font-bold text-xs uppercase tracking-wider">Strategic Fit</th>
                  <th className="px-6 py-4 font-heading font-bold text-xs uppercase tracking-wider">Considerations &amp; Trade-off</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tools.map((t, i) => {
                  const CatIcon = categoryIcon(t.category);
                  return (
                    <tr
                      key={t.tool}
                      className={`hover:bg-teal-50/30 transition-colors ${i % 2 === 1 ? "bg-cream/40" : "bg-white"}`}
                    >
                      <td className="px-6 py-4 font-heading font-bold text-ink">{t.tool}</td>
                      <td className="px-6 py-4">
                        <Badge variant={t.badgeVariant} className="gap-1.5 font-medium">
                          <CatIcon className="h-3.5 w-3.5" />
                          {t.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-ink/80">{t.whyUseIt}</td>
                      <td className="px-6 py-4 text-text-muted italic">{t.tradeoff}</td>
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
                <Card key={t.tool} variant="white" className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-ink text-base">{t.tool}</h3>
                    <Badge variant={t.badgeVariant} className="gap-1 text-xs">
                      <CatIcon className="h-3 w-3" />
                      {t.category}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm text-ink/80">{t.whyUseIt}</p>
                  <p className="mt-2 text-xs text-text-muted italic border-t border-border/50 pt-2">{t.tradeoff}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* ── 3. Tech Stack ──────────────────────────────────── */}
        <section id="tech-stack" aria-labelledby="tech-stack-heading">
          <SectionHeader
            eyebrow="Frontend Foundations"
            title="Modern Production Tech Stack"
            description="Curated for performance, accessibility, zero runtime crashes, and effortless deployability."
            align="left"
            className="mb-8"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {techStack.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <Card variant="surface" className="p-5 h-full hover:border-teal/40 transition-colors">
                  <p className="font-heading font-bold text-ink text-sm sm:text-base">{item.name}</p>
                  <p className="mt-1.5 text-xs sm:text-sm text-text-muted leading-relaxed">{item.rationale}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 4. CTA Strategy ────────────────────────────────── */}
        <section id="cta-strategy" aria-labelledby="cta-strategy-heading">
          <SectionHeader
            eyebrow="Conversion Architecture"
            title="Route-by-Route CTA Matrix"
            description="Strategic hierarchy of primary and secondary conversion actions matching specific user mental models."
            align="left"
            className="mb-8"
          />

          {/* Desktop table */}
          <div className="hidden md:block overflow-hidden rounded-[16px] border border-border bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-surface text-ink/80 border-b border-border">
                  <th className="px-6 py-4 font-heading font-bold text-xs uppercase tracking-wider">Page</th>
                  <th className="px-6 py-4 font-heading font-bold text-xs uppercase tracking-wider">Primary Action</th>
                  <th className="px-6 py-4 font-heading font-bold text-xs uppercase tracking-wider">Secondary Action</th>
                  <th className="px-6 py-4 font-heading font-bold text-xs uppercase tracking-wider">User Trigger</th>
                  <th className="px-6 py-4 font-heading font-bold text-xs uppercase tracking-wider">Product Objective</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ctaStrategy.map((row, i) => (
                  <tr
                    key={`${row.page}-${row.primaryCTA}`}
                    className={`hover:bg-teal-50/30 transition-colors ${i % 2 === 1 ? "bg-cream/40" : "bg-white"}`}
                  >
                    <td className="px-6 py-4 font-heading font-bold text-ink">{row.page}</td>
                    <td className="px-6 py-4 font-semibold text-teal">{row.primaryCTA}</td>
                    <td className="px-6 py-4 text-ink/75">{row.secondaryCTA}</td>
                    <td className="px-6 py-4 text-text-muted text-xs sm:text-sm">{row.trigger}</td>
                    <td className="px-6 py-4 text-ink/80 font-medium text-xs sm:text-sm">{row.goal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-3 md:hidden">
            {ctaStrategy.map((row) => (
              <Card key={`${row.page}-${row.primaryCTA}`} variant="white" className="p-5">
                <p className="font-heading font-bold text-ink text-base">{row.page}</p>
                <div className="mt-3 space-y-1.5 text-xs sm:text-sm">
                  <p>
                    <span className="text-text-muted font-medium">Primary:</span>{" "}
                    <span className="font-bold text-teal">{row.primaryCTA}</span>
                  </p>
                  <p>
                    <span className="text-text-muted font-medium">Secondary:</span>{" "}
                    <span className="text-ink/80">{row.secondaryCTA}</span>
                  </p>
                  <p>
                    <span className="text-text-muted font-medium">Trigger:</span>{" "}
                    <span className="text-ink/70">{row.trigger}</span>
                  </p>
                  <p className="border-t border-border/60 pt-2 mt-2">
                    <span className="text-text-muted font-medium">Goal:</span>{" "}
                    <span className="text-ink font-semibold">{row.goal}</span>
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* ── 5. Lead Capture Automation Flow ────────────────── */}
        <section id="lead-flow" aria-labelledby="lead-flow-heading">
          <SectionHeader
            eyebrow="Lead Lifecycle"
            title="End-to-End Enrolment Automation"
            description="Deterministic webhook orchestrations routing captured guardians from front-end modals to cohort onboarding."
            align="left"
            className="mb-8"
          />

          <Card variant="white" className="p-6 sm:p-10 border-border">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {leadSteps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.step}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="flex items-start gap-3.5"
                  >
                    {/* Step badge */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-teal text-white shadow-sm font-heading font-bold text-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-heading font-bold text-ink">
                        <span className="mr-1 text-teal">{s.step}.</span>
                        {s.label}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{s.detail}</p>
                    </div>
                    {/* Arrow on desktop */}
                    {i < leadSteps.length - 1 && i % 3 !== 2 && (
                      <ArrowRight className="hidden lg:block h-4 w-4 mt-2.5 shrink-0 text-teal/40" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </section>

        {/* ── 6. What I'd Build Next ─────────────────────────── */}
        <section id="next" aria-labelledby="next-heading">
          <SectionHeader
            eyebrow="Vision & Expansion"
            title="Post-MVP Roadmap: Phase 2 Initiatives"
            description="Strategic product extensions evolving this discovery directory into a full-stack veterinary ecosystem."
            align="left"
            className="mb-8"
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {nextBuilds.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.article
                  key={card.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                  aria-label={card.title}
                >
                  <Card variant="surface" className="h-full p-6 hover:border-teal/40 transition-colors">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[12px] bg-teal-50 border border-teal-100 text-teal">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-heading font-bold text-ink">{card.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-text-muted leading-relaxed">{card.description}</p>
                  </Card>
                </motion.article>
              );
            })}
          </div>
        </section>
      </Container>
    </main>
  );
}
