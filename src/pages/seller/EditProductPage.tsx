import ProductImagePicker from '../../features/products/ProductImagePicker'
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
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState('')
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
      setFiles([])
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

  // Upload files sequentially to respect the backend's eight-image limit.
  async function handleUpload() {
    if (!product || files.length === 0 || uploading) return
    if (product.images.length + files.length > 8) {
      setError(`You can add ${Math.max(0, 8 - product.images.length)} more picture(s).`)
      return
    }
    for (const file of files) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
        setError('Each picture must be JPEG, PNG or WebP and 5 MB or smaller.')
        return
      }
    }
    setUploading(true)
    setError(null)
    setMessage('')
    let completed = 0
    try {
      for (const file of files) {
        setUploadProgress(`Uploading picture ${completed + 1} of ${files.length}…`)
        await uploadProductImage(Number(id), file)
        completed++
        // A retry sends only files not yet confirmed as uploaded.
        setFiles(files.slice(completed))
      }
      setMessage(`${completed} picture(s) uploaded.`)
    } catch (err) {
      const reason = err instanceof Error ? err.message : 'Please try again.'
      setError(`${completed} picture(s) uploaded. Remaining files are selected for retry. ${reason}`)
    } finally {
      // Refresh even after a partial failure so existing photos stay visible.
      try {
        setProduct(await getMyProduct(Number(id)))
      } catch {
        setError('Could not refresh the product photos. Reload this page before uploading again to check which photos were saved.')
      }
      setUploadProgress('')
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
            <p>{product.images.length}/8 photos already uploaded. Select more below, then press Upload selected photos.</p>
            <ProductImagePicker files={files} onChange={setFiles} onError={setError}
              disabled={uploading} maxFiles={Math.max(0, 8 - product.images.length)} />
            {uploadProgress && <p role="status">{uploadProgress}</p>}
            <button
              className="btn btn-primary"
              type="button"
              disabled={files.length === 0 || uploading || product.images.length >= 8}
              onClick={handleUpload}
            >
              {uploading ? 'Uploading…' : `Upload selected photos (${files.length})`}
            </button>
          </section>
          <h2>Product details</h2>
          <ProductForm
            key={product.id}
            submitText="Save product details"
            initial={{
              name: product.name,
              description: product.description,
              price: product.price,
              quantity: product.quantity,
              categoryId: product.category.id,
            }}
            onSubmit={handleSave}
          />

        </>
      )}
    </div>
  )
}
