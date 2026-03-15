import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export const Hero = () => {
  const { settings } = useSiteSettings()

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={settings.heroImageUrl}
          alt="Modern Architecture"
          className="w-full h-full object-cover scale-105 animate-pulse-slow opacity-40 brightness-50"
          style={{ animationDuration: '8s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <div className="space-y-10 animate-slide-up">
          <div className="inline-flex items-center space-x-3 px-5 py-2 rounded-full glass border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-primary/90 mb-6 animate-fade-in glow-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span>{settings.heroBadge}</span>
          </div>

          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85]">
            {settings.heroTitle.split(' ').map((word, i) => (
              <span key={i} className="inline-block">
                {i > 0 && '\u00A0'}
                <span className={i % 2 === 1 ? 'text-iridescent' : 'text-foreground'}>{word}</span>
                {i === 1 && <br />}
                {i === 3 && <br />}
              </span>
            ))}
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-foreground/60 font-medium leading-relaxed">
            {settings.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a href="#showcase" className="w-full sm:w-auto">
              <button className="btn-glass-primary h-16 px-12 text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center group w-full sm:w-auto rounded-xl shadow-2xl">
                View Showcase <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
            <a href="#services" className="w-full sm:w-auto">
              <button className="btn-glass-secondary h-16 px-12 text-[11px] font-black uppercase tracking-[0.3em] text-foreground/60 hover:text-foreground w-full sm:w-auto rounded-xl border-white/5 hover:border-white/20 transition-all">
                Our Services
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Floating Stats Cards */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 hidden md:block">
        <div className="grid grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {[
            { label: 'Properties Managed', value: '$2.4B+' },
            { label: 'Client Satisfaction', value: '99.8%' },
            { label: 'Global Offices', value: '12' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-500 cursor-default">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-2 font-bold group-hover:text-primary transition-colors">
                {stat.label}
              </p>
              <p className="text-2xl font-black tracking-tighter text-foreground group-hover:text-iridescent transition-all">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-10 hidden lg:block animate-fade-in">
        <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-foreground/30 [writing-mode:vertical-rl]">
          Est. 2024 / {settings.brandName}
        </p>
      </div>
      <div className="absolute bottom-10 right-10 hidden lg:block animate-fade-in">
        <div className="flex items-center space-x-4">
          <div className="h-[1px] w-20 bg-white/10" />
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-foreground/30">
            Scroll to explore
          </p>
        </div>
      </div>
    </div>
  )
}
