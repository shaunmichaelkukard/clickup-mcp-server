import { useState, useEffect, useCallback } from 'react'
import { blink } from '@/lib/blink'

export interface SocialLink {
  id: string
  platform: string
  url: string
  iconName: string
  displayOrder: number
  isActive: string | number
}

export function useSocialLinks() {
  const [links, setLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLinks = useCallback(async () => {
    try {
      const rows = await blink.db.socialLinks.list({
        orderBy: { displayOrder: 'asc' },
        limit: 20,
      })
      setLinks(rows as SocialLink[])
    } catch {
      // Silent fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  return { links, loading, refetch: fetchLinks }
}
