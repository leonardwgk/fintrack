import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { withInvestmentMetrics, summarizePortfolio } from '../lib/finance'

export function useInvestments() {
  const { user } = useAuthStore()
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchInvestments = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setInvestments((data || []).map(withInvestmentMetrics))
    } catch (err) {
      console.error('Investments fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    async function load() { await fetchInvestments() }
    load()
  }, [fetchInvestments])

  const create = async (values) => {
    const { error } = await supabase.from('investments').insert({ ...values, user_id: user.id })
    if (error) throw error
    await fetchInvestments()
  }

  const update = async (id, values) => {
    const { error } = await supabase.from('investments').update(values).eq('id', id)
    if (error) throw error
    await fetchInvestments()
  }

  const remove = async (id) => {
    const { error } = await supabase.from('investments').delete().eq('id', id)
    if (error) throw error
    await fetchInvestments()
  }

  const { totalValue, totalCost, totalGain, totalGainPct } = summarizePortfolio(investments)

  return {
    investments, totalValue, totalCost, totalGain, totalGainPct,
    loading, create, update, remove, refetch: fetchInvestments,
  }
}
