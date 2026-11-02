import { useRef, useState } from 'react'
import { uploadPhoto } from './api'

const ACCEPT = 'image/jpeg,image/png,image/webp,image/heic,image/heif'
const CONCURRENCY = 3

// Uploads files as soon as they're chosen. `onUploaded` is called once per
// finished photo so a big batch shows up progressively.
function useUploader(onUploaded) {
  const [pending, setPending] = useState([]) // { key, name, error? }
  const [errors, setErrors] = useState([])

  async function start(fileList) {
    const files = [...fileList].filter((f) => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name))
    if (files.length === 0) return
    setErrors([])
    const items = files.map((f, i) => ({ key: `${Date.now()}-${i}`, name: f.name, file: f }))
    setPending((p) => [...p, ...items])

    let cursor = 0
    async function worker() {
      while (cursor < items.length) {
        const item = items[cursor++]
        try {
          const image = await uploadPhoto(item.file)
          onUploaded(image)
        } catch (e) {
          setErrors((errs) => [...errs, e.message])
        } finally {
          setPending((p) => p.filter((x) => x.key !== item.key))
        }
      }
    }
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, worker))
  }

  return { pending, errors, start }
}

function DropZone({ multiple, onFiles, label, hint, compact }) {
  const inputRef = useRef(null)
  const [over, setOver] = useState(false)

  return (
    <div
      className={`adm-drop${over ? ' is-over' : ''}${compact ? ' adm-drop--compact' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        onFiles(e.dataTransfer.files)
      }}
    >
      <p className="adm-drop__label">{label}</p>
      {hint && <p className="adm-muted adm-drop__hint">{hint}</p>}
      <button type="button" className="adm-btn adm-btn--ghost" onClick={() => inputRef.current?.click()}>
        Choose photo{multiple ? 's' : ''}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple={multiple}
        hidden
        onChange={(e) => {
          onFiles(e.target.files)
          e.target.value = ''
        }}
      />
    </div>
  )
}

function Progress({ pending, errors }) {
  return (
    <>
      {pending.length > 0 && (
        <p className="adm-alert adm-alert--info" role="status">
          Uploading {pending.length} photo{pending.length === 1 ? '' : 's'}… you can keep editing meanwhile.
        </p>
      )}
      {errors.length > 0 && (
        <div className="adm-alert adm-alert--error" role="alert">
          {errors.map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </div>
      )}
    </>
  )
}

// `onAdd` must append using the latest state (e.g. a functional setState), as
// several uploads can finish between renders.
export function GalleryUploader({ images, onChange, onAdd }) {
  const { pending, errors, start } = useUploader(onAdd)

  const update = (i, patch) => onChange(images.map((img, j) => (j === i ? { ...img, ...patch } : img)))
  const removeAt = (i) => onChange(images.filter((_, j) => j !== i))
  const moveTo = (from, to) => {
    const next = [...images]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  return (
    <div className="adm-gallery">
      {images.length > 0 && (
        <ol className="adm-gallery__grid">
          {images.map((img, i) => (
            <li key={img.url} className={`adm-photo${i === 0 ? ' is-cover' : ''}`}>
              <div className="adm-photo__img">
                <img src={img.thumbUrl} alt="" />
                {i === 0 && <span className="adm-photo__badge">Cover photo</span>}
              </div>
              <input
                className="adm-input adm-input--sm"
                placeholder="Caption, e.g. Open-plan kitchen"
                value={img.alt || ''}
                maxLength={200}
                onChange={(e) => update(i, { alt: e.target.value })}
                aria-label={`Caption for photo ${i + 1}`}
              />
              <div className="adm-photo__tools">
                <button type="button" className="adm-icon-btn" disabled={i === 0} onClick={() => moveTo(i, i - 1)} aria-label="Move photo earlier">
                  ◀
                </button>
                <button
                  type="button"
                  className="adm-icon-btn"
                  disabled={i === images.length - 1}
                  onClick={() => moveTo(i, i + 1)}
                  aria-label="Move photo later"
                >
                  ▶
                </button>
                {i !== 0 && (
                  <button type="button" className="adm-btn adm-btn--text adm-btn--sm" onClick={() => moveTo(i, 0)}>
                    Make cover
                  </button>
                )}
                <button type="button" className="adm-btn adm-btn--text adm-btn--sm adm-danger-text" onClick={() => removeAt(i)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}

      <DropZone
        multiple
        onFiles={start}
        label="Drag photos here — you can select lots at once"
        hint="JPG, PNG or WebP. Large phone photos are fine; they're resized automatically and location data is removed."
      />
      <Progress pending={pending} errors={errors} />
    </div>
  )
}

export function SingleUploader({ image, onChange, label, hint }) {
  const { pending, errors, start } = useUploader((img) => onChange(img))

  return (
    <div className="adm-single">
      {image ? (
        <div className="adm-photo adm-photo--single">
          <div className="adm-photo__img">
            <img src={image.thumbUrl} alt="" />
          </div>
          <div className="adm-photo__tools">
            <button type="button" className="adm-btn adm-btn--text adm-btn--sm adm-danger-text" onClick={() => onChange(null)}>
              Remove
            </button>
          </div>
        </div>
      ) : (
        <DropZone compact multiple={false} onFiles={(files) => start([...files].slice(0, 1))} label={label} hint={hint} />
      )}
      <Progress pending={pending} errors={errors} />
    </div>
  )
}
