/**
 * STATIC SITE COPY
 * -----------------------------------------------------------------------
 * Projects and company details (stats, contact, registration numbers,
 * testimonial) are managed in the CMS at /admin and loaded from the API —
 * see src/SiteData.jsx. Only fixed, code-level copy lives here.
 * -----------------------------------------------------------------------
 */
export const site = {
  // Used when no hero photo has been uploaded in the CMS. CC0 — no attribution needed.
  defaultHeroImage: '/images/hero.jpg',

  legal: {
    quoteLeadRetention:
      '24 months from your last contact with us, or until you ask us to delete it — whichever is sooner',
    dataSharedWith: [
      {
        name: 'Our website hosting provider',
        purpose: 'Storing the site and any enquiry data you submit, and keeping standard security/access logs'
      },
      {
        name: 'Our email service provider',
        purpose: 'Sending you a reply to your enquiry'
      }
    ],
    policyUpdated: '2 November 2026'
  }
}
