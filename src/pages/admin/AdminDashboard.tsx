import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { blink } from '@/lib/blink'
import { useAuth } from '@/hooks/useAuth'
import {
  FolderOpen,
  FileText,
  Users,
  Share2,
  Settings,
  ArrowRight,
} from 'lucide-react'

export function AdminDashboard() {
  const { user } = useAuth()
  const [counts, setCounts] = useState({
    projects: 0,
    posts: 0,
    leads: 0,
    social: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const [projects, posts, leads, social] = await Promise.all([
          blink.db.projects.count({ where: { userId: user.id } }),
          blink.db.blogPosts.count({ where: { userId: user.id } }),
          blink.db.leads.count({ where: { userId: user.id } }),
          blink.db.socialLinks.count({ where: { userId: user.id } }),
        ])
        setCounts({
          projects: projects ?? 0,
          posts: posts ?? 0,
          leads: leads ?? 0,
          social: social ?? 0,
        })
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const cards = [
    { label: 'Strategic Projects', count: counts.projects, icon: FolderOpen, href: '/admin/projects', color: 'text-primary', shadow: 'shadow-glow-cyan' },
    { label: 'Property Insights', count: counts.posts, icon: FileText, href: '/admin/blog', color: 'text-accent', shadow: 'shadow-glow-violet' },
    { label: 'Business Inquiries', count: counts.leads, icon: Users, href: '/admin/leads', color: 'text-primary', shadow: 'shadow-glow-cyan' },
    { label: 'Social Footprint', count: counts.social, icon: Share2, href: '/admin/social', color: 'text-accent', shadow: 'shadow-glow-violet' },
  ]

  return (
    <div className="p-6 lg:p-10 space-y-12 max-w-6xl animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-foreground leading-none">Command Center</h1>
          <p className="text-foreground/40 text-[10px] font-mono tracking-[0.3em] uppercase mt-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            JacksonCartel Systems Online
          </p>
        </div>
        
        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl hidden md:block">
          <p className="text-[10px] font-mono text-foreground/20 uppercase tracking-widest">Operator Session</p>
          <p className="text-xs font-bold text-foreground mt-1">{user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <Link
            key={card.label}
            to={card.href}
            className={`glass-card p-8 group hover:scale-[1.05] transition-all duration-500 animate-slide-up`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className={`p-3 rounded-xl bg-white/5 border border-white/5 group-hover:border-primary/20 transition-all ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-foreground/20 group-hover:text-primary group-hover:translate-x-2 transition-all" />
            </div>
            <div className="space-y-1">
              {loading ? (
                <div className="h-10 w-16 bg-white/5 animate-pulse rounded" />
              ) : (
                <p className="text-4xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors leading-none">
                  {card.count}
                </p>
              )}
              <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="glass-card p-10 overflow-hidden relative group">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all" />
        
        <div className="flex items-center gap-4 mb-10">
          <div className="h-1 w-12 bg-primary/40 rounded-full" />
          <h2 className="text-xl font-black uppercase tracking-[0.2em] text-foreground">Operational Tasks</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Global Settings', desc: 'Content & Headings', href: '/admin/settings', icon: Settings },
            { label: 'New Campaign', desc: 'Property Showcase', href: '/admin/projects', icon: FolderOpen },
            { label: 'Draft Insight', desc: 'Blog Publication', href: '/admin/blog', icon: FileText },
            { label: 'Connect Hub', desc: 'Social Platforms', href: '/admin/social', icon: Share2 }
          ].map((action, i) => (
            <Link 
              key={i}
              to={action.href} 
              className="p-6 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/20 rounded-2xl transition-all group/action"
            >
              <action.icon className="h-5 w-5 text-foreground/40 group-hover/action:text-primary mb-4 transition-colors" />
              <p className="text-sm font-black text-foreground uppercase tracking-widest">{action.label}</p>
              <p className="text-[10px] text-foreground/30 uppercase tracking-widest mt-1">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
