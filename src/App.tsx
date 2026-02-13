import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminSettings } from './pages/admin/AdminSettings'
import { AdminProjects } from './pages/admin/AdminProjects'
import { AdminBlog } from './pages/admin/AdminBlog'
import { AdminLeads } from './pages/admin/AdminLeads'
import { AdminSocial } from './pages/admin/AdminSocial'
import { Toaster } from './components/ui/sonner'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="social" element={<AdminSocial />} />
        </Route>
      </Routes>
      <Toaster position="top-center" />
    </>
  )
}

export default App
