/**
 * SITE CONFIG — PLACEHOLDER VALUES
 * -----------------------------------------------------------------------
 * Every company-specific fact used across the site lives here. Swap these
 * for RNK2 Properties Ltd's real figures/copy before going live — nothing
 * else in the codebase needs to change.
 * -----------------------------------------------------------------------
 */
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
      duration: '16 weeks',
      brief:
        'A growing family needed a bigger kitchen and a proper family room, without losing the garden or the character of a 1930s house next to the river.',
      approach:
        'We drew up a double-storey rear extension in-house, took it through planning and building regulations, and built it with our own site team — widening the kitchen into a full open-plan living space downstairs and adding a fifth bedroom above.'
    },
    {
      slug: 'oakfield-loft-conversion',
      title: 'Oakfield Loft Conversion',
      type: 'Loft conversion',
      spec: 'Dormer loft · 2 additional bedrooms',
      image: '/images/work-2.jpg',
      location: 'Caversham, Reading',
      duration: '10 weeks',
      brief:
        'An unused loft space with just enough headroom to be worth converting — the client wanted two extra bedrooms and an en suite without a full house move.',
      approach:
        'A rear dormer gave us the head height and floor area for two bedrooms and a shower room. Structural calculations, building regs, and steelwork were handled in-house alongside the build, so the whole project ran as one continuous programme.'
    },
    {
      slug: 'the-beechwood-house',
      title: 'The Beechwood House',
      type: 'New build',
      spec: '4-bed · New build',
      image: '/images/work-3.jpg',
      location: 'Sonning Common, Oxfordshire',
      duration: '38 weeks',
      brief:
        'A self-build plot with outline planning permission already in place — the client needed detailed drawings, a full planning application, and a builder to see it through to completion.',
      approach:
        'We developed the design from initial sketch to full working drawings, secured detailed planning and building regs approval, then built the four-bedroom home on a fixed price and a fixed programme, with the same team involved from the first drawing to the final handover.'
    },
    {
      slug: 'mill-lane-garage-conversion',
      title: 'Mill Lane Garage Conversion',
      type: 'Garage conversion',
      spec: 'Single garage · Home office',
      image: '/images/work-4.jpg',
      location: 'Henley-on-Thames, Oxfordshire',
      duration: '6 weeks',
      brief:
        'A single garage that had become storage space, wanted back as a proper home office — insulated, heated, and separated from the rest of the house.',
      approach:
        'We insulated and re-floored the garage, added a partition wall, ran power and heating, and replaced the garage door with a matching window and rendered wall — turning it into a self-contained office in six weeks.'
    }
  ]
}
