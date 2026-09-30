import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { IconChevron, IconClose } from './icons'

export default function Lightbox({ images, initialIndex, title, onClose }) {
  const [index, setIndex] = useState(initialIndex)
  const closeRef = useRef(null)
  const previousActiveElement = useRef(null)

  const goPrev = () => setIndex((i) => (i - 1 + images.length) % images.length)
  const goNext = () => setIndex((i) => (i + 1) % images.length)

  useEffect(() => {
    previousActiveElement.current = document.activeElement
    closeRef.current?.focus()

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previousActiveElement.current?.focus?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const image = images[index]

  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${title} — photo ${index + 1} of ${images.length}`}>
      <div className="lightbox__backdrop" aria-hidden="true" onClick={onClose} />

      <div className="lightbox__frame">
        <img src={image.src} alt={image.alt} className="lightbox__img" />
      </div>

      <button ref={closeRef} type="button" className="lightbox__close" onClick={onClose} aria-label="Close photo viewer">
        <IconClose />
      </button>

      {images.length > 1 && (
        <>
          <button type="button" className="lightbox__prev" onClick={goPrev} aria-label="Previous photo">
            <IconChevron className="lightbox__chevron lightbox__chevron--prev" />
          </button>
          <button type="button" className="lightbox__next" onClick={goNext} aria-label="Next photo">
            <IconChevron className="lightbox__chevron lightbox__chevron--next" />
          </button>
          <span className="lightbox__count mono">
            {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </span>
        </>
      )}
    </div>,
    document.body
  )
}
