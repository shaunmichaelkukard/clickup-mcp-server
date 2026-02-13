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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-6 p-8 border border-border bg-card max-w-md mx-4">
          <div className="h-12 w-12 mx-auto bg-primary/10 flex items-center justify-center">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tighter uppercase">Admin Hub</h1>
          <p className="text-muted-foreground text-sm">
            Sign in to manage your JacksonCartel website content.
          </p>
          <Button onClick={login} className="w-full h-12 uppercase font-mono tracking-widest">
            Sign In
          </Button>
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-2">
            <ArrowLeft className="h-3 w-3" /> Back to Website
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 h-screen flex-shrink-0 flex flex-col border-r border-border bg-card hidden lg:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link to="/admin" className="text-lg font-bold tracking-tighter">
            <span className="text-primary">JC</span> Admin
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary border-l-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-border space-y-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> View Website
          </Link>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground truncate">{user.email}</span>
            <button onClick={logout} className="text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <Link to="/admin" className="text-lg font-bold tracking-tighter">
          <span className="text-primary">JC</span> Admin
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xs text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <button onClick={logout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex overflow-x-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex-1 flex flex-col items-center py-2 min-w-[64px] text-[10px]',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-4 w-4 mb-1" />
              {item.label.split(' ')[0]}
            </Link>
          )
        })}
      </div>

      {/* Main content */}
      <main className="flex-1 h-screen overflow-y-auto lg:pt-0 pt-14 pb-16 lg:pb-0">
        <Outlet />
      </main>
    </div>
  )
}
