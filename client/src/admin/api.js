// Thin fetch wrapper for the CMS API. Every admin request carries the
// X-RNK2-Admin header, which the server requires on writes (CSRF guard).

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

let onUnauthorized = () => {}
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn
}

export async function api(path, { method = 'GET', body, form } = {}) {
  const headers = { 'X-RNK2-Admin': '1' }
  let payload
  if (form) payload = form
  else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  let res
  try {
    res = await fetch(`/api${path}`, { method, headers, body: payload, credentials: 'same-origin' })
  } catch {
    throw new ApiError('Can’t reach the server. Check your internet connection and try again.', 0)
  }

  let data = {}
  try {
    data = await res.json()
  } catch {
    // Non-JSON (e.g. proxy error page) — fall through with a generic message.
  }

  if (res.status === 401 && !path.startsWith('/auth/login')) onUnauthorized()
  if (!res.ok || data.ok === false) {
    throw new ApiError(data.error || 'Something went wrong. Please try again.', res.status)
  }
  return data
}

// Phone photos are often 5–15MB. Shrinking them in the browser first makes
// uploads much faster on site/mobile connections. The server still re-encodes
// everything, so this is purely a speed-up and falls back to the original.
async function shrinkForUpload(file) {
  const resizable = /^image\/(jpeg|png|webp)$/.test(file.type)
  if (!resizable || file.size < 2.5 * 1024 * 1024 || typeof createImageBitmap !== 'function') return file
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    const max = 2600
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close?.()
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9))
    if (!blob || blob.size >= file.size) return file
    return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch {
    return file
  }
}

export async function uploadPhoto(file) {
  const form = new FormData()
  form.append('photo', await shrinkForUpload(file))
  const data = await api('/admin/uploads', { method: 'POST', form })
  return data.image
}
