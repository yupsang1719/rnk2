import { site } from '../siteConfig'

export default function Testimonial() {
  return (
    <section className="section section--mist">
      <div className="container">
        <span className="section-label">SEC.05 / IN THEIR WORDS</span>
        <blockquote className="testimonial">
          <p className="testimonial__quote">{site.testimonial.quote}</p>
          <footer className="testimonial__attribution">
            <strong>{site.testimonial.name}</strong> — {site.testimonial.town}
          </footer>
        </blockquote>
      </div>
    </section>
  )
}
