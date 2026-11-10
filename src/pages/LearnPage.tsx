import { useState, useCallback } from 'react'
import { motion, type Variants } from 'framer-motion'
import {
  GraduationCap,
  Briefcase,
  Laptop,
  Store,
  Sparkles,
  Workflow,
  Globe,
  PenTool,
  BarChart3,
  Trophy,
  Check,
  ChevronDown,
  Download,
  ArrowRight,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { courseModules, faqs, batchOptions } from '@/data/course'
import LeadCaptureModal from '@/components/LeadCaptureModal'
import { Container, Button, Card, Badge, SectionHeader } from '@/components/ui'

/* ------------------------------------------------------------------ */
/*  Icon map                                                           */
/* ------------------------------------------------------------------ */

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  Workflow,
  Globe,
  PenTool,
  BarChart3,
  Trophy,
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' as const },
  }),
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface WhoCard {
  icon: LucideIcon
  title: string
  description: string
}

const whoCards: WhoCard[] = [
  {
    icon: GraduationCap,
    title: 'Students',
    description: 'Stand out from the crowd by mastering AI tools before you graduate.',
  },
  {
    icon: Briefcase,
    title: 'Working Professionals',
    description: 'Automate routine tasks and free up hours for strategic, high-impact work.',
  },
  {
    icon: Laptop,
    title: 'Freelancers',
    description: 'Deliver faster, charge more, and serve more clients with AI in your toolkit.',
  },
  {
    icon: Store,
    title: 'Small Business Owners',
    description: 'Run your marketing, ops, and analytics with a lean team and smart AI workflows.',
  },
]

const outcomes = [
  'AI-powered automated triage and workflow engine',
  'Professional veterinary website deployed live',
  'Week of branded animal-wellness educational content',
  'Pet clinic data dashboard with actionable health insights',
]

/* ------------------------------------------------------------------ */
/*  FAQ Accordion Component                                            */
/* ------------------------------------------------------------------ */

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index
        return (
          <div
            key={index}
            className="border border-border rounded-[16px] bg-white overflow-hidden transition-colors"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between px-6 py-4 text-left min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="font-heading font-semibold text-ink text-base pr-4">
                {faq.question}
              </span>
              <ChevronDown
                size={20}
                className={`text-text-muted shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-teal' : ''
                }`}
              />
            </button>
            <div
              id={`faq-answer-${index}`}
              role="region"
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-text-muted text-sm leading-relaxed border-t border-border/40 pt-3">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function LearnPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalIntent, setModalIntent] = useState<'reserve' | 'syllabus'>('reserve')

  const openReserveModal = useCallback(() => {
    setModalIntent('reserve')
    setModalOpen(true)
  }, [])

  const openSyllabusModal = useCallback(() => {
    setModalIntent('syllabus')
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => setModalOpen(false), [])

  return (
    <>
      <main className="bg-cream min-h-screen pb-24 md:pb-12">
        {/* ========== 1. Hero ========== */}
        <section className="relative overflow-hidden bg-teal-dark text-white border-b border-teal-800" aria-label="Course hero">
          {/* Subtle geometric pattern backdrop */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-light blur-3xl" />
            <div className="absolute bottom-0 -left-12 w-64 h-64 rounded-full bg-teal blur-2xl" />
          </div>

          <Container size="default" className="relative py-16 sm:py-24 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold tracking-wide uppercase mb-6">
              <Sparkles size={14} className="text-amber" />
              Cohort 1 Enrolment Now Open
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]"
            >
              Master Applied AI for Healthcare & Veterinary Workflows
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-6 text-teal-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            >
              A 6-week hands-on intensive designed for clinicians, operators, and builders.
              Automate triages, orchestrate n8n & Make pipelines, build assistive web portals, and extract clinical insights — without prior coding knowledge.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-8 flex flex-col sm:flex-row gap-3.5 justify-center items-center"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={openReserveModal}
                rightIcon={<ArrowRight size={18} />}
                className="w-full sm:w-auto shadow-lg"
              >
                Reserve Your Seat
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={openSyllabusModal}
                leftIcon={<Download size={18} />}
                className="w-full sm:w-auto text-white border-white/40 hover:bg-white/10"
              >
                Download Syllabus
              </Button>
            </motion.div>

            {/* Quick trust metrics */}
            <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-3xl mx-auto">
              <div>
                <p className="font-heading text-2xl font-bold text-white">6 Weeks</p>
                <p className="text-xs text-teal-200 mt-1">Live hands-on labs</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-white">4 Capstones</p>
                <p className="text-xs text-teal-200 mt-1">Deployable systems</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-white">1:1 Mentoring</p>
                <p className="text-xs text-teal-200 mt-1">Direct feedback</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-white">Zero Code</p>
                <p className="text-xs text-teal-200 mt-1">Beginner friendly</p>
              </div>
            </div>
          </Container>
        </section>

        {/* ========== 2. Who It's For ========== */}
        <section className="py-16 sm:py-20 bg-cream" aria-label="Who this course is for">
          <Container size="default">
            <SectionHeader
              eyebrow="Target Audience"
              title="Built for Professionals Ready to Automate"
              description="Whether you lead a veterinary practice, manage clinic operations, or build modern tools, this course meets you where you are."
              align="center"
            />

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {whoCards.map((card, i) => {
                const Icon = card.icon
                return (
                  <motion.div
                    key={card.title}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeUp}
                  >
                    <Card variant="surface" className="h-full p-6 text-center hover:border-teal/40 transition-colors">
                      <div className="w-12 h-12 rounded-[14px] bg-teal-50 border border-teal-100 flex items-center justify-center mx-auto text-teal">
                        <Icon size={24} />
                      </div>
                      <h3 className="font-heading font-bold text-ink mt-4 text-lg">{card.title}</h3>
                      <p className="text-text-muted text-sm mt-2 leading-relaxed">{card.description}</p>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </Container>
        </section>

        {/* ========== 3. Module Cards ========== */}
        <section className="py-16 sm:py-20 bg-white border-y border-border" aria-label="Course modules">
          <Container size="default">
            <SectionHeader
              eyebrow="Curriculum"
              title="Six Practical, Outcome-Driven Modules"
              description="Every module pairs conceptual foundation with real-world implementation so you finish each week with deployed workflows."
              align="center"
            />

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courseModules.map((mod, i) => {
                const Icon = iconMap[mod.icon] || Sparkles
                return (
                  <motion.article
                    key={mod.id}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                  >
                    <Card variant="surface" className="h-full p-6 flex flex-col hover:border-teal transition-all">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="w-10 h-10 rounded-[12px] bg-teal-50 border border-teal-100 flex items-center justify-center text-teal shrink-0">
                          <Icon size={20} />
                        </div>
                        <Badge variant="teal">
                          Module {mod.number}
                        </Badge>
                      </div>

                      <h3 className="font-heading font-bold text-ink text-lg">{mod.title}</h3>
                      <p className="text-text-muted text-sm mt-1.5 leading-relaxed">{mod.description}</p>

                      <ul className="mt-5 space-y-2 flex-1">
                        {mod.topics.map((topic) => (
                          <li key={topic} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal mt-1.5 shrink-0" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-5 pt-3.5 border-t border-border/60">
                        <p className="text-xs sm:text-sm font-semibold text-teal flex items-start gap-2">
                          <Check size={16} className="mt-0.5 shrink-0 text-teal" />
                          <span>{mod.outcome}</span>
                        </p>
                      </div>
                    </Card>
                  </motion.article>
                )
              })}
            </div>
          </Container>
        </section>

        {/* ========== 4. Projects & Outcomes ========== */}
        <section className="py-16 sm:py-20 bg-surface" aria-label="Projects and outcomes">
          <Container size="default">
            <SectionHeader
              eyebrow="Real Artifacts"
              title="What You Will Build & Deploy"
              description="No theoretical toy exercises. You graduate with four production-ready assets tailored to care coordination."
              align="center"
            />

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {outcomes.map((outcome, i) => (
                <motion.div
                  key={outcome}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeUp}
                  className="flex items-start gap-3.5 bg-white border border-border rounded-[16px] p-5 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={16} className="text-teal font-bold" />
                  </div>
                  <span className="text-ink font-semibold text-sm sm:text-base leading-snug">{outcome}</span>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* ========== 5. Curriculum Timeline ========== */}
        <section className="py-16 sm:py-20 bg-white border-y border-border" aria-label="Course timeline">
          <Container size="narrow">
            <SectionHeader
              eyebrow="Timeline"
              title="Your 6-Week Learning Journey"
              description="A structured step-by-step roadmap taking you from fundamental prompting to autonomous production systems."
              align="center"
              className="mb-12"
            />

            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-border" aria-hidden="true" />

              <ol className="space-y-8">
                {courseModules.map((mod, i) => (
                  <motion.li
                    key={mod.id}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeUp}
                    className="relative pl-12"
                  >
                    {/* Circle dot badge */}
                    <div className="absolute left-0 top-1 w-[30px] h-[30px] rounded-full bg-teal text-white flex items-center justify-center font-heading font-bold text-xs shadow-sm ring-4 ring-white z-10">
                      {mod.number}
                    </div>
                    <div className="bg-cream border border-border rounded-[14px] p-5">
                      <span className="text-xs font-bold text-teal uppercase tracking-wider">
                        Week {mod.number}
                      </span>
                      <h3 className="font-heading font-bold text-ink text-base sm:text-lg mt-0.5">{mod.title}</h3>
                      <p className="text-text-muted text-sm mt-1.5 leading-relaxed">{mod.description}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>
          </Container>
        </section>

        {/* ========== 6. Mentor Block & Honest Disclaimer ========== */}
        <section className="py-16 sm:py-20 bg-cream" aria-label="Mentor">
          <Container size="default">
            <SectionHeader
              eyebrow="Instruction"
              title="Learn with Practised Practitioners"
              description="Live instruction backed by senior healthtech engineers and workflow automation architects."
              align="center"
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mt-10"
            >
              <Card variant="white" className="p-8 flex flex-col sm:flex-row items-center gap-6 max-w-2xl mx-auto border-border">
                <div
                  className="w-24 h-24 rounded-full bg-surface border-2 border-dashed border-teal/40 flex items-center justify-center shrink-0"
                  aria-label="Mentor photo placeholder"
                >
                  <span className="text-text-muted text-xs text-center px-3 font-medium">
                    [Mentor Photo]
                  </span>
                </div>
                <div className="text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 text-xs text-teal font-semibold mb-1">
                    <ShieldCheck size={14} /> Verified Lead Instructor
                  </div>
                  <h3 className="font-heading font-bold text-ink text-xl">[Mentor Name]</h3>
                  <p className="text-text-muted text-sm mt-2 leading-relaxed">
                    [Mentor Bio — to be updated with instructor profile and industry credentials prior to cohort start].
                  </p>
                </div>
              </Card>

              {/* Honest Testimonials Notice */}
              <div className="mt-8 bg-surface border border-dashed border-border rounded-[16px] p-6 text-center max-w-2xl mx-auto">
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  <span className="font-semibold text-ink">Founding Cohort Notice:</span> Student feedback and capstone case studies will be published openly here upon completion of Batch 1. In alignment with our transparency policy, we never generate or publish simulated testimonials.
                </p>
              </div>
            </motion.div>
          </Container>
        </section>

        {/* ========== 7. Batch & Pricing Cards ========== */}
        <section className="py-16 sm:py-20 bg-white border-y border-border" aria-label="Pricing and batches">
          <Container size="default">
            <SectionHeader
              eyebrow="Tuition & Schedule"
              title="Choose Your Learning Track"
              description="Transparent cohort options. All tiers include full access to session recordings, workshop templates, and office hours."
              align="center"
            />

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {batchOptions.map((batch, i) => (
                <motion.div
                  key={batch.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUp}
                  className="flex"
                >
                  <Card
                    variant="cream"
                    className={`relative p-6 flex flex-col w-full transition-all ${
                      batch.highlighted
                        ? 'border-2 border-teal shadow-md ring-1 ring-teal/20'
                        : 'border border-border'
                    }`}
                  >
                    {batch.highlighted && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-sm">
                        Recommended
                      </span>
                    )}

                    <h3 className="font-heading font-bold text-ink text-xl">{batch.label}</h3>
                    <p className="font-heading text-3xl font-extrabold text-teal mt-3">{batch.price}</p>
                    <p className="text-text-muted text-xs mt-1">Cohort starts: {batch.startDate}</p>

                    <ul className="mt-6 space-y-3 flex-1 border-t border-border/50 pt-5">
                      {batch.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink">
                          <Check size={16} className="text-teal mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8">
                      <Button
                        variant={batch.highlighted ? 'primary' : 'outline'}
                        size="md"
                        onClick={openReserveModal}
                        className="w-full"
                      >
                        Reserve Your Seat
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* ========== 8. FAQ ========== */}
        <section className="py-16 sm:py-20 bg-cream" aria-label="Frequently asked questions">
          <Container size="narrow">
            <SectionHeader
              eyebrow="Got Questions?"
              title="Frequently Asked Questions"
              description="Clear answers about workload, prerequisites, software tool access, and cohort policies."
              align="center"
              className="mb-10"
            />
            <FAQAccordion />
          </Container>
        </section>

        {/* ========== 9. Final CTA Band ========== */}
        <section className="bg-teal-dark text-white border-t border-teal-800" aria-label="Final call to action">
          <Container size="narrow" className="py-16 sm:py-20 text-center">
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white">
              Ready to Build Intelligent Care Workflows?
            </h2>
            <p className="mt-4 text-teal-100 text-sm sm:text-base max-w-lg mx-auto">
              Join the founding cohort of healthtech and veterinary innovators leveraging AI for real operational leverage.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button
                variant="primary"
                size="lg"
                onClick={openReserveModal}
                rightIcon={<ArrowRight size={18} />}
                className="w-full sm:w-auto shadow-lg"
              >
                Reserve Your Seat Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={openSyllabusModal}
                leftIcon={<Download size={18} />}
                className="w-full sm:w-auto text-white border-white/40 hover:bg-white/10"
              >
                Download Full Syllabus
              </Button>
            </div>
          </Container>
        </section>
      </main>

      {/* ========== 10. Sticky Mobile CTA Bar ========== */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-surface/95 backdrop-blur-md border-t border-border px-4 py-3 flex items-center justify-between gap-3 shadow-lg">
        <div className="min-w-0">
          <p className="font-heading font-bold text-ink text-sm truncate">AI Care Intensive</p>
          <p className="text-xs text-text-muted">Batch 1 enrolment</p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={openReserveModal}
          className="shrink-0"
        >
          Reserve Seat
        </Button>
      </div>

      {/* ========== 11. Lead Capture Modal ========== */}
      <LeadCaptureModal open={modalOpen} onClose={closeModal} intent={modalIntent} />
    </>
  )
}
