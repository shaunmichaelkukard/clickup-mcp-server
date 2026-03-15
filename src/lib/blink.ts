import { createClient } from '@blinkdotnew/sdk'

const PROJECT_ID = import.meta.env.VITE_BLINK_PROJECT_ID || 'profile-showcase-site-zkahxjnx'
const PUBLISHABLE_KEY = import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk_mCbrOlMTTRaw_9iMQl5YUAerrtwjqP8J'

// Purge any stale tokens that have a mismatched projectId claim.
// This happens when a user previously signed in via a different Blink project
// and the old JWT (which has no projectId or a wrong one) is cached in localStorage.
function clearStaleBlinkTokens(projectId: string) {
  if (typeof window === 'undefined') return
  try {
    // Check ALL localStorage keys for any JWT-like values, not just blink_ prefixed ones
    for (const key of Object.keys(localStorage)) {
      const raw = localStorage.getItem(key)
      if (!raw) continue
      // Only inspect values that look like JWTs (three base64 segments separated by dots)
      if (!/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(raw)) continue
      try {
        const parts = raw.split('.')
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
        // Remove if projectId is missing or mismatched
        if (!payload.projectId || payload.projectId !== projectId) {
          localStorage.removeItem(key)
          console.info(`[blink] Cleared stale token at key "${key}" (projectId: ${payload.projectId ?? 'none'})`)
        }
      } catch {
        // Non-JWT value or parse error — skip
      }
    }
  } catch {
    // localStorage may be unavailable in some contexts — safe to ignore
  }
}

clearStaleBlinkTokens(PROJECT_ID)

export const blink = createClient({
  projectId: PROJECT_ID,
  publishableKey: PUBLISHABLE_KEY,
  auth: { mode: 'managed' },
})
