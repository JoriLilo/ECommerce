import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductForm from '../../features/products/ProductForm'
import type { ProductInput } from '../../services/productService'
import {
  createProduct,
  updateProduct,
  uploadProductImage,
} from '../../services/productService'

// Creates a product and uploads its required image before returning to the list.
export default function AddProductPage() {
  const navigate = useNavigate()
  const [productId, setProductId] = useState<number | null>(null)

  // Keep successful uploads on retries so a partial failure does not upload them twice.
  const uploadedImages = useRef(new Set<File>())
  const [uploadProgress, setUploadProgress] = useState('')

  // Saves the product details before handling any separate image upload.
  async function handleSave(data: ProductInput, images: File[]) {
    if (images.length === 0) throw new Error('Choose at least one product picture.')
    const allSelected = new Set([...uploadedImages.current, ...images])
    if (allSelected.size > 8) throw new Error('A product can have at most 8 pictures. Open the saved product to manage its images.')
    let savedId = productId
    if (savedId === null) {
      const product = await createProduct(data)
      savedId = product.id
      setProductId(savedId)
    } else {
      await updateProduct(savedId, data)
    }
    try {
      for (let index = 0; index < images.length; index++) {
        const image = images[index]
        if (uploadedImages.current.has(image)) continue
        setUploadProgress(`Uploading picture ${index + 1} of ${images.length}…`)
        await uploadProductImage(savedId, image)
        uploadedImages.current.add(image)
      }
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Please try again.'
      throw new Error(
        `Product details are saved. ${uploadedImages.current.size} picture(s) uploaded; another upload failed. Retry to continue, or open the saved product to check its photos. ${reason}`,
      )
    } finally {
      setUploadProgress('')
    }
    navigate('/seller/products')
  }

  return (
    <div>
      <h1>Add product</h1>
      <p>
        Enter the product details and choose up to 8 pictures. Your product will wait for admin
        approval.
      </p>
      {productId !== null && (
        <p>
          Your product details are saved. Retry saving to continue the uploads, or{' '}
          <Link to={`/seller/products/${productId}/edit`}>open the saved product</Link>.
        </p>
      )}
      {uploadProgress && <p role="status">{uploadProgress}</p>}
      <ProductForm requireImage submitText="Save product" onSubmit={handleSave} />
    </div>
  )
}
