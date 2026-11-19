import { useContent } from '../SiteData'
import { RichText } from '../content/text'

const Mail = ({ to }) => <a href={`mailto:${to}`}>{to}</a>

export default function PrivacyPolicy() {
  const { settings, c } = useContent('privacy')
  const privacyEmail = settings.privacyEmail || settings.email

  return (
    <section className="section section--light">
      <div className="container">
        <span className="eyebrow">{c.eyebrow}</span>
        <h1 className="privacy-policy__title">{c.title}</h1>
        <p className="lede">
          {c.intro} {c.lastUpdated}
        </p>

        <ol className="privacy-policy__clauses">
          <li>
            <h2 className="section-label">{c.whoHeading}</h2>
            <p className="project-copy">
              {c.companyName}
              {settings.registrationNo && `, company registration no. ${settings.registrationNo}`}
              {settings.address && `, of ${settings.address}`}
              {(settings.registrationNo || settings.address) && ','} {c.whoText}
              {settings.email && (
                <>
                  {' '}
                  {c.contactPrefix} <Mail to={settings.email} />.
                </>
              )}
            </p>
          </li>

          {c.sections.map((clause, i) => (
            <li key={i}>
              <h2 className="section-label">{clause.heading}</h2>
              <RichText text={clause.body} paragraphClass="project-copy" listClass="privacy-policy__list" />
            </li>
          ))}

          <li>
            <h2 className="section-label">{c.contactHeading}</h2>
            <p className="project-copy">
              {privacyEmail && (
                <>
                  {c.dataRequestPrefix} <Mail to={privacyEmail} />.{' '}
                </>
              )}
              {settings.icoRegistrationNo && `${c.icoPrefix} ${settings.icoRegistrationNo}. `}
              {c.complaintText}
            </p>
          </li>
        </ol>
      </div>
    </section>
  )
}
