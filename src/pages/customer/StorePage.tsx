import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getStore } from '../../services/storeService'
import { getStoreProducts } from '../../services/productService'
import type { Store } from '../../types/seller'
import type { Product } from '../../types/product'
import ProductCard from '../../features/products/ProductCard'
import ErrorMessage from '../../components/common/ErrorMessage'

export default function StorePage() {
  const { id } = useParams()
  const [store, setStore] = useState<Store | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setStore(null)
      setProducts([])
      setError(null)
      try {
        const storeId = Number(id)
        if (!Number.isInteger(storeId) || storeId < 1) throw new Error('Store not found.')
        const data = await getStore(storeId)
        const items = await getStoreProducts(storeId)
        if (!cancelled) {
          setStore(data)
          setProducts(items)
        }
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Could not load store.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) return <p role="status">Loading store…</p>
  return (
    <section className="content-page">
      <Link to="/products">Browse all products</Link>
      <ErrorMessage message={error} />
      {store && (
        <>
          <h1>{store.name}</h1>
          <p>{store.description}</p>
          <h2>Products</h2>
          {products.length === 0 && <p>This store has no published products yet.</p>}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{ ...product, storeName: store.name }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
