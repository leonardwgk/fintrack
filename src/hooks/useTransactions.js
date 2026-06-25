import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { signedDelta } from '../lib/finance'

// Adjust an account's balance by `delta` (read-modify-write).
async function adjustBalance(accountId, delta) {
  if (!accountId || !delta) return
  const { data } = await supabase.from('accounts').select('balance').eq('id', accountId).maybeSingle()
  if (!data) return
  const next = Number(data.balance) + delta
  await supabase.from('accounts').update({ balance: next }).eq('id', accountId)
}

export function useTransactions(initialDate = new Date()) {
  const { user } = useAuthStore()
  const [month, setMonth] = useState(initialDate.getMonth()) // 0-indexed
  const [year, setYear] = useState(initialDate.getFullYear())
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTransactions = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const firstDay = new Date(year, month, 1).toISOString().split('T')[0]
      const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0]
      const { data } = await supabase
        .from('transactions')
        .select('id, type, amount, date, notes, account_id, category_id, categories(name, color, icon), accounts(name, icon)')
        .eq('user_id', user.id)
        .gte('date', firstDay)
        .lte('date', lastDay)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
      setTransactions(data || [])
    } catch (err) {
      console.error('Transactions fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [user, month, year])

  useEffect(() => {
    async function load() { await fetchTransactions() }
    load()
  }, [fetchTransactions])

  const create = async (values) => {
    const { error } = await supabase.from('transactions').insert({ ...values, user_id: user.id })
    if (error) throw error
    await adjustBalance(values.account_id, signedDelta(values.type, values.amount))
    await fetchTransactions()
  }

  const update = async (id, values) => {
    const prev = transactions.find((t) => t.id === id)
    const { error } = await supabase.from('transactions').update(values).eq('id', id)
    if (error) throw error
    if (prev) {
      // Reverse the old effect, then apply the new one.
      await adjustBalance(prev.account_id, -signedDelta(prev.type, prev.amount))
      await adjustBalance(values.account_id, signedDelta(values.type, values.amount))
    }
    await fetchTransactions()
  }

  const remove = async (id) => {
    const prev = transactions.find((t) => t.id === id)
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) throw error
    if (prev) await adjustBalance(prev.account_id, -signedDelta(prev.type, prev.amount))
    await fetchTransactions()
  }

  const shiftMonth = (offset) => {
    const d = new Date(year, month + offset, 1)
    setMonth(d.getMonth())
    setYear(d.getFullYear())
  }
  const goToToday = () => { const d = new Date(); setMonth(d.getMonth()); setYear(d.getFullYear()) }
  const prevMonth = () => shiftMonth(-1)
  const nextMonth = () => shiftMonth(1)

  const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)

  return {
    transactions, loading, month, year, income, expense,
    create, update, remove, refetch: fetchTransactions,
    prevMonth, nextMonth, goToToday,
  }
}
