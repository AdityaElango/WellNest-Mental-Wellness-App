import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ToggleSwitch from './ToggleSwitch.jsx'
import LoginForm from './LoginForm.jsx'
import RegisterForm from './RegisterForm.jsx'
import api from '../services/api'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

function validate(mode, { name, email, password }) {
  const errors = {}
  if (mode === 'register' && !name.trim()) errors.name = 'Name is required.'
  if (!email.trim()) errors.email = 'Email is required.'
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Enter a valid email.'
  if (!password.trim()) errors.password = 'Password is required.'
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters.'
  return errors
}

export default function AuthForm() {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const { login } = useAuth()
  const { push } = useToast()
  const navigate = useNavigate()

  const title = useMemo(() => (mode === 'login' ? 'Welcome back' : 'Create your account'), [mode])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const nextErrors = validate(mode, { name, email, password })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setLoading(true)
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const payload = mode === 'login' ? { email, password } : { name, email, password }
      const { data } = await api.post(endpoint, payload)
      login(data.token)
      if (!remember) sessionStorage.setItem('wellnest_non_persistent_login', '1')
      push(mode === 'login' ? 'Logged in successfully' : 'Account created successfully', 'success')
      navigate('/dashboard')
    } catch {
      setError(mode === 'login' ? 'Invalid credentials' : 'Registration failed')
      push('Please check your details and try again', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full rounded-2xl border border-white/40 bg-white/80 p-6 shadow-2xl backdrop-blur-xl md:p-8">
      <p className="mb-2 text-xs font-medium text-primary">Authentication</p>
      <h2 className="mb-5 font-display text-2xl font-semibold text-slate-800">{title}</h2>
      <ToggleSwitch
        value={mode}
        onChange={(next) => {
          setMode(next)
          setErrors({})
          setError('')
        }}
      />
      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        {mode === 'login' ? (
          <LoginForm
            email={email}
            password={password}
            showPassword={showPassword}
            errors={errors}
            loading={loading}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onTogglePassword={() => setShowPassword((s) => !s)}
          />
        ) : (
          <RegisterForm
            name={name}
            email={email}
            password={password}
            showPassword={showPassword}
            errors={errors}
            loading={loading}
            onNameChange={setName}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onTogglePassword={() => setShowPassword((s) => !s)}
          />
        )}
        <label className="inline-flex items-center gap-2 text-xs text-slate-600">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Remember me
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  )
}
