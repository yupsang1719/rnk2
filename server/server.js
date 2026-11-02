import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import { config } from './config.js'
import quotesRouter from './routes/quotes.js'
import siteRouter from './routes/site.js'
import authRouter from './routes/auth.js'
import adminRouter from './routes/admin.js'
import { ensureUploadDir } from './lib/images.js'

const app = express()

app.disable('x-powered-by')
app.set('trust proxy', /^\d+$/.test(config.trustProxy) ? Number(config.trustProxy) : config.trustProxy)

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

// Uploaded project photos. File names are random and never reused, so they
// can be cached for a long time.
app.use(
  '/uploads',
  express.static(config.uploadDir, { maxAge: '365d', immutable: true, index: false, fallthrough: false })
)

// Serve the built React app from this same process when it exists (production).
const indexHtml = path.join(config.clientDist, 'index.html')
if (fs.existsSync(indexHtml)) {
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
    res.sendFile(indexHtml)
  })
  console.log(`Serving client build from ${config.clientDist}`)
}

app.use((err, _req, res, _next) => {
  if (err.status === 404) return res.status(404).end()
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
