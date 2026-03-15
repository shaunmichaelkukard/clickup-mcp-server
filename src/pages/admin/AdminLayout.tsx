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
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-primary/20 animate-pulse" />
          <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
        
        <div className="glass-card w-full max-w-md mx-4 p-10 space-y-10 relative z-10 border-t border-l border-white/10 shadow-2xl">
          <div className="text-center space-y-8">
            <div className="h-20 w-20 mx-auto glass-card flex items-center justify-center glow-primary border-primary/20">
              <Settings className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-black tracking-tighter uppercase text-iridescent leading-none">Admin Hub</h1>
              <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-[0.2em]">
                Authenticating JacksonCartel Authority
              </p>
            </div>
            <Button onClick={login} className="btn-glass-primary w-full h-14 uppercase font-black tracking-[0.3em] text-xs glow-primary">
              Authorize Dashboard
            </Button>
            <Link to="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2">
              <ArrowLeft className="h-3 w-3" /> Back to Website
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Sidebar */}
      <aside className="w-64 h-screen flex-shrink-0 flex flex-col glass-panel border-r border-white/5 hidden lg:flex relative z-20">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link to="/admin" className="text-lg font-black tracking-tighter flex items-center gap-3 uppercase">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black" style={{background: 'var(--gradient-primary)'}}>JC</div>
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
                  'flex items-center gap-3 px-4 py-3 text-xs transition-all duration-300 rounded-xl group relative overflow-hidden font-black uppercase tracking-[0.1em]',
                  isActive
                    ? 'glass-card text-primary glow-primary border-primary/20'
                    : 'text-muted-foreground hover:text-foreground glass-hover border-transparent hover:border-white/5'
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]" />
                )}
                <item.icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                <span className="relative z-10">{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-white/5 space-y-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors px-2"
          >
            <ArrowLeft className="h-3 w-3" /> View Website
          </Link>
          <div className="glass-card p-3 flex items-center justify-between rounded-xl border-white/5 bg-white/5">
            <span className="text-[10px] text-muted-foreground truncate font-mono">{user.email}</span>
            <button onClick={logout} className="text-muted-foreground hover:text-primary transition-all active:scale-90">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 glass-panel border-b border-white/5 flex items-center justify-between px-4">
        <Link to="/admin" className="text-lg font-black tracking-tighter flex items-center gap-2 uppercase">
          <div className="w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-black" style={{background: 'var(--gradient-primary)'}}>JC</div>
          <span className="text-iridescent">Admin</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 glass-card rounded-lg border-white/5">
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </Link>
          <button onClick={logout} className="p-2 glass-card rounded-lg border-white/5">
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
              <item.icon className={cn("h-5 w-5 mb-1", isActive && "glow-primary")} />
              <span className="text-[10px] font-black tracking-[0.1em] uppercase">{item.label.split(' ')[0]}</span>
            </Link>
          )
        })}
      </div>

      {/* Main content */}
      <main className="flex-1 h-screen overflow-y-auto lg:pt-0 pt-14 pb-16 lg:pb-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.05),transparent_40%),radial-gradient(circle_at_bottom_left,hsl(var(--accent)/0.05),transparent_40%)]">
        <div className="min-h-full relative">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
