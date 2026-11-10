import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, id, className = '', ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-heading text-xs sm:text-sm font-semibold text-ink mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full min-h-[44px] rounded-[12px] border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-text-muted/60 transition-colors focus:border-teal focus:ring-2 focus:ring-teal/20 focus-visible:outline-none ${
              leftIcon ? 'pl-10' : ''
            } ${
              error ? 'border-red-emergency ring-1 ring-red-emergency/20' : 'border-border'
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-emergency font-medium">{error}</p>}
        {!error && helperText && (
          <p className="mt-1 text-xs text-text-muted">{helperText}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
