import { Activity, Brain, LayoutDashboard, NotebookPen, Timer } from 'lucide-react'

const features = [
  { icon: NotebookPen, title: 'Smart Journaling', text: 'Capture your thoughts and track your personal journey.' },
  { icon: Brain, title: 'Mental Health Assessment', text: 'Evaluate your emotional well-being with guided questionnaires.' },
  { icon: Activity, title: 'Breathing Exercises', text: 'Reduce stress with guided breathing techniques.' },
  { icon: Timer, title: 'Meditation Timer', text: 'Improve focus and mindfulness with structured sessions.' },
  { icon: LayoutDashboard, title: 'Personalized Dashboard', text: 'Get insights into your progress and wellness trends.' },
]

export default function AboutSection() {
  return (
    <section className="animate-fade-in space-y-8">
      <div className="space-y-3">
        <p className="inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-primary">About WellNest</p>
        <h1 className="font-display text-4xl font-semibold leading-tight text-slate-800 md:text-5xl">
          Your personal space for mental clarity, mindfulness, and growth.
        </h1>
      </div>

      <div className="rounded-2xl border border-white/50 bg-white/70 p-6 shadow-soft">
        <h2 className="mb-2 font-display text-xl font-semibold text-slate-800">About</h2>
        <p className="text-slate-600">
          WellNest is a modern mental wellness platform designed to help individuals manage their thoughts, track emotional
          well-being, and build healthier habits.
        </p>
        <p className="mt-3 text-slate-600">
          It combines journaling, self-assessment, and mindfulness tools into a single seamless experience - empowering users
          to reflect, relax, and grow.
        </p>
      </div>

      <div className="rounded-2xl border border-white/50 bg-white/70 p-6 shadow-soft">
        <h2 className="mb-2 font-display text-xl font-semibold text-slate-800">What Problem It Solves</h2>
        <p className="text-slate-600">
          In today&apos;s fast-paced world, managing mental health often takes a backseat. WellNest provides a private space to
          express thoughts, tools to understand emotional patterns, and simple ways to reduce stress and improve focus.
        </p>
      </div>

      <div>
        <h2 className="mb-4 font-display text-2xl font-semibold text-slate-800">Core Features</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="rounded-2xl border border-white/60 bg-white/75 p-4 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Icon className="mb-3 h-5 w-5 text-primary" />
              <h3 className="font-medium text-slate-800">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/50 bg-white/70 p-6 shadow-soft">
        <h2 className="mb-2 font-display text-xl font-semibold text-slate-800">Our Vision</h2>
        <p className="text-slate-600">
          To create a safe, accessible, and intelligent platform that supports mental well-being through technology. We aim to
          make mental wellness simple, consistent, and part of everyday life.
        </p>
      </div>

      <div className="rounded-2xl border border-white/50 bg-white/70 p-6 shadow-soft">
        <h2 className="mb-3 font-display text-xl font-semibold text-slate-800">Built With</h2>
        <div className="flex flex-wrap gap-2">
          {['React (Frontend)', 'Spring Boot (Backend)', 'MongoDB Atlas (Database)', 'REST APIs & JWT Authentication'].map(
            (item) => (
              <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {item}
              </span>
            ),
          )}
        </div>
      </div>

      <p className="text-sm text-slate-600">
        WellNest is more than just an app - it&apos;s a step towards a healthier and more mindful life.
      </p>
    </section>
  )
}
