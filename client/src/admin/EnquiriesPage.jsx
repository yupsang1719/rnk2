import { useEffect, useState } from 'react'
import { api } from './api'

const fmt = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' })

export default function EnquiriesPage() {
  const [quotes, setQuotes] = useState(null)
  const [error, setError] = useState('')
  const [confirmId, setConfirmId] = useState(null)

  useEffect(() => {
    api('/admin/quotes')
      .then((d) => setQuotes(d.quotes))
      .catch((e) => setError(e.message))
  }, [])

  async function remove(id) {
    try {
      await api(`/admin/quotes/${id}`, { method: 'DELETE' })
      setQuotes((q) => q.filter((x) => x.id !== id))
    } catch (e) {
      setError(e.message)
    } finally {
      setConfirmId(null)
    }
  }

  return (
    <div className="adm-page">
      <div className="adm-page__head">
        <div>
          <h1 className="adm-h1">Enquiries</h1>
          <p className="adm-muted">
            Quote requests sent from the website, newest first. Delete them once they’re no longer
            needed — the privacy policy promises to keep them no longer than 24 months.
          </p>
        </div>
      </div>

      {error && <p className="adm-alert adm-alert--error" role="alert">{error}</p>}
      {quotes === null && !error && <p className="adm-muted">Loading…</p>}
      {quotes?.length === 0 && (
        <div className="adm-card adm-empty">
          <p className="adm-muted">No enquiries yet.</p>
        </div>
      )}

      <ul className="adm-quotes">
        {quotes?.map((q) => (
          <li key={q.id} className="adm-card adm-quote">
            <div className="adm-quote__head">
              <strong>{q.name}</strong>
              <span className="adm-chip">{q.projectType}</span>
              <span className="adm-muted">{fmt.format(new Date(q.createdAt))}</span>
            </div>
            <p className="adm-quote__contact">
              <a href={`mailto:${q.email}`}>{q.email}</a> · <a href={`tel:${q.phone.replace(/[^\d+]/g, '')}`}>{q.phone}</a> ·{' '}
              {q.postcode}
            </p>
            {q.message && <p className="adm-quote__msg">{q.message}</p>}
            <div className="adm-quote__actions">
              {confirmId === q.id ? (
                <>
                  <span className="adm-muted">Delete this enquiry for good?</span>
                  <button type="button" className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => remove(q.id)}>
                    Yes, delete
                  </button>
                  <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setConfirmId(null)}>
                    Cancel
                  </button>
                </>
              ) : (
                <button type="button" className="adm-btn adm-btn--text adm-btn--sm" onClick={() => setConfirmId(q.id)}>
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
