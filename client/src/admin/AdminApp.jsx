import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { api, setUnauthorizedHandler } from './api'
import LoginPage from './LoginPage'
import ProjectsPage from './ProjectsPage'
import ProjectEditor from './ProjectEditor'
import SettingsPage from './SettingsPage'
import EnquiriesPage from './EnquiriesPage'
import AccountPage from './AccountPage'
import './admin.css'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    const prevTitle = document.title
    document.title = 'RNK2 Website Admin'
    return () => {
      meta.remove()
      document.title = prevTitle
    }
  }, [])
}

export default function AdminApp() {
  useNoIndex()
  const [user, setUser] = useState(undefined) // undefined = checking
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    api('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => setUser(null))
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null))
  }, [])

  const logout = useCallback(async () => {
    try {
      await api('/auth/logout', { method: 'POST' })
    } finally {
      setUser(null)
      navigate('/admin/login')
    }
  }, [navigate])

  if (user === undefined) return <div className="adm-boot" aria-busy="true" />

  if (!user) {
    return (
      <AuthContext.Provider value={{ user, setUser, logout }}>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/admin/login" replace state={{ from: location.pathname }} />} />
        </Routes>
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      <div className="adm">
        <header className="adm-bar">
          <div className="adm-bar__inner">
            <span className="adm-brand">
              RNK2 <span>{'// Website admin'}</span>
            </span>
            <nav className="adm-nav" aria-label="Admin">
              <NavLink to="/admin" end>Projects</NavLink>
              <NavLink to="/admin/company">Company details</NavLink>
              <NavLink to="/admin/enquiries">Enquiries</NavLink>
              <NavLink to="/admin/account">Account</NavLink>
            </nav>
            <div className="adm-bar__right">
              <a href="/" target="_blank" rel="noopener noreferrer" className="adm-link">
                View website ↗
              </a>
              <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={logout}>
                Sign out
              </button>
            </div>
          </div>
        </header>

        <main className="adm-main">
          <Routes>
            <Route index element={<ProjectsPage />} />
            <Route path="projects/new" element={<ProjectEditor />} />
            <Route path="projects/:id" element={<ProjectEditor />} />
            <Route path="company" element={<SettingsPage />} />
            <Route path="enquiries" element={<EnquiriesPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="login" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </AuthContext.Provider>
  )
}
