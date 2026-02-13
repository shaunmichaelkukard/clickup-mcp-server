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
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-xl font-bold tracking-tighter">
              <span className="text-primary">{settings.brandName.slice(0, 7)}</span>
              <span className="text-muted-foreground">{settings.brandName.slice(7)}</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              {settings.footerDescription}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-foreground mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><a href="#showcase" className="text-sm text-muted-foreground hover:text-primary transition-colors">Showcase</a></li>
              <li><a href="#services" className="text-sm text-muted-foreground hover:text-primary transition-colors">Services</a></li>
              <li><a href="#blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Insights</a></li>
              <li><a href="#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-foreground mb-4">Connect</h3>
            {activeSocials.length > 0 ? (
              <ul className="space-y-2">
                {activeSocials.map((social) => {
                  const Icon = iconMap[social.iconName] || Globe
                  return (
                    <li key={social.id}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                      </a>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">LinkedIn</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Twitter</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Instagram</a></li>
              </ul>
            )}
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {settings.brandName}. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground underline decoration-border underline-offset-4">Privacy Policy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground underline decoration-border underline-offset-4">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
