import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export interface AccordionItem {
  id: string | number
  title: string
  content: React.ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  defaultOpenId?: string | number
  allowMultiple?: boolean
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenId,
  allowMultiple = false,
}) => {
  const [openIds, setOpenIds] = useState<(string | number)[]>(
    defaultOpenId !== undefined ? [defaultOpenId] : []
  )

  const toggle = (id: string | number) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      )
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]))
    }
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openIds.includes(item.id)
        return (
          <div
            key={item.id}
            className={`rounded-[16px] border transition-all duration-200 overflow-hidden ${
              isOpen
                ? 'border-teal/40 bg-white shadow-sm'
                : 'border-border bg-white hover:border-teal/30'
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              className="flex w-full min-h-[48px] items-center justify-between px-5 py-4 text-left transition-colors focus-visible:outline-teal"
            >
              <span className="font-heading font-semibold text-ink text-sm sm:text-base pr-4">
                {item.title}
              </span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-text-muted transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-teal' : ''
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="border-t border-border/60 px-5 pb-5 pt-3 text-sm text-text-muted leading-relaxed">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
