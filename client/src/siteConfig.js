/**
 * SITE CONFIG — PLACEHOLDER VALUES
 * -----------------------------------------------------------------------
 * Every company-specific fact used across the site lives here. Swap these
 * for RNK2 Properties Ltd's real figures/copy before going live — nothing
 * else in the codebase needs to change.
 * -----------------------------------------------------------------------
 */

// Shared "before" placeholder for the before/after slider — every project
// currently points at the same generic under-construction photo (hero.jpg,
// CC0). Swap for real per-project before-construction photography before
// launch, same as every other photo on the site (see README photo table).
const BEFORE_PLACEHOLDER = {
  src: '/images/hero.jpg',
  alt: 'Property before construction work began'
}

export const site = {
  region: 'SOUTH EAST ENGLAND',
  establishedYear: '2011',

  hero: {
    image: '/images/hero.jpg'
  },

  stats: {
    yearsEstablished: '13',
    projectsCompleted: '210+',
    guaranteeYears: '10',
    onTimePercent: '96%'
  },

  trackRecord: {
    yearsBuilding: '13 YRS',
    projectsCompleted: '210+',
    guarantee: '10 YR GUARANTEE',
    insured: 'FULLY INSURED'
  },

  contact: {
    phone: '01234 567 890',
    email: 'enquiries@rnk2properties.co.uk',
    addressLine: 'Unit 4, Riverside Business Park, Reading, RG1 8EX'
  },

  company: {
    registrationNo: '12345678',
    areasCovered: 'Berkshire, Oxfordshire, Surrey & Hampshire'
  },

  legal: {
    icoRegistrationNo: 'ZA123456', // placeholder — real ICO register number (ico.org.uk/ESDWebPages/Search)
    privacyEmail: 'privacy@rnk2properties.co.uk', // placeholder — dedicated data-requests contact
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
    policyUpdated: '30 September 2026'
  },

  testimonial: {
    quote:
      'They designed it, drew it up, sorted planning, and built it — we never had to be the ones chasing between an architect and a builder. It just happened.',
    name: 'Sarah & Michael Thompson',
    town: 'Wokingham, Berkshire'
  },

  work: [
    {
      slug: 'riverside-extension',
      title: 'The Riverside Extension',
      type: 'Rear extension',
      spec: 'Double-storey · Rear extension',
      image: '/images/work-1.jpg',
      location: 'Wargrave, Berkshire',
      county: 'Berkshire',
      duration: '16 weeks',
      brief:
        'A growing family needed a bigger kitchen and a proper family room, without losing the garden or the character of a 1930s house next to the river.',
      approach:
        'We drew up a double-storey rear extension in-house, took it through planning and building regulations, and built it with our own site team — widening the kitchen into a full open-plan living space downstairs and adding a fifth bedroom above.',
      // Placeholder gallery — only one real photo exists per project today.
      // These reuse it with distinct captions so the gallery/lightbox UI is
      // functionally real; replace with true multi-angle photography before launch.
      gallery: [
        { src: '/images/work-1.jpg', alt: 'The Riverside Extension — rear elevation' },
        { src: '/images/work-1.jpg', alt: 'The Riverside Extension — open-plan kitchen' },
        { src: '/images/work-1.jpg', alt: 'The Riverside Extension — first-floor bedroom' }
      ],
      beforeImage: BEFORE_PLACEHOLDER,
      costBand: '£85,000 – £110,000',
      budgetTier: 2, // 1 = under £30k, 2 = £30k–£150k, 3 = £150k+ (sort bucket only, not a display string)
      timeline: [
        { label: 'Design & planning', duration: '3 weeks' },
        { label: 'Approvals (planning & building regs)', duration: '4 weeks' },
        { label: 'Construction', duration: '8 weeks' },
        { label: 'Handover', duration: '1 week' }
      ],
      result: '+28m² of living space across two storeys, including a fifth bedroom.',
      // Approximate town centroid — matches the precision of `location`/`county`
      // (town-level only, no street address is ever stored here). A small
      // deterministic offset is applied at render time (see utils/geoJitter.js)
      // purely so same-town pins don't stack before zooming in.
      coords: { lat: 51.4886, lng: -0.8686 }
    },
    {
      slug: 'oakfield-loft-conversion',
      title: 'Oakfield Loft Conversion',
      type: 'Loft conversion',
      spec: 'Dormer loft · 2 additional bedrooms',
      image: '/images/work-2.jpg',
      location: 'Caversham, Reading',
      county: 'Reading',
      duration: '10 weeks',
      brief:
        'An unused loft space with just enough headroom to be worth converting — the client wanted two extra bedrooms and an en suite without a full house move.',
      approach:
        'A rear dormer gave us the head height and floor area for two bedrooms and a shower room. Structural calculations, building regs, and steelwork were handled in-house alongside the build, so the whole project ran as one continuous programme.',
      gallery: [
        { src: '/images/work-2.jpg', alt: 'Oakfield Loft Conversion — dormer exterior' },
        { src: '/images/work-2.jpg', alt: 'Oakfield Loft Conversion — new bedroom' },
        { src: '/images/work-2.jpg', alt: 'Oakfield Loft Conversion — en suite shower room' }
      ],
      beforeImage: BEFORE_PLACEHOLDER,
      costBand: '£55,000 – £70,000',
      budgetTier: 2,
      timeline: [
        { label: 'Design & planning', duration: '2 weeks' },
        { label: 'Approvals (planning & building regs)', duration: '2 weeks' },
        { label: 'Construction', duration: '5 weeks' },
        { label: 'Handover', duration: '1 week' }
      ],
      result: '+2 bedrooms and an en suite, added within the existing roofline.',
      coords: { lat: 51.4718, lng: -0.9679 }
    },
    {
      slug: 'the-beechwood-house',
      title: 'The Beechwood House',
      type: 'New build',
      spec: '4-bed · New build',
      image: '/images/work-3.jpg',
      location: 'Sonning Common, Oxfordshire',
      county: 'Oxfordshire',
      duration: '38 weeks',
      brief:
        'A self-build plot with outline planning permission already in place — the client needed detailed drawings, a full planning application, and a builder to see it through to completion.',
      approach:
        'We developed the design from initial sketch to full working drawings, secured detailed planning and building regs approval, then built the four-bedroom home on a fixed price and a fixed programme, with the same team involved from the first drawing to the final handover.',
      gallery: [
        { src: '/images/work-3.jpg', alt: 'The Beechwood House — front elevation' },
        { src: '/images/work-3.jpg', alt: 'The Beechwood House — living space' },
        { src: '/images/work-3.jpg', alt: 'The Beechwood House — garden aspect' }
      ],
      beforeImage: BEFORE_PLACEHOLDER,
      costBand: '£340,000 – £395,000',
      budgetTier: 3,
      timeline: [
        { label: 'Design & planning', duration: '6 weeks' },
        { label: 'Approvals (planning & building regs)', duration: '6 weeks' },
        { label: 'Construction', duration: '24 weeks' },
        { label: 'Handover', duration: '2 weeks' }
      ],
      result: '1,850 sq ft four-bedroom home delivered on a fixed price and programme.',
      coords: { lat: 51.5237, lng: -0.9179 }
    },
    {
      slug: 'mill-lane-garage-conversion',
      title: 'Mill Lane Garage Conversion',
      type: 'Garage conversion',
      spec: 'Single garage · Home office',
      image: '/images/work-4.jpg',
      location: 'Henley-on-Thames, Oxfordshire',
      county: 'Oxfordshire',
      duration: '6 weeks',
      brief:
        'A single garage that had become storage space, wanted back as a proper home office — insulated, heated, and separated from the rest of the house.',
      approach:
        'We insulated and re-floored the garage, added a partition wall, ran power and heating, and replaced the garage door with a matching window and rendered wall — turning it into a self-contained office in six weeks.',
      gallery: [
        { src: '/images/work-4.jpg', alt: 'Mill Lane Garage Conversion — exterior with new window' },
        { src: '/images/work-4.jpg', alt: 'Mill Lane Garage Conversion — home office interior' },
        { src: '/images/work-4.jpg', alt: 'Mill Lane Garage Conversion — insulated ceiling detail' }
      ],
      beforeImage: BEFORE_PLACEHOLDER,
      costBand: '£18,000 – £25,000',
      budgetTier: 1,
      timeline: [
        { label: 'Design & planning', duration: '1 week' },
        { label: 'Approvals (building regs)', duration: '1 week' },
        { label: 'Construction', duration: '3 weeks' },
        { label: 'Handover', duration: '1 week' }
      ],
      result: '18m² reclaimed as a fully insulated, heated home office.',
      coords: { lat: 51.5360, lng: -0.9026 }
    }
  ]
}
