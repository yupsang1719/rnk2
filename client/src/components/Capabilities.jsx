import Reveal from './Reveal'
import {
  IconExtension,
  IconLoft,
  IconNewBuild,
  IconDrawings,
  IconStructural,
  IconManagement
} from './icons'

const CAPABILITIES = [
  {
    title: 'Extensions',
    desc: 'Single and double-storey extensions that add real living space without a move.',
    Icon: IconExtension
  },
  {
    title: 'Loft & Garage Conversions',
    desc: 'Turn unused roof and garage space into bedrooms, offices or living rooms.',
    Icon: IconLoft
  },
  {
    title: 'New Builds',
    desc: 'Ground-up homes, from a single plot infill to a full self-build.',
    Icon: IconNewBuild
  },
  {
    title: 'Design & Planning Drawings',
    desc: 'Architectural drawings and planning applications, done in-house from day one.',
    Icon: IconDrawings
  },
  {
    title: 'Building Regs & Structural',
    desc: 'Structural calculations and building regulations sign-off, handled for you.',
    Icon: IconStructural
  },
  {
    title: 'Full Project Management',
    desc: 'One point of contact and one programme from first sketch to final snag.',
    Icon: IconManagement
  }
]

export default function Capabilities() {
  return (
    <section className="section section--light" id="capabilities">
      <div className="container">
        <span className="section-label">SEC.01 / WHAT WE BUILD</span>
        <h2>Capabilities</h2>
        <p className="lede">
          Six disciplines, one company. Every project draws on the same team of designers,
          engineers and site staff.
        </p>

        <div className="capabilities-grid">
          {CAPABILITIES.map((cap, i) => (
            <Reveal as="div" className="capability-card" key={cap.title}>
              <div className="capability-card__top">
                <cap.Icon className="capability-card__icon" aria-hidden="true" />
                <span className="capability-card__index">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="capability-card__title">{cap.title}</h3>
              <p className="capability-card__desc">{cap.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
