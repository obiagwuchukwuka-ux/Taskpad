import { useEffect, useMemo, useState } from 'react'
import { supabase } from './supabase'
import TaskItem from './TaskItem'

export default function Tasks({ user }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [due, setDue] = useState('')
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')

  // Load this user's tasks (RLS guarantees only their rows come back)
  useEffect(() => {
    supabase.from('tasks').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message); else setTasks(data)
        setLoading(false)
      })
  }, [])

  async function addTask(e) {
    e.preventDefault()
    if (!title.trim()) return
    const { data, error } = await supabase.from('tasks')
      .insert({ title: title.trim(), priority, due_date: due || null })
      .select().single()
    if (error) return setError(error.message)
    setTasks(t => [data, ...t]); setTitle(''); setDue('')
  }

  // Optimistic update: change the UI first, roll back if Supabase rejects it
  async function updateTask(id, patch) {
    const prev = tasks
    setTasks(t => t.map(x => (x.id === id ? { ...x, ...patch } : x)))
    const { error } = await supabase.from('tasks').update(patch).eq('id', id)
    if (error) { setTasks(prev); setError(error.message) }
  }

  async function deleteTask(id) {
    if (!confirm('Delete this task and its notes?')) return
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) setError(error.message); else setTasks(t => t.filter(x => x.id !== id))
  }

  const visible = useMemo(() => {
    const q = query.toLowerCase()
    return tasks.filter(t =>
      (filter === 'all' || (filter === 'done') === t.done) &&
      (!q || t.title.toLowerCase().includes(q) || (t.notes || '').toLowerCase().includes(q)))
  }, [tasks, filter, query])

  const done = tasks.filter(t => t.done).length

  return (
    <main>
      <header>
        <div>
          <h1>Taskpad</h1>
          <p className="sub">{tasks.length ? `${done} of ${tasks.length} tasks done` : 'Nothing planned yet'}</p>
        </div>
        <div className="who">
          <span>{user.email}</span>
          <button className="btn" onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
      </header>

      <div className="progress"><i style={{ width: tasks.length ? `${(done / tasks.length) * 100}%` : 0 }} /></div>

      <form className="add" onSubmit={addTask}>
        <input placeholder="What needs doing?" value={title} onChange={e => setTitle(e.target.value)} maxLength={200} required />
        <select value={priority} onChange={e => setPriority(e.target.value)} aria-label="Priority">
          <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
        </select>
        <input type="date" value={due} onChange={e => setDue(e.target.value)} aria-label="Due date" />
        <button className="btn primary">Add task</button>
      </form>

      <div className="tools">
        <input type="search" placeholder="Search tasks and notes" value={query} onChange={e => setQuery(e.target.value)} />
        <div className="chips">
          {['all', 'active', 'done'].map(f => (
            <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="error" role="alert">{error}</p>}

      <ul>
        {loading ? <li className="empty">Loading tasks…</li>
          : visible.length === 0 ? <li className="empty">{tasks.length ? 'No tasks match this view.' : 'No tasks yet. Add your first task above.'}</li>
          : visible.map(t => <TaskItem key={t.id} task={t} onUpdate={updateTask} onDelete={deleteTask} />)}
      </ul>
    </main>
  )
}
