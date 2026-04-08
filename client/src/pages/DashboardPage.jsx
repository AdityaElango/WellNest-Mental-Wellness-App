import { Suspense, lazy, useEffect, useState } from 'react'
import { Activity, BookOpenCheck, Flame, Sparkles, Target } from 'lucide-react'
import { getCached } from '../services/api'
import BreathingAnimation from '../components/BreathingAnimation.jsx'
import MeditationTimer from '../components/MeditationTimer.jsx'
import AppShell from '../components/AppShell.jsx'
import SkeletonCard from '../components/SkeletonCard.jsx'
const WellnessTrendChart = lazy(() => import('../components/WellnessTrendChart.jsx'))

export default function DashboardPage() {
  const [stats, setStats] = useState({ notesCount: 0, wellnessScore: 0 })
  const [trend, setTrend] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getCached('/api/dashboard/stats', {}, 20000), getCached('/api/dashboard/history', {}, 20000)])
      .then(([statsRes, historyRes]) => {
        const score = statsRes.data.wellnessScore === -1 ? 0 : statsRes.data.wellnessScore
        setStats({
          notesCount: statsRes.data.notesCount,
          wellnessScore: score,
        })
        setTrend(historyRes.data.trend || [])
        setRecentActivity((historyRes.data.recentActivity || []).map((item) => item.message))
        setStreak(historyRes.data.streak || 0)
      })
      .catch(() => {
        setTrend([])
        setRecentActivity([])
      })
      .finally(() => setLoading(false))
  }, [])

  const weeklyTarget = 80
  const progress = Math.min(100, Math.round(((stats.wellnessScore || 0) / weeklyTarget) * 100))
  const motivation = stats.wellnessScore >= 75
    ? 'You are building strong momentum. Keep your calming rituals consistent.'
    : 'Small consistent steps matter. A short breathing session can shift your day.'

  return (
    <AppShell title="Dashboard">
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
        {!loading && (
          <>
        <div className="card bg-gradient-to-br from-blue-500 to-blue-400 p-5 text-white">
          <p className="mb-2 inline-flex items-center gap-2 text-sm text-blue-50"><BookOpenCheck className="h-4 w-4" /> Notes</p>
          <p className="text-3xl font-display font-semibold">{stats.notesCount}</p>
        </div>
        <div className="card bg-gradient-to-br from-emerald-500 to-teal-400 p-5 text-white">
          <p className="mb-2 inline-flex items-center gap-2 text-sm text-emerald-50"><Sparkles className="h-4 w-4" /> Wellness Score</p>
          <p className="text-3xl font-display font-semibold">{stats.wellnessScore}</p>
        </div>
        <div className="card bg-gradient-to-br from-violet-500 to-indigo-400 p-5 text-white">
          <p className="mb-2 inline-flex items-center gap-2 text-sm text-violet-50"><Flame className="h-4 w-4" /> Streak</p>
          <p className="text-3xl font-display font-semibold">{streak} days</p>
        </div>
          </>
        )}
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h3 className="mb-4 font-display text-lg font-semibold text-slate-800">Wellness Trend</h3>
          <Suspense fallback={<SkeletonCard className="h-64" />}>
            <WellnessTrendChart trend={trend} />
          </Suspense>
          {trend.length === 0 && <p className="mt-3 text-sm text-slate-500">No questionnaire history yet.</p>}
        </div>

        <div className="card p-5">
          <h3 className="mb-4 inline-flex items-center gap-2 font-display text-lg font-semibold text-slate-800">
            <Target className="h-4 w-4 text-primary" />
            Progress
          </h3>
          <div className="mb-3 h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm text-slate-600">{progress}% of weekly wellness target</p>
          <p className="mt-4 text-xs text-slate-500">Target score: {weeklyTarget}</p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-3 font-display text-lg font-semibold text-slate-800">Recent Activity</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            {recentActivity.map((item) => (
              <li key={item} className="inline-flex w-full items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                <Activity className="h-4 w-4 text-primary" />
                {item}
              </li>
            ))}
            {recentActivity.length === 0 && (
              <li className="rounded-xl bg-slate-50 px-3 py-2 text-slate-500">No activity yet.</li>
            )}
          </ul>
        </div>
        <div className="card bg-gradient-to-br from-sky-500/90 to-emerald-500/90 p-5 text-white">
          <h3 className="mb-3 font-display text-lg font-semibold">Motivation</h3>
          <p className="text-sm leading-6 text-emerald-50">{motivation}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <BreathingAnimation />
        <MeditationTimer />
      </div>
    </AppShell>
  )
}
