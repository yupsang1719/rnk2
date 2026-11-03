import { Router } from 'express'
import Project from '../models/Project.js'
import { config } from '../config.js'

const router = Router()

const siteUrl = () => config.siteUrl.replace(/\/$/, '')

const escapeXml = (s) =>
  String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c])

router.get('/robots.txt', (_req, res) => {
  res.type('text/plain').set('Cache-Control', 'public, max-age=3600').send(
    ['User-agent: *', 'Disallow: /admin', 'Disallow: /api/', '', `Sitemap: ${siteUrl()}/sitemap.xml`, ''].join('\n')
  )
})

// Homepage, privacy policy and every published project. Drafts are never listed.
router.get('/sitemap.xml', async (_req, res, next) => {
  try {
    const projects = await Project.find({ published: true }, { slug: 1, updatedAt: 1 }).sort({ sortOrder: 1 }).lean()
    const latest = projects.reduce((max, p) => (p.updatedAt > max ? p.updatedAt : max), new Date(0))
    const urls = [
      { loc: '/', lastmod: projects.length ? latest : null },
      { loc: '/privacy-policy' },
      ...projects.map((p) => ({ loc: `/work/${encodeURIComponent(p.slug)}`, lastmod: p.updatedAt }))
    ]
    const body = urls
      .map(
        (u) =>
          `  <url><loc>${escapeXml(siteUrl() + u.loc)}</loc>${
            u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString().slice(0, 10)}</lastmod>` : ''
          }</url>`
      )
      .join('\n')
    res
      .type('application/xml')
      .set('Cache-Control', 'public, max-age=3600')
      .send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`)
  } catch (err) {
    next(err)
  }
})

export default router
