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
      }
    }
    load()
  }, [user])

  const cards = [
    { label: 'Projects', count: counts.projects, icon: FolderOpen, href: '/admin/projects', color: 'text-primary' },
    { label: 'Blog Posts', count: counts.posts, icon: FileText, href: '/admin/blog', color: 'text-lime' },
    { label: 'Leads', count: counts.leads, icon: Users, href: '/admin/leads', color: 'text-neon-red' },
    { label: 'Social Links', count: counts.social, icon: Share2, href: '/admin/social', color: 'text-cyan' },
  ]

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter uppercase">Administration Hub</h1>
        <p className="text-muted-foreground mt-1">
          Manage your entire JacksonCartel website from here.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.href}
            className="group p-6 bg-card border border-border hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <card.icon className={`h-5 w-5 ${card.color}`} />
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-3xl font-bold font-mono">{card.count}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold uppercase tracking-tight">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link to="/admin/settings" className="p-4 bg-secondary hover:bg-secondary/80 transition-colors flex items-center gap-3">
            <span className="text-sm">Edit Website Content & Headings</span>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Link>
          <Link to="/admin/projects" className="p-4 bg-secondary hover:bg-secondary/80 transition-colors flex items-center gap-3">
            <span className="text-sm">Add New Project</span>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Link>
          <Link to="/admin/blog" className="p-4 bg-secondary hover:bg-secondary/80 transition-colors flex items-center gap-3">
            <span className="text-sm">Write Blog Post</span>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Link>
          <Link to="/admin/social" className="p-4 bg-secondary hover:bg-secondary/80 transition-colors flex items-center gap-3">
            <span className="text-sm">Manage Social Links</span>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Link>
        </div>
      </div>
    </div>
  )
}
