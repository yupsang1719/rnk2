import { useCountUp } from '../hooks/useCountUp'

function parseValue(raw) {
  const match = String(raw).match(/^-?\d+/)
  if (!match) return null
  return { number: parseInt(match[0], 10), suffix: raw.slice(match[0].length) }
}

export default function StatCounter({ value, className = '' }) {
  const parsed = parseValue(value)

  if (!parsed) {
    return <span className={className}>{value}</span>
  }

  return <StatCounterAnimated number={parsed.number} suffix={parsed.suffix} className={className} />
}

function StatCounterAnimated({ number, suffix, className }) {
  const [ref, current] = useCountUp(number)

  return (
    <span className={className} ref={ref}>
      {current}
      {suffix}
    </span>
  )
}
