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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
              <span className="text-primary">{settings.brandName.slice(0, 7)}</span><span className="text-muted-foreground">{settings.brandName.slice(7)}</span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href="#contact">
              <Button size="sm" className="font-mono text-xs uppercase tracking-widest">
                Start Project
              </Button>
            </a>
            <Link to="/admin" className="p-2 text-muted-foreground hover:text-primary transition-colors" title="Admin Hub">
              <Settings className="h-4 w-4" />
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Link to="/admin" className="p-2 text-muted-foreground hover:text-primary transition-colors">
              <Settings className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-muted-foreground transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="px-3 py-2">
              <a href="#contact" onClick={() => setIsOpen(false)}>
                <Button className="w-full justify-center">Start Project</Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
