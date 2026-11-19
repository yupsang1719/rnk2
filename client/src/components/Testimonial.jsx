import { useContent } from '../SiteData'

export default function Testimonial() {
  const { c } = useContent('testimonials')
  const reviews = c.items.filter((r) => r.quote)
  if (reviews.length === 0) return null

  return (
    <section className="section section--mist">
      <div className="container">
        {c.label && <span className="section-label">{c.label}</span>}
        <div className="testimonials">
          {reviews.map((review, i) => (
            <blockquote className="testimonial" key={i}>
              <p className="testimonial__quote">{review.quote}</p>
              {(review.name || review.town) && (
                <footer className="testimonial__attribution">
                  {review.name && <strong>{review.name}</strong>}
                  {review.name && review.town && ' — '}
                  {review.town}
                </footer>
              )}
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
