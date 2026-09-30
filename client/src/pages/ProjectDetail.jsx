import { Link, Navigate, useParams } from 'react-router-dom'
import { site } from '../siteConfig'
import Reveal from '../components/Reveal'
import QuoteCTA from '../components/QuoteCTA'
import ProjectGallery from '../components/ProjectGallery'
import BeforeAfterSlider from '../components/BeforeAfterSlider'
import ProjectTimeline from '../components/ProjectTimeline'
import { IconArrow } from '../components/icons'
import { hidePhotoOnError } from '../utils/imageFallback'

const FACTS = [
  { key: 'type', label: 'Project type' },
  { key: 'location', label: 'Location' },
  { key: 'duration', label: 'Duration' },
  { key: 'costBand', label: 'Cost band' }
]

export default function ProjectDetail() {
  const { slug } = useParams()
  const projectIndex = site.work.findIndex((p) => p.slug === slug)
  const project = site.work[projectIndex]

  if (!project) {
    return <Navigate to="/" replace />
  }

  const otherProjects = site.work.filter((p) => p.slug !== slug)

  return (
    <>
      <section className="hero project-hero">
        <div className="hero__tick" aria-hidden="true" />
        <div className="container hero__inner">
          <div className="project-hero__meta">
            <Link to="/#work" className="project-hero__back mono">
              <IconArrow className="project-hero__back-icon" />
              Back to work
            </Link>
            <span className="project-hero__tag mono">
              {`FIG. ${String(projectIndex + 1).padStart(2, '0')}`}
            </span>
          </div>

          <span className="eyebrow project-hero__eyebrow">{project.type}</span>
          <h1 className="project-hero__title">{project.title}</h1>
          <p className="project-hero__spec mono">{project.spec}</p>
        </div>
      </section>

      <section className="section section--light">
        <div className="container project-layout">
          <div className="project-media">
            <ProjectGallery images={project.gallery} title={project.title} />

            <aside className="project-facts">
              <span className="project-facts__label mono">Project facts</span>
              <dl className="project-facts__list">
                {FACTS.map((fact) => (
                  <div className="project-facts__row" key={fact.key}>
                    <dt>{fact.label}</dt>
                    <dd>{project[fact.key]}</dd>
                  </div>
                ))}
              </dl>
              <a href="#quote" className="btn btn--primary">
                Start a similar project
                <IconArrow className="btn__arrow" />
              </a>
            </aside>
          </div>

          <div className="project-content">
            <h2 className="section-label">THE BRIEF</h2>
            <p className="project-copy">{project.brief}</p>

            <h2 className="section-label">THE APPROACH</h2>
            <p className="project-copy">{project.approach}</p>

            <h2 className="section-label">THE RESULT</h2>
            <p className="project-result mono">{project.result}</p>

            <h2 className="section-label">THE TIMELINE</h2>
            <ProjectTimeline steps={project.timeline} />
          </div>
        </div>
      </section>

      <section className="section section--mist">
        <div className="container">
          <span className="section-label">THE TRANSFORMATION</span>
          <h2>Before &amp; after</h2>
          <BeforeAfterSlider
            beforeImage={project.beforeImage}
            afterImage={{ src: project.image, alt: project.title }}
            title={project.title}
          />
        </div>
      </section>

      {otherProjects.length > 0 && (
        <section className="section section--light">
          <div className="container">
            <span className="section-label">SEC.08 / MORE PROJECTS</span>
            <h2>Other work</h2>

            <div className="project-more-grid">
              {otherProjects.map((p) => (
                <Reveal as={Link} to={`/work/${p.slug}`} className="project-more-card" key={p.slug}>
                  <div className="project-more-card__media">
                    <img src={p.image} alt={p.title} onError={hidePhotoOnError} loading="lazy" />
                  </div>
                  <span className="project-more-card__type mono">{p.type}</span>
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
