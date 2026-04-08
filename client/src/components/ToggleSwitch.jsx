export default function ToggleSwitch({ value, onChange }) {
  return (
    <div className="inline-flex w-full rounded-xl border border-slate-200 bg-slate-100 p-1">
      <button
        type="button"
        onClick={() => onChange('login')}
        className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
          value === 'login' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'
        }`}
      >
        Login
      </button>
      <button
        type="button"
        onClick={() => onChange('register')}
        className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
          value === 'register' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'
        }`}
      >
        Register
      </button>
    </div>
  )
}
