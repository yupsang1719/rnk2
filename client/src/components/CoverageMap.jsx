import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../SiteData'
import { IconPin } from './icons'

const CoverageMapView = lazy(() => import('./CoverageMapView'))

export default function CoverageMap() {
  const { projects, settings, c } = useContent('coverage')
  const mapped = projects.filter((p) => p.coords)

  return (
    <section className="section section--light coverage" id="coverage">
      <div className="container">
        {c.label && <span className="section-label">{c.label}</span>}
        <h2>{settings.areasCovered ? `${c.headingPrefix} ${settings.areasCovered}` : c.headingFallback}</h2>

        <div className="coverage-map-wrap">
          <Suspense fallback={<div className="coverage-map coverage-map--loading" />}>
            <CoverageMapView />
          </Suspense>
        </div>

        {c.caption && <p className="coverage-caption mono">{c.caption}</p>}

        <ul className="coverage-list">
          {mapped.map((project) => (
            <li key={project.slug}>
              <Link to={`/work/${project.slug}`} className="coverage-list__link">
                <IconPin className="coverage-list__icon" aria-hidden="true" />
                {project.title} {project.county && <span className="mono">— {project.county}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
