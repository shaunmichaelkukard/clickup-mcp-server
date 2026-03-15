import { Link, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Settings,
  FolderOpen,
  FileText,
  Users,
  Share2,
  LogOut,
  ArrowLeft,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Site Settings', href: '/admin/settings', icon: Settings },
  { label: 'Projects', href: '/admin/projects', icon: FolderOpen },
  { label: 'Blog Posts', href: '/admin/blog', icon: FileText },
  { label: 'Leads', href: '/admin/leads', icon: Users },
  { label: 'Social Links', href: '/admin/social', icon: Share2 },
]

export function AdminLayout() {
  const { user, loading, login, logout } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#080c14]">
        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-primary/20 animate-pulse" />
          <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#080c14] relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
        
        <div className="glass-card w-full max-w-md mx-4 p-8 space-y-8 relative z-10 border-t border-l border-white/10 shadow-2xl">
          <div className="text-center space-y-6">
            <div className="h-16 w-16 mx-auto glass-card flex items-center justify-center glow-cyan">
              <Settings className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter uppercase text-iridescent">Admin Hub</h1>
              <p className="text-muted-foreground text-sm">
                Sign in to manage your JacksonCartel website content.
              </p>
            </div>
            <Button onClick={login} className="btn-glass-primary w-full h-12 uppercase font-mono tracking-widest text-sm glow-cyan">
              Sign In to Dashboard
            </Button>
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2">
              <ArrowLeft className="h-3 w-3" /> Back to Website
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#080c14] text-foreground selection:bg-primary/30">
      {/* Sidebar */}
      <aside className="w-64 h-screen flex-shrink-0 flex flex-col glass-panel border-r border-white/5 hidden lg:flex relative z-20">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link to="/admin" className="text-lg font-bold tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-background text-xs font-bold" style={{background: 'linear-gradient(135deg, hsl(185 85% 50%), hsl(245 70% 65%))'}}>JC</div>
            <span className="text-iridescent">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 mt-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 rounded-xl group relative overflow-hidden',
                  isActive
                    ? 'glass-card text-primary glow-cyan border-white/10'
                    : 'text-muted-foreground hover:text-foreground glass-hover'
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-full" />
                )}
                <item.icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                <span className="relative z-10 font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-white/5 space-y-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors px-2"
          >
            <ArrowLeft className="h-3 w-3" /> View Website
          </Link>
          <div className="glass-card p-3 flex items-center justify-between rounded-xl border-white/5 bg-white/5">
            <span className="text-[10px] text-muted-foreground truncate font-mono">{user.email}</span>
            <button onClick={logout} className="text-muted-foreground hover:text-red-400 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 glass-panel border-b border-white/5 flex items-center justify-between px-4">
        <Link to="/admin" className="text-lg font-bold tracking-tighter flex items-center gap-2">
          <div className="w-6 h-6 rounded flex items-center justify-center text-background text-[10px] font-bold" style={{background: 'linear-gradient(135deg, hsl(185 85% 50%), hsl(245 70% 65%))'}}>JC</div>
          <span className="text-iridescent">Admin</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 glass-card rounded-lg">
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </Link>
          <button onClick={logout} className="p-2 glass-card rounded-lg">
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/5 flex overflow-x-auto px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex-1 flex flex-col items-center py-3 min-w-[64px] transition-all duration-300',
                isActive ? 'text-primary scale-110' : 'text-muted-foreground opacity-70'
              )}
            >
              <item.icon className={cn("h-5 w-5 mb-1", isActive && "glow-cyan")} />
              <span className="text-[10px] font-medium tracking-tight">{item.label.split(' ')[0]}</span>
            </Link>
          )
        })}
      </div>

      {/* Main content */}
      <main className="flex-1 h-screen overflow-y-auto lg:pt-0 pt-14 pb-16 lg:pb-0 bg-[radial-gradient(circle_at_top_right,rgba(13,148,136,0.05),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.05),transparent_40%)]">
        <div className="min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
