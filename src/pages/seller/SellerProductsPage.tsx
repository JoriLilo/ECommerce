
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
    <main className="products-page">

      <section className="products-hero">
        <p className="products-eyebrow">DISCOVER VIA BUY</p>
        <h1>Find something <span>you love.</span></h1>
        <p className="products-subtitle">
          Explore our collection and discover products worth having.
        </p>
      </section>

      <section className="products-content">

        <div className="products-toolbar">
          <div>
            <h2>All Products</h2>
            <p>{visible.length} products available</p>
          </div>

          <div className="products-search">
            <SearchInput value={search} onChange={setSearch} />
          </div>
        </div>

        <ErrorMessage message={error} />

        {visible.length === 0 ? (
          <EmptyState message="No products found. Try another search." />
        ) : (
          <div className="product-grid">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

      </section>
    </main>
  )
}
