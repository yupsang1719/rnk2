import { Router } from 'express'
import Project, { toPublicProject } from '../models/Project.js'
import { getSettings, toPublicSettings } from '../models/Settings.js'

const router = Router()

// Everything the public site needs in one request: company settings plus
// published projects only. Drafts are never sent to the public site.
router.get('/', async (_req, res) => {
  try {
    const [settings, projects] = await Promise.all([
      getSettings(),
      Project.find({ published: true }).sort({ sortOrder: 1, createdAt: -1 })
    ])
    res.set('Cache-Control', 'no-cache')
    res.json({
      ok: true,
      settings: toPublicSettings(settings),
      projects: projects.map(toPublicProject)
    })
  } catch (err) {
    console.error('Failed to load site data:', err)
    res.status(500).json({ ok: false, error: 'Could not load site content.' })
  }
})

export default router
