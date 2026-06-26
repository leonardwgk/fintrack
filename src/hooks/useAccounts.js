import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { summarizeAccounts } from '../lib/finance'

export function useAccounts() {
  const { user } = useAuthStore()
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAccounts = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: true })
      setAccounts(data || [])
    } catch (err) {
      console.error('Accounts fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    async function load() { await fetchAccounts() }
    load()
  }, [fetchAccounts])

  const create = async (values) => {
    const { error } = await supabase.from('accounts').insert({ ...values, user_id: user.id })
    if (error) throw error
    await fetchAccounts()
  }

  const update = async (id, values) => {
    const { error } = await supabase.from('accounts').update(values).eq('id', id)
    if (error) throw error
    await fetchAccounts()
  }

  // Soft delete — keeps referential integrity with transactions.
  const remove = async (id) => {
    const { error } = await supabase.from('accounts').update({ is_active: false }).eq('id', id)
    if (error) throw error
    await fetchAccounts()
  }

  const { assets, liabilities, totalAssets, totalLiabilities, netWorth } = summarizeAccounts(accounts)

  return {
    accounts, assets, liabilities,
    totalAssets, totalLiabilities, netWorth,
    loading, create, update, remove, refetch: fetchAccounts,
  }
}
