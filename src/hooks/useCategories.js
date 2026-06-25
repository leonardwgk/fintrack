import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { dedupeCategories } from '../lib/finance'

// Default categories seeded once per user on first load.
const DEFAULT_CATEGORIES = [
  // income
  { name: 'Gaji',         type: 'income',  color: 'var(--green-soft)',  icon: '💰' },
  { name: 'Bonus',        type: 'income',  color: 'var(--green-soft)',  icon: '🎁' },
  { name: 'Investasi',    type: 'income',  color: 'var(--purple-soft)', icon: '📈' },
  { name: 'Freelance',    type: 'income',  color: 'var(--blue-soft)',   icon: '💼' },
  { name: 'Lainnya',      type: 'income',  color: 'var(--surface-2)',   icon: '✨' },
  // expense
  { name: 'Makanan',      type: 'expense', color: 'var(--amber-soft)',  icon: '🍜' },
  { name: 'Transportasi', type: 'expense', color: 'var(--blue-soft)',   icon: '🚗' },
  { name: 'Belanja',      type: 'expense', color: 'var(--purple-soft)', icon: '🛍️' },
  { name: 'Tagihan',      type: 'expense', color: 'var(--red-soft)',    icon: '🧾' },
  { name: 'Hiburan',      type: 'expense', color: 'var(--green-soft)',  icon: '🎬' },
  { name: 'Kesehatan',    type: 'expense', color: 'var(--red-soft)',    icon: '🏥' },
  { name: 'Pendidikan',   type: 'expense', color: 'var(--blue-soft)',   icon: '📚' },
  { name: 'Lainnya',      type: 'expense', color: 'var(--surface-2)',   icon: '📦' },
]

// Module-level guard so concurrent mounts (e.g. React StrictMode double-invoke
// in dev, or two hook instances) never seed defaults more than once per user.
const seedingInFlight = new Map() // userId -> Promise

async function seedDefaultsOnce(userId) {
  if (seedingInFlight.has(userId)) return seedingInFlight.get(userId)
  const promise = (async () => {
    // Re-check inside the guard to avoid a TOCTOU race with another tab/request.
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('user_id', userId)
      .limit(1)
    if (existing && existing.length > 0) return
    const rows = DEFAULT_CATEGORIES.map((c) => ({ ...c, user_id: userId, is_default: true }))
    await supabase.from('categories').insert(rows)
  })()
  seedingInFlight.set(userId, promise)
  try {
    await promise
  } finally {
    seedingInFlight.delete(userId)
  }
}

export function useCategories() {
  const { user } = useAuthStore()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const load = () =>
        supabase
          .from('categories')
          .select('*')
          .eq('user_id', user.id)
          .order('type', { ascending: true })
          .order('name', { ascending: true })

      let { data } = await load()

      // Seed defaults the first time the user has no categories.
      if (!data || data.length === 0) {
        await seedDefaultsOnce(user.id)
        ;({ data } = await load())
      }

      // Dedupe defensively so any historical double-seed never shows twice.
      setCategories(dedupeCategories(data || []))
    } catch (err) {
      console.error('Categories fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    async function load() { await fetchCategories() }
    load()
  }, [fetchCategories])

  const create = async (values) => {
    const { error } = await supabase.from('categories').insert({ ...values, user_id: user.id })
    if (error) throw error
    await fetchCategories()
  }

  const update = async (id, values) => {
    const { error } = await supabase.from('categories').update(values).eq('id', id)
    if (error) throw error
    await fetchCategories()
  }

  const remove = async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
    await fetchCategories()
  }

  const income = categories.filter((c) => c.type === 'income')
  const expense = categories.filter((c) => c.type === 'expense')

  return { categories, income, expense, loading, create, update, remove, refetch: fetchCategories }
}
