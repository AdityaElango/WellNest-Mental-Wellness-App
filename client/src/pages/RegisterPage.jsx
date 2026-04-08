import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, Lock, Mail, User, UserPlus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext.jsx'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const { login } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const nextErrors = {}
    if (!name.trim()) nextErrors.name = 'Name is required.'
    if (!email.trim()) nextErrors.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = 'Enter a valid email.'
    if (!password.trim()) nextErrors.password = 'Password is required.'
    else if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters.'
    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!validate()) return
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password })
      login(data.token)
      navigate('/dashboard')
    } catch {
      setError('Registration failed')
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-blue-500/20 via-sky-300/10 to-emerald-400/20 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-white/40 bg-white/25 p-8 shadow-2xl backdrop-blur-xl animate-fade-in">
        <h1 className="mb-2 font-display text-3xl font-semibold text-slate-800">Create account</h1>
        <p className="mb-6 text-sm text-slate-600">Start building calmer daily routines with WellNest.</p>

        <div className="mb-4">
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
            <input
              id="register-name"
              className="peer w-full rounded-xl border border-white/60 bg-white/70 py-3 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder=" "
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="register-name" className="pointer-events-none absolute left-10 top-3 text-sm text-slate-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs">
              Full name
            </label>
          </div>
          {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
        </div>

        <div className="mb-4">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
            <input
              id="register-email"
              className="peer w-full rounded-xl border border-white/60 bg-white/70 py-3 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="register-email" className="pointer-events-none absolute left-10 top-3 text-sm text-slate-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs">
              Email
            </label>
          </div>
          {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
        </div>

        <div className="mb-4">
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              className="peer w-full rounded-xl border border-white/60 bg-white/70 py-3 pl-10 pr-10 text-sm text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="register-password" className="pointer-events-none absolute left-10 top-3 text-sm text-slate-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs">
              Password
            </label>
            <button type="button" className="absolute right-3 top-3 text-slate-500 transition hover:text-slate-700" onClick={() => setShowPassword((s) => !s)}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
        </div>

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-3 text-sm font-medium text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:scale-[1.01]">
          <UserPlus className="h-4 w-4" />
          Create account
        </button>
        <p className="mt-4 text-sm text-slate-700">
          Already registered? <Link to="/login" className="inline-flex items-center gap-1 text-primary hover:underline">Login <ArrowRight className="h-3.5 w-3.5" /></Link>
        </p>
      </form>
    </div>
  )
}
