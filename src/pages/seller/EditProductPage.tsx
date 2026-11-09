import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import ProductForm from '../../features/products/ProductForm'
import {
  getMyProduct,
  deleteProductImage,
  updateProduct,
  uploadProductImage,
} from '../../services/productService'
import type { ProductInput } from '../../services/productService'
import type { Product } from '../../types/product'
import ErrorMessage from '../../components/common/ErrorMessage'
import StatusBadge from '../../components/common/StatusBadge'

// Loads the seller's product and handles detail and image changes.
export default function EditProductPage() {
  const { id } = useParams()
  const location = useLocation()
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  // Loads data for this view when the effect dependencies change.
  useEffect(() => {
    // Cleanup marks this effect as cancelled so pending results do not update its state.
    let cancelled = false
    async function loadProduct() {
      setLoading(true)
      setError(null)
      setProduct(null)
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

  // Saves the edited product details and updates the page state.
  async function handleSave(data: ProductInput) {
    const result = await updateProduct(Number(id), data)
    setProduct(result)
    setMessage('Product details saved.')
  }

  // Uploads the selected image and refreshes the product details.
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

  // Deletes the selected image and refreshes the product details.
  async function handleDeleteImage(imageId: number) {
    if (!window.confirm('Delete this product image?')) return
    setUploading(true)
    setError(null)
    setMessage('')
    try {
      await deleteProductImage(Number(id), imageId)
      setProduct(await getMyProduct(Number(id)))
      setMessage('Image deleted.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete image.')
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
              {product.imageDetails.map((image) => (
                <div key={image.id}>
                  <img
                    className="seller-product-image"
                    src={image.url}
                    alt={product.name}
                  />
                  <button
                    type="button"
                    className="btn btn-danger"
                    disabled={uploading}
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    Delete image
                  </button>
                </div>
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
