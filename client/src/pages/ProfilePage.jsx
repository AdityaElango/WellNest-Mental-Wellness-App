import { useEffect, useMemo, useState } from 'react'
import { Mail, Save, Sparkles } from 'lucide-react'
import AppShell from '../components/AppShell.jsx'
import api, { getCached, invalidateCache } from '../services/api'
import SkeletonCard from '../components/SkeletonCard.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function ProfilePage() {
  const { push } = useToast()
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [stats, setStats] = useState({ notesCount: 0, wellnessScore: 0 })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    invalidateCache('/api/users/me')
    Promise.all([api.get('/api/users/me'), getCached('/api/dashboard/stats', {}, 20000)])
      .then(([meRes, statsRes]) => {
        setProfile({ name: meRes.data.name || '', email: meRes.data.email || '' })
        setStats({
          notesCount: statsRes.data.notesCount || 0,
          wellnessScore: statsRes.data.wellnessScore === -1 ? 0 : statsRes.data.wellnessScore,
        })
      })
      .catch(() => {
        push('Could not load profile data', 'error')
      })
      .finally(() => setLoading(false))
  }, [])

  const initials = useMemo(() => {
    if (!profile.name) return 'WN'
    return profile.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('')
  }, [profile.name])

  const saveProfile = async () => {
    setSaving(true)
    setMessage('')
    try {
      const { data } = await api.put('/api/users/me', { name: profile.name })
      invalidateCache('/api/users/me')
      setProfile((prev) => ({ ...prev, name: data.name || prev.name }))
      setMessage('Profile updated successfully.')
      push('Profile updated', 'success')
    } catch {
      setMessage('Update failed. Try again.')
      push('Profile update failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppShell title="Profile">
      {loading && (
        <div className="grid gap-4 lg:grid-cols-3">
          <SkeletonCard className="lg:col-span-2" />
          <SkeletonCard />
        </div>
      )}
      {!loading && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card p-6 lg:col-span-2">
          <div className="mb-5 flex items-center gap-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 text-lg font-semibold text-white">
              {initials}
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-slate-800">{profile.name || 'Your Account'}</h2>
              <p className="inline-flex items-center gap-2 text-sm text-slate-500">
                <Mail className="h-4 w-4" />
                {profile.email || 'Email unavailable'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm text-slate-600">Full name</span>
              <input
                className="input"
                value={profile.name}
                onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Your name"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-slate-600">Email</span>
              <input className="input bg-slate-50" value={profile.email} disabled />
            </label>
            <button
              type="button"
              onClick={saveProfile}
              disabled={saving || !profile.name.trim()}
              className="btn-primary disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save changes'}
            </button>
            {message && <p className="text-sm text-slate-600">{message}</p>}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 inline-flex items-center gap-2 font-display text-lg font-semibold text-slate-800">
            <Sparkles className="h-4 w-4 text-primary" />
            Your Stats
          </h3>
          <div className="space-y-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Notes Count</p>
              <p className="text-2xl font-display font-semibold text-slate-800">{stats.notesCount}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Wellness Score</p>
              <p className="text-2xl font-display font-semibold text-slate-800">{stats.wellnessScore}/100</p>
            </div>
            <div className="rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 p-3 text-white">
              <p className="text-xs text-blue-100">Current Status</p>
              <p className="text-sm">{stats.wellnessScore >= 70 ? 'Balanced and focused' : 'Keep building your routine'}</p>
            </div>
          </div>
        </div>
        </div>
      )}
    </AppShell>
  )
}
