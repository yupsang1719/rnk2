export default function ProjectTimeline({ steps }) {
  return (
    <ol className="timeline-list">
      {steps.map((step, i) => (
        <li className="timeline-step" key={step.label}>
          <span className="timeline-step__marker mono">{String(i + 1).padStart(2, '0')}</span>
          <span className="timeline-step__label">{step.label}</span>
          <span className="timeline-step__duration mono">{step.duration}</span>
        </li>
      ))}
    </ol>
  )
}
