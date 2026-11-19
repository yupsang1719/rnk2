import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IconCheck } from './icons'
import { useContent } from '../SiteData'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UK_POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  projectType: '',
  postcode: '',
  message: '',
  consent: false
}

// Field -> error message key in the CMS copy (Site content → Get a quote).
const ERROR_KEYS = {
  name: 'errName',
  email: 'errEmail',
  phone: 'errPhone',
  projectType: 'errProjectType',
  postcode: 'errPostcode',
  consent: 'errConsent'
}

function validate(form, projectTypes, c) {
  const errors = {}

  if (form.name.trim().length < 2) errors.name = c.errName
  if (!EMAIL_RE.test(form.email.trim())) errors.email = c.errEmail
  if (form.phone.trim().length < 7) errors.phone = c.errPhone
  if (!projectTypes.includes(form.projectType)) errors.projectType = c.errProjectType
  if (!UK_POSTCODE_RE.test(form.postcode.trim())) errors.postcode = c.errPostcode
  if (!form.consent) errors.consent = c.errConsent

  return errors
}

// Show the CMS wording for any field the server rejected.
function serverErrors(errors, c) {
  const out = {}
  for (const [field, message] of Object.entries(errors || {})) {
    out[field] = (ERROR_KEYS[field] && c[ERROR_KEYS[field]]) || message
  }
  return out
}

export default function QuoteForm() {
  const { c } = useContent('quote')
  const projectTypes = c.projectTypes.map((t) => t.text)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [statusMessage, setStatusMessage] = useState('')

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  const handleConsentChange = (e) => {
    setForm((f) => ({ ...f, consent: e.target.checked }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const clientErrors = validate(form, projectTypes, c)
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
        setStatusMessage(c.successMessage)
        setForm(EMPTY_FORM)
        setErrors({})
      } else {
        setErrors(serverErrors(data.errors, c))
        setStatus('error')
        setStatusMessage(data.errors?.form || c.errorMessage)
      }
    } catch {
      setStatus('error')
      setStatusMessage(c.networkError)
    }
  }

  const fieldClass = (field) => `field${errors[field] ? ' field--error' : ''}`

  return (
    <form className="quote-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className={fieldClass('name')}>
          <label htmlFor="name">{c.nameLabel}</label>
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
          <label htmlFor="email">{c.emailLabel}</label>
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
          <label htmlFor="phone">{c.phoneLabel}</label>
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
          <label htmlFor="projectType">{c.projectTypeLabel}</label>
          <select
            id="projectType"
            value={form.projectType}
            onChange={handleChange('projectType')}
            aria-invalid={Boolean(errors.projectType)}
            aria-describedby={errors.projectType ? 'projectType-error' : undefined}
          >
            <option value="">{c.projectTypePlaceholder}</option>
            {projectTypes.map((type) => (
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
          <label htmlFor="postcode">{c.postcodeLabel}</label>
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
          <label htmlFor="message">{c.messageLabel}</label>
          <textarea
            id="message"
            value={form.message}
            onChange={handleChange('message')}
            rows={4}
          />
        </div>
      </div>

      <div className={`consent-field${errors.consent ? ' consent-field--error' : ''}`}>
        <label className="consent-field__label" htmlFor="consent">
          <input
            id="consent"
            type="checkbox"
            className="consent-field__input"
            checked={form.consent}
            onChange={handleConsentChange}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
          />
          <span className="consent-field__box" aria-hidden="true">
            <IconCheck className="consent-field__check" />
          </span>
          <span className="consent-field__text">
            {c.consentText}{' '}
            <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer">
              {c.consentLinkText}
            </Link>
            .
          </span>
        </label>
        {errors.consent && (
          <span className="field__error" id="consent-error">
            {errors.consent}
          </span>
        )}
      </div>

      <div className="quote-form__submit">
        <button type="submit" className="btn btn--primary" disabled={status === 'loading'}>
          {status === 'loading' ? c.sendingLabel : c.submitLabel}
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
