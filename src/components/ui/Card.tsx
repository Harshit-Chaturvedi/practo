import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'surface' | 'cream'
  interactive?: boolean
  selected?: boolean
}

export const Card: React.FC<CardProps> = ({
  variant = 'white',
  interactive = false,
  selected = false,
  className = '',
  children,
  ...props
}) => {
  const bgStyles = {
    white: 'bg-white',
    surface: 'bg-surface',
    cream: 'bg-cream',
  }

  return (
    <div
      className={`rounded-[16px] border transition-all duration-200 p-5 sm:p-6 ${
        bgStyles[variant]
      } ${
        selected
          ? 'border-teal ring-2 ring-teal/20 shadow-md'
          : interactive
            ? 'border-border hover:border-teal/50 hover:shadow-md cursor-pointer'
            : 'border-border shadow-sm'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
