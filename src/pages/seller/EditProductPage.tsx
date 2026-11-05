import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductForm from '../../features/products/ProductForm'
import { getProduct, updateProduct } from '../../services/productService'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import type { Product } from '../../types/product'

export default function EditProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProduct(Number(id))
      .then((p) => setProduct(p ?? null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loading />
  if (!product) return <EmptyState message="Product not found." />

  return (
    <div>
      <h1>Edit product</h1>
      <ProductForm
        submitText="Save changes"
        initial={{
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          categoryId: product.category.id,
          imageUrl: product.images[0] ?? '',
        }}
        onSubmit={async (data) => {
          await updateProduct(product.id, data)
          navigate('/seller/products')
        }}
      />
    </div>
  )
}