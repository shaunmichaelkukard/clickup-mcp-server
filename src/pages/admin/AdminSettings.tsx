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

      // Fetch existing rows to get their real DB-assigned IDs.
      // This prevents the UNIQUE constraint failure on setting_key when the
      // upsert ID doesn't match the already-persisted row ID.
      const existing = await blink.db.siteSettings.list({
        where: { userId: user.id },
        limit: 200,
      }) as Array<{ id: string; settingKey: string }>

      const existingById: Record<string, string> = {}
      for (const row of existing) {
        existingById[row.settingKey] = row.id
      }

      // Upsert each setting using the existing row's ID if one is found,
      // otherwise generate a fresh deterministic ID.
      await Promise.all(
        entries.map(([key, value]) =>
          blink.db.siteSettings.upsert({
            id: existingById[key] ?? `${user.id}_${key}`,
            userId: user.id,
            settingKey: key,
            settingValue: value ?? '',
          })
        )
      )
      setLastSaved(new Date())
      toast.success('Settings saved')
    } catch (err: unknown) {
      console.error('Save error:', err)
      const errObj = err as { status?: number; details?: { error?: string } }
      if (errObj?.status === 403 && errObj?.details?.error?.includes('projectId missing')) {
        toast.error('Session expired. Redirecting to sign in...')
        setTimeout(() => blink.auth.login(window.location.href), 1500)
      } else {
        toast.error('Failed to save settings. Please try again.')
      }
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
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-primary/20 animate-pulse" />
          <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-10 space-y-12 max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-black tracking-tighter uppercase text-iridescent leading-none">Global Config</h1>
          <p className="text-foreground/40 text-[10px] font-mono uppercase tracking-[0.2em]">
            JacksonCartel Strategic Infrastructure
          </p>
          <div className="h-6">
            {saving ? (
              <p className="text-[10px] font-mono uppercase text-primary animate-pulse flex items-center gap-2 px-3 py-1.5 glass-card w-fit rounded-full border-primary/20 bg-primary/5">
                <Loader2 className="h-3 w-3 animate-spin" />
                Synchronizing...
              </p>
            ) : lastSaved ? (
              <p className="text-[10px] font-mono uppercase text-green-500 flex items-center gap-2 px-3 py-1.5 glass-card w-fit rounded-full border-green-500/20 bg-green-500/5">
                <CheckCircle2 className="h-3 w-3" />
                Auto-saved {lastSaved.toLocaleTimeString()}
              </p>
            ) : null}
          </div>
        </div>
        <Button 
          onClick={() => handleSave()} 
          disabled={saving} 
          className="btn-glass-primary h-14 px-10 uppercase font-black text-xs tracking-[0.2em] glow-primary shrink-0 rounded-xl"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-3" /> : <Save className="h-4 w-4 mr-3" />}
          Commit Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-32">
        {settingGroups.map((group, idx) => (
          <div 
            key={group.title} 
            className="glass-card p-8 space-y-8 relative overflow-hidden group border border-white/5 hover:border-primary/20 transition-all duration-500 animate-slide-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-3xl -mr-24 -mt-24 group-hover:bg-primary/10 transition-colors" />
            
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-4">
              <span className="w-10 h-[1px] bg-primary/30" />
              {group.title}
            </h2>
            
            <div className="space-y-6">
              {group.fields.map((field) => (
                <div key={field.key} className="space-y-3">
                  <label className="text-[10px] text-foreground/30 font-black uppercase tracking-[0.2em] ml-1">
                    {field.label}
                  </label>
                  {field.key === 'heroImageUrl' ? (
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <Input
                          value={getVal(field.key)}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          className="input-glass h-12 flex-1 text-sm border-white/5 focus:border-primary/40 transition-all"
                          placeholder="Image Source URL..."
                        />
                        <label className="btn-glass-secondary flex items-center justify-center px-5 h-12 cursor-pointer transition-all rounded-xl border border-white/5 hover:border-primary/30 active:scale-95 shrink-0 bg-white/5">
                          {uploadingHero ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 text-primary" />}
                          <input type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
                        </label>
                      </div>
                      {getVal(field.key) && (
                        <div className="relative group/img aspect-video rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                          <img
                            src={getVal(field.key)}
                            alt="Preview"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110 brightness-75 group-hover/img:brightness-100"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover/img:opacity-20 transition-opacity" />
                        </div>
                      )}
                    </div>
                  ) : field.type === 'textarea' ? (
                    <Textarea
                      value={getVal(field.key)}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="input-glass min-h-[120px] text-sm border-white/5 focus:border-primary/40 transition-all leading-relaxed p-5"
                    />
                  ) : (
                    <Input
                      value={getVal(field.key)}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="input-glass h-12 text-sm border-white/5 focus:border-primary/40 transition-all px-5"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-4rem)] max-w-4xl z-40 md:hidden animate-fade-in">
        <Button 
          onClick={() => handleSave()} 
          disabled={saving} 
          className="btn-glass-primary w-full h-16 uppercase font-black tracking-[0.3em] text-[11px] glow-primary shadow-2xl rounded-2xl"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : <Save className="h-5 w-5 mr-3" />}
          Update All Infrastructure
        </Button>
      </div>
    </div>
  )
}
