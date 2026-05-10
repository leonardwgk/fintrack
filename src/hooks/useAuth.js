import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const { user, profile, loading, setUser, setLoading, fetchProfile } = useAuthStore()

  useEffect(() => {
    // get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) fetchProfile(currentUser.id)
      setLoading(false)
    })

    // listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        if (currentUser) fetchProfile(currentUser.id)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user, profile, loading }
}
