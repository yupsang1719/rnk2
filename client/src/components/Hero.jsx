import { useEffect, useRef } from 'react'
import { site } from '../siteConfig'
import { useContent, yearsSince } from '../SiteData'
import StatCounter from './StatCounter'
import { IconArrow, IconCheck } from './icons'
import { hidePhotoOnError } from '../utils/imageFallback'

function buildStats(s, c) {
  return [
    { value: yearsSince(s.establishedYear), label: c.statYearsLabel },
    { value: s.projectsCompleted, label: c.statProjectsLabel },
    { value: s.guaranteeYears ? `${s.guaranteeYears} ${c.statGuaranteeUnit}` : '', label: c.statGuaranteeLabel },
    { value: s.onTimePercent, label: c.statOnTimeLabel }
  ].filter((stat) => stat.value)
}

export default function Hero() {
  const heroRef = useRef(null)
  const { settings, projects, c } = useContent('hero')
  const stats = buildStats(settings, c)
  const eyebrow = [
    c.eyebrow,
    settings.region,
    settings.establishedYear && `${c.establishedPrefix} ${settings.establishedYear}`
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
      <img className="hero__photo" src={c.image?.url || site.defaultHeroImage} alt="" onError={hidePhotoOnError} />
      <div className="hero__scrim" aria-hidden="true" />
      <div className="hero__tick" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__layout">
          <div className="hero__content">
            <div className="hero__frame">
              <span className="hero__frame-tag mono">FIG. 01</span>
              <p className="eyebrow hero__eyebrow">{eyebrow}</p>
              <h1 className="hero__title">
                {c.titleBefore} <span className="highlight">{c.titleHighlight}</span> {c.titleAfter}
              </h1>
            </div>

            <p className="lede hero__lede">{c.lede}</p>

            <div className="hero__actions">
              <a href="#quote" className="btn btn--primary">
                {c.primaryCta}
                <IconArrow className="btn__arrow" />
              </a>
              {projects.length > 0 && (
                <a href="#work" className="btn btn--ghost">
                  {c.secondaryCta}
                  <IconArrow className="btn__arrow" />
                </a>
              )}
            </div>
          </div>

          <aside className="hero__quote-card">
            <span className="hero__quote-card-eyebrow mono">{c.cardEyebrow}</span>
            <p className="hero__quote-card-title">{c.cardTitle}</p>
            <ul className="hero__quote-card-list">
              {c.cardPoints.map((point, i) => (
                <li key={i}>
                  <IconCheck aria-hidden="true" />
                  <span>{point.text}</span>
                </li>
              ))}
            </ul>
            <a href="#quote" className="btn btn--primary">
              {c.cardCta}
              <IconArrow className="btn__arrow" />
            </a>
          </aside>
        </div>

        {stats.length > 0 && (
          <div className="stat-strip">
            {stats.map((stat, i) => (
              <div className="stat-strip__item" key={i}>
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
