import { createContext, useContext, useEffect, useState } from 'react'

const EMPTY_SETTINGS = {
  region: '',
  establishedYear: '',
  projectsCompleted: '',
  guaranteeYears: '',
  onTimePercent: '',
  fullyInsured: false,
  areasCovered: '',
  phone: '',
  email: '',
  address: '',
  registrationNo: '',
  icoRegistrationNo: '',
  privacyEmail: '',
  testimonialQuote: '',
  testimonialName: '',
  testimonialTown: '',
  heroImage: ''
}

const SiteDataContext = createContext({
  status: 'loading',
  settings: EMPTY_SETTINGS,
  projects: []
})

export function SiteDataProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', settings: EMPTY_SETTINGS, projects: [] })

  useEffect(() => {
    let cancelled = false
    fetch('/api/site')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data) => {
        if (cancelled) return
        setState({
          status: 'ready',
          settings: { ...EMPTY_SETTINGS, ...data.settings },
          projects: data.projects || []
        })
      })
      .catch(() => {
        if (!cancelled) setState((s) => ({ ...s, status: 'error' }))
      })
    return () => {
      cancelled = true
    }
  }, [])

  return <SiteDataContext.Provider value={state}>{children}</SiteDataContext.Provider>
}

export function useSiteData() {
  return useContext(SiteDataContext)
}

// Years since the company was established, or '' if unknown.
export function yearsSince(year) {
  const n = parseInt(year, 10)
  if (!n || n < 1900) return ''
  const years = new Date().getFullYear() - n
  return years > 0 ? String(years) : ''
}
