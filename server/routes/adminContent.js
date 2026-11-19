import { Router } from 'express'
import mongoose from 'mongoose'
import { ContentVersion, MAX_VERSIONS, clean, clearPublishedCache, getContentDoc } from '../models/Content.js'

// Mounted under /api/admin/content, behind requireAuth + requireAdminHeader.
const router = Router()

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const who = (user) => user.name || user.email

async function state(doc) {
  const draft = clean(doc.draft)
  const published = clean(doc.published).content
  const versions = await ContentVersion.find({}, { publishedAt: 1, publishedBy: 1 })
    .sort({ publishedAt: -1 })
    .limit(MAX_VERSIONS)
    .lean()
  return {
    ok: true,
    draft: draft.content,
    problems: draft.problems,
    published,
    hasUnpublished: !same(draft.content, published),
    draftUpdatedAt: doc.draftUpdatedAt,
    draftUpdatedBy: doc.draftUpdatedBy,
    publishedAt: doc.publishedAt,
    publishedBy: doc.publishedBy,
    versions: versions.map((v) => ({ id: String(v._id), publishedAt: v.publishedAt, publishedBy: v.publishedBy }))
  }
}

// Refuse to overwrite a draft someone else saved after this editor loaded it.
function isStale(doc, base) {
  if (!base || !doc.draftUpdatedAt) return false
  return new Date(base).getTime() !== doc.draftUpdatedAt.getTime()
}
const staleError = (doc) => ({
  ok: false,
  stale: true,
  error: `${doc.draftUpdatedBy || 'Someone'} saved changes to the draft since you opened it. Reload the page to see them (your unsaved edits will be lost).`
})

router.get('/', async (_req, res) => {
  const doc = await getContentDoc()
  res.json(await state(doc))
})

router.put('/draft', async (req, res) => {
  const doc = await getContentDoc()
  if (isStale(doc, req.body?.baseUpdatedAt)) return res.status(409).json(staleError(doc))
  doc.draft = clean(req.body?.content).content
  doc.draftUpdatedAt = new Date()
  doc.draftUpdatedBy = who(req.user)
  doc.markModified('draft')
  await doc.save()
  res.json(await state(doc))
})

router.post('/publish', async (req, res) => {
  const doc = await getContentDoc()
  if (isStale(doc, req.body?.baseUpdatedAt)) return res.status(409).json(staleError(doc))
  const { content, problems } = clean(doc.draft)
  if (problems.length) {
    return res.status(400).json({ ok: false, error: 'Fix these before publishing:', problems })
  }
  const previous = clean(doc.published).content
  if (same(previous, content)) return res.json(await state(doc))

  await ContentVersion.create({
    content: previous,
    publishedAt: doc.publishedAt || new Date(),
    publishedBy: doc.publishedBy || ''
  })
  const old = await ContentVersion.find({}, { _id: 1 }).sort({ publishedAt: -1 }).skip(MAX_VERSIONS).lean()
  if (old.length) await ContentVersion.deleteMany({ _id: { $in: old.map((v) => v._id) } })

  doc.published = content
  doc.draft = content
  doc.publishedAt = new Date()
  doc.publishedBy = who(req.user)
  doc.markModified('published')
  doc.markModified('draft')
  await doc.save()
  clearPublishedCache()
  res.json(await state(doc))
})

router.post('/discard', async (req, res) => {
  const doc = await getContentDoc()
  doc.draft = clean(doc.published).content
  doc.draftUpdatedAt = new Date()
  doc.draftUpdatedBy = who(req.user)
  doc.markModified('draft')
  await doc.save()
  res.json(await state(doc))
})

// Restoring loads an old version into the draft; it still has to be published.
router.post('/versions/:id/restore', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ ok: false, error: 'Not found.' })
  const version = await ContentVersion.findById(req.params.id).lean()
  if (!version) return res.status(404).json({ ok: false, error: 'That version no longer exists.' })
  const doc = await getContentDoc()
  doc.draft = clean(version.content).content
  doc.draftUpdatedAt = new Date()
  doc.draftUpdatedBy = who(req.user)
  doc.markModified('draft')
  await doc.save()
  res.json(await state(doc))
})

export default router
