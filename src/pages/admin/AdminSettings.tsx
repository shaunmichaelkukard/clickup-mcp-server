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
    if (!user) return
    setSaving(true)
    try {
      const entries = Object.entries(data as unknown as Record<string, string>)
      for (const [key, value] of entries) {
        // Only save if it's different from current server state to optimize
        if (settings[key as keyof SiteSettings] !== value) {
          await blink.db.siteSettings.upsert({
            id: key,
            userId: user.id,
            settingKey: key,
            settingValue: value,
          })
        }
      }
      setLastSaved(new Date())
    } catch {
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter uppercase">Site Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Edit all website text, headings, contact info, and images.
          </p>
          <div className="flex items-center gap-2 mt-2 h-5">
            {saving ? (
              <p className="text-[10px] font-mono uppercase text-primary animate-pulse flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving changes...
              </p>
            ) : lastSaved ? (
              <p className="text-[10px] font-mono uppercase text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                Last saved at {lastSaved.toLocaleTimeString()}
              </p>
            ) : null}
          </div>
        </div>
        <Button onClick={() => handleSave()} disabled={saving} className="h-10 uppercase font-mono text-xs tracking-widest">
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Now
        </Button>
      </div>

      {settingGroups.map((group) => (
        <div key={group.title} className="border border-border bg-card p-6 space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-widest text-primary">{group.title}</h2>
          {group.fields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                {field.label}
              </label>
              {field.key === 'heroImageUrl' ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={getVal(field.key)}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="bg-secondary border-none h-10 flex-1"
                      placeholder="Enter URL or upload..."
                    />
                    <label className="flex items-center gap-2 px-4 h-10 bg-secondary hover:bg-muted cursor-pointer transition-colors text-xs font-mono uppercase">
                      {uploadingHero ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
                    </label>
                  </div>
                  {getVal(field.key) && (
                    <img
                      src={getVal(field.key)}
                      alt="Hero preview"
                      className="w-full h-32 object-cover border border-border"
                    />
                  )}
                </div>
              ) : field.type === 'textarea' ? (
                <Textarea
                  value={getVal(field.key)}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="bg-secondary border-none min-h-[80px] resize-none"
                />
              ) : (
                <Input
                  value={getVal(field.key)}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="bg-secondary border-none h-10"
                />
              )}
            </div>
          ))}
        </div>
      ))}

      <div className="sticky bottom-4 lg:bottom-0">
        <Button onClick={() => handleSave()} disabled={saving} className="w-full h-12 uppercase font-mono tracking-widest">
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save All Changes
        </Button>
      </div>
    </div>
  )
}
