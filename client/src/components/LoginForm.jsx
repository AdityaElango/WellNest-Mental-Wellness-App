import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react'

export default function LoginForm({
  email,
  password,
  showPassword,
  errors,
  loading,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
}) {
  return (
    <>
      <div>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
          <input
            className="peer w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder=" "
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
          <label className="pointer-events-none absolute left-10 top-3 text-sm text-slate-500 transition-all peer-placeholder-shown:top-3 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs">
            Email
          </label>
        </div>
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
      </div>

      <div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
          <input
            type={showPassword ? 'text' : 'password'}
            className="peer w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder=" "
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />
          <label className="pointer-events-none absolute left-10 top-3 text-sm text-slate-500 transition-all peer-placeholder-shown:top-3 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs">
            Password
          </label>
          <button type="button" className="absolute right-3 top-3 text-slate-500 hover:text-slate-700" onClick={onTogglePassword}>
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-3 text-sm font-medium text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-70"
      >
        <LogIn className="h-4 w-4" />
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </>
  )
}
