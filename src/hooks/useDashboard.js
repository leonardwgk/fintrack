import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

export function useDashboard() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    netWorth: 0,
    totalAssets: 0,
    totalLiabilities: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    netBalance: 0,
    recentTransactions: [],
  })

  const fetchDashboard = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const now = new Date()
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
      const lastDay  = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

      const [netWorthRes, monthlyRes, recentRes] = await Promise.all([
        supabase.from('v_net_worth').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('transactions').select('type, amount').eq('user_id', user.id).gte('date', firstDay).lte('date', lastDay),
        supabase.from('transactions').select('id, type, amount, date, notes, categories(name, color, icon)').eq('user_id', user.id).order('date', { ascending: false }).order('created_at', { ascending: false }).limit(5),
      ])

      const nw  = netWorthRes.data
      const txs = monthlyRes.data || []
      const monthlyIncome  = txs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
      const monthlyExpense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)

      setData({
        netWorth:           Number(nw?.net_worth          || 0),
        totalAssets:        Number(nw?.total_assets       || 0),
        totalLiabilities:   Number(nw?.total_liabilities  || 0),
        monthlyIncome,
        monthlyExpense,
        netBalance:         monthlyIncome - monthlyExpense,
        recentTransactions: recentRes.data || [],
      })
    } catch (err) {
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return { ...data, loading, refetch: fetchDashboard }
}