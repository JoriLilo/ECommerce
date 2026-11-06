import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductForm from '../../features/products/ProductForm'
import type { ProductInput } from '../../services/productService'
import {
  createProduct,
  updateProduct,
  uploadProductImage,
} from '../../services/productService'

export default function AddProductPage() {
  const navigate = useNavigate()
  const [productId, setProductId] = useState<number | null>(null)

  async function handleSave(data: ProductInput, image: File | null) {
    if (!image) throw new Error('Choose a product picture.')
    let savedId = productId
    if (savedId === null) {
      const product = await createProduct(data)
      savedId = product.id
      setProductId(savedId)
    } else {
      await updateProduct(savedId, data)
    }
    try {
      await uploadProductImage(savedId, image)
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Please try again.'
      throw new Error(
        `Product details are saved, but the picture could not be uploaded. ${reason}`,
      )
    }
    navigate('/seller/products')
  }

  return (
    <div>
      <h1>Add product</h1>
      <p>
        Enter the product details and choose a picture. Your product will wait for admin
        approval.
      </p>
      {productId !== null && (
        <p>
          Your product details are saved. Retry saving to upload the picture, or{' '}
          <Link to={`/seller/products/${productId}/edit`}>open the saved product</Link>.
        </p>
      )}
      <ProductForm requireImage submitText="Save product" onSubmit={handleSave} />
    </div>
  )
}
