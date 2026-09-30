import Reveal from './Reveal'

const STEPS = [
  {
    title: 'Design & Drawings',
    desc: 'We survey the site and produce architectural drawings and design options in-house.'
  },
  {
    title: 'Planning & Building Regs',
    desc: 'We handle the planning application and building regulations submission, and answer to it.'
  },
  {
    title: 'Build',
    desc: 'Our own site teams and trusted trades build to the drawings, on a fixed programme.'
  },
  {
    title: 'Handover',
    desc: 'Snagging, sign-off, and a structural guarantee — you get a finished, certified home.'
  }
]

export default function Process() {
  return (
    <section className="section section--light" id="process">
      <div className="container">
        <span className="section-label">SEC.04 / HOW IT WORKS</span>
        <h2>The process</h2>
        <p className="lede">Four stages. One team, start to finish.</p>

        <div className="process-list">
          {STEPS.map((step, i) => (
            <Reveal
              as="div"
              className="process-step"
              key={step.title}
              style={{ '--reveal-delay': `${i * 150}ms` }}
            >
              <span className="process-step__num mono">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="process-step__title">{step.title}</h3>
              <p className="process-step__desc">{step.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
