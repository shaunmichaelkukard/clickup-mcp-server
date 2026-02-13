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
    <div className="p-6 lg:p-10 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter uppercase">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage showcase projects.</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: '', description: '', imageUrl: '', category: '', link: '' }); setLastSaved(null) }} className="h-10">
          {showForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {showForm ? 'Cancel' : 'Add Project'}
        </Button>
      </div>

      {showForm && (
        <div className="border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono uppercase tracking-widest text-primary">
              {editing ? 'Edit Project' : 'New Project'}
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
          <Input placeholder="Project Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-secondary border-none h-10" />
          <Input placeholder="Category (e.g. Strategic Campaign)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-secondary border-none h-10" />
          <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-secondary border-none min-h-[80px]" />
          <div className="flex gap-2">
            <Input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="bg-secondary border-none h-10 flex-1" />
            <label className="flex items-center gap-2 px-4 h-10 bg-secondary hover:bg-muted cursor-pointer transition-colors text-xs font-mono uppercase">
              {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
              Upload
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
          {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="w-full h-32 object-cover border border-border" />}
          <Input placeholder="Link (optional)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="bg-secondary border-none h-10" />
          {!editing && (
            <Button onClick={handleSave} className="h-10 uppercase font-mono text-xs tracking-widest">
              Create Project
            </Button>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>No projects yet. Add your first project above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4 bg-card border border-border hover:border-primary/20 transition-colors">
              {p.imageUrl && (
                <img src={p.imageUrl} alt={p.title} className="w-16 h-16 object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.category}</p>
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
