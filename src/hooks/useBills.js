import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { sumMonthly } from '../lib/finance'

export function useBills() {
  const { user } = useAuthStore()
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBills = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data } = await supabase
        .from('bills')
        .select('*, accounts(name, icon)')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('due_day', { ascending: true })
      setBills(data || [])
    } catch (err) {
      console.error('Bills fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    async function load() { await fetchBills() }
    load()
  }, [fetchBills])

  const create = async (values) => {
    const { error } = await supabase.from('bills').insert({ ...values, user_id: user.id })
    if (error) throw error
    await fetchBills()
  }

  const update = async (id, values) => {
    const { error } = await supabase.from('bills').update(values).eq('id', id)
    if (error) throw error
    await fetchBills()
  }

  const remove = async (id) => {
    const { error } = await supabase.from('bills').update({ is_active: false }).eq('id', id)
    if (error) throw error
    await fetchBills()
  }

  const monthlyTotal = sumMonthly(bills)
  const yearlyTotal = monthlyTotal * 12

  return { bills, monthlyTotal, yearlyTotal, loading, create, update, remove, refetch: fetchBills }
}
