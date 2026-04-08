import { ClipboardList, LayoutDashboard, LogOut, Moon, NotebookPen, Sun, UserCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

let dashboardPrefetched = false

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/notes', label: 'Notes', icon: NotebookPen },
  { to: '/questionnaire', label: 'Questionnaire', icon: ClipboardList },
  { to: '/profile', label: 'Profile', icon: UserCircle2 },
]

export default function AppShell({ title, children }) {
  const { logout } = useAuth()
  const { pathname } = useLocation()
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('wellnest_dark_mode')
    if (saved === '1') return true
    if (saved === '0') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('wellnest_dark_mode', darkMode ? '1' : '0')
  }, [darkMode])

  const prefetchDashboard = () => {
    if (dashboardPrefetched) return
    dashboardPrefetched = true
    import('../pages/DashboardPage.jsx')
    import('./WellnessTrendChart.jsx')
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-white/60 bg-white/70 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <img src="/wellnest-logo.png" alt="WellNest logo" className="h-7 w-7 rounded-lg object-cover shadow-sm" />
            <span className="font-display text-lg font-semibold">WellNest</span>
          </div>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onMouseEnter={to === '/dashboard' ? prefetchDashboard : undefined}
                onFocus={to === '/dashboard' ? prefetchDashboard : undefined}
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                  pathname === to ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode((d) => !d)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {darkMode ? 'Light' : 'Dark'}
            </button>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
            <LogOut className="h-4 w-4" />
            Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 animate-fade-in">
        <h1 className="mb-6 font-display text-3xl font-semibold text-slate-800 dark:text-slate-100">{title}</h1>
        {children}
      </main>
    </div>
  )
}
