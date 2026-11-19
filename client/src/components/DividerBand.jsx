import { useContent } from '../SiteData'

export default function DividerBand() {
  const { c } = useContent('divider')
  return (
    <div className="divider-band" role="presentation" aria-hidden="true">
      <span className="divider-band__label divider-band__label--right">{c.right}</span>
      <span className="divider-band__label">{c.left}</span>
    </div>
  )
}
