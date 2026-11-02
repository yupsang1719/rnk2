import { useSiteData } from '../SiteData'

export default function Testimonial() {
  const { settings } = useSiteData()
  if (!settings.testimonialQuote) return null

  return (
    <section className="section section--mist">
      <div className="container">
        <span className="section-label">SEC.06 / IN THEIR WORDS</span>
        <blockquote className="testimonial">
          <p className="testimonial__quote">{settings.testimonialQuote}</p>
          {(settings.testimonialName || settings.testimonialTown) && (
            <footer className="testimonial__attribution">
              {settings.testimonialName && <strong>{settings.testimonialName}</strong>}
              {settings.testimonialName && settings.testimonialTown && ' — '}
              {settings.testimonialTown}
            </footer>
          )}
        </blockquote>
      </div>
    </section>
  )
}
