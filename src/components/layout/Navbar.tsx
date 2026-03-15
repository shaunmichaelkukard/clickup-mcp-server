import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Menu, X, Settings } from 'lucide-react'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { settings } = useSiteSettings()

  const navLinks = [
    { name: 'Showcase', href: '#showcase' },
    { name: 'Services', href: '#services' },
    { name: 'Insights', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ]

  const brandParts = settings.brandName.match(/^(\w+)(\w+)$/) || [settings.brandName, settings.brandName.slice(0, -6), settings.brandName.slice(-6)]

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-6xl z-50 glass-panel rounded-2xl overflow-hidden">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-black tracking-tighter hover:opacity-80 transition-opacity uppercase">
              <span className="text-iridescent">{settings.brandName.slice(0, 7)}</span><span className="text-foreground/90">{settings.brandName.slice(7)}</span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-1.5 text-xs font-medium text-foreground/70 hover:text-foreground hover:bg-white/5 rounded-full transition-all border border-transparent hover:border-white/10"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href="#contact">
              <button className="btn-glass-primary px-6 py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-black">
                Start Project
              </button>
            </a>
            <Link to="/admin" className="p-2.5 text-foreground/50 hover:text-primary transition-all glass rounded-full hover:scale-110 active:scale-95" title="Admin Hub">
              <Settings className="h-4 w-4" />
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Link to="/admin" className="p-2 text-foreground/50 hover:text-primary transition-colors glass rounded-full">
              <Settings className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 glass rounded-full text-foreground hover:text-primary transition-colors"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden glass-panel border-t border-white/10 animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-white/5 rounded-xl transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4">
              <a href="#contact" onClick={() => setIsOpen(false)}>
                <button className="btn-glass-primary w-full py-3 rounded-xl uppercase font-bold tracking-widest text-[10px]">
                  Start Project
                </button>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
