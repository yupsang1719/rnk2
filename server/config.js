import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isProduction = process.env.NODE_ENV === 'production'

function required(name, devFallback) {
  const value = process.env[name]
  if (value) return value
  if (isProduction) {
    console.error(`Missing required environment variable ${name}. See server/.env.example.`)
    process.exit(1)
  }
  return devFallback
}

const jwtSecret = required('JWT_SECRET', 'dev-only-insecure-secret-change-me')
if (isProduction && jwtSecret.length < 32) {
  console.error('JWT_SECRET must be at least 32 characters in production.')
  process.exit(1)
}

export const config = {
  isProduction,
  port: Number(process.env.PORT) || 5001,
  mongoUri: required('MONGODB_URI', 'mongodb://127.0.0.1:27017/rnk2-properties'),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  // Public address of the site, used in the sitemap and link-preview tags.
  siteUrl: process.env.SITE_URL || process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  jwtSecret,
  // Where uploaded photos are written. On a host with an ephemeral filesystem,
  // point this at a persistent disk/volume or uploads will vanish on redeploy.
  uploadDir: path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, 'uploads')),
  // Built React app. Served by this same process in production.
  clientDist: path.resolve(process.env.CLIENT_DIST || path.join(__dirname, '..', 'client', 'dist')),
  trustProxy: process.env.TRUST_PROXY ?? (isProduction ? '1' : '0')
}
