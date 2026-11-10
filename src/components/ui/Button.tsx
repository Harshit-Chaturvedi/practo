import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-heading font-semibold rounded-[12px] transition-all duration-200 cursor-pointer min-h-[44px] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'

    const variantStyles = {
      primary:
        'bg-amber text-ink hover:bg-amber-dark shadow-sm hover:shadow-md focus-visible:outline-amber',
      secondary:
        'bg-teal text-white hover:bg-teal-dark shadow-sm hover:shadow-md focus-visible:outline-teal',
      outline:
        'border border-border bg-white text-ink hover:bg-surface hover:border-teal/40 focus-visible:outline-teal',
      ghost:
        'bg-transparent text-ink hover:bg-surface hover:text-teal focus-visible:outline-teal',
      danger:
        'bg-red-emergency text-white hover:bg-red-700 shadow-sm focus-visible:outline-red-emergency',
    }

    const sizeStyles = {
      sm: 'px-3.5 py-1.5 text-xs gap-1.5 min-w-[36px]',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-7 py-3.5 text-base gap-2.5',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    )
  }
)
Button.displayName = 'Button'
