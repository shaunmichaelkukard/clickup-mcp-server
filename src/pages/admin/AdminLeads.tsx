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
    try {
      await blink.db.leads.delete(id)
      setLeads((prev) => prev.filter((l) => l.id !== id))
      toast.success('Lead deleted')
    } catch { toast.error('Delete failed') }
  }

  return (
    <div className="p-6 lg:p-10 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tighter uppercase">Leads</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View and manage contact form submissions.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : leads.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Mail className="h-8 w-8 mx-auto mb-3 opacity-40" />
          <p>No leads yet. They will appear here when visitors submit the contact form.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div key={lead.id} className="p-5 bg-card border border-border space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">{lead.email} {lead.company && `• ${lead.company}`}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStatusToggle(lead)}
                    className={`flex items-center gap-1 px-2 py-1 text-xs font-mono uppercase tracking-wider transition-colors ${
                      lead.status === 'contacted'
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground bg-secondary'
                    }`}
                  >
                    {lead.status === 'contacted' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {lead.status}
                  </button>
                  <button onClick={() => handleDelete(lead.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-secondary-foreground">{lead.message}</p>
              <p className="text-[10px] font-mono text-muted-foreground">
                {new Date(lead.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
