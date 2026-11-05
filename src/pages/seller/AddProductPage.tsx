import { useNavigate } from 'react-router-dom'
import ProductForm from '../../features/products/ProductForm'
import { createProduct } from '../../services/productService'

export default function AddProductPage() {
  const navigate = useNavigate()
  return (
    <div>
      <h1>Add product</h1>
      <ProductForm
        submitText="Save product"
        onSubmit={async (data) => {
          await createProduct(data)
          navigate('/seller/products')
        }}
      />
    </div>
  )
}