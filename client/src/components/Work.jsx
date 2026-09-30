import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { site } from '../siteConfig'
import { IconPlus } from './icons'

function handleImageError(e) {
  e.currentTarget.style.display = 'none'
}

export default function Work() {
  return (
    <section className="section section--light" id="work">
      <div className="container">
        <span className="section-label">SEC.02 / SELECTED WORK</span>
        <h2>Recent projects</h2>
        <p className="lede">
          A small selection of finished jobs. Placeholder photos and project names — swap
          for real project photography before launch.
        </p>

        <div className="work-grid">
          {site.work.map((project) => (
            <Reveal
              as={Link}
              to={`/work/${project.slug}`}
              className="work-card"
              key={project.slug}
            >
              <div className="work-card__media">
                <img src={project.image} alt={project.title} onError={handleImageError} loading="lazy" />
                <div className="work-card__overlay" aria-hidden="true">
                  <span className="work-card__view">
                    <IconPlus className="work-card__view-icon" />
                    View project
                  </span>
                </div>
              </div>
              <div className="work-card__body">
                <span className="work-card__type">{project.type}</span>
                <h3 className="work-card__title">{project.title}</h3>
                <p className="work-card__spec mono">{project.spec}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
