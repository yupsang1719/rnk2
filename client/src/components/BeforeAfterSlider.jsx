import { useState } from 'react'
import { hidePhotoOnError } from '../utils/imageFallback'

export default function BeforeAfterSlider({ beforeImage, afterImage, title, beforeTag = 'Before', afterTag = 'After' }) {
  const [value, setValue] = useState(50)

  return (
    <div className="ba-slider">
      <div className="ba-slider__frame" style={{ '--reveal': `${value}%` }}>
        <img
          className="ba-slider__img ba-slider__img--before"
          src={beforeImage.src}
          alt={beforeImage.alt}
          onError={hidePhotoOnError}
        />
        <div className="ba-slider__after">
          <img
            className="ba-slider__img"
            src={afterImage.src}
            alt={afterImage.alt}
            onError={hidePhotoOnError}
          />
        </div>

        <div className="ba-slider__divider" aria-hidden="true" />

        {beforeTag && <span className="ba-slider__tag ba-slider__tag--before mono">{beforeTag}</span>}
        {afterTag && <span className="ba-slider__tag ba-slider__tag--after mono">{afterTag}</span>}

        <input
          type="range"
          className="ba-slider__input"
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-label={`Compare before and after photos for ${title}`}
          aria-valuetext={`${value}% revealed`}
        />
      </div>
    </div>
  )
}
