import { Router } from 'express'
import multer from 'multer'
import mongoose from 'mongoose'
import Project, {
  BUDGET_TIERS,
  COUNTIES,
  PROJECT_TYPES,
  publishProblems
} from '../models/Project.js'
import { EDITABLE_SETTINGS, getSettings, toPublicSettings } from '../models/Settings.js'
import User, { MIN_PASSWORD_LENGTH } from '../models/User.js'
import Quote from '../models/Quote.js'
import { requireAdminHeader, requireAuth } from '../middleware/auth.js'
import { deleteRemovedImages, isOwnUpload, processImage } from '../lib/images.js'
import { geocodeTown } from '../lib/geocode.js'
import { uniqueSlug } from '../lib/slug.js'

const router = Router()
router.use(requireAuth, requireAdminHeader)

const isId = (id) => mongoose.isValidObjectId(id)
const notFound = (res) => res.status(404).json({ ok: false, error: 'Not found.' })

// ---------------------------------------------------------------- options
router.get('/options', (_req, res) => {
  res.json({ ok: true, projectTypes: PROJECT_TYPES, counties: COUNTIES, budgetTiers: BUDGET_TIERS })
})

// ---------------------------------------------------------------- uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    cb(null, /^image\//.test(file.mimetype))
  }
})

router.post('/uploads', (req, res) => {
  upload.single('photo')(req, res, async (err) => {
    if (err) {
      const msg = err.code === 'LIMIT_FILE_SIZE' ? 'That photo is over 25MB.' : 'Upload failed.'
      return res.status(400).json({ ok: false, error: msg })
    }
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'Please choose a photo (JPG, PNG or WebP).' })
    }
    try {
      const image = await processImage(req.file.buffer)
      return res.status(201).json({ ok: true, image: { ...image, alt: '' } })
    } catch (e) {
      console.warn('Image processing failed:', e.message)
      const heic = /\.(heic|heif)$/i.test(req.file.originalname)
      const error = heic
        ? `“${req.file.originalname}” is an iPhone HEIC photo, which can’t be read here. Export it as JPG first (or upload it from the iPhone itself, which converts it automatically).`
        : `“${req.file.originalname}” couldn’t be read as a photo.`
      return res.status(400).json({ ok: false, error })
    }
  })
})

// ---------------------------------------------------------------- projects
function cleanImage(img) {
  if (!isOwnUpload(img)) return null
  return {
    url: img.url,
    thumbUrl: img.thumbUrl,
    alt: typeof img.alt === 'string' ? img.alt.trim().slice(0, 200) : '',
    width: Number(img.width) || undefined,
    height: Number(img.height) || undefined
  }
}

const TEXT_FIELDS = ['title', 'spec', 'town', 'duration', 'costBand', 'brief', 'approach', 'result']

function pickProjectFields(body) {
  const out = {}
  for (const k of TEXT_FIELDS) {
    if (k in body) out[k] = typeof body[k] === 'string' ? body[k].trim() : ''
  }
  if ('type' in body) out.type = PROJECT_TYPES.includes(body.type) ? body.type : ''
  if ('county' in body) out.county = COUNTIES.includes(body.county) ? body.county : ''
  if ('budgetTier' in body) {
    const n = Number(body.budgetTier)
    out.budgetTier = BUDGET_TIERS.includes(n) ? n : null
  }
  if (Array.isArray(body.timeline)) {
    out.timeline = body.timeline
      .slice(0, 10)
      .filter((s) => s && typeof s.label === 'string' && s.label.trim())
      .map((s) => ({
        label: s.label.trim().slice(0, 80),
        duration: typeof s.duration === 'string' ? s.duration.trim().slice(0, 40) : ''
      }))
  }
  if (Array.isArray(body.images)) {
    out.images = body.images.slice(0, 40).map(cleanImage).filter(Boolean)
  }
  if ('beforeImage' in body) out.beforeImage = body.beforeImage ? cleanImage(body.beforeImage) : null
  if ('published' in body) out.published = body.published === true
  return out
}

function adminProject(p) {
  const obj = p.toObject({ versionKey: false })
  obj.id = String(p._id)
  delete obj._id
  obj.publishProblems = publishProblems(p)
  return obj
}

function validationMessage(err) {
  if (err.code === 11000) return 'Another project already uses that name.'
  const first = Object.values(err.errors || {})[0]
  return first?.message || 'Some details look invalid.'
}

router.get('/projects', async (_req, res) => {
  const projects = await Project.find().sort({ sortOrder: 1, createdAt: -1 })
  res.json({ ok: true, projects: projects.map(adminProject) })
})

router.get('/projects/:id', async (req, res) => {
  if (!isId(req.params.id)) return notFound(res)
  const p = await Project.findById(req.params.id)
  if (!p) return notFound(res)
  res.json({ ok: true, project: adminProject(p) })
})

async function applyLocation(project, changedLocation) {
  const missing = !project.coords || typeof project.coords.lat !== 'number'
  if (!project.town) {
    project.coords = undefined
    project.coordsLabel = ''
    return
  }
  if (!changedLocation && !missing) return
  const found = await geocodeTown(project.town, project.county)
  if (found) {
    project.coords = { lat: found.lat, lng: found.lng }
    project.coordsLabel = found.label
  } else {
    project.coords = undefined
    project.coordsLabel = ''
  }
}

router.post('/projects', async (req, res) => {
  const fields = pickProjectFields(req.body || {})
  if (!fields.title) return res.status(400).json({ ok: false, error: 'Give the project a name.' })
  try {
    const first = await Project.findOne().sort({ sortOrder: 1 }).select('sortOrder')
    const project = new Project({
      ...fields,
      published: false,
      slug: await uniqueSlug(fields.title),
      sortOrder: first ? first.sortOrder - 1 : 0
    })
    await applyLocation(project, true)
    if (req.body?.published === true) {
      const problems = publishProblems(project)
      if (problems.length === 0) project.published = true
    }
    await project.save()
    res.status(201).json({ ok: true, project: adminProject(project) })
  } catch (err) {
    res.status(400).json({ ok: false, error: validationMessage(err) })
  }
})

router.put('/projects/:id', async (req, res) => {
  if (!isId(req.params.id)) return notFound(res)
  const project = await Project.findById(req.params.id)
  if (!project) return notFound(res)

  const fields = pickProjectFields(req.body || {})
  if ('title' in fields && !fields.title) {
    return res.status(400).json({ ok: false, error: 'Give the project a name.' })
  }

  const oldImages = [...project.images.map((i) => i.toObject()), project.beforeImage?.toObject?.()]
  const locationChanged =
    ('town' in fields && fields.town !== project.town) ||
    ('county' in fields && fields.county !== project.county)
  const titleChanged = 'title' in fields && fields.title !== project.title

  project.set(fields)
  if (titleChanged && !project.published) project.slug = await uniqueSlug(project.title, project._id)

  if (project.published) {
    const problems = publishProblems(project)
    if (problems.length) {
      return res.status(400).json({
        ok: false,
        error: `To show this project on the website, add: ${problems.join(', ')}.`
      })
    }
  }

  try {
    await applyLocation(project, locationChanged)
    await project.save()
    await deleteRemovedImages(oldImages, [...project.images, project.beforeImage])
    res.json({ ok: true, project: adminProject(project) })
  } catch (err) {
    res.status(400).json({ ok: false, error: validationMessage(err) })
  }
})

router.put('/projects-order', async (req, res) => {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids.filter(isId) : []
  await Promise.all(ids.map((id, i) => Project.updateOne({ _id: id }, { $set: { sortOrder: i } })))
  res.json({ ok: true })
})

router.delete('/projects/:id', async (req, res) => {
  if (!isId(req.params.id)) return notFound(res)
  const project = await Project.findByIdAndDelete(req.params.id)
  if (!project) return notFound(res)
  await deleteRemovedImages([...project.images, project.beforeImage], [])
  res.json({ ok: true })
})

// ---------------------------------------------------------------- settings
router.get('/settings', async (_req, res) => {
  const s = await getSettings()
  const out = toPublicSettings(s)
  out.heroImage = s.heroImage || null
  res.json({ ok: true, settings: out })
})

router.put('/settings', async (req, res) => {
  const s = await getSettings()
  const body = req.body || {}
  const oldHero = s.heroImage ? [s.heroImage.toObject?.() || s.heroImage] : []
  for (const k of EDITABLE_SETTINGS) {
    if (!(k in body)) continue
    if (k === 'fullyInsured') s.fullyInsured = body.fullyInsured === true
    else if (k === 'heroImage') s.heroImage = body.heroImage && isOwnUpload(body.heroImage)
      ? { url: body.heroImage.url, thumbUrl: body.heroImage.thumbUrl }
      : null
    else s[k] = typeof body[k] === 'string' ? body[k].trim() : ''
  }
  try {
    await s.save()
    await deleteRemovedImages(oldHero, s.heroImage ? [s.heroImage] : [])
    const out = toPublicSettings(s)
    out.heroImage = s.heroImage || null
    res.json({ ok: true, settings: out })
  } catch (err) {
    res.status(400).json({ ok: false, error: validationMessage(err) })
  }
})

// ---------------------------------------------------------------- enquiries
router.get('/quotes', async (_req, res) => {
  const quotes = await Quote.find().sort({ createdAt: -1 }).limit(500)
  res.json({
    ok: true,
    quotes: quotes.map((q) => ({
      id: String(q._id),
      name: q.name,
      email: q.email,
      phone: q.phone,
      projectType: q.projectType,
      postcode: q.postcode,
      message: q.message,
      createdAt: q.createdAt
    }))
  })
})

router.delete('/quotes/:id', async (req, res) => {
  if (!isId(req.params.id)) return notFound(res)
  const q = await Quote.findByIdAndDelete(req.params.id)
  if (!q) return notFound(res)
  res.json({ ok: true })
})

// ---------------------------------------------------------------- users
router.get('/users', async (_req, res) => {
  const users = await User.find().sort({ createdAt: 1 })
  res.json({ ok: true, users: users.map((u) => u.toSafeJSON()) })
})

router.post('/users', async (req, res) => {
  const { name, email, password } = req.body || {}
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    return res
      .status(400)
      .json({ ok: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` })
  }
  try {
    const user = new User({ name, email })
    await user.setPassword(password)
    await user.save()
    res.status(201).json({ ok: true, user: user.toSafeJSON() })
  } catch (err) {
    const error = err.code === 11000 ? 'There is already a user with that email.' : 'Enter a valid email address.'
    res.status(400).json({ ok: false, error })
  }
})

router.delete('/users/:id', async (req, res) => {
  if (!isId(req.params.id)) return notFound(res)
  if (String(req.user._id) === req.params.id) {
    return res.status(400).json({ ok: false, error: 'You can’t remove your own account.' })
  }
  const u = await User.findByIdAndDelete(req.params.id)
  if (!u) return notFound(res)
  res.json({ ok: true })
})

export default router
