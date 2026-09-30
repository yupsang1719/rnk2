import { useState } from 'react'

const PROJECT_TYPES = ['Extension', 'Conversion', 'New Build', 'Design only']

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UK_POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  projectType: '',
  postcode: '',
  message: ''
}

function validate(form) {
  const errors = {}

  if (form.name.trim().length < 2) {
    errors.name = 'Enter your full name.'
  }
  if (!EMAIL_RE.test(form.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }
  if (form.phone.trim().length < 7) {
    errors.phone = 'Enter a valid phone number.'
  }
  if (!PROJECT_TYPES.includes(form.projectType)) {
    errors.projectType = 'Choose a project type.'
  }
  if (!UK_POSTCODE_RE.test(form.postcode.trim())) {
    errors.postcode = 'Enter a valid UK postcode.'
  }

  return errors
}

export default function QuoteForm() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [statusMessage, setStatusMessage] = useState('')

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const clientErrors = validate(form)
    setErrors(clientErrors)

    if (Object.keys(clientErrors).length > 0) {
      setStatus('idle')
      setStatusMessage('')
      return
    }

    setStatus('loading')
    setStatusMessage('')

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setStatus('success')
        setStatusMessage("Thanks — we'll be in touch within one working day.")
        setForm(EMPTY_FORM)
        setErrors({})
      } else {
        setErrors(data.errors || {})
        setStatus('error')
        setStatusMessage(
          data.errors?.form ||
            'A few details need a second look — check the form and try again.'
        )
      }
    } catch {
      setStatus('error')
      setStatusMessage(
        "We couldn't reach the server. Check your connection and try again."
      )
    }
  }

  const fieldClass = (field) => `field${errors[field] ? ' field--error' : ''}`

  return (
    <form className="quote-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className={fieldClass('name')}>
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={handleChange('name')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <span className="field__error" id="name-error">
              {errors.name}
            </span>
          )}
        </div>

        <div className={fieldClass('email')}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <span className="field__error" id="email-error">
              {errors.email}
            </span>
          )}
        </div>

        <div className={fieldClass('phone')}>
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange('phone')}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && (
            <span className="field__error" id="phone-error">
              {errors.phone}
            </span>
          )}
        </div>

        <div className={fieldClass('projectType')}>
          <label htmlFor="projectType">Project type</label>
          <select
            id="projectType"
            value={form.projectType}
            onChange={handleChange('projectType')}
            aria-invalid={Boolean(errors.projectType)}
            aria-describedby={errors.projectType ? 'projectType-error' : undefined}
          >
            <option value="">Select one…</option>
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.projectType && (
            <span className="field__error" id="projectType-error">
              {errors.projectType}
            </span>
          )}
        </div>

        <div className={fieldClass('postcode')}>
          <label htmlFor="postcode">Postcode</label>
          <input
            id="postcode"
            type="text"
            autoComplete="postal-code"
            value={form.postcode}
            onChange={handleChange('postcode')}
            aria-invalid={Boolean(errors.postcode)}
            aria-describedby={errors.postcode ? 'postcode-error' : undefined}
          />
          {errors.postcode && (
            <span className="field__error" id="postcode-error">
              {errors.postcode}
            </span>
          )}
        </div>

        <div className="field field--full">
          <label htmlFor="message">Tell us about the project (optional)</label>
          <textarea
            id="message"
            value={form.message}
            onChange={handleChange('message')}
            rows={4}
          />
        </div>
      </div>

      <div className="quote-form__submit">
        <button type="submit" className="btn btn--primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending…' : 'Request a quote'}
        </button>
      </div>

      {statusMessage && (status === 'success' || status === 'error') && (
        <p className={`form-status ${status === 'error' ? 'form-status--error' : ''}`} role="status">
          {statusMessage}
        </p>
      )}
    </form>
  )
}
