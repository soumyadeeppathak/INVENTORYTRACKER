import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  interactive?: boolean
}

export function Card({ children, interactive = false, className = '', ...props }: CardProps) {
  const baseStyles = 'bg-white rounded-lg border border-gray-200 shadow-sm'
  const interactiveStyles = interactive
    ? 'cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-150'
    : ''

  return (
    <div className={`${baseStyles} ${interactiveStyles} ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-4 border-b border-gray-100 ${className}`}>{children}</div>
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-4 border-t border-gray-100 ${className}`}>{children}</div>
}
