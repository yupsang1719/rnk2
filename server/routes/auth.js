import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import User, { MIN_PASSWORD_LENGTH } from '../models/User.js'
import { clearSessionCookie, requireAuth, setSessionCookie } from '../middleware/auth.js'

const router = Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { ok: false, error: 'Too many sign-in attempts. Please wait 15 minutes and try again.' }
})

router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body || {}
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ ok: false, error: 'Enter your email and password.' })
  }
  const user = await User.findOne({ email: email.trim().toLowerCase() })
  const valid = user ? await user.checkPassword(password) : false
  if (!user || !valid) {
    return res.status(401).json({ ok: false, error: 'That email and password don’t match.' })
  }
  user.lastLoginAt = new Date()
  await user.save()
  setSessionCookie(res, user)
  return res.json({ ok: true, user: user.toSafeJSON() })
})

router.post('/logout', (_req, res) => {
  clearSessionCookie(res)
  res.json({ ok: true })
})

router.get('/me', requireAuth, (req, res) => {
  res.json({ ok: true, user: req.user.toSafeJSON() })
})

router.post('/password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {}
  if (typeof newPassword !== 'string' || newPassword.length < MIN_PASSWORD_LENGTH) {
    return res
      .status(400)
      .json({ ok: false, error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.` })
  }
  if (typeof currentPassword !== 'string' || !(await req.user.checkPassword(currentPassword))) {
    return res.status(400).json({ ok: false, error: 'Your current password is incorrect.' })
  }
  await req.user.setPassword(newPassword)
  await req.user.save()
  setSessionCookie(res, req.user)
  res.json({ ok: true })
})

export default router
