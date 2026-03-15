import { Link } from 'react-router-dom'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { useSocialLinks } from '@/hooks/useSocialLinks'
import {
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Music2,
  Github,
  Globe,
  MessageCircle,
  Send,
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Music2,
  Github,
  Globe,
  MessageCircle,
  Send,
}

export const Footer = () => {
  const { settings } = useSiteSettings()
  const { links: socialLinks } = useSocialLinks()

  const activeSocials = socialLinks.filter((s) => Number(s.isActive) > 0)

  return (
    <footer className="relative mt-32">
      <div className="absolute inset-0 bg-white/[0.01] border-t border-white/5" />
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-black tracking-tighter group uppercase">
              <span className="text-iridescent group-hover:glow-primary transition-all">{settings.brandName.slice(0, 7)}</span>
              <span className="text-foreground/80">{settings.brandName.slice(7)}</span>
            </Link>
            <p className="mt-6 text-sm text-foreground/40 max-w-sm leading-relaxed">
              {settings.footerDescription}
            </p>
            <div className="mt-8 flex items-center gap-4">
               <div className="h-1 w-12 bg-primary/20 rounded-full" />
               <div className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Established 2024</div>
            </div>
          </div>
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground mb-8 flex items-center gap-2">
              <div className="h-1 w-1 bg-primary rounded-full" />
              Navigation
            </h3>
            <ul className="space-y-4">
              <li><a href="#showcase" className="text-sm text-foreground/40 hover:text-primary transition-colors flex items-center group">
                <span className="h-[1px] w-0 group-hover:w-4 bg-primary mr-0 group-hover:mr-3 transition-all" />
                Showcase
              </a></li>
              <li><a href="#services" className="text-sm text-foreground/40 hover:text-primary transition-colors flex items-center group">
                <span className="h-[1px] w-0 group-hover:w-4 bg-primary mr-0 group-hover:mr-3 transition-all" />
                Services
              </a></li>
              <li><a href="#blog" className="text-sm text-foreground/40 hover:text-primary transition-colors flex items-center group">
                <span className="h-[1px] w-0 group-hover:w-4 bg-primary mr-0 group-hover:mr-3 transition-all" />
                Insights
              </a></li>
              <li><a href="#contact" className="text-sm text-foreground/40 hover:text-primary transition-colors flex items-center group">
                <span className="h-[1px] w-0 group-hover:w-4 bg-primary mr-0 group-hover:mr-3 transition-all" />
                Contact
              </a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground mb-8 flex items-center gap-2">
              <div className="h-1 w-1 bg-accent rounded-full" />
              Connect
            </h3>
            {activeSocials.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {activeSocials.map((social) => {
                  const Icon = iconMap[social.iconName] || Globe
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 w-10 glass rounded-xl flex items-center justify-center text-foreground/40 hover:text-primary hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
                      title={social.platform}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {['LinkedIn', 'Twitter', 'Instagram'].map((p) => (
                  <a key={p} href="#" className="h-10 w-10 glass rounded-xl flex items-center justify-center text-foreground/40 hover:text-primary transition-all">
                    <Globe className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <p className="text-[10px] font-mono text-foreground/20 uppercase tracking-widest font-bold">
            &copy; {new Date().getFullYear()} {settings.brandName}. Engineered for excellence.
          </p>
          <div className="flex space-x-8">
            <a href="#" className="text-[10px] font-bold text-foreground/20 hover:text-foreground uppercase tracking-widest transition-colors">Privacy Policy</a>
            <a href="#" className="text-[10px] font-bold text-foreground/20 hover:text-foreground uppercase tracking-widest transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
