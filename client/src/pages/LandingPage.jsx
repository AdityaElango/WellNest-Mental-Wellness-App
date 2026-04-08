import { Navigate } from 'react-router-dom'
import AboutSection from '../components/AboutSection.jsx'
import AuthForm from '../components/AuthForm.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function LandingPage() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500/20 via-sky-200/10 to-emerald-400/20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-6 md:py-10 lg:grid-cols-2 lg:items-start lg:gap-10">
        <section>
          <div className="mb-6 inline-flex items-center gap-3 rounded-2xl border border-white/50 bg-white/70 px-4 py-2 shadow-soft">
            <img src="/wellnest-logo.png" alt="WellNest logo" className="h-10 w-10 rounded-xl object-cover" />
            <span className="font-display text-lg font-semibold text-slate-800">WellNest</span>
          </div>
          <AboutSection />
        </section>
        <div className="lg:sticky lg:top-8">
          <AuthForm />
        </div>
      </div>
    </main>
  )
}
