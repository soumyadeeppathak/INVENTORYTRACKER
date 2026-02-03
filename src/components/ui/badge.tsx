import type { HTMLAttributes, ReactNode } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'primary' | 'success' | 'warning' | 'error'
  children: ReactNode
}

export function Badge({ variant = 'default', children, className = '', ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium'

  const variants = {
    default: 'bg-gray-100 text-gray-700',
    secondary: 'bg-gray-50 text-gray-600',
    primary: 'bg-indigo-100 text-indigo-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
  }

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  )
}
