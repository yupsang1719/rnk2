import { site } from '../siteConfig'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="grain-overlay" aria-hidden="true" />
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4>RNK2 // Properties Ltd</h4>
            <p>
              {site.contact.addressLine}
              <br />
              {site.contact.phone}
              <br />
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            </p>
          </div>

          <div>
            <h4>Areas covered</h4>
            <p>{site.company.areasCovered}</p>
          </div>

          <div>
            <h4>Assurance</h4>
            <ul>
              <li>Fully insured — public liability &amp; employer&apos;s liability</li>
              <li>{site.stats.guaranteeYears}-year structural guarantee on new build work</li>
              <li>Company registration no. {site.company.registrationNo}</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} RNK2 Properties Ltd. All rights reserved.</span>
          <span className="placeholder-note">
            [ALL FIGURES &amp; CONTACT DETAILS ON THIS SITE ARE PLACEHOLDERS — SEE src/siteConfig.js]
          </span>
        </div>
      </div>
    </footer>
  )
}
