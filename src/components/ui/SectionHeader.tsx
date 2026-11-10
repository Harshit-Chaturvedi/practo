import React from 'react'

export interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
  theme?: 'dark' | 'light'
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  align = 'center',
  className = '',
  theme = 'light',
}) => {
  const isCenter = align === 'center'
  const isDark = theme === 'dark'

  return (
    <div
      className={`mb-8 sm:mb-12 ${
        isCenter ? 'text-center mx-auto max-w-2xl' : 'text-left max-w-3xl'
      } ${className}`}
    >
      {eyebrow && (
        <span
          className={`inline-block font-heading text-xs font-bold uppercase tracking-wider mb-2.5 ${
            isDark ? 'text-teal-300' : 'text-teal'
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight ${
          isDark ? 'text-white' : 'text-ink'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-3 text-sm sm:text-base leading-relaxed max-w-[65ch] ${
            isCenter ? 'mx-auto' : ''
          } ${isDark ? 'text-white/80' : 'text-text-muted'}`}
        >
          {description}
        </p>
      )}
    </div>
  )
}
