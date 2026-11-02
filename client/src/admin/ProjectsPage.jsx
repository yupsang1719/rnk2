import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from './api'

export default function ProjectsPage() {
  const [projects, setProjects] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    api('/admin/projects')
      .then((d) => setProjects(d.projects))
      .catch((e) => setError(e.message))
  }, [])

  async function togglePublished(p) {
    setBusyId(p.id)
    setError('')
    setNotice('')
    try {
      const { project } = await api(`/admin/projects/${p.id}`, {
        method: 'PUT',
        body: { published: !p.published }
      })
      setProjects((list) => list.map((x) => (x.id === p.id ? project : x)))
      setNotice(project.published ? `“${project.title}” is now live on the website.` : `“${project.title}” has been hidden from the website.`)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusyId(null)
    }
  }

  async function move(index, delta) {
    const next = [...projects]
    const [item] = next.splice(index, 1)
    next.splice(index + delta, 0, item)
    setProjects(next)
    try {
      await api('/admin/projects-order', { method: 'PUT', body: { ids: next.map((p) => p.id) } })
    } catch (e) {
      setError(e.message)
    }
  }

  async function remove(p) {
    setBusyId(p.id)
    setError('')
    try {
      await api(`/admin/projects/${p.id}`, { method: 'DELETE' })
      setProjects((list) => list.filter((x) => x.id !== p.id))
      setNotice(`“${p.title}” was deleted.`)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusyId(null)
      setConfirmDelete(null)
    }
  }

  const liveCount = projects?.filter((p) => p.published).length ?? 0

  return (
    <div className="adm-page">
      <div className="adm-page__head">
        <div>
          <h1 className="adm-h1">Projects</h1>
          {projects && (
            <p className="adm-muted">
              {liveCount} live on the website · {projects.length - liveCount} draft
              {projects.length - liveCount === 1 ? '' : 's'}. The order here is the order on the website.
            </p>
          )}
        </div>
        <Link to="/admin/projects/new" className="adm-btn adm-btn--primary">
          + Add a project
        </Link>
      </div>

      {error && <p className="adm-alert adm-alert--error" role="alert">{error}</p>}
      {notice && <p className="adm-alert adm-alert--ok" role="status">{notice}</p>}

      {projects === null && !error && <p className="adm-muted">Loading…</p>}

      {projects?.length === 0 && (
        <div className="adm-card adm-empty">
          <h2 className="adm-h2">No projects yet</h2>
          <p className="adm-muted">
            Add your first finished project. It stays as a draft until you choose to show it on
            the website — nothing appears publicly until then.
          </p>
          <Link to="/admin/projects/new" className="adm-btn adm-btn--primary">
            + Add a project
          </Link>
        </div>
      )}

      {projects?.length > 0 && (
        <ul className="adm-plist">
          {projects.map((p, i) => (
            <li key={p.id} className="adm-card adm-prow">
              <div className="adm-prow__order">
                <button
                  type="button"
                  className="adm-icon-btn"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label={`Move ${p.title} up`}
                >
                  ▲
                </button>
                <button
                  type="button"
                  className="adm-icon-btn"
                  onClick={() => move(i, 1)}
                  disabled={i === projects.length - 1}
                  aria-label={`Move ${p.title} down`}
                >
                  ▼
                </button>
              </div>

              <Link to={`/admin/projects/${p.id}`} className="adm-prow__thumb">
                {p.images[0] ? <img src={p.images[0].thumbUrl} alt="" /> : <span>No photo</span>}
              </Link>

              <div className="adm-prow__main">
                <Link to={`/admin/projects/${p.id}`} className="adm-prow__title">
                  {p.title}
                </Link>
                <p className="adm-muted adm-prow__meta">
                  {[p.type, [p.town, p.county].filter(Boolean).join(', '), `${p.images.length} photo${p.images.length === 1 ? '' : 's'}`]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
                {!p.published && p.publishProblems.length > 0 && (
                  <p className="adm-prow__todo">Still needed before it can go live: {p.publishProblems.join(', ')}</p>
                )}
              </div>

              <div className="adm-prow__status">
                <span className={`adm-chip ${p.published ? 'adm-chip--live' : ''}`}>
                  {p.published ? 'Live' : 'Draft'}
                </span>
              </div>

              <div className="adm-prow__actions">
                {confirmDelete === p.id ? (
                  <>
                    <span className="adm-muted">Delete for good?</span>
                    <button
                      type="button"
                      className="adm-btn adm-btn--danger adm-btn--sm"
                      onClick={() => remove(p)}
                      disabled={busyId === p.id}
                    >
                      Yes, delete
                    </button>
                    <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setConfirmDelete(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className={`adm-btn adm-btn--sm ${p.published ? 'adm-btn--ghost' : 'adm-btn--primary'}`}
                      onClick={() => togglePublished(p)}
                      disabled={busyId === p.id || (!p.published && p.publishProblems.length > 0)}
                      title={!p.published && p.publishProblems.length > 0 ? 'Finish the missing details first' : undefined}
                    >
                      {p.published ? 'Hide from website' : 'Show on website'}
                    </button>
                    <Link to={`/admin/projects/${p.id}`} className="adm-btn adm-btn--ghost adm-btn--sm">
                      Edit
                    </Link>
                    {p.published && (
                      <a href={`/work/${p.slug}`} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn--ghost adm-btn--sm">
                        View ↗
                      </a>
                    )}
                    <button
                      type="button"
                      className="adm-btn adm-btn--text adm-btn--sm"
                      onClick={() => setConfirmDelete(p.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
