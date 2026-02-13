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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {posts.map((post) => (
          <div key={post.id} className="group cursor-pointer">
            <div className="aspect-[4/3] mb-6 overflow-hidden bg-muted">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover brightness-75 transition-all duration-500 group-hover:brightness-100 group-hover:scale-105"
              />
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <div className="h-[1px] flex-1 bg-border" />
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors underline-offset-4 tracking-tight">
              {post.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center text-xs font-mono uppercase tracking-widest text-primary group-hover:translate-x-2 transition-transform">
              Read Article <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
