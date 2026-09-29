import { useEffect, useRef, useState } from 'react'

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState(task.notes ?? '')
  const [status, setStatus] = useState('')
  const first = useRef(true)

  // Autosave notes 700ms after the user stops typing
  useEffect(() => {
    if (first.current) { first.current = false; return }
    setStatus('Saving…')
    const timer = setTimeout(() => { onUpdate(task.id, { notes }); setStatus('Saved') }, 700)
    return () => clearTimeout(timer)
  }, [notes]) // eslint-disable-line react-hooks/exhaustive-deps

  const overdue = task.due_date && !task.done && task.due_date < new Date().toISOString().slice(0, 10)

  function rename() {
    const name = prompt('Edit task', task.title)
    if (name && name.trim()) onUpdate(task.id, { title: name.trim() })
  }

  return (
    <li className={`task ${task.done ? 'done' : ''}`} data-p={task.priority}>
      <div className="row">
        <input type="checkbox" checked={task.done} onChange={e => onUpdate(task.id, { done: e.target.checked })} aria-label="Mark done" />
        <button className="title" onClick={rename} title="Click to edit">{task.title}</button>
        <button className="icon" onClick={() => setOpen(!open)} aria-expanded={open}>{notes ? 'Notes •' : 'Notes'}</button>
        <button className="icon" onClick={() => onDelete(task.id)}>Delete</button>
      </div>
      <div className="meta">
        <span>{task.priority} priority</span>
        {task.due_date && <span className={overdue ? 'overdue' : ''}>{overdue ? 'Overdue: ' : 'Due '}{task.due_date}</span>}
      </div>
      {open && (
        <div className="notes">
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add notes, links or details…" aria-label="Notes" />
          <span className="saved">{status}</span>
        </div>
      )}
    </li>
  )
}
