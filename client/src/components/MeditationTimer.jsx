import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'

function MeditationTimer() {
  const [presetMinutes, setPresetMinutes] = useState(5)
  const [seconds, setSeconds] = useState(5 * 60)
  const [running, setRunning] = useState(false)
  const audioCtxRef = useRef(null)

  useEffect(() => {
    if (!running || seconds <= 0) return
    const id = setInterval(() => setSeconds((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [running, seconds])

  useEffect(() => {
    if (seconds === 0) {
      setRunning(false)
      playCompletionTone(audioCtxRef)
    }
  }, [seconds])

  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0')
  const remSeconds = String(seconds % 60).padStart(2, '0')
  const totalSeconds = presetMinutes * 60
  const progress = useMemo(() => ((totalSeconds - seconds) / totalSeconds) * 100, [seconds, totalSeconds])
  const radius = 58
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const setPreset = (min) => {
    setPresetMinutes(min)
    setSeconds(min * 60)
    setRunning(false)
  }

  return (
    <div className="card p-5">
      <h3 className="font-display text-lg font-semibold mb-3">Meditation Timer</h3>
      <div className="mb-4 grid place-items-center">
        <div className="relative h-36 w-36">
          <svg className="h-36 w-36 -rotate-90">
            <circle cx="72" cy="72" r={radius} stroke="#e2e8f0" strokeWidth="10" fill="none" />
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="url(#meditationGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500 ease-linear"
            />
            <defs>
              <linearGradient id="meditationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <p className="text-3xl font-display font-semibold">{minutes}:{remSeconds}</p>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-center gap-2">
        {[5, 10, 15].map((min) => (
          <button
            key={min}
            type="button"
            onClick={() => setPreset(min)}
            className={`rounded-xl px-3 py-1.5 text-sm transition ${
              presetMinutes === min
                ? 'bg-slate-900 text-white'
                : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {min} min
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        <button className="btn-primary px-3 py-2" onClick={() => setRunning((r) => !r)} disabled={seconds === 0}>
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 transition hover:bg-slate-50"
          onClick={() => {
            setRunning(false)
            setSeconds(presetMinutes * 60)
          }}
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </div>
  )
}
export default memo(MeditationTimer)

function playCompletionTone(audioCtxRef) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return
  const ctx = audioCtxRef.current ?? new AudioCtx()
  audioCtxRef.current = ctx
  if (ctx.state === 'suspended') ctx.resume()

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = 528
  gain.gain.value = 0.0001
  gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.72)
}
