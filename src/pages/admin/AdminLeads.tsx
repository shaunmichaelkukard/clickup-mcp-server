import { useState, useEffect } from 'react'
import { blink } from '@/lib/blink'
import { useAuth } from '@/hooks/useAuth'
import { Loader2, Mail, Trash2, CheckCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface Lead {
  id: string
  name: string
  email: string
  company: string
  message: string
  status: string
  createdAt: string
}

export function AdminLeads() {
  const { user } = useAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'contacted'>('all')

  const fetchLeads = async () => {
    if (!user) return
    try {
      const rows = await blink.db.leads.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        limit: 100,
      })
      setLeads(rows as Lead[])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchLeads() }, [user])

  const handleStatusToggle = async (lead: Lead) => {
    const newStatus = lead.status === 'pending' ? 'contacted' : 'pending'
    try {
      await blink.db.leads.update(lead.id, { status: newStatus })
      setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, status: newStatus } : l))
      toast.success(`Marked as ${newStatus}`)
    } catch { toast.error('Update failed') }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this lead?')) return
    try {
      await blink.db.leads.delete(id)
      setLeads((prev) => prev.filter((l) => l.id !== id))
      toast.success('Lead deleted')
    } catch { toast.error('Delete failed') }
  }

  const filteredLeads = leads.filter(l => filter === 'all' || l.status === filter)
  const stats = {
    total: leads.length,
    pending: leads.filter(l => l.status === 'pending').length,
    contacted: leads.filter(l => l.status === 'contacted').length
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-5xl animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-foreground">Inquiries Hub</h1>
          <p className="text-foreground/40 text-xs font-mono tracking-widest uppercase mt-2">
            Managing potential opportunities and client connections.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-secondary p-1 rounded-lg">
            {(['all', 'pending', 'contacted'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${
                  filter === f 
                    ? 'bg-background text-primary shadow-sm' 
                    : 'text-foreground/40 hover:text-foreground/60'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Inquiries', value: stats.total, icon: Mail },
          { label: 'Pending Response', value: stats.pending, icon: Clock },
          { label: 'Successfully Contacted', value: stats.contacted, icon: CheckCircle }
        ].map((s, i) => (
          <div key={i} className="glass-card p-6 flex items-center justify-between group hover:border-primary/20 transition-all">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">{s.label}</p>
              <p className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">{s.value}</p>
            </div>
            <s.icon className="h-5 w-5 text-foreground/20 group-hover:text-primary/40 transition-colors" />
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary opacity-40" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/20">Syncing database...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-32 glass-card border-dashed border-white/5">
          <Mail className="h-12 w-12 mx-auto mb-6 opacity-10" />
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-foreground/30">No leads matching filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredLeads.map((lead, idx) => (
            <div 
              key={lead.id} 
              className="glass-card p-8 group hover:scale-[1.01] transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center text-primary font-black border border-primary/10">
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground leading-tight">{lead.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-mono uppercase tracking-widest mt-1">
                      <span className="text-primary">{lead.email}</span>
                      {lead.company && <span className="text-foreground/30">• {lead.company}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 self-end lg:self-center">
                  <button
                    onClick={() => handleStatusToggle(lead)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                      lead.status === 'contacted'
                        ? 'bg-primary/10 text-primary border-primary/20 shadow-glow-cyan'
                        : 'bg-white/5 text-foreground/40 border-white/5 hover:border-white/10'
                    }`}
                  >
                    {lead.status === 'contacted' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {lead.status}
                  </button>
                  <button 
                    onClick={() => handleDelete(lead.id)} 
                    className="p-2 text-foreground/10 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all border border-transparent hover:border-red-500/20"
                    title="Delete Lead"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-6 group-hover:border-primary/10 transition-colors">
                <p className="text-sm text-foreground/70 leading-relaxed font-serif italic">
                  "{lead.message}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-[10px] font-mono text-foreground/20 uppercase tracking-[0.2em]">
                  Received on {new Date(lead.createdAt).toLocaleDateString()} at {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <div className="h-[1px] flex-1 mx-6 bg-white/5" />
                <span className="text-[10px] font-black tracking-widest text-foreground/10">ID: {lead.id.slice(-8)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
