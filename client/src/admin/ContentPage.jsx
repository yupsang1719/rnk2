import { useEffect, useMemo, useState } from 'react'
import { CONTENT_SCHEMA } from '@shared/content/schema.js'
import { api } from './api'
import { SingleUploader } from './PhotoUploader'

const fmt = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
const when = (d) => (d ? fmt.format(new Date(d)) : '')

// Which page to open when previewing each tab.
const PREVIEW_PATH = {
  capabilities: '/#capabilities',
  work: '/#work',
  coverage: '/#coverage',
  process: '/#process',
  quote: '/#quote',
  privacy: '/privacy-policy',
  notFound: '/this-page-does-not-exist'
}

const emptyItem = (field) => Object.fromEntries(field.fields.map((f) => [f.key, f.type === 'image' ? null : '']))
const isText = (field) => ['text', 'textarea', 'richtext'].includes(field.type)

// ---------------------------------------------------------------- fields

function Counter({ value, max }) {
  if (!max) return null
  const n = (value || '').length
  return <span className={`adm-count${n > max * 0.9 ? ' is-near' : ''}`}>{n} / {max}</span>
}

function FieldInput({ field, value, onChange, id }) {
  switch (field.type) {
    case 'textarea':
    case 'richtext':
      return (
        <textarea
          id={id}
          className="adm-input"
          rows={field.type === 'richtext' ? 8 : 3}
          maxLength={field.max}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )
    case 'image':
      return <SingleUploader image={value} onChange={onChange} label="Drag a photo here" />
    default:
      return (
        <input
          id={id}
          className="adm-input"
          type="text"
          maxLength={field.max}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )
  }
}

function Field({ field, value, onChange, path }) {
  const id = `f-${path}`
  if (field.type === 'list') return <ListField field={field} value={value} onChange={onChange} path={path} />

  const wide = field.type !== 'text'
  return (
    <div className={`adm-field${wide ? ' adm-field--wide' : ''}`}>
      <span className="adm-label-row">
        <label className="adm-label" htmlFor={id}>
          {field.label}
          {isText(field) && field.optional && <span className="adm-muted"> (optional)</span>}
        </label>
        {isText(field) && <Counter value={value} max={field.max} />}
      </span>
      <FieldInput field={field} value={value} onChange={onChange} id={id} />
      {field.hint && <span className="adm-hint">{field.hint}</span>}
    </div>
  )
}

function itemTitle(item) {
  const text = item.title || item.label || item.heading || item.text || item.quote || item.name || ''
  return text.length > 60 ? `${text.slice(0, 57)}…` : text
}

function ListField({ field, value, onChange, path }) {
  const items = value || []
  const set = (i, key, v) => onChange(items.map((it, j) => (j === i ? { ...it, [key]: v } : it)))
  const move = (from, to) => {
    const next = [...items]
    const [it] = next.splice(from, 1)
    next.splice(to, 0, it)
    onChange(next)
  }
  const remove = (i) => onChange(items.filter((_, j) => j !== i))
  // Fixed lists (cards, steps, menu links…) only allow editing the wording.
  const editable = !field.fixed
  const canAdd = editable && items.length < (field.max ?? 20)
  const single = field.fields.length === 1

  return (
    <div className="adm-field adm-field--wide">
      <span className="adm-label">{field.label}</span>
      {field.hint && <span className="adm-hint adm-hint--top">{field.hint}</span>}
      <ol className="adm-list">
        {items.map((item, i) => (
          <li className={`adm-list__item${single ? ' adm-list__item--single' : ''}`} key={i}>
            <div className="adm-list__head">
              <span className="adm-list__title">
                {field.itemLabel || 'Item'} {i + 1}
                {!single && itemTitle(item) && <span className="adm-muted"> — {itemTitle(item)}</span>}
              </span>
              {editable && (
              <span className="adm-list__tools">
                <button type="button" className="adm-icon-btn" disabled={i === 0} onClick={() => move(i, i - 1)} aria-label={`Move ${field.itemLabel || 'item'} ${i + 1} up`}>
                  ▲
                </button>
                <button
                  type="button"
                  className="adm-icon-btn"
                  disabled={i === items.length - 1}
                  onClick={() => move(i, i + 1)}
                  aria-label={`Move ${field.itemLabel || 'item'} ${i + 1} down`}
                >
                  ▼
                </button>
                <button type="button" className="adm-btn adm-btn--text adm-btn--sm adm-danger-text" onClick={() => remove(i)}>
                  Remove
                </button>
              </span>
              )}
            </div>
            <div className="adm-grid">
              {field.fields.map((f) => (
                <Field
                  key={f.key}
                  field={f}
                  value={item[f.key]}
                  onChange={(v) => set(i, f.key, v)}
                  path={`${path}-${i}-${f.key}`}
                />
              ))}
            </div>
          </li>
        ))}
      </ol>
      {items.length === 0 && <p className="adm-muted">None yet.</p>}
      {editable && (
        <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" disabled={!canAdd} onClick={() => onChange([...items, emptyItem(field)])}>
          + Add {(field.itemLabel || 'item').toLowerCase()}
        </button>
      )}
      {editable && !canAdd && <span className="adm-hint">That’s the most there’s room for ({field.max}).</span>}
    </div>
  )
}

// ---------------------------------------------------------------- page

export default function ContentPage() {
  const [server, setServer] = useState(null) // last state from the API
  const [form, setForm] = useState(null) // the draft being edited
  const [tab, setTab] = useState(CONTENT_SCHEMA[0].key)
  const [busy, setBusy] = useState('') // '', 'save', 'publish', 'discard', 'restore'
  const [error, setError] = useState('')
  const [problems, setProblems] = useState([])
  const [notice, setNotice] = useState('')
  const [confirm, setConfirm] = useState(null) // 'discard' | version id
  const [stale, setStale] = useState(false)

  const load = (data) => {
    setServer(data)
    setForm(data.draft)
    setProblems(data.problems || [])
  }

  useEffect(() => {
    api('/admin/content')
      .then(load)
      .catch((e) => setError(e.message))
  }, [])

  const dirty = useMemo(() => server && form && JSON.stringify(form) !== JSON.stringify(server.draft), [form, server])

  // Warn before closing the tab with unsaved edits.
  useEffect(() => {
    if (!dirty) return undefined
    const warn = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  async function run(kind, fn, okMessage) {
    setBusy(kind)
    setError('')
    setNotice('')
    try {
      const data = await fn()
      load(data)
      if (okMessage) setNotice(okMessage(data))
      return data
    } catch (e) {
      setError(e.message)
      if (e.status === 409) setStale(true)
      if (e.data?.problems) setProblems(e.data.problems)
      return null
    } finally {
      setBusy('')
      setConfirm(null)
    }
  }

  const saveDraft = () =>
    api('/admin/content/draft', { method: 'PUT', body: { content: form, baseUpdatedAt: server.draftUpdatedAt } })

  const save = () =>
    run('save', saveDraft, (d) =>
      d.problems.length ? 'Draft saved, but a few things need fixing before it can be published.' : 'Draft saved. Use Preview to check it, then Publish.'
    )

  async function preview() {
    // Open the tab straight away (inside the click) so pop-up blockers allow it.
    const win = window.open('about:blank', '_blank')
    if (dirty) {
      const ok = await run('save', saveDraft, () => 'Draft saved.')
      if (!ok) {
        win?.close()
        return
      }
    }
    const path = PREVIEW_PATH[tab] || '/'
    const [p, hash] = path.split('#')
    const url = `${p}?preview=draft${hash ? `#${hash}` : ''}`
    if (win) win.location.href = url
    else window.open(url, '_blank')
  }

  async function publish() {
    await run(
      'publish',
      async () => {
        if (dirty) {
          const saved = await saveDraft()
          setServer(saved)
          return api('/admin/content/publish', { method: 'POST', body: { baseUpdatedAt: saved.draftUpdatedAt } })
        }
        return api('/admin/content/publish', { method: 'POST', body: { baseUpdatedAt: server.draftUpdatedAt } })
      },
      () => 'Published. The website now shows these changes.'
    )
  }

  const discard = () =>
    run('discard', () => api('/admin/content/discard', { method: 'POST' }), () => 'Draft discarded. The editor now matches the live website.')

  const restore = (id) =>
    run('restore', () => api(`/admin/content/versions/${id}/restore`, { method: 'POST' }), () =>
      'That version is now loaded as the draft. Preview it, then Publish to put it live.'
    )

  if (!form) {
    return (
      <div className="adm-page">
        {error ? <p className="adm-alert adm-alert--error">{error}</p> : <p className="adm-muted">Loading…</p>}
      </div>
    )
  }

  const section = CONTENT_SCHEMA.find((s) => s.key === tab)
  const setField = (key, value) => setForm((f) => ({ ...f, [tab]: { ...f[tab], [key]: value } }))
  const unpublished = dirty || server.hasUnpublished
  const problemTabs = new Set(
    problems.map((p) => CONTENT_SCHEMA.find((s) => p.startsWith(`${s.title} →`))?.key).filter(Boolean)
  )

  return (
    <div className="adm-page">
      <div className="adm-page__head">
        <div>
          <h1 className="adm-h1">Site content</h1>
          <p className="adm-muted">
            Every heading, paragraph, button and label on the website. Changes are saved as a draft — preview them,
            then publish.
          </p>
        </div>
        <div className="adm-content-status">
          {unpublished ? <span className="adm-chip adm-chip--draft">Unpublished changes</span> : <span className="adm-chip adm-chip--live">Live site is up to date</span>}
          {server.publishedAt && (
            <span className="adm-muted adm-content-status__meta">
              Last published {when(server.publishedAt)}
              {server.publishedBy && ` by ${server.publishedBy}`}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="adm-alert adm-alert--error" role="alert">
          <p>{error}</p>
          {stale && (
            <p>
              <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => window.location.reload()}>
                Reload
              </button>
            </p>
          )}
        </div>
      )}
      {notice && !dirty && <p className="adm-alert adm-alert--ok" role="status">{notice}</p>}
      {problems.length > 0 && (
        <div className="adm-alert adm-alert--warn" role="alert">
          <p>Fix these before publishing:</p>
          <ul className="adm-problems">
            {problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="adm-content">
        <nav className="adm-tabs" aria-label="Website sections">
          {CONTENT_SCHEMA.map((s) => (
            <button
              type="button"
              key={s.key}
              className={`adm-tab${s.key === tab ? ' is-active' : ''}`}
              aria-current={s.key === tab ? 'true' : undefined}
              onClick={() => setTab(s.key)}
            >
              {s.title}
              {problemTabs.has(s.key) && <span className="adm-tab__dot" aria-label="needs fixing" />}
            </button>
          ))}
        </nav>

        <div className="adm-content__main">
          <section className="adm-card adm-section">
            <h2 className="adm-h2">{section.title}</h2>
            <p className="adm-muted">{section.intro}</p>
            <div className="adm-grid">
              {section.fields.map((f) => (
                <Field
                  key={`${tab}-${f.key}`}
                  field={f}
                  value={form[tab][f.key]}
                  onChange={(v) => setField(f.key, v)}
                  path={`${tab}-${f.key}`}
                />
              ))}
            </div>
          </section>

          <section className="adm-card adm-section">
            <h2 className="adm-h2">History</h2>
            <p className="adm-muted">
              The last {server.versions.length || 'few'} published versions. Restoring loads one into the draft so you
              can check it before publishing.
            </p>
            {server.versions.length === 0 ? (
              <p className="adm-muted">Nothing published from here yet.</p>
            ) : (
              <ul className="adm-versions">
                {server.versions.map((v) => (
                  <li key={v.id}>
                    <span>
                      {when(v.publishedAt)}
                      {v.publishedBy && <span className="adm-muted"> — {v.publishedBy}</span>}
                    </span>
                    {confirm === v.id ? (
                      <span className="adm-versions__confirm">
                        <span className="adm-muted">Replace the current draft with this version?</span>
                        <button type="button" className="adm-btn adm-btn--primary adm-btn--sm" disabled={!!busy} onClick={() => restore(v.id)}>
                          Restore
                        </button>
                        <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setConfirm(null)}>
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <button type="button" className="adm-btn adm-btn--text adm-btn--sm" disabled={!!busy} onClick={() => setConfirm(v.id)}>
                        Restore…
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <div className="adm-savebar adm-savebar--content">
        <span className="adm-muted adm-savebar__status">
          {dirty ? 'You have unsaved changes.' : server.hasUnpublished ? 'Draft saved — not published yet.' : 'Everything is published.'}
        </span>
        {confirm === 'discard' ? (
          <span className="adm-versions__confirm">
            <span className="adm-muted">Throw away all unpublished changes?</span>
            <button type="button" className="adm-btn adm-btn--danger adm-btn--sm" disabled={!!busy} onClick={discard}>
              Discard
            </button>
            <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setConfirm(null)}>
              Cancel
            </button>
          </span>
        ) : (
          unpublished && (
            <button type="button" className="adm-btn adm-btn--text adm-danger-text" disabled={!!busy} onClick={() => setConfirm('discard')}>
              Discard changes
            </button>
          )
        )}
        <button type="button" className="adm-btn adm-btn--ghost" disabled={!!busy || !dirty} onClick={save}>
          {busy === 'save' ? 'Saving…' : 'Save draft'}
        </button>
        <button type="button" className="adm-btn adm-btn--ghost" disabled={!!busy} onClick={preview}>
          Preview ↗
        </button>
        <button type="button" className="adm-btn adm-btn--primary" disabled={!!busy || !unpublished} onClick={publish}>
          {busy === 'publish' ? 'Publishing…' : 'Publish'}
        </button>
      </div>
    </div>
  )
}
