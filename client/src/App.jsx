import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute.jsx'

const LandingPage = lazy(() => import('./pages/LandingPage.jsx'))
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'))
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'))
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'))
const NotesPage = lazy(() => import('./pages/NotesPage.jsx'))
const QuestionnairePage = lazy(() => import('./pages/QuestionnairePage.jsx'))
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'))

export default function App() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center text-slate-500">Loading...</div>}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/questionnaire" element={<QuestionnairePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
