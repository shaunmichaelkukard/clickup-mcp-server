import { useState, useEffect } from 'react'
import { blink } from '@/lib/blink'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Plus, Trash2, Loader2, Upload, Pencil, X, CheckCircle2 } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  imageUrl: string
  author: string
  publishedAt: string
}

export function AdminBlog() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', imageUrl: '', author: '' })

  const fetchPosts = async () => {
    if (!user) return
    try {
      const rows = await blink.db.blogPosts.list({
        where: { userId: user.id },
        orderBy: { publishedAt: 'desc' },
        limit: 50,
      })
      setPosts(rows as BlogPost[])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchPosts() }, [user])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const { publicUrl } = await blink.storage.upload(file, `blog/${Date.now()}.${ext}`)
      setForm((prev) => ({ ...prev, imageUrl: publicUrl }))
      toast.success('Image uploaded')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const handleSave = async () => {
    if (!user || !form.title || !form.excerpt || !form.content) return
    setSaving(true)
    try {
      if (editing) {
        await blink.db.blogPosts.update(editing, {
          title: form.title,
          excerpt: form.excerpt,
          content: form.content,
          imageUrl: form.imageUrl,
          author: form.author,
        })
        setLastSaved(new Date())
        fetchPosts()
      } else {
        await blink.db.blogPosts.create({
          userId: user.id,
          title: form.title,
          excerpt: form.excerpt,
          content: form.content,
          imageUrl: form.imageUrl,
          author: form.author || 'JacksonCartel',
        })
        toast.success('Post created')
        setForm({ title: '', excerpt: '', content: '', imageUrl: '', author: '' })
        setEditing(null)
        setShowForm(false)
        fetchPosts()
      }
    } catch { toast.error('Failed to save') }
    finally { setSaving(false) }
  }

  // Autosave for editing existing posts
  useEffect(() => {
    if (!editing || !user || !form.title || !form.excerpt || !form.content) return

    const timer = setTimeout(() => {
      handleSave()
    }, 1500)

    return () => clearTimeout(timer)
  }, [form, editing, user])

  const handleEdit = (p: BlogPost) => {
    setForm({ title: p.title, excerpt: p.excerpt, content: p.content, imageUrl: p.imageUrl, author: p.author })
    setEditing(p.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await blink.db.blogPosts.delete(id)
      setPosts((prev) => prev.filter((p) => p.id !== id))
      toast.success('Post deleted')
    } catch { toast.error('Delete failed') }
  }

  return (
    <div className="p-6 lg:p-10 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter uppercase">Blog Posts</h1>
          <p className="text-muted-foreground text-sm mt-1">Create and edit blog articles.</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: '', excerpt: '', content: '', imageUrl: '', author: '' }); setLastSaved(null) }} className="h-10">
          {showForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {showForm ? 'Cancel' : 'New Post'}
        </Button>
      </div>

      {showForm && (
        <div className="border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono uppercase tracking-widest text-primary">
              {editing ? 'Edit Post' : 'New Post'}
            </h2>
            <div className="h-4">
              {saving ? (
                <p className="text-[10px] font-mono uppercase text-primary animate-pulse flex items-center gap-1.5">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Saving...
                </p>
              ) : lastSaved ? (
                <p className="text-[10px] font-mono uppercase text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  Saved
                </p>
              ) : null}
            </div>
          </div>
          <Input placeholder="Post Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-secondary border-none h-10" />
          <Input placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="bg-secondary border-none h-10" />
          <Textarea placeholder="Excerpt (short summary)" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="bg-secondary border-none min-h-[60px]" />
          <Textarea placeholder="Full Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="bg-secondary border-none min-h-[150px]" />
          <div className="flex gap-2">
            <Input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="bg-secondary border-none h-10 flex-1" />
            <label className="flex items-center gap-2 px-4 h-10 bg-secondary hover:bg-muted cursor-pointer transition-colors text-xs font-mono uppercase">
              {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
              Upload
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
          {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="w-full h-32 object-cover border border-border" />}
          {!editing && (
            <Button onClick={handleSave} className="h-10 uppercase font-mono text-xs tracking-widest">
              Publish Post
            </Button>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>No blog posts yet. Write your first article above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4 bg-card border border-border hover:border-primary/20 transition-colors">
              {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="w-16 h-16 object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{p.title}</p>
                <p className="text-xs text-muted-foreground truncate">{p.excerpt}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(p)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(p.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
