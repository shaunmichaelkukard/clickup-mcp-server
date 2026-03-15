import { createClient } from '@blinkdotnew/sdk'

function getProjectId(): string {
  const envId = import.meta.env.VITE_BLINK_PROJECT_ID
  if (envId) return envId
  const hostname = typeof window !== 'undefined' ? window.location.hostname : ''
  const match = hostname.match(/^([^.]+)\.sites\.blink\.new$/)
  if (match) return match[1]
  return 'profile-showcase-site-zkahxjnx'
}

// Auth enabled for admin hub, public pages work without login
// authRequired: false allows public reads (site settings, blog posts, projects)
// Admin write operations will still require a valid user JWT via useAuth
export const blink = createClient({
  projectId: getProjectId(),
  publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk_mCbrOlMTTRaw_9iMQl5YUAerrtwjqP8J',
  auth: { mode: 'managed' },
})
