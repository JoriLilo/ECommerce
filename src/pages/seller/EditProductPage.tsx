import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import ProductForm from '../../features/products/ProductForm'
import {
  getMyProduct,
  updateProduct,
  uploadProductImage,
} from '../../services/productService'
import type { ProductInput } from '../../services/productService'
import type { Product } from '../../types/product'
import ErrorMessage from '../../components/common/ErrorMessage'
import StatusBadge from '../../components/common/StatusBadge'

export default function EditProductPage() {
  const { id } = useParams()
  const location = useLocation()
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    async function loadProduct() {
      setLoading(true)
      setError(null)
      try {
        const result = await getMyProduct(Number(id))
        if (!cancelled) setProduct(result)
      } catch (error) {
        if (!cancelled)
          setError(error instanceof Error ? error.message : 'Could not load product.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadProduct()
    return () => {
      cancelled = true
    }
  }, [id])

  async function handleSave(data: ProductInput) {
    const result = await updateProduct(Number(id), data)
    setProduct(result)
    setMessage('Product details saved.')
  }

  async function handleUpload() {
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Choose a JPEG, PNG or WebP image.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Choose an image smaller than 5 MB.')
      return
    }
    setUploading(true)
    setError(null)
    setMessage('')
    try {
      await uploadProductImage(Number(id), file)
      const result = await getMyProduct(Number(id))
      setProduct(result)
      setFile(null)
      setMessage('Image uploaded.')
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Could not upload image. Your product details are saved.',
      )
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <p role="status">Loading product…</p>

  return (
    <div>
      <Link to="/seller/products">Back to My Products</Link>
      <h1>Edit product and images</h1>
      {location.state?.created && (
        <p>
          Your product was saved. Upload images below. It will appear in the shop after
          admin approval.
        </p>
      )}
      <ErrorMessage message={error} />
      {message && <p role="status">{message}</p>}
      {product && (
        <>
          <StatusBadge status={product.productStatus} />
          <ProductForm
            key={product.id}
            submitText="Save changes"
            initial={{
              name: product.name,
              description: product.description,
              price: product.price,
              quantity: product.quantity,
              categoryId: product.category.id,
            }}
            onSubmit={handleSave}
          />
          <section className="seller-panel">
            <h2>Product images</h2>
            <div className="seller-image-list">
              {product.images.map((url) => (
                <img
                  className="seller-product-image"
                  key={url}
                  src={url}
                  alt={product.name}
                />
              ))}
            </div>
            <label htmlFor="product-image">Choose a JPEG, PNG or WebP image</label>
            <input
              id="product-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={uploading}
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
            <p>You can upload up to 8 images, one at a time. Maximum size: 5 MB each.</p>
            <button
              className="btn btn-primary"
              type="button"
              disabled={!file || uploading || product.images.length >= 8}
              onClick={handleUpload}
            >
              {uploading ? 'Uploading…' : 'Upload image'}
            </button>
          </section>
        </>
      )}
    </div>
  )
}
