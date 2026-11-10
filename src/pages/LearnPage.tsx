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
  type LucideIcon,
} from 'lucide-react'
import { courseModules, faqs, batchOptions } from '@/data/course'
import LeadCaptureModal from '@/components/LeadCaptureModal'

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
  hidden: { opacity: 0, y: 24 },
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
  'AI-powered workflow automation',
  'Professional website deployed live',
  'Week of branded social content',
  'Data dashboard with actionable insights',
]

/* ------------------------------------------------------------------ */
/*  FAQ Accordion                                                      */
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
            className="border border-border rounded-[16px] bg-white overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between px-5 py-4 text-left min-h-[44px] focus:outline-none"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="font-heading font-semibold text-ink text-sm sm:text-base pr-4">
                {faq.question}
              </span>
              <ChevronDown
                size={20}
                className={`text-gray-500 shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
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
                <p className="px-5 pb-4 text-gray-600 text-sm leading-relaxed">
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
      <main className="bg-cream min-h-screen pb-32 md:pb-12">
        {/* ========== 1. Hero ========== */}
        <section className="relative overflow-hidden bg-indigo" aria-label="Course hero">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/20" />
            <div className="absolute bottom-0 -left-12 w-64 h-64 rounded-full bg-white/10" />
          </div>
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
            >
              Learn to Work Smarter with AI
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-5 text-white/85 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            >
              A 6-week hands-on course that teaches you to use AI tools, automate workflows,
              build websites, create content, and analyse data — no coding experience required.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
            >
              <button
                onClick={openReserveModal}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-8 py-3 bg-white text-indigo font-semibold rounded-[14px] hover:bg-gray-100 transition-colors shadow-lg"
              >
                Reserve Your Seat
                <ArrowRight size={18} />
              </button>
              <button
                onClick={openSyllabusModal}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-8 py-3 border-2 border-white/60 text-white font-semibold rounded-[14px] hover:bg-white/10 transition-colors"
              >
                <Download size={18} />
                Download Syllabus
              </button>
            </motion.div>
          </div>
        </section>

        {/* ========== 2. Who It's For ========== */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20" aria-label="Who this course is for">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-ink text-center">
            Who It&apos;s For
          </h2>
          <p className="mt-3 text-gray-600 text-center max-w-xl mx-auto">
            Whether you&apos;re starting out or looking to level up, this course meets you where you are.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                  className="bg-surface border border-border rounded-[16px] p-6 text-center"
                >
                  <div className="w-12 h-12 rounded-[12px] bg-indigo/10 flex items-center justify-center mx-auto">
                    <Icon size={24} className="text-indigo" />
                  </div>
                  <h3 className="font-heading font-semibold text-ink mt-4 text-lg">{card.title}</h3>
                  <p className="text-gray-600 text-sm mt-2 leading-relaxed">{card.description}</p>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* ========== 3. Module Cards ========== */}
        <section className="bg-white border-y border-border" aria-label="Course modules">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-ink text-center">
              What You&apos;ll Learn
            </h2>
            <p className="mt-3 text-gray-600 text-center max-w-xl mx-auto">
              Six practical modules designed to give you real, usable skills from day one.
            </p>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                    className="bg-surface border border-border rounded-[16px] p-6 hover:shadow-lg transition-shadow group"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-[10px] bg-indigo/10 flex items-center justify-center shrink-0">
                        <Icon size={20} className="text-indigo" />
                      </div>
                      <span className="text-xs font-semibold text-indigo bg-indigo/10 px-2.5 py-1 rounded-[20px]">
                        Module {mod.number}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-ink text-lg">{mod.title}</h3>
                    <p className="text-gray-600 text-sm mt-1.5 leading-relaxed">{mod.description}</p>
                    <ul className="mt-4 space-y-1.5">
                      {mod.topics.map((topic) => (
                        <li key={topic} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo mt-1.5 shrink-0" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-3 border-t border-border">
                      <p className="text-sm font-medium text-indigo flex items-start gap-2">
                        <Check size={16} className="mt-0.5 shrink-0" />
                        {mod.outcome}
                      </p>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </section>

        {/* ========== 4. Projects & Outcomes ========== */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20" aria-label="Projects and outcomes">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-ink text-center">
            What You&apos;ll Build
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {outcomes.map((outcome, i) => (
              <motion.div
                key={outcome}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                className="flex items-start gap-3 bg-white border border-border rounded-[16px] p-5"
              >
                <div className="w-8 h-8 rounded-full bg-green-open/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={16} className="text-green-open" />
                </div>
                <span className="text-ink font-medium text-sm sm:text-base">{outcome}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ========== 5. Curriculum Timeline ========== */}
        <section className="bg-white border-y border-border" aria-label="Course timeline">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-ink text-center mb-12">
              Your 6-Week Journey
            </h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-border" aria-hidden="true" />

              <ol className="space-y-8">
                {courseModules.map((mod, i) => (
                  <motion.li
                    key={mod.id}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeUp}
                    className="relative pl-10"
                  >
                    {/* Dot */}
                    <div className="absolute left-0 top-1 w-[30px] h-[30px] rounded-full bg-indigo flex items-center justify-center z-10">
                      <span className="text-white text-xs font-bold">{mod.number}</span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-indigo uppercase tracking-wide">
                        Week {mod.number}
                      </span>
                      <h3 className="font-heading font-bold text-ink text-lg mt-0.5">{mod.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{mod.description}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ========== 6. Mentor Block ========== */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20" aria-label="Mentor">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-ink text-center mb-10">
            Your Mentor
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-surface border border-border rounded-[16px] p-8 flex flex-col sm:flex-row items-center gap-6 max-w-xl mx-auto"
          >
            <div
              className="w-24 h-24 rounded-full bg-gray-200 border-2 border-border flex items-center justify-center shrink-0"
              aria-label="Mentor photo placeholder"
            >
              <span className="text-gray-500 text-xs text-center px-2 leading-tight">
                Mentor Photo
              </span>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-heading font-bold text-ink text-xl">[Mentor Name]</h3>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                [Mentor Bio — to be filled with real mentor details]
              </p>
            </div>
          </motion.div>
        </section>

        {/* ========== 6b. Testimonials Placeholder ========== */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10" aria-label="Learner reviews">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-ink text-center mb-6">
            Learner Feedback
          </h2>
          <div className="bg-surface border border-dashed border-border rounded-[16px] p-8 text-center max-w-xl mx-auto">
            <p className="text-gray-500 text-sm leading-relaxed">
              [Testimonials Placeholder — Real cohort feedback and student outcome case studies will be displayed here following Batch 1. We do not publish fabricated reviews.]
            </p>
          </div>
        </section>

        {/* ========== 7. Batch & Pricing Cards ========== */}
        <section className="bg-white border-y border-border" aria-label="Pricing and batches">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-ink text-center">
              Choose Your Batch
            </h2>
            <p className="mt-3 text-gray-600 text-center max-w-xl mx-auto">
              Pick the learning format that fits your schedule and goals.
            </p>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
              {batchOptions.map((batch, i) => (
                <motion.div
                  key={batch.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUp}
                  className={`relative bg-cream border-2 rounded-[16px] p-6 flex flex-col ${
                    batch.highlighted
                      ? 'border-indigo shadow-lg'
                      : 'border-border'
                  }`}
                >
                  {batch.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo text-white text-xs font-bold px-4 py-1 rounded-[20px]">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-heading font-bold text-ink text-xl">{batch.label}</h3>
                  <p className="font-heading text-3xl font-bold text-indigo mt-3">{batch.price}</p>
                  <p className="text-gray-500 text-sm mt-1">Starts {batch.startDate}</p>

                  <ul className="mt-5 space-y-2.5 flex-1">
                    {batch.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-ink">
                        <Check size={16} className="text-green-open mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={openReserveModal}
                    className={`mt-6 w-full min-h-[44px] px-4 py-2.5 font-semibold rounded-[14px] transition-colors ${
                      batch.highlighted
                        ? 'bg-indigo text-white hover:bg-indigo-light'
                        : 'border-2 border-indigo text-indigo hover:bg-indigo/5'
                    }`}
                  >
                    Reserve Your Seat
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== 8. FAQ ========== */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20" aria-label="Frequently asked questions">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-ink text-center mb-10">
            Frequently Asked Questions
          </h2>
          <FAQAccordion />
        </section>

        {/* ========== 9. Final CTA ========== */}
        <section className="bg-indigo" aria-label="Final call to action">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              Ready to Future-Proof Your Skills?
            </h2>
            <p className="mt-4 text-white/80 max-w-md mx-auto">
              Join the founding cohort building real-world AI skills.
            </p>
            <button
              onClick={openReserveModal}
              className="mt-8 inline-flex items-center justify-center gap-2 min-h-[44px] px-8 py-3.5 bg-amber text-ink font-bold rounded-[14px] hover:bg-amber-dark transition-colors shadow-lg text-lg"
            >
              Reserve Your Seat Now
              <ArrowRight size={20} />
            </button>
          </div>
        </section>
      </main>

      {/* ========== 10. Sticky Mobile CTA Bar ========== */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-surface border-t border-border px-4 py-3">
        <button
          onClick={openReserveModal}
          className="w-full min-h-[44px] px-4 py-3 bg-indigo text-white font-semibold rounded-[14px] hover:bg-indigo-light transition-colors"
        >
          Reserve Your Seat
        </button>
      </div>

      {/* ========== 11. Lead Capture Modal ========== */}
      <LeadCaptureModal open={modalOpen} onClose={closeModal} intent={modalIntent} />
    </>
  )
}
