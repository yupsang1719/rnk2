import mongoose from 'mongoose'

// Single document holding every company-wide fact shown on the site.
// Empty fields are hidden on the public site rather than showing placeholders.
const str = (max) => ({ type: String, trim: true, maxlength: max, default: '' })

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'site', unique: true },

    region: str(60),
    establishedYear: str(4),
    projectsCompleted: str(20),
    guaranteeYears: str(4),
    onTimePercent: str(10),
    fullyInsured: { type: Boolean, default: false },
    areasCovered: str(200),

    phone: str(40),
    email: str(120),
    address: str(250),

    registrationNo: str(20),
    icoRegistrationNo: str(20),
    privacyEmail: str(120),

    testimonialQuote: str(600),
    testimonialName: str(120),
    testimonialTown: str(120),

    heroImage: {
      type: new mongoose.Schema({ url: String, thumbUrl: String }, { _id: false }),
      default: null
    }
  },
  { timestamps: true }
)

export const EDITABLE_SETTINGS = [
  'region',
  'establishedYear',
  'projectsCompleted',
  'guaranteeYears',
  'onTimePercent',
  'fullyInsured',
  'areasCovered',
  'phone',
  'email',
  'address',
  'registrationNo',
  'icoRegistrationNo',
  'privacyEmail',
  'testimonialQuote',
  'testimonialName',
  'testimonialTown',
  'heroImage'
]

const Settings = mongoose.model('Settings', settingsSchema)

export async function getSettings() {
  return Settings.findOneAndUpdate(
    { key: 'site' },
    { $setOnInsert: { key: 'site' } },
    { upsert: true, new: true }
  )
}

export function toPublicSettings(s) {
  const out = {}
  for (const k of EDITABLE_SETTINGS) out[k] = s[k] ?? ''
  out.heroImage = s.heroImage?.url || ''
  out.updatedAt = s.updatedAt
  return out
}

export default Settings
