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
        'py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden',
        dark && 'bg-white/[0.01]',
        className
      )}
    >
      <div className={cn('max-w-7xl mx-auto relative z-10', containerClassName)}>
        {(title || subtitle) && (
          <div className="mb-20 animate-fade-in">
            {title && (
              <h2 className="text-4xl sm:text-6xl font-black tracking-tighter mb-6 uppercase leading-none">
                {title.split(' ').map((word, i) => (
                  <span key={i} className={i % 2 === 1 ? 'text-iridescent' : 'text-foreground'}>
                    {word}{' '}
                  </span>
                ))}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg max-w-2xl text-foreground/40 font-medium leading-relaxed">
                {subtitle}
              </p>
            )}
            <div className="flex items-center gap-4 mt-10">
              <div className="h-[2px] w-24 bg-gradient-to-r from-primary to-transparent" />
              <div className="h-1.5 w-1.5 rounded-full bg-primary glow-cyan" />
            </div>
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
