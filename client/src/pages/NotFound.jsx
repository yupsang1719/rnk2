import { Link } from 'react-router-dom'
import { IconArrow } from '../components/icons'

export default function NotFound() {
  return (
    <section className="section section--light not-found">
      <div className="container">
        <span className="section-label">ERR.404</span>
        <h1 className="not-found__title">Page not found</h1>
        <p className="lede">That page doesn&apos;t exist, or the project may have been taken down.</p>
        <Link to="/" className="btn btn--primary not-found__cta">
          Back to the homepage
          <IconArrow className="btn__arrow" />
        </Link>
      </div>
    </section>
  )
}
