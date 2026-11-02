import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { config } from '../config.js'

export const COOKIE_NAME = 'rnk2_admin'
const SESSION_DAYS = 7

export function setSessionCookie(res, user) {
  const token = jwt.sign({ sub: String(user._id), v: user.tokenVersion }, config.jwtSecret, {
    expiresIn: `${SESSION_DAYS}d`
  })
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'strict',
    path: '/api',
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000
  })
}

export function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'strict',
    path: '/api'
  })
}

export async function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME]
  if (!token) return res.status(401).json({ ok: false, error: 'Please sign in.' })
  try {
    const payload = jwt.verify(token, config.jwtSecret)
    const user = await User.findById(payload.sub)
    if (!user || user.tokenVersion !== payload.v) {
      clearSessionCookie(res)
      return res.status(401).json({ ok: false, error: 'Your session has ended. Please sign in again.' })
    }
    req.user = user
    return next()
  } catch {
    clearSessionCookie(res)
    return res.status(401).json({ ok: false, error: 'Your session has ended. Please sign in again.' })
  }
}

// Cross-site requests can't set custom headers without a CORS preflight we
// never approve, so requiring one on every admin write blocks CSRF on top of
// the SameSite=Strict cookie.
export function requireAdminHeader(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next()
  if (req.get('X-RNK2-Admin') !== '1') {
    return res.status(403).json({ ok: false, error: 'Request blocked.' })
  }
  return next()
}
