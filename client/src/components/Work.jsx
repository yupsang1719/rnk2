import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import WorkFilters from './WorkFilters'
import { useContent } from '../SiteData'
import { IconPlus } from './icons'
import { hidePhotoOnError } from '../utils/imageFallback'

export default function Work() {
  const { projects: allProjects, c } = useContent('work')
  // null = show every type (the "All" button)
  const [activeType, setActiveType] = useState(null)
  const [sortOrder, setSortOrder] = useState('default')

  const types = useMemo(
    () => [...new Set(allProjects.map((project) => project.type).filter(Boolean))],
    [allProjects]
  )
  const canSortByBudget = allProjects.some((p) => p.budgetTier)

  const projects = useMemo(() => {
    let list = allProjects.filter((project) => activeType === null || project.type === activeType)
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
        {c.label && <span className="section-label">{c.label}</span>}
        {c.heading && <h2>{c.heading}</h2>}
        {c.lede && <p className="lede">{c.lede}</p>}

        {(types.length > 1 || canSortByBudget) && (
          <WorkFilters
            labels={c}
            types={types.length > 1 ? types : []}
            activeType={activeType}
            onTypeChange={setActiveType}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            showSort={canSortByBudget}
          />
        )}

        {projects.length === 0 ? (
          <p className="work-empty">{c.empty}</p>
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
                      {c.viewProject}
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
