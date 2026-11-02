import { useEffect, useState } from 'react'
import { api } from './api'
import { useAuth } from './AdminApp'

const MIN = 10

function ChangePassword() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    try {
      await api('/auth/password', { method: 'POST', body: { currentPassword: current, newPassword: next } })
      setCurrent('')
      setNext('')
      setMsg({ ok: true, text: 'Password changed. Other devices have been signed out.' })
    } catch (err) {
      setMsg({ ok: false, text: err.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="adm-card adm-section" onSubmit={submit}>
      <h2 className="adm-h2">Change your password</h2>
      <div className="adm-grid">
        <label className="adm-field">
          <span className="adm-label">Current password</span>
          <input className="adm-input" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
        </label>
        <label className="adm-field">
          <span className="adm-label">New password</span>
          <input className="adm-input" type="password" autoComplete="new-password" minLength={MIN} value={next} onChange={(e) => setNext(e.target.value)} required />
          <span className="adm-hint">At least {MIN} characters.</span>
        </label>
      </div>
      {msg && <p className={`adm-alert ${msg.ok ? 'adm-alert--ok' : 'adm-alert--error'}`}>{msg.text}</p>}
      <button type="submit" className="adm-btn adm-btn--primary" disabled={busy}>
        {busy ? 'Saving…' : 'Change password'}
      </button>
    </form>
  )
}

function Users() {
  const { user: me } = useAuth()
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [msg, setMsg] = useState(null)
  const [confirmId, setConfirmId] = useState(null)

  useEffect(() => {
    api('/admin/users').then((d) => setUsers(d.users)).catch((e) => setMsg({ ok: false, text: e.message }))
  }, [])

  async function add(e) {
    e.preventDefault()
    setMsg(null)
    try {
      const { user } = await api('/admin/users', { method: 'POST', body: form })
      setUsers((u) => [...u, user])
      setForm({ name: '', email: '', password: '' })
      setMsg({ ok: true, text: `${user.email} can now sign in. Send them the password separately.` })
    } catch (err) {
      setMsg({ ok: false, text: err.message })
    }
  }

  async function remove(id) {
    try {
      await api(`/admin/users/${id}`, { method: 'DELETE' })
      setUsers((u) => u.filter((x) => x.id !== id))
    } catch (err) {
      setMsg({ ok: false, text: err.message })
    } finally {
      setConfirmId(null)
    }
  }

  return (
    <section className="adm-card adm-section">
      <h2 className="adm-h2">Who can sign in</h2>
      <ul className="adm-users">
        {users.map((u) => (
          <li key={u.id}>
            <span>
              <strong>{u.name || u.email}</strong> {u.name && <span className="adm-muted">{u.email}</span>}
              {u.id === me.id && <span className="adm-chip">You</span>}
            </span>
            {u.id !== me.id &&
              (confirmId === u.id ? (
                <span>
                  <button type="button" className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => remove(u.id)}>
                    Yes, remove
                  </button>{' '}
                  <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setConfirmId(null)}>
                    Cancel
                  </button>
                </span>
              ) : (
                <button type="button" className="adm-btn adm-btn--text adm-btn--sm" onClick={() => setConfirmId(u.id)}>
                  Remove
                </button>
              ))}
          </li>
        ))}
      </ul>

      <form onSubmit={add}>
        <h3 className="adm-h3">Add a person</h3>
        <div className="adm-grid">
          <label className="adm-field">
            <span className="adm-label">Name</span>
            <input className="adm-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="adm-field">
            <span className="adm-label">Email</span>
            <input className="adm-input" type="email" autoComplete="off" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </label>
          <label className="adm-field">
            <span className="adm-label">Temporary password</span>
            <input className="adm-input" type="password" autoComplete="new-password" minLength={MIN} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <span className="adm-hint">At least {MIN} characters. Ask them to change it after signing in.</span>
          </label>
        </div>
        {msg && <p className={`adm-alert ${msg.ok ? 'adm-alert--ok' : 'adm-alert--error'}`}>{msg.text}</p>}
        <button type="submit" className="adm-btn adm-btn--primary">Add person</button>
      </form>
    </section>
  )
}

export default function AccountPage() {
  return (
    <div className="adm-page">
      <div className="adm-page__head">
        <h1 className="adm-h1">Account</h1>
      </div>
      <ChangePassword />
      <Users />
    </div>
  )
}
