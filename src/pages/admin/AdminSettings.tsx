import { useState, useEffect } from 'react'
import { blink } from '@/lib/blink'
import { useAuth } from '@/hooks/useAuth'
import { useSiteSettings, SiteSettings } from '@/hooks/useSiteSettings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Save, Loader2, Upload, CheckCircle2 } from 'lucide-react'

const settingGroups = [
  {
    title: 'Hero Section',
    fields: [
      { key: 'heroBadge', label: 'Badge Text', type: 'input' },
      { key: 'heroTitle', label: 'Title', type: 'textarea' },
      { key: 'heroSubtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'heroImageUrl', label: 'Background Image URL', type: 'input' },
    ],
  },
  {
    title: 'Brand',
    fields: [
      { key: 'brandName', label: 'Brand Name', type: 'input' },
      { key: 'brandTagline', label: 'Tagline', type: 'input' },
    ],
  },
  {
    title: 'Section Headings',
    fields: [
      { key: 'showcaseTitle', label: 'Showcase Title', type: 'input' },
      { key: 'showcaseSubtitle', label: 'Showcase Subtitle', type: 'textarea' },
      { key: 'servicesTitle', label: 'Services Title', type: 'input' },
      { key: 'servicesSubtitle', label: 'Services Subtitle', type: 'textarea' },
      { key: 'blogTitle', label: 'Blog Title', type: 'input' },
      { key: 'blogSubtitle', label: 'Blog Subtitle', type: 'textarea' },
    ],
  },
  {
    title: 'Contact Details',
    fields: [
      { key: 'contactTitle', label: 'Contact Section Title', type: 'input' },
      { key: 'contactSubtitle', label: 'Contact Subtitle', type: 'textarea' },
      { key: 'contactEmail', label: 'Email', type: 'input' },
      { key: 'contactPhone', label: 'Phone', type: 'input' },
    ],
  },
  {
    title: 'Office 1',
    fields: [
      { key: 'office1Name', label: 'City/Name', type: 'input' },
      { key: 'office1Address1', label: 'Address Line 1', type: 'input' },
      { key: 'office1Address2', label: 'Address Line 2', type: 'input' },
    ],
  },
  {
    title: 'Office 2',
    fields: [
      { key: 'office2Name', label: 'City/Name', type: 'input' },
      { key: 'office2Address1', label: 'Address Line 1', type: 'input' },
      { key: 'office2Address2', label: 'Address Line 2', type: 'input' },
    ],
  },
  {
    title: 'Footer',
    fields: [
      { key: 'footerDescription', label: 'Footer Description', type: 'textarea' },
    ],
  },
]

export function AdminSettings() {
  const { user } = useAuth()
  const { settings, loading: settingsLoading, defaults } = useSiteSettings()
  const [form, setForm] = useState<SiteSettings>(defaults)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [uploadingHero, setUploadingHero] = useState(false)

  useEffect(() => {
    if (!settingsLoading) {
      setForm(settings)
    }
  }, [settings, settingsLoading])

  const handleSave = async (data: SiteSettings = form) => {
    if (!user) {
      toast.error('You must be signed in to save settings')
      return
    }
    setSaving(true)
    try {
      const entries = Object.entries(data as unknown as Record<string, string>)
      // Save all entries in parallel for speed
      await Promise.all(
        entries.map(([key, value]) =>
          blink.db.siteSettings.upsert({
            id: `${user.id}_${key}`,
            userId: user.id,
            settingKey: key,
            settingValue: value ?? '',
          })
        )
      )
      setLastSaved(new Date())
      toast.success('Settings saved')
    } catch (err) {
      console.error('Save error:', err)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  // Autosave effect
  useEffect(() => {
    if (settingsLoading || !user) return

    // Don't autosave on first load
    if (JSON.stringify(form) === JSON.stringify(settings)) return

    const timer = setTimeout(() => {
      handleSave()
    }, 1500)

    return () => clearTimeout(timer)
  }, [form, settings, user, settingsLoading])

  const getVal = (key: string): string => (form as unknown as Record<string, string>)[key] || ''

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploadingHero(true)
    try {
      const ext = file.name.split('.').pop()
      const { publicUrl } = await blink.storage.upload(
        file,
        `hero/${Date.now()}.${ext}`
      )
      handleChange('heroImageUrl', publicUrl)
      toast.success('Hero image uploaded')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploadingHero(false)
    }
  }

  if (settingsLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#080c14]">
        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-primary/20 animate-pulse" />
          <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter uppercase text-iridescent">Site Settings</h1>
          <p className="text-muted-foreground text-sm max-w-md">
            Fine-tune every aspect of your website's presence, from hero sections to office details.
          </p>
          <div className="h-6">
            {saving ? (
              <p className="text-[10px] font-mono uppercase text-primary animate-pulse flex items-center gap-2 px-2 py-1 glass-card w-fit rounded-full border-primary/20">
                <Loader2 className="h-3 w-3 animate-spin" />
                Syncing changes...
              </p>
            ) : lastSaved ? (
              <p className="text-[10px] font-mono uppercase text-muted-foreground flex items-center gap-2 px-2 py-1 glass-card w-fit rounded-full border-white/5 bg-white/5">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                Last saved: {lastSaved.toLocaleTimeString()}
              </p>
            ) : null}
          </div>
        </div>
        <Button 
          onClick={() => handleSave()} 
          disabled={saving} 
          className="btn-glass-primary h-12 px-8 uppercase font-mono text-xs tracking-widest glow-cyan shrink-0"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24">
        {settingGroups.map((group) => (
          <div 
            key={group.title} 
            className="glass-card p-6 space-y-6 relative overflow-hidden group border-t border-l border-white/10"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
            
            <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-primary flex items-center gap-3">
              <span className="w-8 h-[1px] bg-primary/30" />
              {group.title}
            </h2>
            
            <div className="space-y-5">
              {group.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest ml-1">
                    {field.label}
                  </label>
                  {field.key === 'heroImageUrl' ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          value={getVal(field.key)}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          className="input-glass h-11 flex-1 text-sm"
                          placeholder="URL..."
                        />
                        <label className="btn-glass-secondary flex items-center gap-2 px-4 h-11 cursor-pointer transition-all text-[10px] font-mono uppercase rounded-xl border border-white/10 shrink-0">
                          {uploadingHero ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                          <input type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
                        </label>
                      </div>
                      {getVal(field.key) && (
                        <div className="relative group/img aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg">
                          <img
                            src={getVal(field.key)}
                            alt="Hero preview"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </div>
                  ) : field.type === 'textarea' ? (
                    <Textarea
                      value={getVal(field.key)}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="input-glass min-h-[100px] text-sm leading-relaxed"
                    />
                  ) : (
                    <Input
                      value={getVal(field.key)}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="input-glass h-11 text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-4xl z-40 md:hidden">
        <Button 
          onClick={() => handleSave()} 
          disabled={saving} 
          className="btn-glass-primary w-full h-14 uppercase font-mono tracking-widest text-sm glow-cyan shadow-2xl"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
          Update All Settings
        </Button>
      </div>
    </div>
  )
}
