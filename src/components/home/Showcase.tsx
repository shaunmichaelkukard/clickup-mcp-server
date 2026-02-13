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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="group relative bg-background overflow-hidden aspect-[16/10]"
          >
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-75 group-hover:brightness-100"
            />
            <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
              <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-primary mb-2 block">
                      {project.category}
                    </span>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">{project.description}</p>
                  </div>
                  <div className="h-10 w-10 bg-primary flex items-center justify-center">
                    <ArrowUpRight className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-6 left-6 text-[10px] font-mono text-foreground/30">
              0{index + 1}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
