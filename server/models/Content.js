import mongoose from 'mongoose'
import { CONTENT_DEFAULTS } from '../../shared/content/defaults.js'
import { normalizeContent } from '../../shared/content/normalize.js'
import { isOwnUpload } from '../lib/images.js'
import Settings from './Settings.js'

// How many previously published versions to keep for "restore".
export const MAX_VERSIONS = 20

const Mixed = mongoose.Schema.Types.Mixed

// One document holds the editable website copy: what the public sees
// (`published`) and what the CMS is working on (`draft`).
const contentSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'site', unique: true },
    draft: { type: Mixed, default: null },
    published: { type: Mixed, default: null },
    draftUpdatedAt: Date,
    draftUpdatedBy: { type: String, default: '' },
    publishedAt: Date,
    publishedBy: { type: String, default: '' }
  },
  { minimize: false }
)

const versionSchema = new mongoose.Schema(
  {
    content: { type: Mixed, required: true },
    publishedAt: { type: Date, required: true },
    publishedBy: { type: String, default: '' }
  },
  { minimize: false }
)
versionSchema.index({ publishedAt: -1 })

const Content = mongoose.model('Content', contentSchema)
export const ContentVersion = mongoose.model('ContentVersion', versionSchema)

export const clean = (raw) => normalizeContent(raw, { isOwnImage: isOwnUpload })

// First run: start from the original copy, carrying over the hero photo and
// review that used to live under Company details.
async function initialContent() {
  const content = JSON.parse(JSON.stringify(CONTENT_DEFAULTS))
  const s = await Settings.findOne({ key: 'site' }).lean()
  if (s?.heroImage?.url) content.hero.image = { url: s.heroImage.url, thumbUrl: s.heroImage.thumbUrl }
  if (s?.testimonialQuote) {
    content.testimonials.items = [
      { quote: s.testimonialQuote, name: s.testimonialName || '', town: s.testimonialTown || '' }
    ]
  }
  return clean(content).content
}

export async function getContentDoc() {
  let doc = await Content.findOne({ key: 'site' })
  if (doc) return doc
  const content = await initialContent()
  try {
    doc = await Content.create({
      key: 'site',
      draft: content,
      published: content,
      draftUpdatedAt: new Date(),
      publishedAt: new Date(),
      publishedBy: 'Original website copy'
    })
  } catch (err) {
    // Another request created it at the same moment.
    if (err.code !== 11000) throw err
    doc = await Content.findOne({ key: 'site' })
  }
  return doc
}

// The public site reads published content on every page view, so keep the
// cleaned copy in memory and refresh it whenever something is published.
let publishedCache = null

export async function getPublishedContent() {
  if (publishedCache) return publishedCache
  const doc = await getContentDoc()
  publishedCache = clean(doc.published).content
  return publishedCache
}

export function clearPublishedCache() {
  publishedCache = null
}

export default Content
