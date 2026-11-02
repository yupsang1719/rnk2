import { useEffect, useRef } from 'react'
import { site } from '../siteConfig'
import { useSiteData, yearsSince } from '../SiteData'
import StatCounter from './StatCounter'
import { IconArrow, IconCheck } from './icons'
import { hidePhotoOnError } from '../utils/imageFallback'

function buildStats(s) {
  return [
    { value: yearsSince(s.establishedYear), label: 'Years established' },
    { value: s.projectsCompleted, label: 'Projects completed' },
    { value: s.guaranteeYears ? `${s.guaranteeYears} YR` : '', label: 'Structural guarantee' },
    { value: s.onTimePercent, label: 'Delivered on time' }
  ].filter((stat) => stat.value)
}

const QUOTE_POINTS = [
  'No-obligation site visit',
  'Fixed-price written quote',
  'Answer within one working day'
]

export default function Hero() {
  const heroRef = useRef(null)
  const { settings, projects } = useSiteData()
  const stats = buildStats(settings)
  const eyebrow = [
    'RESIDENTIAL BUILDER',
    settings.region && settings.region.toUpperCase(),
    settings.establishedYear && `EST. ${settings.establishedYear}`
  ]
    .filter(Boolean)
    .join(' — ')

  useEffect(() => {
    const node = heroRef.current
    if (!node) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    if (prefersReducedMotion || !isFinePointer) return

    const handleMove = (e) => {
      const rect = node.getBoundingClientRect()
      const mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const my = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      node.style.setProperty('--mx', mx.toFixed(3))
      node.style.setProperty('--my', my.toFixed(3))
    }

    node.addEventListener('mousemove', handleMove)
    return () => node.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <section className="hero" id="top" ref={heroRef}>
      <img className="hero__photo" src={settings.heroImage || site.defaultHeroImage} alt="" onError={hidePhotoOnError} />
      <div className="hero__scrim" aria-hidden="true" />
      <div className="hero__tick" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__layout">
          <div className="hero__content">
            <div className="hero__frame">
              <span className="hero__frame-tag mono">FIG. 01</span>
              <p className="eyebrow hero__eyebrow">{eyebrow}</p>
              <h1 className="hero__title">
                We design it <span className="highlight">AND</span> build it.
              </h1>
            </div>

            <p className="lede hero__lede">
              One team carries your project from architectural drawings through planning and
              building regulations to a finished, guaranteed build — so nothing gets lost in
              translation between a designer and a site team.
            </p>

            <div className="hero__actions">
              <a href="#quote" className="btn btn--primary">
                Request a quote
                <IconArrow className="btn__arrow" />
              </a>
              {projects.length > 0 && (
                <a href="#work" className="btn btn--ghost">
                  See our work
                  <IconArrow className="btn__arrow" />
                </a>
              )}
            </div>
          </div>

          <aside className="hero__quote-card">
            <span className="hero__quote-card-eyebrow mono">Get a quote</span>
            <p className="hero__quote-card-title">Free site visit. Fixed-price quote.</p>
            <ul className="hero__quote-card-list">
              {QUOTE_POINTS.map((point) => (
                <li key={point}>
                  <IconCheck aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <a href="#quote" className="btn btn--primary">
              Start your project
              <IconArrow className="btn__arrow" />
            </a>
          </aside>
        </div>

        {stats.length > 0 && (
          <div className="stat-strip">
            {stats.map((stat) => (
              <div className="stat-strip__item" key={stat.label}>
                <StatCounter className="stat-strip__value" value={stat.value} />
                <span className="stat-strip__label">{stat.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
