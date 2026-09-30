import { site } from '../siteConfig'

export default function PrivacyPolicy() {
  return (
    <section className="section section--light">
      <div className="container">
        <span className="eyebrow">Legal</span>
        <h1 className="privacy-policy__title">Privacy Policy</h1>
        <p className="lede">
          This explains what personal data RNK2 Properties Ltd collects when you contact us,
          why, and what rights you have. Last updated {site.legal.policyUpdated}.
        </p>

        <ol className="privacy-policy__clauses">
          <li>
            <h2 className="section-label">01 / WHO WE ARE</h2>
            <p className="project-copy">
              RNK2 Properties Ltd, company registration no. {site.company.registrationNo},
              of {site.contact.addressLine}, is the data controller for the personal data
              described in this policy. You can reach us at{' '}
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
            </p>
          </li>

          <li>
            <h2 className="section-label">02 / WHAT WE COLLECT</h2>
            <p className="project-copy">
              When you submit a quote request, we collect:
            </p>
            <ul className="privacy-policy__list">
              <li>Your name, email address and phone number</li>
              <li>Your postcode and the project type/details you submit in the quote form</li>
              <li>Any message you choose to add</li>
              <li>
                Standard technical/security logs kept by our hosting provider (e.g. IP
                address) — this site does not use cookies or analytics
              </li>
            </ul>
          </li>

          <li>
            <h2 className="section-label">03 / WHY WE PROCESS IT &amp; OUR LAWFUL BASIS</h2>
            <p className="project-copy">
              We use your details to respond to your quote request, arrange a site visit, and
              provide a written quote — this is necessary to take steps at your request before
              entering into a contract with you. Where you&apos;ve given consent (see below), we
              rely on that consent as our lawful basis.
            </p>
          </li>

          <li>
            <h2 className="section-label">04 / HOW LONG WE KEEP IT</h2>
            <p className="project-copy">{site.legal.quoteLeadRetention}</p>
          </li>

          <li>
            <h2 className="section-label">05 / WHO WE SHARE IT WITH</h2>
            <p className="project-copy">
              We don&apos;t sell your data. We share it only with the following processors, who act
              on our instructions:
            </p>
            <ul className="privacy-policy__list">
              {site.legal.dataSharedWith.map((d) => (
                <li key={d.name}>
                  {d.name} — {d.purpose}
                </li>
              ))}
            </ul>
          </li>

          <li>
            <h2 className="section-label">06 / YOUR RIGHTS</h2>
            <p className="project-copy">
              You have the right to access, correct, erase, or restrict the data we hold about
              you, to object to our processing, to request a copy in a portable format, and to
              withdraw your consent at any time. You also have the right to complain to the
              Information Commissioner&apos;s Office (ICO) if you&apos;re unhappy with how
              we&apos;ve handled your data.
            </p>
          </li>

          <li>
            <h2 className="section-label">07 / COOKIES</h2>
            <p className="project-copy">
              This site does not currently use cookies or analytics. If that changes, this
              policy will be updated first.
            </p>
          </li>

          <li>
            <h2 className="section-label">08 / CONTACT US &amp; COMPLAINTS</h2>
            <p className="project-copy">
              For data requests, contact{' '}
              <a href={`mailto:${site.legal.privacyEmail}`}>{site.legal.privacyEmail}</a>.
              Our ICO registration number is {site.legal.icoRegistrationNo}. You can also
              complain to the Information Commissioner&apos;s Office at ico.org.uk.
            </p>
          </li>
        </ol>
      </div>
    </section>
  )
}
