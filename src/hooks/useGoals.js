import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { applyContribution } from '../lib/finance'

export function useGoals() {
  const { user } = useAuthStore()
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchGoals = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .neq('status', 'cancelled')
        .order('created_at', { ascending: false })
      setGoals(data || [])
    } catch (err) {
      console.error('Goals fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    async function load() { await fetchGoals() }
    load()
  }, [fetchGoals])

  const create = async (values) => {
    const { error } = await supabase.from('goals').insert({ ...values, user_id: user.id })
    if (error) throw error
    await fetchGoals()
  }

  const update = async (id, values) => {
    const { error } = await supabase.from('goals').update(values).eq('id', id)
    if (error) throw error
    await fetchGoals()
  }

  const remove = async (id) => {
    const { error } = await supabase.from('goals').delete().eq('id', id)
    if (error) throw error
    await fetchGoals()
  }

  // Add a contribution to a goal: bump current_amount, log it, auto-complete.
  const addFunds = async (goal, amount) => {
    const { value, current_amount, status } = applyContribution(goal, amount)
    if (!value || value <= 0) return

    const { error } = await supabase
      .from('goals')
      .update({ current_amount, status })
      .eq('id', goal.id)
    if (error) throw error

    await supabase.from('goal_contributions').insert({ goal_id: goal.id, amount: value })
    await fetchGoals()
  }

  return { goals, loading, create, update, remove, addFunds, refetch: fetchGoals }
}
