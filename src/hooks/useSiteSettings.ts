import { useState, useEffect, useCallback } from 'react'
import { blink } from '@/lib/blink'

export interface SiteSettings {
  // Hero
  heroTitle: string
  heroSubtitle: string
  heroBadge: string
  heroImageUrl: string
  // Contact
  contactEmail: string
  contactPhone: string
  contactTitle: string
  contactSubtitle: string
  // Offices
  office1Name: string
  office1Address1: string
  office1Address2: string
  office2Name: string
  office2Address1: string
  office2Address2: string
  // Footer
  footerDescription: string
  // Brand
  brandName: string
  brandTagline: string
  // Services section
  servicesTitle: string
  servicesSubtitle: string
  // Showcase section
  showcaseTitle: string
  showcaseSubtitle: string
  // Blog section
  blogTitle: string
  blogSubtitle: string
}

const defaults: SiteSettings = {
  heroTitle: 'Strategic Solutions For High-End Assets',
  heroSubtitle: 'JacksonCartel delivers bespoke marketing campaigns that convert leads into legends. We specialize in strategic visibility for the world\'s most prestigious properties.',
  heroBadge: 'Property Marketing Specialists',
  heroImageUrl: 'https://images.unsplash.com/photo-1758957701419-2c6e266f7988?auto=format&fit=crop&q=80&w=2000',
  contactEmail: 'hello@jacksoncartel.com',
  contactPhone: '+1 (555) 0123 4567',
  contactTitle: 'Start a Project',
  contactSubtitle: 'Ready to elevate your property\'s market presence? Get in touch to discuss a bespoke strategic campaign.',
  office1Name: 'New York',
  office1Address1: '5th Avenue, Suite 1200',
  office1Address2: 'Manhattan, NY',
  office2Name: 'London',
  office2Address1: 'Mayfair Square',
  office2Address2: 'London, W1',
  footerDescription: 'Property Marketing Solutions. Specialists in strategic marketing campaigns and lead generation for the modern real estate landscape.',
  brandName: 'JacksonCartel',
  brandTagline: 'Property Marketing Solutions',
  servicesTitle: 'Our Expertise',
  servicesSubtitle: 'We combine analytical precision with creative excellence to deliver results that exceed expectations.',
  showcaseTitle: 'The Showcase',
  showcaseSubtitle: 'Excellence in property marketing. Explore our recent strategic campaigns and successful lead generation initiatives.',
  blogTitle: 'Property Insights',
  blogSubtitle: 'The latest trends, strategies, and insights from the front lines of global property marketing.',
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaults)
  const [loading, setLoading] = useState(true)

  const fetchSettings = useCallback(async () => {
    try {
      const rows = await blink.db.siteSettings.list({ limit: 200 })
      if (rows && rows.length > 0) {
        const merged = { ...defaults }
        rows.forEach((row: { settingKey: string; settingValue: string }) => {
          if (row.settingKey in merged) {
            (merged as Record<string, string>)[row.settingKey] = row.settingValue
          }
        })
        setSettings(merged)
      }
    } catch (err) {
      console.error('Failed to load settings, using defaults:', err)
      // Use defaults on error - site still displays
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return { settings, loading, refetch: fetchSettings, defaults }
}

export { defaults as siteSettingsDefaults }