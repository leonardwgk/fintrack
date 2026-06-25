import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AccountsPage from './pages/AccountsPage'
import TransactionsPage from './pages/TransactionsPage'
import AllowancePage from './pages/AllowancePage'
import BudgetsPage from './pages/BudgetsPage'
import GoalsPage from './pages/GoalsPage'
import BillsPage from './pages/BillsPage'
import InvestmentsPage from './pages/InvestmentsPage'
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
        <Route path="/accounts"     element={<ProtectedRoute><AccountsPage /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
        <Route path="/allowance"    element={<ProtectedRoute><AllowancePage /></ProtectedRoute>} />
        <Route path="/budgets"      element={<ProtectedRoute><BudgetsPage /></ProtectedRoute>} />
        <Route path="/goals"        element={<ProtectedRoute><GoalsPage /></ProtectedRoute>} />
        <Route path="/bills"        element={<ProtectedRoute><BillsPage /></ProtectedRoute>} />
        <Route path="/investments"  element={<ProtectedRoute><InvestmentsPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}