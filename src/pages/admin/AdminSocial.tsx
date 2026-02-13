import { useState, useEffect } from 'react'
import { blink } from '@/lib/blink'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Plus, Trash2, Loader2, Pencil, X, GripVertical, CheckCircle2 } from 'lucide-react'

const PLATFORM_OPTIONS = [
  { value: 'linkedin', label: 'LinkedIn', icon: 'Linkedin' },
  { value: 'twitter', label: 'Twitter / X', icon: 'Twitter' },
  { value: 'instagram', label: 'Instagram', icon: 'Instagram' },
  { value: 'facebook', label: 'Facebook', icon: 'Facebook' },
  { value: 'youtube', label: 'YouTube', icon: 'Youtube' },
  { value: 'tiktok', label: 'TikTok', icon: 'Music2' },
  { value: 'github', label: 'GitHub', icon: 'Github' },
  { value: 'website', label: 'Website', icon: 'Globe' },
  { value: 'whatsapp', label: 'WhatsApp', icon: 'MessageCircle' },
  { value: 'telegram', label: 'Telegram', icon: 'Send' },
]

interface SocialLink {
  id: string
  platform: string
  url: string
  iconName: string
  displayOrder: number
  isActive: string | number
}

export function AdminSocial() {
  const { user } = useAuth()
  const [links, setLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [form, setForm] = useState({ platform: 'linkedin', url: '' })

  const fetchLinks = async () => {
    if (!user) return
    try {
      const rows = await blink.db.socialLinks.list({
        where: { userId: user.id },
        orderBy: { displayOrder: 'asc' },
        limit: 20,
      })
      setLinks(rows as SocialLink[])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchLinks() }, [user])

  const handleSave = async () => {
    if (!user || !form.url) return
    const platformInfo = PLATFORM_OPTIONS.find((p) => p.value === form.platform)
    setSaving(true)
    try {
      if (editing) {
        await blink.db.socialLinks.update(editing, {
          platform: form.platform,
          url: form.url,
          iconName: platformInfo?.icon || 'Globe',
        })
        setLastSaved(new Date())
        fetchLinks()
      } else {
        await blink.db.socialLinks.create({
          userId: user.id,
          platform: form.platform,
          url: form.url,
          iconName: platformInfo?.icon || 'Globe',
          displayOrder: links.length,
          isActive: '1',
        })
        toast.success('Link added')
        setForm({ platform: 'linkedin', url: '' })
        setEditing(null)
        setShowForm(false)
        fetchLinks()
      }
    } catch { toast.error('Failed to save') }
    finally { setSaving(false) }
  }

  // Autosave for editing existing links
  useEffect(() => {
    if (!editing || !user || !form.url) return

    const timer = setTimeout(() => {
      handleSave()
    }, 1500)

    return () => clearTimeout(timer)
  }, [form, editing, user])

  const handleEdit = (link: SocialLink) => {
    setForm({ platform: link.platform, url: link.url })
    setEditing(link.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await blink.db.socialLinks.delete(id)
      setLinks((prev) => prev.filter((l) => l.id !== id))
      toast.success('Link deleted')
    } catch { toast.error('Delete failed') }
  }

  return (
    <div className="p-6 lg:p-10 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter uppercase">Social Links</h1>
          <p className="text-muted-foreground text-sm mt-1">Add your social media profiles.</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ platform: 'linkedin', url: '' }); setLastSaved(null) }} className="h-10">
          {showForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {showForm ? 'Cancel' : 'Add Link'}
        </Button>
      </div>

      {showForm && (
        <div className="border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono uppercase tracking-widest text-primary">
              {editing ? 'Edit Link' : 'Add Social Link'}
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
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Platform</label>
            <select
              value={form.platform}
              onChange={(e) => setForm({ ...form, platform: e.target.value })}
              className="w-full h-10 bg-secondary text-foreground px-3 border-none outline-none"
            >
              {PLATFORM_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">URL</label>
            <Input
              placeholder="https://linkedin.com/in/yourprofile"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="bg-secondary border-none h-10"
            />
          </div>
          {!editing && (
            <Button onClick={handleSave} className="h-10 uppercase font-mono text-xs tracking-widest">
              Add Link
            </Button>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : links.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>No social links yet. Add your first platform above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {links.map((link) => {
            const platform = PLATFORM_OPTIONS.find((p) => p.value === link.platform)
            return (
              <div key={link.id} className="flex items-center gap-4 p-4 bg-card border border-border hover:border-primary/20 transition-colors">
                <GripVertical className="h-4 w-4 text-muted-foreground/30" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{platform?.label || link.platform}</p>
                  <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleEdit(link)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(link.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
