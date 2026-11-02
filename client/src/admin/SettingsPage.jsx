import { useEffect, useMemo, useState } from 'react'
import { api } from './api'
import { SingleUploader } from './PhotoUploader'

const SECTIONS = [
  {
    title: 'Track record',
    intro: 'Shown as the big numbers on the homepage. Anything left blank is simply not shown.',
    fields: [
      { key: 'establishedYear', label: 'Year established', hint: 'e.g. 2011 — “years established” is worked out from this', maxLength: 4, inputMode: 'numeric' },
      { key: 'projectsCompleted', label: 'Projects completed', hint: 'e.g. 210+', maxLength: 20 },
      { key: 'guaranteeYears', label: 'Structural guarantee (years)', hint: 'e.g. 10', maxLength: 4, inputMode: 'numeric' },
      { key: 'onTimePercent', label: 'Delivered on time', hint: 'e.g. 96%', maxLength: 10 },
      { key: 'fullyInsured', label: 'We are fully insured (public & employer’s liability)', type: 'checkbox' },
      { key: 'region', label: 'Region', hint: 'Shown at the top of the homepage, e.g. South East England', maxLength: 60 },
      { key: 'areasCovered', label: 'Areas covered', hint: 'e.g. Berkshire, Oxfordshire, Surrey & Hampshire', maxLength: 200, wide: true }
    ]
  },
  {
    title: 'Contact details',
    intro: 'Shown in the footer and next to the quote form.',
    fields: [
      { key: 'phone', label: 'Phone number', maxLength: 40, type: 'tel' },
      { key: 'email', label: 'Email for enquiries', maxLength: 120, type: 'email' },
      { key: 'address', label: 'Business address', maxLength: 250, wide: true }
    ]
  },
  {
    title: 'Legal',
    intro: 'Shown in the footer and the privacy policy.',
    fields: [
      { key: 'registrationNo', label: 'Companies House registration number', maxLength: 20 },
      { key: 'icoRegistrationNo', label: 'ICO registration number', hint: 'From ico.org.uk. Leave blank if you don’t have one.', maxLength: 20 },
      { key: 'privacyEmail', label: 'Email for privacy / data requests', hint: 'If blank, the enquiries email is used.', maxLength: 120, type: 'email' }
    ]
  },
  {
    title: 'Homepage customer review',
    intro: 'One featured review. Make sure the customer is happy to be quoted and named. Leave the review blank to hide this section.',
    fields: [
      { key: 'testimonialQuote', label: 'Review text', maxLength: 600, type: 'textarea', wide: true },
      { key: 'testimonialName', label: 'Customer name as shown', hint: 'e.g. Sarah & Michael Thompson', maxLength: 120 },
      { key: 'testimonialTown', label: 'Customer town', hint: 'e.g. Wokingham, Berkshire', maxLength: 120 }
    ]
  }
]

export default function SettingsPage() {
  const [form, setForm] = useState(null)
  const [saved, setSaved] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api('/admin/settings')
      .then(({ settings }) => {
        setForm(settings)
        setSaved(settings)
      })
      .catch((e) => setError(e.message))
  }, [])

  const dirty = useMemo(() => form && JSON.stringify(form) !== JSON.stringify(saved), [form, saved])

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const { settings } = await api('/admin/settings', { method: 'PUT', body: form })
      setForm(settings)
      setSaved(settings)
      setNotice('Saved. The website is updated.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (!form) {
    return (
      <div className="adm-page">
        {error ? <p className="adm-alert adm-alert--error">{error}</p> : <p className="adm-muted">Loading…</p>}
      </div>
    )
  }

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  return (
    <form className="adm-page" onSubmit={submit}>
      <div className="adm-page__head">
        <div>
          <h1 className="adm-h1">Company details</h1>
          <p className="adm-muted">These appear across the whole website.</p>
        </div>
      </div>

      {error && <p className="adm-alert adm-alert--error" role="alert">{error}</p>}
      {notice && !dirty && <p className="adm-alert adm-alert--ok" role="status">{notice}</p>}

      {SECTIONS.map((section) => (
        <section className="adm-card adm-section" key={section.title}>
          <h2 className="adm-h2">{section.title}</h2>
          <p className="adm-muted">{section.intro}</p>
          <div className="adm-grid">
            {section.fields.map((f) =>
              f.type === 'checkbox' ? (
                <label className="adm-check adm-field--wide" key={f.key}>
                  <input type="checkbox" checked={!!form[f.key]} onChange={(e) => set(f.key, e.target.checked)} />
                  <span>{f.label}</span>
                </label>
              ) : (
                <label className={`adm-field${f.wide ? ' adm-field--wide' : ''}`} key={f.key}>
                  <span className="adm-label">{f.label}</span>
                  {f.type === 'textarea' ? (
                    <textarea
                      className="adm-input"
                      rows={4}
                      maxLength={f.maxLength}
                      value={form[f.key] || ''}
                      onChange={(e) => set(f.key, e.target.value)}
                    />
                  ) : (
                    <input
                      className="adm-input"
                      type={f.type || 'text'}
                      inputMode={f.inputMode}
                      maxLength={f.maxLength}
                      value={form[f.key] || ''}
                      onChange={(e) => set(f.key, e.target.value)}
                    />
                  )}
                  {f.hint && <span className="adm-hint">{f.hint}</span>}
                </label>
              )
            )}
          </div>
        </section>
      ))}

      <section className="adm-card adm-section">
        <h2 className="adm-h2">Homepage background photo</h2>
        <p className="adm-muted">
          The large photo behind the headline. A wide, landscape shot of a finished build works best.
          If none is uploaded, a stock construction photo is used.
        </p>
        <SingleUploader
          image={form.heroImage}
          onChange={(img) => set('heroImage', img)}
          label="Drag a landscape photo here"
        />
      </section>

      <div className="adm-savebar">
        <span className="adm-muted">{dirty ? 'You have unsaved changes.' : 'All changes saved.'}</span>
        <button type="submit" className="adm-btn adm-btn--primary" disabled={saving || !dirty}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}
