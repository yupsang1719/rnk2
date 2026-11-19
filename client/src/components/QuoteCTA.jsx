import QuoteForm from './QuoteForm'
import { useContent } from '../SiteData'

export default function QuoteCTA() {
  const { settings, c } = useContent('quote')

  return (
    <section className="section section--light" id="quote">
      <div className="container quote-section">
        <div className="quote-section__intro">
          {c.label && <span className="section-label">{c.label}</span>}
          {c.heading && <h2>{c.heading}</h2>}
          {c.lede && <p className="lede">{c.lede}</p>}
          {settings.phone && (
            <p className="lede mono" style={{ fontSize: '0.9rem', marginTop: '24px' }}>
              {c.callPrompt && `${c.callPrompt} `}
              <a href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}>{settings.phone}</a>
            </p>
          )}
        </div>

        <QuoteForm />
      </div>
    </section>
  )
}
