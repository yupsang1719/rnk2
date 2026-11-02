import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import sharp from 'sharp'
import { config } from '../config.js'

const FULL_WIDTH = 2000
const THUMB_WIDTH = 640

export const UPLOAD_URL_PREFIX = '/uploads/'

export async function ensureUploadDir() {
  await fs.mkdir(config.uploadDir, { recursive: true })
}

// Re-encodes an uploaded photo to WebP at two sizes. Re-encoding also strips
// all metadata, including GPS/EXIF location from phone photos, which would
// otherwise reveal the homeowner's exact address. Throws on non-images.
export async function processImage(buffer) {
  const id = `${Date.now().toString(36)}-${crypto.randomBytes(6).toString('hex')}`
  // .rotate() applies the EXIF orientation before metadata is dropped.
  const base = sharp(buffer, { failOn: 'error', limitInputPixels: 120_000_000 }).rotate()

  const fullName = `${id}.webp`
  const thumbName = `${id}-thumb.webp`

  const full = await base
    .clone()
    .resize({ width: FULL_WIDTH, height: FULL_WIDTH, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(config.uploadDir, fullName))

  await base
    .clone()
    .resize({ width: THUMB_WIDTH, height: THUMB_WIDTH, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 76 })
    .toFile(path.join(config.uploadDir, thumbName))

  return {
    url: UPLOAD_URL_PREFIX + fullName,
    thumbUrl: UPLOAD_URL_PREFIX + thumbName,
    width: full.width,
    height: full.height
  }
}

// Only ever deletes files we created inside the upload dir.
async function deleteUploadUrl(url) {
  if (typeof url !== 'string' || !url.startsWith(UPLOAD_URL_PREFIX)) return
  const name = path.basename(url)
  if (!/^[a-z0-9-]+\.webp$/i.test(name)) return
  try {
    await fs.unlink(path.join(config.uploadDir, name))
  } catch (err) {
    if (err.code !== 'ENOENT') console.warn('Could not delete upload', name, err.message)
  }
}

export function imageUrls(images) {
  const urls = new Set()
  for (const img of images) {
    if (!img) continue
    if (img.url) urls.add(img.url)
    if (img.thumbUrl) urls.add(img.thumbUrl)
  }
  return urls
}

// Deletes files referenced by `before` that are no longer referenced by `after`.
export async function deleteRemovedImages(before, after) {
  const keep = imageUrls(after)
  const removed = [...imageUrls(before)].filter((u) => !keep.has(u))
  await Promise.all(removed.map(deleteUploadUrl))
}

export function isOwnUpload(img) {
  return (
    img &&
    typeof img.url === 'string' &&
    typeof img.thumbUrl === 'string' &&
    img.url.startsWith(UPLOAD_URL_PREFIX) &&
    img.thumbUrl.startsWith(UPLOAD_URL_PREFIX)
  )
}
