import React, { useEffect, useRef, useState } from 'react'
import { isAnimationAllowed } from '../../utils/animation'

export interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: React.ElementType
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  as: Component = 'div',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  // Content is visible by default (progressive enhancement)
  const [revealed, setRevealed] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (!isAnimationAllowed()) {
      return
    }

    const node = ref.current
    if (!node) return

    const rect = node.getBoundingClientRect()
    const isBelowFold = rect.top > window.innerHeight

    // Only animate when element is below the fold
    if (isBelowFold) {
      setRevealed(false)
      setIsTransitioning(true)

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setRevealed(true)
              observer.disconnect()
              break
            }
          }
        },
        { rootMargin: '0px 0px -40px 0px', threshold: 0.05 }
      )
      observer.observe(node)

      // Fallback: guarantee all content is visible after 1.5s or on window load
      const timer = window.setTimeout(() => {
        setRevealed(true)
        observer.disconnect()
      }, 1500)

      const handleLoad = () => {
        window.setTimeout(() => {
          setRevealed(true)
          observer.disconnect()
        }, 1500)
      }
      window.addEventListener('load', handleLoad, { once: true })

      return () => {
        observer.disconnect()
        window.clearTimeout(timer)
        window.removeEventListener('load', handleLoad)
      }
    }
  }, [])

  return (
    <Component
      ref={ref}
      data-reveal="true"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'none' : 'translateY(16px)',
        transition: isTransitioning
          ? `opacity 0.45s ease-out ${delay}s, transform 0.45s ease-out ${delay}s`
          : 'none',
      }}
      className={className}
    >
      {children}
    </Component>
  )
}
