import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../siteConfig'
import { IconPin } from './icons'

const CoverageMapView = lazy(() => import('./CoverageMapView'))

export default function CoverageMap() {
  return (
    <section className="section section--light coverage" id="coverage">
      <div className="container">
        <span className="section-label">SEC.03 / WHERE WE BUILD</span>
        <h2>Recent work across {site.company.areasCovered}</h2>

        <div className="coverage-map-wrap">
          <Suspense fallback={<div className="coverage-map coverage-map--loading" />}>
            <CoverageMapView />
          </Suspense>
        </div>

        <p className="coverage-caption mono">
          Zoom or pan to explore, or use the list below.
        </p>

        <ul className="coverage-list">
          {site.work.map((project) => (
            <li key={project.slug}>
              <Link to={`/work/${project.slug}`} className="coverage-list__link">
                <IconPin className="coverage-list__icon" aria-hidden="true" />
                {project.title} <span className="mono">— {project.county}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
