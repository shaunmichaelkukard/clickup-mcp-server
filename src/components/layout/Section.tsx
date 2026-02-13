import React from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  id?: string
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  containerClassName?: string
  dark?: boolean
}

export const Section = ({
  id,
  title,
  subtitle,
  children,
  className,
  containerClassName,
  dark = false,
}: SectionProps) => {
  return (
    <section
      id={id}
      className={cn(
        'py-20 px-4 sm:px-6 lg:px-8',
        dark ? 'bg-card border-y border-border' : 'bg-background',
        className
      )}
    >
      <div className={cn('max-w-7xl mx-auto', containerClassName)}>
        {(title || subtitle) && (
          <div className="mb-12">
            {title && (
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-4 uppercase">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg max-w-2xl text-muted-foreground">
                {subtitle}
              </p>
            )}
            <div className="h-1 w-20 mt-8 bg-primary" />
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
