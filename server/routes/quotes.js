import { Router } from 'express'
import Quote, { PROJECT_TYPE_VALUES } from '../models/Quote.js'

const router = Router()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UK_POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i

function validateQuote(body) {
  const errors = {}
  const { name, email, phone, projectType, postcode, message } = body

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.name = 'Enter your full name.'
  }
  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    errors.email = 'Enter a valid email address.'
  }
  if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
    errors.phone = 'Enter a valid phone number.'
  }
  if (!projectType || !PROJECT_TYPE_VALUES.includes(projectType)) {
    errors.projectType = 'Choose a project type.'
  }
  if (!postcode || typeof postcode !== 'string' || !UK_POSTCODE_RE.test(postcode.trim())) {
    errors.postcode = 'Enter a valid UK postcode.'
  }
  if (message && typeof message === 'string' && message.length > 2000) {
    errors.message = 'Message is too long.'
  }

  return errors
}

router.post('/', async (req, res) => {
  const errors = validateQuote(req.body || {})

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ ok: false, errors })
  }

  try {
    const { name, email, phone, projectType, postcode, message } = req.body
    const quote = await Quote.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      projectType,
      postcode: postcode.trim(),
      message: (message || '').trim()
    })

    return res.status(201).json({
      ok: true,
      quote: {
        id: quote._id,
        createdAt: quote.createdAt
      }
    })
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ ok: false, errors: { form: 'Some details look invalid. Please check and try again.' } })
    }
    console.error('Failed to save quote request:', err)
    return res.status(500).json({ ok: false, errors: { form: 'Something went wrong on our end. Please try again shortly.' } })
  }
})

export default router
