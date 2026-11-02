import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSiteData } from '../SiteData'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const { status } = useSiteData()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ block: 'start' })
        return
      }
      // Sections like #work only render once site content has loaded —
      // wait for it rather than jumping to the top.
      if (status === 'loading') return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash, status])

  return null
}
