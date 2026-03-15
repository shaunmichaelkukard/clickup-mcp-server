import { useState, useEffect } from 'react'
import { blink } from '@/lib/blink'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Plus, Trash2, Loader2, Upload, Pencil, X, CheckCircle2 } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  imageUrl: string
  category: string
  link: string
}

export function AdminProjects() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [form, setForm] = useState({ title: '', description: '', imageUrl: '', category: '', link: '' })

  const fetchProjects = async () => {
    if (!user) return
    try {
      const rows = await blink.db.projects.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        limit: 50,
      })
      setProjects(rows as Project[])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProjects() }, [user])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const { publicUrl } = await blink.storage.upload(file, `projects/${Date.now()}.${ext}`)
      setForm((prev) => ({ ...prev, imageUrl: publicUrl }))
      toast.success('Image uploaded')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const handleSave = async () => {
    if (!user || !form.title || !form.description) return
    setSaving(true)
    try {
      if (editing) {
        await blink.db.projects.update(editing, {
          title: form.title,
          description: form.description,
          imageUrl: form.imageUrl,
          category: form.category,
          link: form.link,
        })
        setLastSaved(new Date())
        fetchProjects()
      } else {
        await blink.db.projects.create({
          userId: user.id,
          title: form.title,
          description: form.description,
          imageUrl: form.imageUrl,
          category: form.category,
          link: form.link || '',
        })
        toast.success('Project created')
        setForm({ title: '', description: '', imageUrl: '', category: '', link: '' })
        setEditing(null)
        setShowForm(false)
        fetchProjects()
      }
    } catch { toast.error('Failed to save') }
    finally { setSaving(false) }
  }

  // Autosave for editing existing projects
  useEffect(() => {
    if (!editing || !user || !form.title || !form.description) return

    const timer = setTimeout(() => {
      handleSave()
    }, 1500)

    return () => clearTimeout(timer)
  }, [form, editing, user])

  const handleEdit = (p: Project) => {
    setForm({ title: p.title, description: p.description, imageUrl: p.imageUrl, category: p.category, link: p.link || '' })
    setEditing(p.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await blink.db.projects.delete(id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
      toast.success('Project deleted')
    } catch { toast.error('Delete failed') }
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter uppercase text-iridescent">Projects</h1>
          <p className="text-muted-foreground text-sm max-w-md">Manage your creative portfolio and showcase your best work.</p>
        </div>
        <Button 
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: '', description: '', imageUrl: '', category: '', link: '' }); setLastSaved(null) }} 
          className={cn(
            "h-12 px-8 uppercase font-mono text-xs tracking-[0.2em] transition-all duration-500 rounded-xl border border-white/10",
            showForm ? "btn-glass-secondary" : "btn-glass-primary glow-cyan"
          )}
        >
          {showForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {showForm ? 'Cancel' : 'Add New Project'}
        </Button>
      </div>

      {showForm && (
        <div className="glass-card p-8 space-y-8 relative overflow-hidden border-t border-l border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32" />
          
          <div className="flex items-center justify-between relative z-10">
            <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-primary flex items-center gap-4">
              <span className="w-12 h-[1px] bg-primary/30" />
              {editing ? 'Edit Project' : 'New Project'}
            </h2>
            <div className="h-6">
              {saving ? (
                <p className="text-[10px] font-mono uppercase text-primary animate-pulse flex items-center gap-2 px-2 py-1 glass-card rounded-full border-primary/20">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Syncing...
                </p>
              ) : lastSaved ? (
                <p className="text-[10px] font-mono uppercase text-muted-foreground flex items-center gap-2 px-2 py-1 glass-card rounded-full border-white/5 bg-white/5">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  Saved
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest ml-1">Title</label>
                <Input placeholder="Project Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-glass h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest ml-1">Category</label>
                <Input placeholder="e.g. Strategic Campaign" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-glass h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest ml-1">External Link</label>
                <Input placeholder="https://..." value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="input-glass h-12" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest ml-1">Description</label>
                <Textarea placeholder="Describe the project..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-glass min-h-[128px] resize-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest ml-1">Cover Image</label>
                <div className="flex gap-2">
                  <Input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="input-glass h-12 flex-1" />
                  <label className="btn-glass-secondary flex items-center gap-2 px-5 h-12 cursor-pointer transition-all text-[10px] font-mono uppercase rounded-xl border border-white/10 shrink-0">
                    {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {form.imageUrl && (
            <div className="relative group/preview aspect-[21/9] max-h-48 rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in-95 duration-500">
              <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-[10px] font-mono uppercase text-white/60 tracking-widest">Image Preview</p>
                <p className="text-white font-bold">{form.title || 'Untitled Project'}</p>
              </div>
            </div>
          )}

          {!editing && (
            <Button 
              onClick={handleSave} 
              className="btn-glass-primary w-full h-14 uppercase font-mono text-sm tracking-[0.2em] glow-cyan shadow-xl relative z-10"
            >
              Confirm & Create Project
            </Button>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-primary/20 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
          </div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground animate-pulse">Loading archive...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card text-center py-24 border border-white/5 bg-white/[0.02]">
          <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">No projects found in the database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <div 
              key={p.id} 
              className="glass-card group relative overflow-hidden flex flex-col border-t border-l border-white/10 hover:border-primary/30 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {p.imageUrl && (
                <div className="aspect-video relative overflow-hidden">
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute top-3 left-3">
                    <span className="badge-glass text-[10px] px-2 py-1 font-mono">{p.category}</span>
                  </div>
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">{p.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-6 flex-1 leading-relaxed opacity-70">
                  {p.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleEdit(p)} 
                      className="p-2.5 rounded-xl glass-hover text-muted-foreground hover:text-primary transition-all border border-transparent hover:border-white/10"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id)} 
                      className="p-2.5 rounded-xl glass-hover text-muted-foreground hover:text-red-400 transition-all border border-transparent hover:border-white/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {p.link && (
                    <a 
                      href={p.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] font-mono uppercase tracking-widest text-primary/60 hover:text-primary transition-colors"
                    >
                      View Live
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
