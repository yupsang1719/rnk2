import { useSiteData, yearsSince } from '../SiteData'
import StatCounter from './StatCounter'

export default function TrackRecord() {
  const { settings } = useSiteData()
  const years = yearsSince(settings.establishedYear)

  const items = [
    { value: years && `${years} YRS`, label: 'Years building' },
    { value: settings.projectsCompleted, label: 'Projects completed' },
    { value: settings.guaranteeYears && `${settings.guaranteeYears} YR GUARANTEE`, label: 'Structural guarantee' },
    { value: settings.fullyInsured && 'FULLY INSURED', label: 'Public liability cover' }
  ].filter((item) => item.value)

  if (items.length === 0) return null

  return (
    <section className="section section--dark">
      <div className="grain-overlay" aria-hidden="true" />
      <div className="container">
        <span className="section-label" style={{ color: 'rgba(220,234,244,0.55)' }}>
          SEC.04 / TRACK RECORD
        </span>
        <h2>Built on delivery</h2>

        <div className="track-record">
          {items.map((item) => (
            <div className="track-record__item" key={item.label}>
              <StatCounter className="track-record__value" value={item.value} />
              <span className="track-record__label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
