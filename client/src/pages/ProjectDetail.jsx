import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useContent } from '../SiteData'
import Reveal from '../components/Reveal'
import QuoteCTA from '../components/QuoteCTA'
import ProjectGallery from '../components/ProjectGallery'
import BeforeAfterSlider from '../components/BeforeAfterSlider'
import ProjectTimeline from '../components/ProjectTimeline'
import { IconArrow } from '../components/icons'
import { hidePhotoOnError } from '../utils/imageFallback'
import NotFound from './NotFound'

// Project field -> its label in the CMS copy (Site content → Project pages).
const FACTS = [
  { key: 'type', label: 'factType' },
  { key: 'location', label: 'factLocation' },
  { key: 'duration', label: 'factDuration' },
  { key: 'costBand', label: 'factCost' }
]

const DEFAULT_TITLE = document.title

export default function ProjectDetail() {
  const { slug } = useParams()
  const { status, projects, c, content } = useContent('project')
  const titleSuffix = content.seo.projectTitleSuffix
  const projectIndex = projects.findIndex((p) => p.slug === slug)
  const project = projects[projectIndex]

  useEffect(() => {
    if (project) document.title = titleSuffix ? `${project.title} ${titleSuffix}` : project.title
    return () => {
      document.title = DEFAULT_TITLE
    }
  }, [project, titleSuffix])

  if (status === 'loading') {
    return <section className="hero project-hero project-hero--loading" aria-busy="true" />
  }

  if (!project) {
    return <NotFound />
  }

  const otherProjects = projects.filter((p) => p.slug !== slug).slice(0, 6)
  const facts = FACTS.filter((f) => project[f.key])

  return (
    <>
      <section className="hero project-hero">
        <div className="hero__tick" aria-hidden="true" />
        <div className="container hero__inner">
          <div className="project-hero__meta">
            <Link to="/#work" className="project-hero__back mono">
              <IconArrow className="project-hero__back-icon" />
              {c.back}
            </Link>
            <span className="project-hero__tag mono">
              {`FIG. ${String(projectIndex + 1).padStart(2, '0')}`}
            </span>
          </div>

          {project.type && <span className="eyebrow project-hero__eyebrow">{project.type}</span>}
          <h1 className="project-hero__title">{project.title}</h1>
          {project.spec && <p className="project-hero__spec mono">{project.spec}</p>}
        </div>
      </section>

      <section className="section section--light">
        <div className="container project-layout">
          <div className="project-media">
            {project.gallery.length > 0 && (
              <ProjectGallery images={project.gallery} title={project.title} />
            )}

            <aside className="project-facts">
              <span className="project-facts__label mono">{c.factsHeading}</span>
              {facts.length > 0 && (
                <dl className="project-facts__list">
                  {facts.map((fact) => (
                    <div className="project-facts__row" key={fact.key}>
                      <dt>{c[fact.label]}</dt>
                      <dd>{project[fact.key]}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <a href="#quote" className="btn btn--primary">
                {c.cta}
                <IconArrow className="btn__arrow" />
              </a>
            </aside>
          </div>

          <div className="project-content">
            {project.brief && (
              <>
                <h2 className="section-label">{c.briefHeading}</h2>
                <p className="project-copy">{project.brief}</p>
              </>
            )}

            {project.approach && (
              <>
                <h2 className="section-label">{c.approachHeading}</h2>
                <p className="project-copy">{project.approach}</p>
              </>
            )}

            {project.result && (
              <>
                <h2 className="section-label">{c.resultHeading}</h2>
                <p className="project-result mono">{project.result}</p>
              </>
            )}

            {project.timeline.length > 0 && (
              <>
                <h2 className="section-label">{c.timelineHeading}</h2>
                <ProjectTimeline steps={project.timeline} />
              </>
            )}
          </div>
        </div>
      </section>

      {project.beforeImage && project.image && (
        <section className="section section--mist">
          <div className="container">
            {c.beforeAfterLabel && <span className="section-label">{c.beforeAfterLabel}</span>}
            {c.beforeAfterHeading && <h2>{c.beforeAfterHeading}</h2>}
            <BeforeAfterSlider
              beforeImage={project.beforeImage}
              afterImage={{ src: project.image, alt: project.title }}
              title={project.title}
              beforeTag={c.beforeTag}
              afterTag={c.afterTag}
            />
          </div>
        </section>
      )}

      {otherProjects.length > 0 && (
        <section className="section section--light">
          <div className="container">
            {c.moreLabel && <span className="section-label">{c.moreLabel}</span>}
            {c.moreHeading && <h2>{c.moreHeading}</h2>}

            <div className="project-more-grid">
              {otherProjects.map((p) => (
                <Reveal as={Link} to={`/work/${p.slug}`} className="project-more-card" key={p.slug}>
                  <div className="project-more-card__media">
                    <img src={p.thumb || p.image} alt={p.title} onError={hidePhotoOnError} loading="lazy" />
                  </div>
                  {p.type && <span className="project-more-card__type mono">{p.type}</span>}
                  <h3 className="project-more-card__title">{p.title}</h3>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <QuoteCTA />
    </>
  )
}
