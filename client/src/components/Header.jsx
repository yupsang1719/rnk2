import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IconArrow, IconSetSquare } from './icons'

const NAV_LINKS = [
  { href: '/#capabilities', label: 'Capabilities' },
  { href: '/#work', label: 'Work' },
  { href: '/#process', label: 'Process' }
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const closeMenu = () => setOpen(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container site-header__bar">
        <Link to="/" className="wordmark">
          <IconSetSquare className="wordmark__mark" aria-hidden="true" />
          RNK2 <span>{'// PROPERTIES LTD'}</span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          <ul className="site-nav__links">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link to={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
          <Link to="/#quote" className="btn btn--primary">
            Request a quote
            <IconArrow className="btn__arrow" />
          </Link>
        </nav>

        <button
          type="button"
          className="hamburger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      <nav
        id="mobile-menu"
        className={`mobile-menu ${open ? 'is-open' : ''}`}
        aria-label="Mobile"
      >
        {NAV_LINKS.map((link) => (
          <Link key={link.href} to={link.href} onClick={closeMenu}>
            {link.label}
          </Link>
        ))}
        <Link to="/#quote" className="btn btn--primary" onClick={closeMenu}>
          Request a quote
          <IconArrow className="btn__arrow" />
        </Link>
      </nav>
    </header>
  )
}
