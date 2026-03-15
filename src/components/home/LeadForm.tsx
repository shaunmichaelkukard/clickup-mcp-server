import React from 'react'
import { Section } from '@/components/layout/Section'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Send } from 'lucide-react'
import { blink } from '@/lib/blink'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export const LeadForm = () => {
  const { settings } = useSiteSettings()
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      company: (formData.get('company') as string) || '',
      message: formData.get('message') as string,
    }

    try {
      // Call the Edge Function to handle database storage and email notification
      const response = await fetch('https://zkahxjnx--send-lead-email.functions.blink.new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to send lead')
      }

      toast.success('Inquiry received. Our team will contact you shortly.')
      ;(e.target as HTMLFormElement).reset()
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('There was an error sending your inquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Section
      id="contact"
      title={settings.contactTitle}
      subtitle={settings.contactSubtitle}
      containerClassName="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start"
    >
      <div className="space-y-8 animate-fade-in">
        <div className="glass-card p-8 group">
          <h3 className="text-lg font-black uppercase tracking-[0.3em] mb-6 text-foreground group-hover:text-iridescent transition-colors flex items-center gap-3">
            <div className="h-1 w-8 bg-primary/40 rounded-full" />
            Direct Connect
          </h3>
          <p className="text-sm text-foreground/50 mb-8 leading-relaxed">
            For urgent inquiries or private portfolio discussions, reach out to our principal partners directly.
          </p>
          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between p-4 rounded-xl glass border-white/5 group/link hover:border-primary/30 transition-all">
              <span className="text-foreground/40 uppercase tracking-widest font-bold">Email</span>
              <span className="text-foreground group-hover/link:text-primary transition-colors">{settings.contactEmail}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl glass border-white/5 group/link hover:border-primary/30 transition-all">
              <span className="text-foreground/40 uppercase tracking-widest font-bold">Phone</span>
              <span className="text-foreground group-hover/link:text-primary transition-colors">{settings.contactPhone}</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-8">
          <h3 className="text-lg font-black uppercase tracking-[0.3em] mb-8 text-foreground flex items-center gap-3">
            <div className="h-1 w-8 bg-accent/40 rounded-full" />
            Elite Offices
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="badge-glass w-fit text-primary font-black glow-primary border-primary/20">{settings.office1Name}</div>
              <div className="space-y-1 text-[10px] text-foreground/40 leading-relaxed font-mono uppercase tracking-[0.2em]">
                <p className="text-foreground/60">{settings.office1Address1}</p>
                <p>{settings.office1Address2}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="badge-glass w-fit text-accent font-black glow-accent border-accent/20">{settings.office2Name}</div>
              <div className="space-y-1 text-[10px] text-foreground/40 leading-relaxed font-mono uppercase tracking-[0.2em]">
                <p className="text-foreground/60">{settings.office2Address1}</p>
                <p>{settings.office2Address2}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-10 space-y-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 ml-1">Full Name</label>
            <input 
              name="name" 
              required 
              placeholder="John Doe" 
              className="input-glass w-full h-14 px-5 text-sm placeholder:text-foreground/20 text-foreground" 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 ml-1">Email Address</label>
            <input 
              name="email" 
              type="email" 
              required 
              placeholder="john@company.com" 
              className="input-glass w-full h-14 px-5 text-sm placeholder:text-foreground/20 text-foreground" 
            />
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 ml-1">Company (Optional)</label>
          <input 
            name="company" 
            placeholder="Agency or Developer Name" 
            className="input-glass w-full h-14 px-5 text-sm placeholder:text-foreground/20 text-foreground" 
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 ml-1">Message</label>
          <textarea 
            name="message" 
            required 
            placeholder="Tell us about your property or project..." 
            className="input-glass w-full min-h-[160px] p-5 text-sm placeholder:text-foreground/20 text-foreground resize-none" 
          />
        </div>
        <button 
          type="submit" 
          disabled={loading} 
          className="btn-glass-primary w-full h-16 uppercase font-black tracking-[0.4em] text-[11px] flex items-center justify-center rounded-xl glow-primary transition-all"
        >
          {loading ? 'Processing...' : 'Send Inquiry'} <Send className="ml-3 h-4 w-4" />
        </button>
      </form>
    </Section>
  )
}
