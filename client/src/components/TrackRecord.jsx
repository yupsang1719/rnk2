import { useContent, yearsSince } from '../SiteData'
import StatCounter from './StatCounter'

export default function TrackRecord() {
  const { settings, c } = useContent('trackRecord')
  const years = yearsSince(settings.establishedYear)

  // Each figure comes from Company details; anything without one is hidden.
  const items = [
    { value: years && `${years} ${c.yearsUnit}`, label: c.yearsLabel },
    { value: settings.projectsCompleted, label: c.projectsLabel },
    { value: settings.guaranteeYears && `${settings.guaranteeYears} ${c.guaranteeUnit}`, label: c.guaranteeLabel },
    { value: settings.fullyInsured && c.insuredValue, label: c.insuredLabel }
  ].filter((item) => item.value)

  if (items.length === 0) return null

  return (
    <section className="section section--dark">
      <div className="grain-overlay" aria-hidden="true" />
      <div className="container">
        {c.label && (
          <span className="section-label" style={{ color: 'rgba(220,234,244,0.55)' }}>
            {c.label}
          </span>
        )}
        {c.heading && <h2>{c.heading}</h2>}

        <div className="track-record">
          {items.map((item, i) => (
            <div className="track-record__item" key={i}>
              <StatCounter className="track-record__value" value={item.value} />
              <span className="track-record__label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
