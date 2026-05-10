import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ProtectedRoute from './components/auth/ProtectedRoute'

function AuthRedirect() {
  const { user, loading } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading])

  return null
}

export default function App() {
  useAuth()

  return (
    <BrowserRouter>
      <AuthRedirect />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/accounts"     element={<ProtectedRoute><div className="p-8 text-gray-400">Accounts — coming soon</div></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><div className="p-8 text-gray-400">Transactions — coming soon</div></ProtectedRoute>} />
        <Route path="/budgets"      element={<ProtectedRoute><div className="p-8 text-gray-400">Budgets — coming soon</div></ProtectedRoute>} />
        <Route path="/goals"        element={<ProtectedRoute><div className="p-8 text-gray-400">Goals — coming soon</div></ProtectedRoute>} />
        <Route path="/bills"        element={<ProtectedRoute><div className="p-8 text-gray-400">Bills — coming soon</div></ProtectedRoute>} />
        <Route path="/investments"  element={<ProtectedRoute><div className="p-8 text-gray-400">Investments — coming soon</div></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}