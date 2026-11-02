import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import WorkFilters from './WorkFilters'
import { useSiteData } from '../SiteData'
import { IconPlus } from './icons'
import { hidePhotoOnError } from '../utils/imageFallback'

export default function Work() {
  const { projects: allProjects } = useSiteData()
  const [activeType, setActiveType] = useState('All')
  const [sortOrder, setSortOrder] = useState('default')

  const types = useMemo(
    () => ['All', ...new Set(allProjects.map((project) => project.type).filter(Boolean))],
    [allProjects]
  )
  const canSortByBudget = allProjects.some((p) => p.budgetTier)

  const projects = useMemo(() => {
    let list = allProjects.filter((project) => activeType === 'All' || project.type === activeType)
    // Projects without a budget band sort last either way.
    const tier = (p, fallback) => p.budgetTier ?? fallback

    if (sortOrder === 'budget-asc') {
      list = [...list].sort((a, b) => tier(a, 99) - tier(b, 99))
    } else if (sortOrder === 'budget-desc') {
      list = [...list].sort((a, b) => tier(b, 0) - tier(a, 0))
    }

    return list
  }, [allProjects, activeType, sortOrder])

  return (
    <section className="section section--light" id="work">
      <div className="container">
        <span className="section-label">SEC.02 / SELECTED WORK</span>
        <h2>Recent projects</h2>
        <p className="lede">
          A selection of finished jobs — each one designed, approved and built by the same team.
        </p>

        {(types.length > 2 || canSortByBudget) && (
          <WorkFilters
            types={types.length > 2 ? types : []}
            activeType={activeType}
            onTypeChange={setActiveType}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            showSort={canSortByBudget}
          />
        )}

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
                  <img
                    src={project.thumb || project.image}
                    alt={project.title}
                    onError={hidePhotoOnError}
                    loading="lazy"
                  />
                  <div className="work-card__overlay" aria-hidden="true">
                    <span className="work-card__view">
                      <IconPlus className="work-card__view-icon" />
                      View project
                    </span>
                  </div>
                </div>
                <div className="work-card__body">
                  {project.type && <span className="work-card__type">{project.type}</span>}
                  <h3 className="work-card__title">{project.title}</h3>
                  {project.spec && <p className="work-card__spec mono">{project.spec}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
