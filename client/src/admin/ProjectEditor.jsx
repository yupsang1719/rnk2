import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from './api'
import { GalleryUploader, SingleUploader } from './PhotoUploader'

const DEFAULT_TIMELINE = [
  { label: 'Design & planning', duration: '' },
  { label: 'Approvals (planning & building regs)', duration: '' },
  { label: 'Construction', duration: '' },
  { label: 'Handover', duration: '' }
]

const EMPTY = {
  title: '',
  type: '',
  spec: '',
  town: '',
  county: '',
  duration: '',
  costBand: '',
  budgetTier: null,
  brief: '',
  approach: '',
  result: '',
  timeline: DEFAULT_TIMELINE,
  images: [],
  beforeImage: null,
  published: false
}

const BUDGET_LABELS = { 1: 'Under £30,000', 2: '£30,000 – £150,000', 3: 'Over £150,000' }

// Same rules as the server's publishProblems(), so the checklist is live.
function problemsFor(f) {
  const p = []
  if (!f.title.trim()) p.push('Project name')
  if (!f.type) p.push('Project type')
  if (!f.town.trim()) p.push('Town or village')
  if (!f.county) p.push('County / area')
  if (!f.brief.trim()) p.push('The brief')
  if (f.images.length === 0) p.push('At least one photo')
  return p
}

// "£85,000 – £110,000" → tier 2, based on the first amount mentioned.
function guessTier(costBand) {
  const m = costBand.replace(/,/g, '').match(/£?\s*(\d+(?:\.\d+)?)\s*(k|m)?/i)
  if (!m) return null
  let n = parseFloat(m[1])
  if (/k/i.test(m[2] || '')) n *= 1000
  if (/m/i.test(m[2] || '')) n *= 1_000_000
  if (n < 30000) return 1
  if (n < 150000) return 2
  return 3
}

function Field({ label, hint, children, wide }) {
  return (
    <label className={`adm-field${wide ? ' adm-field--wide' : ''}`}>
      <span className="adm-label">{label}</span>
      {children}
      {hint && <span className="adm-hint">{hint}</span>}
    </label>
  )
}

export default function ProjectEditor() {
  const { id } = useParams()
  const isNew = !id
  const navigate = useNavigate()
  const [options, setOptions] = useState({ projectTypes: [], counties: [] })
  const [form, setForm] = useState(isNew ? EMPTY : null)
  const [saved, setSaved] = useState(isNew ? EMPTY : null)
  const [meta, setMeta] = useState({ slug: '', coordsLabel: '' })
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api('/admin/options').then(setOptions).catch((e) => setError(e.message))
  }, [])

  useEffect(() => {
    if (isNew) return
    api(`/admin/projects/${id}`)
      .then(({ project }) => {
        const f = {
          ...EMPTY,
          ...project,
          timeline: project.timeline?.length ? project.timeline : DEFAULT_TIMELINE
        }
        setForm(f)
        setSaved(f)
        setMeta({ slug: project.slug, coordsLabel: project.coordsLabel })
      })
      .catch((e) => setError(e.message))
  }, [id, isNew])

  const dirty = useMemo(() => form && saved && JSON.stringify(form) !== JSON.stringify(saved), [form, saved])

  useEffect(() => {
    if (!dirty) return
    const warn = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  if (!form) {
    return (
      <div className="adm-page">
        {error ? <p className="adm-alert adm-alert--error">{error}</p> : <p className="adm-muted">Loading…</p>}
      </div>
    )
  }

  const set = (key) => (e) => {
    const value = e?.target ? e.target.value : e
    setForm((f) => {
      const next = { ...f, [key]: value }
      if (key === 'costBand' && (f.budgetTier == null || f.budgetTier === guessTier(f.costBand))) {
        next.budgetTier = guessTier(value)
      }
      return next
    })
  }
  const setStep = (i, key, value) =>
    setForm((f) => ({ ...f, timeline: f.timeline.map((s, j) => (j === i ? { ...s, [key]: value } : s)) }))

  const problems = problemsFor(form)

  async function save(publish) {
    setSaving(true)
    setError('')
    setNotice('')
    const body = { ...form, published: publish ?? form.published }
    try {
      const { project } = isNew
        ? await api('/admin/projects', { method: 'POST', body })
        : await api(`/admin/projects/${id}`, { method: 'PUT', body })
      const f = { ...EMPTY, ...project, timeline: project.timeline?.length ? project.timeline : DEFAULT_TIMELINE }
      setForm(f)
      setSaved(f)
      setMeta({ slug: project.slug, coordsLabel: project.coordsLabel })
      if (isNew) navigate(`/admin/projects/${project.id}`, { replace: true })
      setNotice(
        project.published
          ? 'Saved. This project is live on the website.'
          : 'Saved as a draft. It is not visible on the website yet.'
      )
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e) {
      setError(e.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="adm-page adm-editor">
      <div className="adm-page__head">
        <div>
          <Link to="/admin" className="adm-link">← All projects</Link>
          <h1 className="adm-h1">{isNew ? 'Add a project' : form.title || 'Untitled project'}</h1>
          <p className="adm-muted">
            <span className={`adm-chip ${saved.published ? 'adm-chip--live' : ''}`}>
              {saved.published ? 'Live on website' : 'Draft — not on website'}
            </span>
            {dirty && <span className="adm-unsaved"> · Unsaved changes</span>}
          </p>
        </div>
        {saved.published && meta.slug && (
          <a href={`/work/${meta.slug}`} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn--ghost">
            View on website ↗
          </a>
        )}
      </div>

      {error && <p className="adm-alert adm-alert--error" role="alert">{error}</p>}
      {notice && !dirty && <p className="adm-alert adm-alert--ok" role="status">{notice}</p>}

      <div className="adm-editor__layout">
        <div className="adm-editor__form">
          <section className="adm-card adm-section">
            <h2 className="adm-h2">1. The basics</h2>
            <div className="adm-grid">
              <Field label="Project name *" hint='e.g. "The Riverside Extension"' wide>
                <input className="adm-input" value={form.title} onChange={set('title')} maxLength={120} />
              </Field>
              <Field label="Project type *" hint="Used for the filter buttons on the website.">
                <select className="adm-input" value={form.type} onChange={set('type')}>
                  <option value="">Choose…</option>
                  {options.projectTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Short description" hint='Shown on the project card, e.g. "Double-storey · Rear extension"'>
                <input className="adm-input" value={form.spec} onChange={set('spec')} maxLength={120} />
              </Field>
              <Field label="Town or village *" hint="Town only — never the street. Used to place the pin on the map.">
                <input className="adm-input" value={form.town} onChange={set('town')} maxLength={80} />
              </Field>
              <Field label="County / area *">
                <select className="adm-input" value={form.county} onChange={set('county')}>
                  <option value="">Choose…</option>
                  {options.counties.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Total project length" hint='First drawings to handover, e.g. "16 weeks"'>
                <input className="adm-input" value={form.duration} onChange={set('duration')} maxLength={40} />
              </Field>
              <Field label="Cost range to show" hint='e.g. "£85,000 – £110,000". Leave blank to not show a price.'>
                <input className="adm-input" value={form.costBand} onChange={set('costBand')} maxLength={60} />
              </Field>
              <Field label="Budget band" hint="Used for “sort by budget”. Filled in from the cost range.">
                <select
                  className="adm-input"
                  value={form.budgetTier ?? ''}
                  onChange={(e) => set('budgetTier')(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">Not set</option>
                  {[1, 2, 3].map((t) => (
                    <option key={t} value={t}>
                      {BUDGET_LABELS[t]}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            {!isNew && saved.town && (
              <p className="adm-hint">
                {meta.coordsLabel
                  ? `Map pin: ${meta.coordsLabel}.`
                  : `“${saved.town}” couldn’t be found on the map, so this project won’t have a map pin. Check the spelling or use the nearest town.`}
              </p>
            )}
          </section>

          <section className="adm-card adm-section">
            <h2 className="adm-h2">2. Photos *</h2>
            <p className="adm-muted">
              The first photo is the cover, used on the project card and as the “after” shot. Add a
              caption to each so visitors (and Google) know what they’re looking at.
            </p>
            <GalleryUploader
              images={form.images}
              onChange={set('images')}
              onAdd={(image) => setForm((f) => ({ ...f, images: [...f.images, image] }))}
            />

            <h3 className="adm-h3">Before photo (optional)</h3>
            <p className="adm-muted">
              Adds a before/after slider to the project page, compared with the cover photo. Works
              best taken from the same spot.
            </p>
            <SingleUploader
              image={form.beforeImage}
              onChange={set('beforeImage')}
              label="Drag the before photo here"
            />
          </section>

          <section className="adm-card adm-section">
            <h2 className="adm-h2">3. The story</h2>
            <div className="adm-grid">
              <Field label="The brief *" hint="What did the client need, and why? 1–2 sentences." wide>
                <textarea className="adm-input" rows={3} value={form.brief} onChange={set('brief')} maxLength={1500} />
              </Field>
              <Field label="Our approach" hint="What RNK2 designed, got approved and built. 1–3 sentences." wide>
                <textarea className="adm-input" rows={4} value={form.approach} onChange={set('approach')} maxLength={2500} />
              </Field>
              <Field label="The result" hint='One line, ideally with a number, e.g. "+28m² of living space, including a fifth bedroom."' wide>
                <input className="adm-input" value={form.result} onChange={set('result')} maxLength={300} />
              </Field>
            </div>
          </section>

          <section className="adm-card adm-section">
            <h2 className="adm-h2">4. Timeline (optional)</h2>
            <p className="adm-muted">Roughly how long each stage took. Stages left blank aren’t shown.</p>
            <div className="adm-timeline">
              {form.timeline.map((step, i) => (
                <div className="adm-timeline__row" key={i}>
                  <input
                    className="adm-input"
                    value={step.label}
                    onChange={(e) => setStep(i, 'label', e.target.value)}
                    aria-label={`Stage ${i + 1} name`}
                    maxLength={80}
                  />
                  <input
                    className="adm-input"
                    value={step.duration}
                    placeholder="e.g. 3 weeks"
                    onChange={(e) => setStep(i, 'duration', e.target.value)}
                    aria-label={`${step.label} duration`}
                    maxLength={40}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="adm-editor__side">
          <div className="adm-card adm-sticky">
            <h2 className="adm-h2">Publish</h2>
            {problems.length > 0 ? (
              <>
                <p className="adm-muted">Before this can go on the website, add:</p>
                <ul className="adm-checklist">
                  {problems.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="adm-muted">Everything needed is filled in.</p>
            )}

            {saved.published ? (
              <>
                <button type="button" className="adm-btn adm-btn--primary adm-btn--block" disabled={saving || !dirty} onClick={() => save(true)}>
                  {saving ? 'Saving…' : dirty ? 'Save changes' : 'All changes saved'}
                </button>
                <button type="button" className="adm-btn adm-btn--ghost adm-btn--block" disabled={saving} onClick={() => save(false)}>
                  Hide from website
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="adm-btn adm-btn--primary adm-btn--block"
                  disabled={saving || problems.length > 0}
                  onClick={() => save(true)}
                >
                  {saving ? 'Saving…' : 'Save & show on website'}
                </button>
                <button
                  type="button"
                  className="adm-btn adm-btn--ghost adm-btn--block"
                  disabled={saving || !form.title.trim() || (!isNew && !dirty)}
                  onClick={() => save(false)}
                >
                  Save as draft
                </button>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
