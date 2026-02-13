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
          className="w-full h-full object-cover brightness-[0.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8 animate-fade-in">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm text-xs font-mono uppercase tracking-widest text-primary mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span>{settings.heroBadge}</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]">
            {settings.heroTitle.split(' ').map((word, i) => (
              <span key={i}>
                {i > 0 && ' '}
                <span className={i % 3 === 1 ? 'text-muted-foreground' : ''}>{word}</span>
                {i === 2 && <br />}
                {i === 4 && <br />}
              </span>
            ))}
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-medium">
            {settings.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a href="#showcase">
              <Button size="lg" className="h-14 px-8 text-base border-2 border-primary bg-primary text-primary-foreground hover:bg-transparent hover:text-primary transition-all duration-300">
                View Showcase <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <a href="#services">
              <Button variant="outline" size="lg" className="h-14 px-8 text-base border-2 border-border text-foreground bg-transparent hover:border-primary hover:text-primary transition-all duration-300">
                Our Services
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-10 hidden lg:block">
        <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-muted-foreground [writing-mode:vertical-rl]">
          Est. 2024 / {settings.brandName}
        </p>
      </div>
      <div className="absolute bottom-10 right-10 hidden lg:block">
        <div className="flex items-center space-x-4">
          <div className="h-[1px] w-20 bg-border" />
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
            Scroll to explore
          </p>
        </div>
      </div>
    </div>
  )
}
