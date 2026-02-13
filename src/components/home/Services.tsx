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
      dark
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <div
            key={service.title}
            className="p-8 border border-primary/10 hover:border-primary/30 transition-colors bg-primary/5 backdrop-blur-sm group"
          >
            <div className="mb-6 h-12 w-12 flex items-center justify-center bg-primary text-primary-foreground group-hover:scale-110 transition-transform">
              <service.icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-4 uppercase tracking-tighter">{service.title}</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              {service.description}
            </p>
            <div className="mt-8 text-[10px] font-mono text-primary/30 group-hover:text-primary/70 transition-colors">
              SERVICE_0{index + 1}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
