import { Link } from 'react-router-dom'
import { IconArrow } from '../components/icons'
import { useContent } from '../SiteData'

export default function NotFound() {
  const { c } = useContent('notFound')
  return (
    <section className="section section--light not-found">
      <div className="container">
        {c.label && <span className="section-label">{c.label}</span>}
        <h1 className="not-found__title">{c.heading}</h1>
        {c.text && <p className="lede">{c.text}</p>}
        {c.button && (
          <Link to="/" className="btn btn--primary not-found__cta">
            {c.button}
            <IconArrow className="btn__arrow" />
          </Link>
        )}
      </div>
    </section>
  )
}
