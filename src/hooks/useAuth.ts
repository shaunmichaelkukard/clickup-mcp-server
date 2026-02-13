import { useState, useEffect } from 'react'
import { blink } from '@/lib/blink'

interface BlinkUser {
  id: string
  email: string
  displayName?: string
  avatar?: string
}

export function useAuth() {
  const [user, setUser] = useState<BlinkUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user as BlinkUser | null)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const login = () => blink.auth.login(window.location.href)
  const logout = () => blink.auth.logout()

  return { user, loading, login, logout }
}
