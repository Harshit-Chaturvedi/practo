import React from 'react'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'narrow' | 'wide'
}

export const Container: React.FC<ContainerProps> = ({
  size = 'default',
  className = '',
  children,
  ...props
}) => {
  const maxW = {
    narrow: 'max-w-4xl',
    default: 'max-w-[1200px]',
    wide: 'max-w-[1400px]',
  }

  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${maxW[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
