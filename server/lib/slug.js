import Project from '../models/Project.js'

export function slugify(text) {
  return String(text || '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'project'
}

export async function uniqueSlug(title, excludeId) {
  const base = slugify(title)
  let slug = base
  for (let n = 2; ; n++) {
    const clash = await Project.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })
    if (!clash) return slug
    slug = `${base}-${n}`
  }
}
