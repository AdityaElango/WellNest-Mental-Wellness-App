import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Brain, HeartPulse, Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'
import api from '../services/api'
import AppShell from '../components/AppShell.jsx'
import { useToast } from '../context/ToastContext.jsx'

const initial = { stress: 3, sleep: 3, mood: 3, energy: 3 }
const questions = [
  { key: 'stress', label: 'How stressed do you feel today?', hint: '1 = very calm, 5 = very stressed' },
  { key: 'sleep', label: 'How well did you sleep last night?', hint: '1 = very poor, 5 = excellent' },
  { key: 'mood', label: 'How is your mood right now?', hint: '1 = low, 5 = very positive' },
  { key: 'energy', label: 'How is your energy level?', hint: '1 = drained, 5 = energized' },
]

export default function QuestionnairePage() {
  const { push } = useToast()
  const [form, setForm] = useState(initial)
  const [step, setStep] = useState(0)
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const activeQuestion = questions[step]

  const liveScore = useMemo(() => {
    const stressComponent = 6 - form.stress
    const total = stressComponent + form.sleep + form.mood + form.energy
    return Math.round((total / 20) * 100)
  }, [form])

  const progress = Math.round(((step + 1) / questions.length) * 100)

  const insight = (score) => {
    if (score >= 80) return 'Great balance today. Keep your routine consistent and celebrate small wins.'
    if (score >= 60) return 'You are doing well. A short breathing break can help maintain momentum.'
    return 'Your mind may need extra care today. Prioritize rest, hydration, and one calm activity.'
  }

  const submit = async () => {
    setSubmitting(true)
    try {
      const { data } = await api.post('/api/questionnaire', form)
      setResult({ score: data.score, text: insight(data.score) })
      push('Assessment completed', 'success')
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#3b82f6', '#22c55e', '#14b8a6'],
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleSliderKeyDown = (e) => {
    const key = e.key
    if (key !== 'ArrowRight' && key !== 'ArrowUp' && key !== 'ArrowLeft' && key !== 'ArrowDown') return
    e.preventDefault()
    const delta = key === 'ArrowRight' || key === 'ArrowUp' ? 1 : -1
    setForm((prev) => ({
      ...prev,
      [activeQuestion.key]: Math.max(1, Math.min(5, prev[activeQuestion.key] + delta)),
    }))
  }

  return (
    <AppShell title="Questionnaire">
      <div className="card max-w-3xl p-6">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
            <span>Progress</span>
            <span>{result ? 100 : progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500" style={{ width: `${result ? 100 : progress}%` }} />
          </div>
        </div>

        {!result ? (
          <div key={activeQuestion.key} className="animate-fade-in">
            <p className="mb-2 inline-flex items-center gap-2 text-sm text-slate-500">
              <HeartPulse className="h-4 w-4" />
              Question {step + 1} of {questions.length}
            </p>
            <h2 className="mb-1 font-display text-2xl font-semibold text-slate-800">{activeQuestion.label}</h2>
            <p className="mb-6 text-sm text-slate-500">{activeQuestion.hint}</p>

            <div className="mb-6 rounded-xl bg-slate-50 p-4">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={form[activeQuestion.key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [activeQuestion.key]: Number(e.target.value) }))}
                onKeyDown={handleSliderKeyDown}
                className="w-full accent-emerald-500"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>1</span>
                <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700 shadow">{form[activeQuestion.key]}</span>
                <span>5</span>
              </div>
            </div>

            <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-50 to-emerald-50 p-4">
              <p className="inline-flex items-center gap-2 text-sm text-slate-600">
                <Brain className="h-4 w-4 text-primary" />
                Live wellness score
              </p>
              <p className="mt-1 font-display text-3xl font-semibold text-slate-800">{liveScore}/100</p>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              {step < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.min(questions.length - 1, s + 1))}
                  className="btn-primary"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button type="button" onClick={submit} disabled={submitting} className="btn-primary disabled:opacity-60">
                  {submitting ? 'Saving...' : 'See Results'}
                  <Sparkles className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700">
              <Sparkles className="h-4 w-4" />
              Assessment Complete
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-slate-800">Your Wellness Score</h2>
            <p className="mt-2 font-display text-5xl font-bold text-slate-900">{result.score}/100</p>
            <p className="mx-auto mt-4 max-w-xl rounded-xl bg-slate-50 p-4 text-slate-600">{result.text}</p>
            <button
              type="button"
              onClick={() => {
                setResult(null)
                setStep(0)
                setForm(initial)
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              Retake Questionnaire
            </button>
          </div>
        )}
      </div>
    </AppShell>
  )
}
