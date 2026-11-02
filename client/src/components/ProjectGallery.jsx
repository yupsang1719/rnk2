import { useState } from 'react'
import { IconPlus } from './icons'
import Lightbox from './Lightbox'
import { hidePhotoOnError } from '../utils/imageFallback'

export default function ProjectGallery({ images, title }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const activeImage = images[activeIndex] || images[0]

  return (
    <div className="project-gallery">
      <button
        type="button"
        className="project-photo project-gallery__main"
        onClick={() => setLightboxOpen(true)}
      >
        <img src={activeImage.src} alt={activeImage.alt} onError={hidePhotoOnError} />
        <span className="project-gallery__expand" aria-hidden="true">
          <IconPlus className="project-gallery__expand-icon" />
          View full size
        </span>
      </button>

      {images.length > 1 && (
        <div className="project-gallery__thumbs" role="tablist" aria-label={`${title} photos`}>
          {images.map((image, i) => (
            <button
              key={`${image.src}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={image.alt || `Photo ${i + 1}`}
              className={`project-gallery__thumb${i === activeIndex ? ' is-active' : ''}`}
              onClick={() => setActiveIndex(i)}
            >
              <img src={image.thumb || image.src} alt="" onError={hidePhotoOnError} loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <Lightbox
          images={images}
          initialIndex={activeIndex}
          title={title}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  )
}
