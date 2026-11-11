import ProductImagePicker from './ProductImagePicker'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import FormField from '../../components/common/FormField'
import ErrorMessage from '../../components/common/ErrorMessage'
import type { ProductInput } from '../../services/productService'
import { getCategories } from '../../services/categoryService'
import type { Category } from '../../types/category'

// Describes the values and callbacks accepted by this component.
interface ProductFormProps {
  initial?: ProductInput
  requireImage?: boolean
  submitText: string
  onSubmit: (data: ProductInput, images: File[]) => Promise<void>
}

// Collects product details, loads categories, and validates before calling onSubmit.
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
  const [images, setImages] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const cannotSave = saving || loadingCategories || categories.length === 0

  // Loads data for this view when the effect dependencies change.
  useEffect(() => {
    // Cleanup marks this effect as cancelled so pending results do not update its state.
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

  // Checks the product values and selected category before submission.
  function validateProduct(product: ProductInput) {
    if (!name.trim() || !description.trim())
      throw new Error('Name and description are required.')
    if (product.price < 0.01 || !Number.isFinite(product.price))
      throw new Error('Enter a valid price greater than zero.')
    if (!Number.isInteger(product.quantity) || product.quantity < 0)
      throw new Error('Stock must be a whole number of zero or more.')
    const selectedCategory = categories.find((category) => category.id === product.categoryId)
    if (!selectedCategory)
      throw new Error('Choose a category.')
    if (requireImage && images.length === 0) throw new Error('Choose at least one product picture.')
    if (images.length > 8) throw new Error('Choose up to 8 pictures.')
    for (const image of images) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(image.type))
        throw new Error('Choose JPEG, PNG or WebP images.')
      if (image.size > 5 * 1024 * 1024)
        throw new Error('Each picture must be 5 MB or smaller.')
    }
  }

  // Converts form values, validates them, and waits for the parent save operation.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return
    setError(null)
    setSaving(true)

    const product: ProductInput = {
      name,
      description,
      price: Number(price),
      quantity: Number(quantity),
      categoryId: Number(categoryId),
    }

    try {
      validateProduct(product)
      await onSubmit(product, images)
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
        <ProductImagePicker files={images} onChange={setImages} onError={setError} disabled={saving} />
      )}
      <ErrorMessage message={error} />
      <button type="submit" className="btn-primary" disabled={cannotSave}>
        {saving ? 'Saving…' : submitText}
      </button>
    </form>
  )
}
