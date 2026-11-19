/**
 * The site's original copy. Used to seed the CMS the first time it runs, to
 * fill in any field added later, and as the fallback if content can't load.
 */
export const CONTENT_DEFAULTS = {
  header: {
    navLinks: [
      { label: 'Capabilities', href: '/#capabilities' },
      { label: 'Work', href: '/#work' },
      { label: 'Process', href: '/#process' }
    ],
    ctaLabel: 'Request a quote',
    // Not editable in the CMS: where the button goes.
    ctaHref: '/#quote'
  },

  hero: {
    image: null,
    eyebrow: 'Residential builder',
    establishedPrefix: 'EST.',
    titleBefore: 'We design it',
    titleHighlight: 'AND',
    titleAfter: 'build it.',
    lede:
      'One team carries your project from architectural drawings through planning and building regulations to a finished, guaranteed build — so nothing gets lost in translation between a designer and a site team.',
    primaryCta: 'Request a quote',
    secondaryCta: 'See our work',
    cardEyebrow: 'Get a quote',
    cardTitle: 'Free site visit. Fixed-price quote.',
    cardPoints: [
      { text: 'No-obligation site visit' },
      { text: 'Fixed-price written quote' },
      { text: 'Answer within one working day' }
    ],
    cardCta: 'Start your project',
    statYearsLabel: 'Years established',
    statProjectsLabel: 'Projects completed',
    statGuaranteeLabel: 'Structural guarantee',
    statGuaranteeUnit: 'YR',
    statOnTimeLabel: 'Delivered on time'
  },

  capabilities: {
    label: 'SEC.01 / WHAT WE BUILD',
    heading: 'Capabilities',
    lede: 'Six disciplines, one company. Every project draws on the same team of designers, engineers and site staff.',
    items: [
      { icon: 'extension', title: 'Extensions', desc: 'Single and double-storey extensions that add real living space without a move.' },
      { icon: 'loft', title: 'Loft & Garage Conversions', desc: 'Turn unused roof and garage space into bedrooms, offices or living rooms.' },
      { icon: 'newBuild', title: 'New Builds', desc: 'Ground-up homes, from a single plot infill to a full self-build.' },
      { icon: 'drawings', title: 'Design & Planning Drawings', desc: 'Architectural drawings and planning applications, done in-house from day one.' },
      { icon: 'structural', title: 'Building Regs & Structural', desc: 'Structural calculations and building regulations sign-off, handled for you.' },
      { icon: 'management', title: 'Full Project Management', desc: 'One point of contact and one programme from first sketch to final snag.' }
    ]
  },

  work: {
    label: 'SEC.02 / SELECTED WORK',
    heading: 'Recent projects',
    lede: 'A selection of finished jobs — each one designed, approved and built by the same team.',
    filterAll: 'All',
    sortLabel: 'Sort',
    sortDefault: 'Default order',
    sortAsc: 'Budget: low to high',
    sortDesc: 'Budget: high to low',
    viewProject: 'View project',
    empty: 'No projects match this filter.'
  },

  coverage: {
    label: 'SEC.03 / WHERE WE BUILD',
    headingPrefix: 'Recent work across',
    headingFallback: 'Where we’ve built',
    caption: 'Zoom or pan to explore, or use the list below.'
  },

  divider: {
    left: 'SCALE N.T.S.',
    right: 'DWG. RNK2-001'
  },

  trackRecord: {
    label: 'SEC.04 / TRACK RECORD',
    heading: 'Built on delivery',
    yearsUnit: 'YRS',
    yearsLabel: 'Years building',
    projectsLabel: 'Projects completed',
    guaranteeUnit: 'YR GUARANTEE',
    guaranteeLabel: 'Structural guarantee',
    insuredValue: 'FULLY INSURED',
    insuredLabel: 'Public liability cover'
  },

  process: {
    label: 'SEC.05 / HOW IT WORKS',
    heading: 'The process',
    lede: 'Four stages. One team, start to finish.',
    steps: [
      { title: 'Design & Drawings', desc: 'We survey the site and produce architectural drawings and design options in-house.' },
      { title: 'Planning & Building Regs', desc: 'We handle the planning application and building regulations submission, and answer to it.' },
      { title: 'Build', desc: 'Our own site teams and trusted trades build to the drawings, on a fixed programme.' },
      { title: 'Handover', desc: 'Snagging, sign-off, and a structural guarantee — you get a finished, certified home.' }
    ]
  },

  testimonials: {
    label: 'SEC.06 / IN THEIR WORDS',
    items: []
  },

  quote: {
    label: 'SEC.07 / GET A QUOTE',
    heading: 'Start with a conversation',
    lede:
      'Tell us about your project and we’ll get back to you within one working day to arrange a site visit. No obligation, no generic sales pitch — just a straight answer on what’s possible.',
    callPrompt: 'Prefer to call?',
    nameLabel: 'Full name',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    projectTypeLabel: 'Project type',
    projectTypePlaceholder: 'Select one…',
    projectTypes: [{ text: 'Extension' }, { text: 'Conversion' }, { text: 'New Build' }, { text: 'Design only' }],
    postcodeLabel: 'Postcode',
    messageLabel: 'Tell us about the project (optional)',
    consentText: 'I have read and agree to the',
    consentLinkText: 'Privacy Policy',
    submitLabel: 'Request a quote',
    sendingLabel: 'Sending…',
    successMessage: 'Thanks — we’ll be in touch within one working day.',
    errorMessage: 'A few details need a second look — check the form and try again.',
    networkError: 'We couldn’t reach the server. Check your connection and try again.',
    errName: 'Enter your full name.',
    errEmail: 'Enter a valid email address.',
    errPhone: 'Enter a valid phone number.',
    errProjectType: 'Choose a project type.',
    errPostcode: 'Enter a valid UK postcode.',
    errConsent: 'You must agree to the Privacy Policy to continue.'
  },

  footer: {
    areasHeading: 'Areas covered',
    assuranceHeading: 'Assurance',
    insuredLine: 'Fully insured — public liability & employer’s liability',
    guaranteeText: 'year structural guarantee on new build work',
    registrationPrefix: 'Company registration no.',
    copyrightText: 'RNK2 Properties Ltd. All rights reserved.',
    privacyLinkText: 'Privacy Policy'
  },

  project: {
    back: 'Back to work',
    factsHeading: 'Project facts',
    factType: 'Project type',
    factLocation: 'Location',
    factDuration: 'Duration',
    factCost: 'Cost band',
    cta: 'Start a similar project',
    briefHeading: 'THE BRIEF',
    approachHeading: 'THE APPROACH',
    resultHeading: 'THE RESULT',
    timelineHeading: 'THE TIMELINE',
    beforeAfterLabel: 'THE TRANSFORMATION',
    beforeAfterHeading: 'Before & after',
    beforeTag: 'Before',
    afterTag: 'After',
    moreLabel: 'SEC.08 / MORE PROJECTS',
    moreHeading: 'Other work'
  },

  privacy: {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    intro:
      'This explains what personal data RNK2 Properties Ltd collects when you contact us, why, and what rights you have.',
    lastUpdated: 'Last updated 2 November 2026.',
    whoHeading: '01 / WHO WE ARE',
    companyName: 'RNK2 Properties Ltd',
    whoText: 'is the data controller for the personal data described in this policy.',
    contactPrefix: 'You can reach us at',
    sections: [
      {
        heading: '02 / WHAT WE COLLECT',
        body: [
          'When you submit a quote request, we collect:',
          '',
          '- Your name, email address and phone number',
          '- Your postcode and the project type/details you submit in the quote form',
          '- Any message you choose to add',
          '- Standard technical/security logs kept by our hosting provider (e.g. IP address) — this site does not use cookies or analytics'
        ].join('\n')
      },
      {
        heading: '03 / WHY WE PROCESS IT & OUR LAWFUL BASIS',
        body:
          'We use your details to respond to your quote request, arrange a site visit, and provide a written quote — this is necessary to take steps at your request before entering into a contract with you. Where you’ve given consent (see below), we rely on that consent as our lawful basis.'
      },
      {
        heading: '04 / HOW LONG WE KEEP IT',
        body: '24 months from your last contact with us, or until you ask us to delete it — whichever is sooner'
      },
      {
        heading: '05 / WHO WE SHARE IT WITH',
        body: [
          'We don’t sell your data. We share it only with the following processors, who act on our instructions:',
          '',
          '- Our website hosting provider — Storing the site and any enquiry data you submit, and keeping standard security/access logs',
          '- Our email service provider — Sending you a reply to your enquiry'
        ].join('\n')
      },
      {
        heading: '06 / YOUR RIGHTS',
        body:
          'You have the right to access, correct, erase, or restrict the data we hold about you, to object to our processing, to request a copy in a portable format, and to withdraw your consent at any time. You also have the right to complain to the Information Commissioner’s Office (ICO) if you’re unhappy with how we’ve handled your data.'
      },
      {
        heading: '07 / COOKIES',
        body:
          'This site does not use analytics or advertising cookies. The only cookie it sets is a strictly necessary sign-in cookie for our own staff when they use the website’s admin area; visitors are never given one. If that changes, this policy will be updated first.'
      }
    ],
    contactHeading: '08 / CONTACT US & COMPLAINTS',
    dataRequestPrefix: 'For data requests, contact',
    icoPrefix: 'Our ICO registration number is',
    complaintText: 'You can also complain to the Information Commissioner’s Office at ico.org.uk.'
  },

  notFound: {
    label: 'ERR.404',
    heading: 'Page not found',
    text: 'That page doesn’t exist, or the project may have been taken down.',
    button: 'Back to the homepage'
  },

  seo: {
    title: 'RNK2 Properties Ltd — Design & Build Residential Builder',
    description:
      'RNK2 Properties Ltd — residential extensions, conversions and new builds. One team, from architectural drawings to a finished, guaranteed build.',
    shareTitle: 'RNK2 Properties Ltd — We design it and build it',
    shareDescription:
      'Residential extensions, conversions and new builds. One team, from architectural drawings to a finished, guaranteed build.',
    shareImage: null,
    projectTitleSuffix: '— RNK2 Properties Ltd'
  }
}
