import mongoose from 'mongoose'

export const PROJECT_TYPES = [
  'Rear extension',
  'Side / wraparound extension',
  'Loft conversion',
  'Garage conversion',
  'New build',
  'Renovation / refurbishment',
  'Other'
]

export const COUNTIES = ['Berkshire', 'Reading', 'Oxfordshire', 'Surrey', 'Hampshire', 'Buckinghamshire', 'Other']

// 1 = under £30k, 2 = £30k–£150k, 3 = £150k+. Used only for "sort by budget".
export const BUDGET_TIERS = [1, 2, 3]

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    thumbUrl: { type: String, required: true },
    alt: { type: String, trim: true, maxlength: 200, default: '' },
    width: Number,
    height: Number
  },
  { _id: false }
)

const timelineStepSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, maxlength: 80, required: true },
    duration: { type: String, trim: true, maxlength: 40, default: '' }
  },
  { _id: false }
)

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true, maxlength: 120 },
    slug: { type: String, trim: true, required: true, unique: true, maxlength: 140 },
    type: { type: String, enum: [...PROJECT_TYPES, ''], default: '' },
    spec: { type: String, trim: true, maxlength: 120, default: '' },
    town: { type: String, trim: true, maxlength: 80, default: '' },
    county: { type: String, enum: [...COUNTIES, ''], default: '' },
    duration: { type: String, trim: true, maxlength: 40, default: '' },
    costBand: { type: String, trim: true, maxlength: 60, default: '' },
    budgetTier: { type: Number, enum: [...BUDGET_TIERS, null], default: null },
    brief: { type: String, trim: true, maxlength: 1500, default: '' },
    approach: { type: String, trim: true, maxlength: 2500, default: '' },
    result: { type: String, trim: true, maxlength: 300, default: '' },
    timeline: { type: [timelineStepSchema], default: [] },
    // First image is the cover photo used on cards, the map and as the "after" shot.
    images: { type: [imageSchema], default: [] },
    beforeImage: { type: imageSchema, default: null },
    // Town-level only (never a street address). Looked up from town + county on save.
    coords: {
      lat: { type: Number, min: -90, max: 90 },
      lng: { type: Number, min: -180, max: 180 }
    },
    coordsLabel: { type: String, default: '' },
    published: { type: Boolean, default: false, index: true },
    sortOrder: { type: Number, default: 0, index: true }
  },
  { timestamps: true }
)

// Anything missing from this list blocks publishing (drafts can be incomplete).
export function publishProblems(p) {
  const problems = []
  if (!p.title) problems.push('Project name')
  if (!p.type) problems.push('Project type')
  if (!p.town) problems.push('Town or village')
  if (!p.county) problems.push('County / area')
  if (!p.brief) problems.push('The brief')
  if (!p.images || p.images.length === 0) problems.push('At least one photo')
  return problems
}

// Shape consumed by the public site (matches what the components already expect).
export function toPublicProject(p) {
  const cover = p.images[0]
  const hasCoords = p.coords && typeof p.coords.lat === 'number' && typeof p.coords.lng === 'number'
  return {
    slug: p.slug,
    title: p.title,
    type: p.type,
    spec: p.spec,
    image: cover?.url || '',
    thumb: cover?.thumbUrl || '',
    location: [p.town, p.county].filter(Boolean).join(', '),
    county: p.county,
    duration: p.duration,
    costBand: p.costBand,
    budgetTier: p.budgetTier,
    brief: p.brief,
    approach: p.approach,
    result: p.result,
    timeline: p.timeline.filter((s) => s.duration),
    gallery: p.images.map((img) => ({
      src: img.url,
      thumb: img.thumbUrl,
      alt: img.alt || p.title
    })),
    beforeImage: p.beforeImage
      ? { src: p.beforeImage.url, alt: p.beforeImage.alt || `${p.title} before work began` }
      : null,
    coords: hasCoords ? { lat: p.coords.lat, lng: p.coords.lng } : null
  }
}

export default mongoose.model('Project', projectSchema)
