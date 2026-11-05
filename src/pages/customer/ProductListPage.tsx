import { useEffect, useState } from 'react'
import { getProducts } from '../../services/productService'
import ProductCard from '../../features/products/ProductCard'
import SearchInput from '../../components/ui/SearchInput'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import ErrorMessage from '../../components/common/ErrorMessage'
import type { Product } from '../../types/product'

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const visible = products
    .filter((p) => p.productStatus === 'APPROVED')
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <Loading />

  return (
    <div>
      <h1>Products</h1>
      <SearchInput value={search} onChange={setSearch} />
      <ErrorMessage message={error} />
      {visible.length === 0 ? (
        <EmptyState message="No products found." />
      ) : (
        <div className="product-grid">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}