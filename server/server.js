import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import mongoose from 'mongoose'
import { config } from './config.js'
import quotesRouter from './routes/quotes.js'
import siteRouter from './routes/site.js'
import authRouter from './routes/auth.js'
import adminRouter from './routes/admin.js'
import seoRouter from './routes/seo.js'
import { ensureUploadDir } from './lib/images.js'

const app = express()

app.disable('x-powered-by')
app.set('trust proxy', /^\d+$/.test(config.trustProxy) ? Number(config.trustProxy) : config.trustProxy)

// One canonical address: send www.example.com to example.com so search
// engines don't index the site twice.
if (config.isProduction) {
  app.use((req, res, next) => {
    const host = req.hostname
    if (host && host.startsWith('www.')) {
      return res.redirect(301, `${req.protocol}://${host.slice(4)}${req.originalUrl}`)
    }
    next()
  })
}

// gzip text responses (HTML, JS, CSS, JSON, SVG). Images, WebP photos and
// map tiles are already compressed and are skipped automatically.
app.use(compression())

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        // MapLibre spins up its worker from a blob: URL.
        workerSrc: ["'self'", 'blob:'],
        childSrc: ["'self'", 'blob:'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: config.isProduction ? [] : null
      }
    },
    crossOriginEmbedderPolicy: false
  })
)

app.use(cors({ origin: config.clientOrigin, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, status: 'RNK2 Properties API is running' })
})

app.use('/api/quotes', quotesRouter)
app.use('/api/site', siteRouter)
app.use('/api/auth', authRouter)
app.use('/api/admin', (_req, res, next) => {
  res.set('X-Robots-Tag', 'noindex, nofollow')
  res.set('Cache-Control', 'no-store')
  next()
}, adminRouter)

app.use('/api', (_req, res) => {
  res.status(404).json({ ok: false, error: 'Not found.' })
})

// robots.txt and sitemap.xml, built from the published projects.
app.use(seoRouter)

// Uploaded project photos. File names are random and never reused, so they
// can be cached for a long time.
app.use(
  '/uploads',
  express.static(config.uploadDir, { maxAge: '365d', immutable: true, index: false, fallthrough: false })
)

// Serve the built React app from this same process when it exists (production).
const indexHtml = path.join(config.clientDist, 'index.html')
if (fs.existsSync(indexHtml)) {
  // Link-preview tags (WhatsApp, Facebook, LinkedIn) need absolute URLs, so
  // the site address is filled in here rather than baked into the build.
  const indexContent = fs
    .readFileSync(indexHtml, 'utf8')
    .replaceAll('__SITE_URL__', config.siteUrl.replace(/\/$/, ''))

  app.use(
    express.static(config.clientDist, {
      index: false,
      setHeaders(res, filePath) {
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
        }
      }
    })
  )
  // SPA fallback so /work/:slug and /admin/* survive a refresh.
  app.get('*', (req, res) => {
    if (req.path.startsWith('/admin')) res.set('X-Robots-Tag', 'noindex, nofollow')
    res.set('Cache-Control', 'no-cache')
    res.type('html').send(indexContent)
  })
  console.log(`Serving client build from ${config.clientDist}`)
}

app.use((err, _req, res, _next) => {
  // Client errors from static files (missing file, "../" probes from bots,
  // malformed URLs) are not server faults: answer 404 and don't log a stack.
  const status = err.status || err.statusCode
  if ((status >= 400 && status < 500) || err instanceof URIError) {
    return res.status(404).end()
  }
  console.error(err)
  res.status(500).json({ ok: false, error: 'Something went wrong.' })
})

async function start() {
  try {
    await ensureUploadDir()
    await mongoose.connect(config.mongoUri)
    console.log('Connected to MongoDB')
    app.listen(config.port, () => {
      console.log(`RNK2 Properties listening on http://localhost:${config.port}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err.message)
    process.exit(1)
  }
}

start()
