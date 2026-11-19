import { CONTENT_SCHEMA } from './schema.js'
import { CONTENT_DEFAULTS } from './defaults.js'

// eslint-disable-next-line no-control-regex
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g

const clone = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)))
const isObject = (v) => v && typeof v === 'object' && !Array.isArray(v)

function cleanString(value, field) {
  let s = typeof value === 'string' ? value : ''
  s = s.replace(CONTROL_RE, '').replace(/\r\n?/g, '\n')
  if (field.type === 'text') s = s.replace(/\s*\n\s*/g, ' ')
  else s = s.replace(/\n{3,}/g, '\n\n')
  return s.trim()
}

function cleanItem(fields, src, base, path, ctx) {
  // Start from the original item so fixed, non-editable parts (a menu
  // link's destination, a card's icon) always survive.
  const out = clone(base) || {}
  for (const f of fields) out[f.key] = cleanField(f, src?.[f.key], base?.[f.key], path, ctx)
  return out
}

/**
 * Clean one field against its schema definition. Problems a person needs
 * to fix before publishing are pushed to `ctx.problems`.
 */
function cleanField(field, value, fallback, path, ctx) {
  const where = [...path, field.label].join(' → ')
  if (value === undefined) value = clone(fallback)

  switch (field.type) {
    case 'text':
    case 'textarea':
    case 'richtext': {
      let s = cleanString(value, field)
      if (field.max && s.length > field.max) {
        ctx.problems.push(`${where}: shorten to ${field.max} characters (now ${s.length}).`)
        s = s.slice(0, field.max)
      }
      if (!field.optional && !s) ctx.problems.push(`${where}: can’t be empty.`)
      return s
    }
    case 'image':
      if (!isObject(value) || !ctx.isOwnImage(value)) return null
      return { url: String(value.url), thumbUrl: String(value.thumbUrl || value.url) }
    case 'list': {
      const items = Array.isArray(value) ? value : []
      const label = (i) => [...path, field.label, `${field.itemLabel || 'Item'} ${i + 1}`]
      if (field.fixed) {
        // Same items as the original copy, always: only their wording changes.
        const base = Array.isArray(fallback) ? fallback : []
        return base.map((b, i) => cleanItem(field.fields, isObject(items[i]) ? items[i] : b, b, label(i), ctx))
      }
      const max = field.max ?? 20
      if (items.length > max) ctx.problems.push(`${where}: at most ${max}.`)
      return items.slice(0, max).map((item, i) => cleanItem(field.fields, isObject(item) ? item : {}, {}, label(i), ctx))
    }
    default:
      return clone(fallback)
  }
}

/**
 * Bring stored or submitted content in line with the schema: unknown keys
 * dropped, non-editable parts and missing fields taken from the original
 * copy, everything trimmed to its limits. Returns `{ content, problems }`.
 */
export function normalizeContent(raw, { isOwnImage = () => false } = {}) {
  const src = isObject(raw) ? raw : {}
  const ctx = { problems: [], isOwnImage }
  const content = {}
  for (const section of CONTENT_SCHEMA) {
    const sectionSrc = isObject(src[section.key]) ? src[section.key] : {}
    const sectionDefaults = CONTENT_DEFAULTS[section.key] || {}
    content[section.key] = clone(sectionDefaults)
    for (const field of section.fields) {
      content[section.key][field.key] = cleanField(
        field,
        sectionSrc[field.key],
        sectionDefaults[field.key],
        [section.title],
        ctx
      )
    }
  }
  return { content, problems: ctx.problems }
}
