import { Link } from 'react-router-dom'

// A link whose destination is set in the CMS: pages on this site go through
// the router; web, email and phone links are plain links (web ones open a new tab).
export default function SmartLink({ to, children, ...rest }) {
  if (/^\/(?!\/)/.test(to || '')) {
    return (
      <Link to={to} {...rest}>
        {children}
      </Link>
    )
  }
  const external = /^https?:/i.test(to || '')
  return (
    <a href={to || '#'} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
      {children}
    </a>
  )
}
