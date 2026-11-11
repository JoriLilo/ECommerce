import { useState } from 'react'
import type { MouseEvent } from 'react'
import './ProductGallery.css'

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(0)
  const activeIndex = selected < images.length ? selected : 0
  if (images.length === 0) return <p>No image uploaded yet.</p>

  function handleSelect(event: MouseEvent<HTMLButtonElement>) {
    setSelected(Number(event.currentTarget.dataset.index))
  }

  const thumbnails = []
  for (let index = 0; index < images.length; index++) {
    thumbnails.push(
      <button key={index} type="button" data-index={index} onClick={handleSelect}
        aria-label={`Show photo ${index + 1} of ${name}`} aria-pressed={index === activeIndex}>
        <img src={images[index]} alt="" />
      </button>,
    )
  }

  return (
    <div className="product-gallery">
      <img className="product-gallery-main" src={images[activeIndex]} alt={`${name} — photo ${activeIndex + 1}`} />
      {images.length > 1 && <div className="product-gallery-thumbnails" role="group" aria-label="Product photos">{thumbnails}</div>}
    </div>
  )
}
