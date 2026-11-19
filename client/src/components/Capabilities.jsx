import Reveal from './Reveal'
import { useContent } from '../SiteData'
import {
  IconExtension,
  IconLoft,
  IconNewBuild,
  IconDrawings,
  IconStructural,
  IconManagement
} from './icons'

// Icon names match ICONS in shared/content/schema.js.
const ICONS = {
  extension: IconExtension,
  loft: IconLoft,
  newBuild: IconNewBuild,
  drawings: IconDrawings,
  structural: IconStructural,
  management: IconManagement
}

export default function Capabilities() {
  const { c } = useContent('capabilities')

  return (
    <section className="section section--light" id="capabilities">
      <div className="container">
        {c.label && <span className="section-label">{c.label}</span>}
        {c.heading && <h2>{c.heading}</h2>}
        {c.lede && <p className="lede">{c.lede}</p>}

        <div className="capabilities-grid">
          {c.items.map((cap, i) => {
            const Icon = ICONS[cap.icon] || IconExtension
            return (
              <Reveal as="div" className="capability-card" key={i}>
                <div className="capability-card__top">
                  <Icon className="capability-card__icon" aria-hidden="true" />
                  <span className="capability-card__index">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="capability-card__title">{cap.title}</h3>
                {cap.desc && <p className="capability-card__desc">{cap.desc}</p>}
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
