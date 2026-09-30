import { Link } from 'react-router-dom'
import { site } from '../siteConfig'
import { IconPin } from './icons'

export default function CoverageMap() {
  return (
    <section className="section section--light coverage" id="coverage">
      <div className="container">
        <span className="section-label">SEC.03 / WHERE WE BUILD</span>
        <h2>Recent work across {site.company.areasCovered}</h2>

        <div className="coverage-panel">
          {site.work.map((project) => (
            <Link
              key={project.slug}
              to={`/work/${project.slug}`}
              className="coverage-pin"
              style={{ left: `${project.coords.x}%`, top: `${project.coords.y}%` }}
            >
              <IconPin className="coverage-pin__icon" />
              <span className="coverage-pin__label">
                {project.title} — {project.county}
              </span>
            </Link>
          ))}
        </div>

        <p className="coverage-caption mono">
          Approximate locations for illustration — not to scale.
        </p>
      </div>
    </section>
  )
}
