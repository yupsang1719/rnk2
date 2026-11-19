import { Link } from 'react-router-dom'
import { useContent } from '../SiteData'

export default function Footer() {
  const { settings, c } = useContent('footer')

  const contactLines = [
    settings.address,
    settings.phone && (
      <a href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}>{settings.phone}</a>
    ),
    settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>
  ].filter(Boolean)

  const assurance = [
    settings.fullyInsured && c.insuredLine,
    settings.guaranteeYears && `${settings.guaranteeYears}-${c.guaranteeText}`,
    settings.registrationNo && `${c.registrationPrefix} ${settings.registrationNo}`
  ].filter(Boolean)

  return (
    <footer className="site-footer">
      <div className="grain-overlay" aria-hidden="true" />
      <div className="container">
        <div className="footer-grid">
          <div>
            <img
              className="footer-logo"
              src="/logos/rnk2-horizontal-on-dark.svg"
              alt="RNK2 Properties Ltd"
              width="329"
              height="99"
              loading="lazy"
            />
            {contactLines.length > 0 && (
              <p>
                {contactLines.map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </p>
            )}
          </div>

          {settings.areasCovered && (
            <div>
              {c.areasHeading && <h4>{c.areasHeading}</h4>}
              <p>{settings.areasCovered}</p>
            </div>
          )}

          {assurance.length > 0 && (
            <div>
              {c.assuranceHeading && <h4>{c.assuranceHeading}</h4>}
              <ul>
                {assurance.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom__legal">
            <span>© {new Date().getFullYear()} {c.copyrightText}</span>
            {c.privacyLinkText && <Link to="/privacy-policy">{c.privacyLinkText}</Link>}
          </div>
        </div>
      </div>
    </footer>
  )
}
