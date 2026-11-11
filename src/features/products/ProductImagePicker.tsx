import { useEffect, useId, useRef } from 'react'
import type { ChangeEvent, MouseEvent } from 'react'
import './ProductImagePicker.css'

interface Props {
  files: File[]
  onChange: (files: File[]) => void
  onError: (message: string | null) => void
  disabled?: boolean
  maxFiles?: number
}

// Object URLs belong to a mounted preview and are released when its file changes.
function PhotoPreview({ file, label }: { file: File; label: string }) {
  const image = useRef<HTMLImageElement>(null)
  useEffect(function attachPreview() {
    const url = URL.createObjectURL(file)
    if (image.current) image.current.src = url
    return function cleanup() { URL.revokeObjectURL(url) }
  }, [file])
  return <img ref={image} alt={label} />
}

// Each selection adds to the queue rather than replacing previously selected photos.
export default function ProductImagePicker({ files, onChange, onError, disabled = false, maxFiles = 8 }: Props) {
  const id = useId()
  function handleChoose(event: ChangeEvent<HTMLInputElement>) {
    const additions = Array.from(event.target.files ?? [])
    // Reset the native input so the same file can be selected again after removal.
    event.target.value = ''
    if (additions.length === 0) return
    const next = [...files]
    for (const file of additions) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
        onError('Choose JPEG, PNG or WebP pictures, up to 5 MB each.')
        return
      }
      let duplicate = false
      for (const existing of next) {
        if (existing.name === file.name && existing.size === file.size && existing.lastModified === file.lastModified) duplicate = true
      }
      if (!duplicate) next.push(file)
    }
    if (next.length > maxFiles) {
      onError(`You can select up to ${maxFiles} additional picture(s). Remove a selected photo first.`)
      return
    }
    onError(null)
    onChange(next)
  }

  function handleRemove(event: MouseEvent<HTMLButtonElement>) {
    const index = Number(event.currentTarget.dataset.index)
    const next = [...files]
    next.splice(index, 1)
    onChange(next)
    onError(null)
  }

  const cards = []
  for (let index = 0; index < files.length; index++) {
    cards.push(<li key={`${files[index].name}-${index}`}>
      <PhotoPreview file={files[index]} label={`Selected photo ${index + 1}`} />
      <span>{files[index].name}</span>
      <button type="button" data-index={index} onClick={handleRemove} disabled={disabled} aria-label={`Remove ${files[index].name}`}>Remove</button>
    </li>)
  }
  return (
    <div className="product-image-picker">
      <label htmlFor={id}>Add product photos</label>
      <input id={id} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleChoose}
        disabled={disabled || files.length >= maxFiles} />
      <p>Choose photos one at a time or several together. Each selection adds to the list below. JPEG, PNG or WebP, up to 5 MB each.</p>
      <p role="status">{files.length} selected · {Math.max(0, maxFiles - files.length)} spaces remaining</p>
      {cards.length > 0 && <ul>{cards}</ul>}
    </div>
  )
}
