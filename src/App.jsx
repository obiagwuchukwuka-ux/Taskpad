import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Auth from './Auth'
import Tasks from './Tasks'

export default function App() {
  const [session, setSession] = useState(undefined) // undefined = still loading

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  if (session === undefined) return <p className="center">Loading…</p>
  return session ? <Tasks user={session.user} /> : <Auth />
}
