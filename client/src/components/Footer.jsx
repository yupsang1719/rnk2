import { Link } from 'react-router-dom'
import { useSiteData } from '../SiteData'

export default function Footer() {
  const { settings } = useSiteData()
  const year = new Date().getFullYear()

  const contactLines = [
    settings.address,
    settings.phone && (
      <a href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}>{settings.phone}</a>
    ),
    settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>
  ].filter(Boolean)

  const assurance = [
    settings.fullyInsured && <>Fully insured — public liability &amp; employer&apos;s liability</>,
    settings.guaranteeYears && `${settings.guaranteeYears}-year structural guarantee on new build work`,
    settings.registrationNo && `Company registration no. ${settings.registrationNo}`
  ].filter(Boolean)

  return (
    <footer className="site-footer">
      <div className="grain-overlay" aria-hidden="true" />
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4>RNK2 // Properties Ltd</h4>
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
              <h4>Areas covered</h4>
              <p>{settings.areasCovered}</p>
            </div>
          )}

          {assurance.length > 0 && (
            <div>
              <h4>Assurance</h4>
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
            <span>© {year} RNK2 Properties Ltd. All rights reserved.</span>
            <Link to="/privacy-policy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
