import { site } from '../siteConfig'
import StatCounter from './StatCounter'

const ITEMS = [
  { value: site.trackRecord.yearsBuilding, label: 'Years building' },
  { value: site.trackRecord.projectsCompleted, label: 'Projects completed' },
  { value: site.trackRecord.guarantee, label: 'Structural guarantee' },
  { value: site.trackRecord.insured, label: 'Public liability cover' }
]

export default function TrackRecord() {
  return (
    <section className="section section--dark">
      <div className="grain-overlay" aria-hidden="true" />
      <div className="container">
        <span className="section-label" style={{ color: 'rgba(220,234,244,0.55)' }}>
          SEC.03 / TRACK RECORD
        </span>
        <h2>Built on delivery</h2>

        <div className="track-record">
          {ITEMS.map((item) => (
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
