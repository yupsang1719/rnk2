import { createContext, useContext, useEffect, useState } from 'react'
import { CONTENT_DEFAULTS } from '@shared/content/defaults.js'

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
  privacyEmail: ''
}

const PREVIEW_KEY = 'rnk2-preview'

// Section-by-section merge so a missing field always has its original copy.
function mergeContent(content) {
  const out = {}
  for (const key of Object.keys(CONTENT_DEFAULTS)) {
    out[key] = { ...CONTENT_DEFAULTS[key], ...(content?.[key] || {}) }
  }
  return out
}

// In production the server embeds the published copy in the page itself.
function embeddedContent() {
  try {
    const el = document.getElementById('site-content')
    return el ? JSON.parse(el.textContent) : null
  } catch {
    return null
  }
}

// ?preview=draft (opened from the CMS) switches this tab to the draft copy
// until "Exit preview" is clicked. Only signed-in admins actually get it.
function previewRequested() {
  try {
    const params = new URLSearchParams(window.location.search)
    if (params.get('preview') === 'draft') sessionStorage.setItem(PREVIEW_KEY, '1')
    return sessionStorage.getItem(PREVIEW_KEY) === '1'
  } catch {
    return new URLSearchParams(window.location.search).get('preview') === 'draft'
  }
}

export function exitPreview() {
  try {
    sessionStorage.removeItem(PREVIEW_KEY)
  } catch {
    // storage blocked — the reload below without ?preview is enough
  }
  const url = new URL(window.location.href)
  url.searchParams.delete('preview')
  window.location.replace(url.toString())
}

const initialContent = mergeContent(embeddedContent())

const SiteDataContext = createContext({
  status: 'loading',
  preview: false,
  settings: EMPTY_SETTINGS,
  content: initialContent,
  projects: []
})

export function SiteDataProvider({ children }) {
  const [state, setState] = useState({
    status: 'loading',
    preview: false,
    settings: EMPTY_SETTINGS,
    content: initialContent,
    projects: []
  })

  useEffect(() => {
    let cancelled = false
    const wantPreview = previewRequested()
    fetch(wantPreview ? '/api/site?preview=1' : '/api/site', { credentials: 'same-origin' })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data) => {
        if (cancelled) return
        setState({
          status: 'ready',
          preview: wantPreview,
          previewDenied: wantPreview && !data.preview,
          settings: { ...EMPTY_SETTINGS, ...data.settings },
          content: data.content ? mergeContent(data.content) : initialContent,
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

/**
 * Site data plus one section of the CMS copy:
 *   const { c, settings } = useContent('hero')
 */
export function useContent(section) {
  const data = useContext(SiteDataContext)
  return { ...data, c: data.content[section] }
}

export { yearsSince } from './content/text'
