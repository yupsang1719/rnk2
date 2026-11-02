import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from './api'
import { useAuth } from './AdminApp'

export default function LoginPage() {
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const { user } = await api('/auth/login', { method: 'POST', body: { email, password } })
      setUser(user)
      const from = location.state?.from
      navigate(from && from !== '/admin/login' ? from : '/admin', { replace: true })
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="adm-login">
      <form className="adm-card adm-login__card" onSubmit={submit}>
        <p className="adm-brand adm-brand--dark">
          RNK2 <span>{'// Website admin'}</span>
        </p>
        <h1 className="adm-h1">Sign in</h1>

        <label className="adm-field">
          <span className="adm-label">Email</span>
          <input
            className="adm-input"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </label>

        <label className="adm-field">
          <span className="adm-label">Password</span>
          <input
            className="adm-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && (
          <p className="adm-alert adm-alert--error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="adm-btn adm-btn--primary adm-btn--block" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
