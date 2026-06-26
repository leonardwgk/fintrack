import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { mergeBudgetSpending } from '../lib/finance'

// Budgets for the current month, each joined with its category and
// the real spending for that category in the same month.
export function useBudgets(date = new Date()) {
  const { user } = useAuthStore()
  const month = date.getMonth() + 1 // 1-indexed for the DB
  const year = date.getFullYear()
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBudgets = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const firstDay = new Date(year, month - 1, 1).toISOString().split('T')[0]
      const lastDay = new Date(year, month, 0).toISOString().split('T')[0]

      const [budgetRes, txRes] = await Promise.all([
        supabase
          .from('budgets')
          .select('*, categories(name, color, icon, type)')
          .eq('user_id', user.id)
          .eq('month', month)
          .eq('year', year),
        supabase
          .from('transactions')
          .select('category_id, amount')
          .eq('user_id', user.id)
          .eq('type', 'expense')
          .gte('date', firstDay)
          .lte('date', lastDay),
      ])

      setBudgets(mergeBudgetSpending(budgetRes.data || [], txRes.data || []))
    } catch (err) {
      console.error('Budgets fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [user, month, year])

  useEffect(() => {
    async function load() { await fetchBudgets() }
    load()
  }, [fetchBudgets])

  const create = async (values) => {
    const { error } = await supabase
      .from('budgets')
      .insert({ ...values, user_id: user.id, month, year })
    if (error) throw error
    await fetchBudgets()
  }

  const update = async (id, values) => {
    const { error } = await supabase.from('budgets').update(values).eq('id', id)
    if (error) throw error
    await fetchBudgets()
  }

  const remove = async (id) => {
    const { error } = await supabase.from('budgets').delete().eq('id', id)
    if (error) throw error
    await fetchBudgets()
  }

  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0)
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0)

  return { budgets, totalBudget, totalSpent, month, year, loading, create, update, remove, refetch: fetchBudgets }
}
