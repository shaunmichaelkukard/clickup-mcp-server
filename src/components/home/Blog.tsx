import { useState, useEffect } from 'react'
import { Section } from '@/components/layout/Section'
import { ArrowRight } from 'lucide-react'
import { blink } from '@/lib/blink'
import { useSiteSettings } from '@/hooks/useSiteSettings'

interface Post {
  id: string
  title: string
  excerpt: string
  imageUrl: string
  publishedAt: string
}

const fallbackPosts: Post[] = [
  {
    id: 'b1',
    title: 'The Future of Property Marketing',
    excerpt: 'How AI and immersive technology are reshaping the real estate landscape.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    publishedAt: '2026-01-30T16:18:22Z',
  },
  {
    id: 'b2',
    title: 'Lead Gen Strategies for 2024',
    excerpt: 'Why strategic targeting is more effective than broad-spectrum advertising.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    publishedAt: '2026-01-30T16:18:22Z',
  },
  {
    id: 'b3',
    title: 'Branding Luxury Real Estate',
    excerpt: 'The importance of narrative in high-end property transactions.',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    publishedAt: '2026-01-30T16:18:22Z',
  },
]

export const Blog = () => {
  const { settings } = useSiteSettings()
  const [posts, setPosts] = useState<Post[]>(fallbackPosts)

  useEffect(() => {
    const load = async () => {
      try {
        const rows = await blink.db.blogPosts.list({
          orderBy: { publishedAt: 'desc' },
          limit: 3,
        })
        if (rows && rows.length > 0) {
          setPosts(rows as Post[])
        }
      } catch {
        // Use fallback
      }
    }
    load()
  }, [])

  return (
    <Section
      id="blog"
      title={settings.blogTitle}
      subtitle={settings.blogSubtitle}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <div 
            key={post.id} 
            className="glass-card group cursor-pointer flex flex-col hover:scale-[1.02] transition-all duration-500 animate-slide-up"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover brightness-90 transition-all duration-1000 group-hover:brightness-110 group-hover:scale-110"
              />
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <span className="badge-glass text-primary/80 group-hover:text-primary transition-colors border-primary/10 group-hover:glow-primary">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <div className="h-[1px] flex-1 bg-white/5 group-hover:bg-primary/20 transition-colors" />
              </div>
              
              <h3 className="text-xl font-black mb-4 group-hover:text-iridescent transition-colors tracking-tight leading-snug uppercase">
                {post.title}
              </h3>
              <p className="text-sm text-foreground/50 mb-8 line-clamp-2 leading-relaxed group-hover:text-foreground/70 transition-colors">
                {post.excerpt}
              </p>
              
              <div className="mt-auto flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-primary group-hover:translate-x-2 transition-transform duration-300">
                Read Full Insight <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
