import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { reconcileAllowance } from '../lib/finance'

// Monthly allowance ("jatah bulanan") for needs, kept in a rekening.
// Tracks how much of the allowance has been spent and lets the user
// reconcile the expected remainder against the real bank balance.
export function useAllowance(date = new Date()) {
  const { user } = useAuthStore()
  const month = date.getMonth() + 1 // 1-indexed for the DB
  const year = date.getFullYear()
  const [allowance, setAllowance] = useState(null)
  const [spent, setSpent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [needsMigration, setNeedsMigration] = useState(false)

  const fetchAllowance = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data: row, error } = await supabase
        .from('allowances')
        .select('*')
        .eq('user_id', user.id)
        .eq('month', month)
        .eq('year', year)
        .maybeSingle()

      // Table missing → feature not migrated yet.
      if (error && (error.code === '42P01' || /does not exist/i.test(error.message || ''))) {
        setNeedsMigration(true)
        setAllowance(null)
        setSpent(0)
        return
      }
      setNeedsMigration(false)

      const firstDay = new Date(year, month - 1, 1).toISOString().split('T')[0]
      const lastDay = new Date(year, month, 0).toISOString().split('T')[0]

      let query = supabase
        .from('transactions')
        .select('amount, account_id')
        .eq('user_id', user.id)
        .eq('type', 'expense')
        .gte('date', firstDay)
        .lte('date', lastDay)
      // Only count spending from the linked rekening, if one is set.
      if (row?.account_id) query = query.eq('account_id', row.account_id)

      const { data: tx } = await query
      const total = (tx || []).reduce((s, t) => s + Number(t.amount), 0)

      setAllowance(row)
      setSpent(total)
    } catch (err) {
      console.error('Allowance fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [user, month, year])

  useEffect(() => {
    async function load() { await fetchAllowance() }
    load()
  }, [fetchAllowance])

  // Upsert the allowance for this month (amount + linked account).
  const save = async (values) => {
    const payload = {
      user_id: user.id,
      month,
      year,
      amount: Number(values.amount) || 0,
      account_id: values.account_id || null,
      // Preserve a previous reconciliation if present.
      real_balance: allowance?.real_balance ?? null,
      reconciled_at: allowance?.reconciled_at ?? null,
    }
    const { error } = await supabase.from('allowances').upsert(payload, { onConflict: 'user_id,month,year' })
    if (error) throw error
    await fetchAllowance()
  }

  // Record the real bank balance for reconciliation.
  const reconcile = async (realBalance) => {
    const payload = {
      user_id: user.id,
      month,
      year,
      amount: allowance?.amount ?? 0,
      account_id: allowance?.account_id ?? null,
      real_balance: Number(realBalance),
      reconciled_at: new Date().toISOString(),
    }
    const { error } = await supabase.from('allowances').upsert(payload, { onConflict: 'user_id,month,year' })
    if (error) throw error
    await fetchAllowance()
  }

  const amount = Number(allowance?.amount || 0)
  const result = reconcileAllowance({ amount, spent, realBalance: allowance?.real_balance ?? null })

  return {
    allowance, amount, spent, month, year, loading, needsMigration,
    ...result, // expected, remaining, spentPct, difference, matched
    save, reconcile, refetch: fetchAllowance,
  }
}
