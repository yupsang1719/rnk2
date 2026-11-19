import { Router } from 'express'
import Project, { toPublicProject } from '../models/Project.js'
import { getSettings, toPublicSettings } from '../models/Settings.js'
import { clean, getContentDoc, getPublishedContent } from '../models/Content.js'
import { userFromRequest } from '../middleware/auth.js'

const router = Router()

// Everything the public site needs in one request: company settings, site
// copy and published projects only. Drafts are never sent to the public site.
// A signed-in admin can ask for the draft copy with ?preview=1.
router.get('/', async (req, res) => {
  try {
    const preview = req.query.preview === '1' && (await userFromRequest(req))
    const [settings, projects, content] = await Promise.all([
      getSettings(),
      Project.find({ published: true }).sort({ sortOrder: 1, createdAt: -1 }),
      preview ? getContentDoc().then((doc) => clean(doc.draft).content) : getPublishedContent()
    ])
    res.set('Cache-Control', preview ? 'no-store' : 'no-cache')
    res.json({
      ok: true,
      preview: Boolean(preview),
      settings: toPublicSettings(settings),
      content,
      projects: projects.map(toPublicProject)
    })
  } catch (err) {
    console.error('Failed to load site data:', err)
    res.status(500).json({ ok: false, error: 'Could not load site content.' })
  }
})

export default router
