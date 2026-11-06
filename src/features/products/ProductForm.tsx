import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import FormField from '../../components/common/FormField'
import ErrorMessage from '../../components/common/ErrorMessage'
import type { ProductInput } from '../../services/productService'
import { getCategories } from '../../services/categoryService'
import type { Category } from '../../types/category'

interface ProductFormProps {
  initial?: ProductInput
  requireImage?: boolean
  submitText: string
  onSubmit: (data: ProductInput, image: File | null) => Promise<void>
}

export default function ProductForm({
  initial,
  requireImage = false,
  submitText,
  onSubmit,
}: ProductFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [price, setPrice] = useState(String(initial?.price ?? ''))
  const [quantity, setQuantity] = useState(String(initial?.quantity ?? ''))
  const [categoryId, setCategoryId] = useState(String(initial?.categoryId ?? ''))
  const [image, setImage] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categoryError, setCategoryError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function loadCategories() {
      try {
        const data = await getCategories()
        if (!cancelled) setCategories(data)
      } catch (err) {
        if (!cancelled) {
          setCategoryError(err instanceof Error ? err.message : 'Could not load categories.')
        }
      } finally {
        if (!cancelled) setLoadingCategories(false)
      }
    }
    loadCategories()
    return () => { cancelled = true }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSaving(true)
    try {
      if (!name.trim() || !description.trim())
        throw new Error('Name and description are required.')
      if (Number(price) < 0.01 || !Number.isFinite(Number(price)))
        throw new Error('Enter a valid price greater than zero.')
      if (!Number.isInteger(Number(quantity)) || Number(quantity) < 0)
        throw new Error('Stock must be a whole number of zero or more.')
      if (!categories.some((category) => category.id === Number(categoryId)))
        throw new Error('Choose a category.')
      if (requireImage && !image) throw new Error('Choose a product picture.')
      if (image && !['image/jpeg', 'image/png', 'image/webp'].includes(image.type))
        throw new Error('Choose a JPEG, PNG or WebP image.')
      if (image && image.size > 5 * 1024 * 1024)
        throw new Error('Choose an image smaller than 5 MB.')
      await onSubmit(
        {
          name,
          description,
          price: Number(price),
          quantity: Number(quantity),
          categoryId: Number(categoryId),
        },
        image,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save product.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="checkout">
      <FormField label="Name" value={name} onChange={setName} />
      <FormField label="Description" value={description} onChange={setDescription} />
      <FormField label="Price" type="number" value={price} onChange={setPrice} />
      <FormField label="Quantity" type="number" value={quantity} onChange={setQuantity} />
      <div className="form-group">
        <label htmlFor="product-category" className="form-label">Category</label>
        <select
          id="product-category"
          className="form-input"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          required
          disabled={saving || loadingCategories || categories.length === 0}
        >
          <option value="">
            {loadingCategories ? 'Loading categories…' : 'Choose a category'}
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <ErrorMessage message={categoryError} />
        {!loadingCategories && !categoryError && categories.length === 0 && (
          <p>No categories available. Ask an admin to add categories first.</p>
        )}
      </div>
      {requireImage && (
        <div className="form-group">
          <label htmlFor="new-product-image" className="form-label">
            Product picture
          </label>
          <input
            id="new-product-image"
            className="form-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            disabled={saving}
            onChange={(event) => setImage(event.target.files?.[0] ?? null)}
          />
          <p>JPEG, PNG or WebP. Maximum size: 5 MB.</p>
        </div>
      )}
      <ErrorMessage message={error} />
      <button type="submit" className="btn-primary" disabled={saving || loadingCategories || categories.length === 0}>
        {saving ? 'Saving…' : submitText}
      </button>
    </form>
  )
}
