import QuoteForm from './QuoteForm'
import { useSiteData } from '../SiteData'

export default function QuoteCTA() {
  const { settings } = useSiteData()

  return (
    <section className="section section--light" id="quote">
      <div className="container quote-section">
        <div className="quote-section__intro">
          <span className="section-label">SEC.07 / GET A QUOTE</span>
          <h2>Start with a conversation</h2>
          <p className="lede">
            Tell us about your project and we&apos;ll get back to you within one working day to
            arrange a site visit. No obligation, no generic sales pitch — just a straight
            answer on what&apos;s possible.
          </p>
          {settings.phone && (
            <p className="lede mono" style={{ fontSize: '0.9rem', marginTop: '24px' }}>
              Prefer to call?{' '}
              <a href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}>{settings.phone}</a>
            </p>
          )}
        </div>

        <QuoteForm />
      </div>
    </section>
  )
}
