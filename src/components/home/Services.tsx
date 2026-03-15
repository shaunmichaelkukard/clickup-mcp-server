import { Section } from '@/components/layout/Section'
import { Target, BarChart3, PenTool, Globe } from 'lucide-react'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export const Services = () => {
  const { settings } = useSiteSettings()

  const services = [
    {
      title: 'Strategic Campaigns',
      description: 'Bespoke marketing strategies tailored to unique property assets, ensuring maximum visibility among high-net-worth individuals.',
      icon: Target,
    },
    {
      title: 'Lead Generation',
      description: 'Data-driven funnels and targeted digital advertising designed to capture and qualify premium real estate leads.',
      icon: BarChart3,
    },
    {
      title: 'Content Creation',
      description: 'High-end architectural photography, cinematic video tours, and compelling editorial content that tells a story.',
      icon: PenTool,
    },
    {
      title: 'Global Outreach',
      description: 'Leveraging an international network to place your property in front of the right buyers, regardless of geography.',
      icon: Globe,
    },
  ]

  return (
    <Section
      id="services"
      title={settings.servicesTitle}
      subtitle={settings.servicesSubtitle}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <div
            key={service.title}
            className="glass-card p-10 group hover:scale-[1.02] transition-all duration-500 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="mb-8 h-16 w-16 rounded-2xl flex items-center justify-center glass border-white/10 text-primary group-hover:text-white group-hover:glow-primary transition-all duration-500 group-hover:-translate-y-2">
              <service.icon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-black mb-4 uppercase tracking-tighter text-foreground group-hover:text-iridescent transition-colors leading-tight">
              {service.title}
            </h3>
            <p className="text-sm text-foreground/50 leading-relaxed group-hover:text-foreground/70 transition-colors">
              {service.description}
            </p>
            <div className="mt-8 flex items-center justify-between">
              <div className="text-[10px] font-mono text-foreground/20 group-hover:text-primary/50 transition-colors tracking-widest font-bold">
                SERVICE_0{index + 1}
              </div>
              <div className="h-[1px] flex-1 bg-white/5 mx-4 group-hover:bg-primary/20 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
