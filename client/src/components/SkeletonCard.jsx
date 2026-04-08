export default function SkeletonCard({ className = '' }) {
  return (
    <div className={`card animate-pulse p-5 ${className}`}>
      <div className="mb-3 h-4 w-24 rounded bg-slate-200" />
      <div className="mb-2 h-6 w-2/3 rounded bg-slate-200" />
      <div className="h-4 w-full rounded bg-slate-100" />
    </div>
  )
}
