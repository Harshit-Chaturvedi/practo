import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'teal' | 'amber' | 'neutral' | 'red' | 'green' | 'outline'
  size?: 'sm' | 'md'
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'teal',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 font-heading font-semibold rounded-full'

  const variantStyles = {
    teal: 'bg-teal-50 text-teal-800 border border-teal-200/60',
    amber: 'bg-amber-50 text-amber-900 border border-amber-200',
    neutral: 'bg-surface text-ink border border-border',
    red: 'bg-red-50 text-red-emergency border border-red-100',
    green: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    outline: 'border border-border bg-white text-text-muted',
  }

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-[11px]',
    md: 'px-3 py-1 text-xs',
  }

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
