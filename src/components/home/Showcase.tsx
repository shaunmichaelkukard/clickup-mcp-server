import { useState, useEffect } from 'react'
import { Section } from '@/components/layout/Section'
import { ArrowUpRight } from 'lucide-react'
import { blink } from '@/lib/blink'
import { useSiteSettings } from '@/hooks/useSiteSettings'

interface Project {
  id: string
  title: string
  description: string
  imageUrl: string
  category: string
}

const fallbackProjects: Project[] = [
  {
    id: 'p1',
    title: 'The Azure Residences',
    description: 'Strategic marketing campaign for luxury high-rise development in Miami.',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
    category: 'Strategic Campaign',
  },
  {
    id: 'p2',
    title: 'Elysian Heights',
    description: 'Lead generation initiative resulting in 150+ high-intent buyer inquiries.',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    category: 'Lead Generation',
  },
  {
    id: 'p3',
    title: 'The Metropolitan',
    description: 'Comprehensive branding and digital presence for a premium commercial asset.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    category: 'Branding & Identity',
  },
  {
    id: 'p4',
    title: 'Skyline Lofts',
    description: 'Content strategy and social media management for modern urban living.',
    imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800',
    category: 'Content Marketing',
  },
]

export const Showcase = () => {
  const { settings } = useSiteSettings()
  const [projects, setProjects] = useState<Project[]>(fallbackProjects)

  useEffect(() => {
    const load = async () => {
      try {
        const rows = await blink.db.projects.list({
          orderBy: { createdAt: 'desc' },
          limit: 8,
        })
        if (rows && rows.length > 0) {
          setProjects(rows as Project[])
        }
      } catch {
        // Use fallback
      }
    }
    load()
  }, [])

  return (
    <Section
      id="showcase"
      title={settings.showcaseTitle}
      subtitle={settings.showcaseSubtitle}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="glass-card group overflow-hidden flex flex-col hover:scale-[1.01] transition-all duration-500 animate-slide-up"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 brightness-90 group-hover:brightness-100"
              />
              <div className="absolute top-4 left-4">
                <span className="badge-glass text-white glow-primary border-primary/20">
                  {project.category}
                </span>
              </div>
              <div className="absolute bottom-4 right-4 h-12 w-12 glass rounded-full flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                <ArrowUpRight className="h-6 w-6" />
              </div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col justify-between bg-gradient-to-b from-transparent to-white/5">
              <div>
                <div className="flex items-center gap-4 mb-3">
                   <div className="text-[10px] font-mono text-primary/40 font-bold">0{index + 1}</div>
                   <div className="h-[1px] w-8 bg-primary/20" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-3 tracking-tighter group-hover:text-iridescent transition-colors leading-none">
                  {project.title}
                </h3>
                <p className="text-sm text-foreground/50 leading-relaxed max-w-md">
                  {project.description}
                </p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/30 group-hover:text-primary/60 transition-colors">
                  Case Study Available
                </span>
                <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  EXPLORE PROJECT
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
