import Reveal from './Reveal'
import { useContent } from '../SiteData'

export default function Process() {
  const { c } = useContent('process')

  return (
    <section className="section section--light" id="process">
      <div className="container">
        {c.label && <span className="section-label">{c.label}</span>}
        {c.heading && <h2>{c.heading}</h2>}
        {c.lede && <p className="lede">{c.lede}</p>}

        <div className="process-list">
          {c.steps.map((step, i) => (
            <Reveal
              as="div"
              className="process-step"
              key={i}
              style={{ '--reveal-delay': `${i * 150}ms` }}
            >
              <span className="process-step__num mono">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="process-step__title">{step.title}</h3>
              {step.desc && <p className="process-step__desc">{step.desc}</p>}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
