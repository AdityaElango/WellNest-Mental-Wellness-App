import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'

const PRESET_STORAGE_KEY = 'wellnest_breathing_preset'

const PRESETS = {
  '4-4-6': [
    { label: 'Inhale', seconds: 4, scale: 'scale-110', color: 'from-sky-400 to-blue-500' },
    { label: 'Hold', seconds: 4, scale: 'scale-105', color: 'from-cyan-400 to-emerald-400' },
    { label: 'Exhale', seconds: 6, scale: 'scale-90', color: 'from-emerald-400 to-teal-500' },
  ],
  '4-7-8': [
    { label: 'Inhale', seconds: 4, scale: 'scale-110', color: 'from-sky-400 to-blue-500' },
    { label: 'Hold', seconds: 7, scale: 'scale-105', color: 'from-cyan-400 to-emerald-400' },
    { label: 'Exhale', seconds: 8, scale: 'scale-90', color: 'from-emerald-400 to-teal-500' },
  ],
  Box: [
    { label: 'Inhale', seconds: 4, scale: 'scale-110', color: 'from-sky-400 to-blue-500' },
    { label: 'Hold', seconds: 4, scale: 'scale-105', color: 'from-cyan-400 to-emerald-400' },
    { label: 'Exhale', seconds: 4, scale: 'scale-90', color: 'from-emerald-400 to-teal-500' },
    { label: 'Hold', seconds: 4, scale: 'scale-95', color: 'from-cyan-400 to-emerald-400' },
  ],
}

function BreathingAnimation() {
  const [presetName, setPresetName] = useState(() => {
    const saved = localStorage.getItem(PRESET_STORAGE_KEY)
    return saved && PRESETS[saved] ? saved : '4-4-6'
  })
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [running, setRunning] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const phases = PRESETS[presetName]
  const [secondsLeft, setSecondsLeft] = useState(phases[0].seconds)
  const audioCtxRef = useRef(null)

  useEffect(() => {
    if (!running) return
    const countdown = setInterval(() => {
      setSecondsLeft((s) => (s > 1 ? s - 1 : 1))
    }, 1000)
    return () => clearInterval(countdown)
  }, [running, phaseIndex])

  useEffect(() => {
    if (!running) return
    const phase = phases[phaseIndex]
    const timer = setTimeout(() => {
      setPhaseIndex((prev) => (prev + 1) % phases.length)
    }, phase.seconds * 1000)
    return () => clearTimeout(timer)
  }, [phaseIndex, running, phases])

  useEffect(() => {
    setSecondsLeft(phases[phaseIndex].seconds)
  }, [phaseIndex, phases])

  useEffect(() => {
    setRunning(false)
    setPhaseIndex(0)
    setSecondsLeft(PRESETS[presetName][0].seconds)
    localStorage.setItem(PRESET_STORAGE_KEY, presetName)
  }, [presetName])

  useEffect(() => {
    if (!running || !soundEnabled) return
    playCue(audioCtxRef)
  }, [phaseIndex, running, soundEnabled])

  const phase = phases[phaseIndex]
  const sessionText = useMemo(() => `${phase.label} • ${secondsLeft}s`, [phase.label, secondsLeft])

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="font-display text-lg font-semibold">Breathing</h3>
        <select
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {Object.keys(PRESETS).map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>
      <div className="grid place-items-center py-4">
        <div className={`h-28 w-28 rounded-full bg-gradient-to-br transition-all duration-1000 ease-in-out ${phase.color} ${phase.scale} shadow-lg`} />
      </div>
      <p className="text-center text-slate-600 text-sm">{sessionText}</p>
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="btn-primary px-4 py-2"
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          type="button"
          onClick={() => setSoundEnabled((s) => !s)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          Cue
        </button>
      </div>
    </div>
  )
}
export default memo(BreathingAnimation)

function playCue(audioCtxRef) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return
  const ctx = audioCtxRef.current ?? new AudioCtx()
  audioCtxRef.current = ctx
  if (ctx.state === 'suspended') ctx.resume()

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = 440
  gain.gain.value = 0.001
  gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.22)
}
