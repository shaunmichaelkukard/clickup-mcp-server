import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/home/Hero'
import { Showcase } from '@/components/home/Showcase'
import { Services } from '@/components/home/Services'
import { Blog } from '@/components/home/Blog'
import { LeadForm } from '@/components/home/LeadForm'

export function HomePage() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <main>
        <Hero />
        <Showcase />
        <Services />
        <Blog />
        <LeadForm />
      </main>
      <Footer />
    </div>
  )
}
