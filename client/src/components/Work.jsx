import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import WorkFilters from './WorkFilters'
import { site } from '../siteConfig'
import { IconPlus } from './icons'
import { hidePhotoOnError } from '../utils/imageFallback'

export default function Work() {
  const [activeType, setActiveType] = useState('All')
  const [sortOrder, setSortOrder] = useState('default')

  const types = useMemo(
    () => ['All', ...new Set(site.work.map((project) => project.type))],
    []
  )

  const projects = useMemo(() => {
    let list = site.work.filter((project) => activeType === 'All' || project.type === activeType)

    if (sortOrder === 'budget-asc') {
      list = [...list].sort((a, b) => a.budgetTier - b.budgetTier)
    } else if (sortOrder === 'budget-desc') {
      list = [...list].sort((a, b) => b.budgetTier - a.budgetTier)
    }

    return list
  }, [activeType, sortOrder])

  return (
    <section className="section section--light" id="work">
      <div className="container">
        <span className="section-label">SEC.02 / SELECTED WORK</span>
        <h2>Recent projects</h2>
        <p className="lede">
          A small selection of finished jobs. Placeholder photos and project names — swap
          for real project photography before launch.
        </p>

        <WorkFilters
          types={types}
          activeType={activeType}
          onTypeChange={setActiveType}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />

        {projects.length === 0 ? (
          <p className="work-empty">No projects match this filter.</p>
        ) : (
          <div className="work-grid">
            {projects.map((project) => (
              <Reveal
                as={Link}
                to={`/work/${project.slug}`}
                className="work-card"
                key={project.slug}
              >
                <div className="work-card__media">
                  <img src={project.image} alt={project.title} onError={hidePhotoOnError} loading="lazy" />
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
        )}
      </div>
    </section>
  )
}
