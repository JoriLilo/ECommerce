import { useEffect, useState } from 'react'
import { getProducts } from '../../services/productService'
import type { Product } from '../../types/product'
import ProductCard from '../../features/products/ProductCard'
import ErrorMessage from '../../components/common/ErrorMessage'
import './HomePage.css'
import { Link } from 'react-router-dom'

// Loads catalog products for the home page.
export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  // Loads data for this view when the effect dependencies change.
  useEffect(() => {
    // Cleanup marks this effect as cancelled so pending results do not update its state.
    let cancelled = false
    // Loads all product pages and converts each response for display.
    async function loadProducts() {
      try {
        const result = await getProducts()
        if (!cancelled) setProducts(result.slice(0, 4))
      } catch (error) {
        if (!cancelled)
          setError(error instanceof Error ? error.message : 'Could not load products.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadProducts()
    return () => {
      cancelled = true
    }
  }, [])
  return (
    <div className="bg-[#FFF9FC] text-[#2E0F32]">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="home-hero-eyebrow">GOOD FINDS. EVERY DAY.</p>
          <h1>
            A little discovery.
            <br />A lot to love.
          </h1>
          <p>Shop everyday essentials and unexpected favorites, all in one place.</p>
          <Link to="/products">
            Explore products <span aria-hidden="true">→</span>
          </Link>
        </div>
        <img
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700"
          alt="Headphones on a bright yellow background"
        />
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-2 font-serif text-3xl">Explore categories</h2>
        <p className="mb-8 text-gray-500">Find exactly what you're looking for.</p>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          <Link to="/products" className="group">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500"
              alt="Fashion"
              className="h-48 w-full object-cover"
            />
            <h3 className="mt-3 font-semibold group-hover:text-[#A66A9A]">Fashion</h3>
          </Link>

          <Link to="/products" className="group">
            <img
              src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500"
              alt="Electronics"
              className="h-48 w-full object-cover"
            />
            <h3 className="mt-3 font-semibold group-hover:text-[#A66A9A]">Electronics</h3>
          </Link>

          <Link to="/products" className="group">
            <img
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500"
              alt="Home and living"
              className="h-48 w-full object-cover"
            />
            <h3 className="mt-3 font-semibold group-hover:text-[#A66A9A]">Home</h3>
          </Link>

          <Link to="/products" className="group">
            <img
              src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500"
              alt="Accessories"
              className="h-48 w-full object-cover"
            />
            <h3 className="mt-3 font-semibold group-hover:text-[#A66A9A]">Accessories</h3>
          </Link>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-[#F8F0F6] py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-serif text-3xl">Latest products</h2>

            <Link
              to="/products"
              className="text-sm font-semibold underline hover:text-[#A66A9A]"
            >
              View all
            </Link>
          </div>

          <ErrorMessage message={error} />
          {loading && <p role="status">Loading products…</p>}
          {!loading && !error && products.length === 0 && (
            <p>No approved products yet.</p>
          )}
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom banner */}
      <section className="bg-[#2E0F32] px-6 py-16 text-center text-white">
        <h2 className="mb-4 font-serif text-3xl md:text-4xl">
          Your next favorite find is here.
        </h2>

        <p className="mb-8 text-[#C98BB9]">Discover products from sellers you'll love.</p>

        <Link
          to="/products"
          className="inline-block bg-[#B7F34A] px-8 py-3 font-semibold text-[#2E0F32] hover:bg-[#C8FF69]"
        >
          Explore products
        </Link>
      </section>
    </div>
  )
}
