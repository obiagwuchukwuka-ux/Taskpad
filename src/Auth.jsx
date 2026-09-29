import { useState } from 'react'
import { supabase } from './supabase'

export default function Auth() {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true); setMsg('')
    const fn = mode === 'signin' ? supabase.auth.signInWithPassword : supabase.auth.signUp
    const { data, error } = await fn.call(supabase.auth, { email, password })
    if (error) setMsg(error.message)
    else if (mode === 'signup' && !data.session) setMsg('Check your email to confirm your account, then sign in.')
    setBusy(false)
  }

  return (
    <main className="auth">
      <h1>Taskpad</h1>
      <p className="sub">{mode === 'signin' ? 'Sign in to see your tasks' : 'Create an account to start'}</p>
      <form onSubmit={submit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password (min 6 characters)" minLength={6}
               value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="btn primary" disabled={busy}>{mode === 'signin' ? 'Sign in' : 'Sign up'}</button>
      </form>
      {msg && <p className="error" role="alert">{msg}</p>}
      <button className="link" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
        {mode === 'signin' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
      </button>
    </main>
  )
}
