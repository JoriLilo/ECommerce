import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts } from '../../services/productService'
import ProductCard from '../../features/products/ProductCard'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import ErrorMessage from '../../components/common/ErrorMessage'
import type { Product } from '../../types/product'
import './ProductListPage.css'

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [params, setParams] = useSearchParams()
  const search = params.get('search') ?? ''
  const category = params.get('category') ?? ''
  const store = params.get('store') ?? ''
  const minPrice = params.get('minPrice') ?? ''
  const maxPrice = params.get('maxPrice') ?? ''
  const inStock = params.get('inStock') === 'true'
  const sort = params.get('sort') ?? ''
  const invalidPrice =
    minPrice !== '' && maxPrice !== '' && Number(minPrice) > Number(maxPrice)

  useEffect(() => {
    let cancelled = false
    async function loadProducts() {
      try {
        const loadedProducts = await getProducts()
        if (!cancelled) {
          setProducts(loadedProducts)
        }
      } catch (error) {
        if (!cancelled) {
          setError(error instanceof Error ? error.message : 'Could not load products.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    loadProducts()
    return () => {
      cancelled = true
    }
  }, [])

  function changeFilter(name: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(name, value)
    else next.delete(name)
    setParams(next, { replace: true })
  }

  function clearFilters() {
    const next = new URLSearchParams()
    if (search) next.set('search', search)
    setParams(next)
  }

  const categoryNames: string[] = []
  const storeNames: string[] = []
  const visibleProducts: Product[] = []
  const searchText = search.trim().toLowerCase()

  for (const product of products) {
    if (product.productStatus !== 'APPROVED') {
      continue
    }
    if (!categoryNames.includes(product.category.name)) {
      categoryNames.push(product.category.name)
    }
    if (!storeNames.includes(product.storeName)) {
      storeNames.push(product.storeName)
    }
    if (!product.name.toLowerCase().includes(searchText)) {
      continue
    }
    if (category && product.category.name !== category) {
      continue
    }
    if (store && product.storeName !== store) {
      continue
    }
    if (minPrice !== '' && !(product.price >= Number(minPrice))) {
      continue
    }
    if (maxPrice !== '' && !(product.price <= Number(maxPrice))) {
      continue
    }
    if (inStock && !(product.quantity > 0)) {
      continue
    }
    visibleProducts.push(product)
  }
  categoryNames.sort()
  storeNames.sort()

  if (sort === 'price-asc') {
    visibleProducts.sort((first, second) => first.price - second.price)
  } else if (sort === 'price-desc') {
    visibleProducts.sort((first, second) => second.price - first.price)
  } else if (sort === 'name-asc') {
    visibleProducts.sort((first, second) => first.name.localeCompare(second.name))
  } else if (sort === 'name-desc') {
    visibleProducts.sort((first, second) => second.name.localeCompare(first.name))
  }

  if (loading) return <Loading />

  return (
    <div className="catalog-page">
      <header className="catalog-heading">
        <h1>Products</h1>
        <p>Find your next favorite.</p>
      </header>
      <div className="catalog-layout">
        <aside className="catalog-filters" aria-label="Product filters">
          <button
            className="catalog-filter-toggle"
            aria-expanded={filtersOpen}
            aria-controls="catalog-filter-body"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            Filters {filtersOpen ? '−' : '+'}
          </button>
          <div
            id="catalog-filter-body"
            className={`catalog-filter-body ${filtersOpen ? 'is-open' : ''}`}
          >
            <div className="catalog-filter-title">
              <h2>Filters</h2>
              <button onClick={clearFilters}>Reset</button>
            </div>
            <label>
              Category
              <select
                value={category}
                onChange={(e) => changeFilter('category', e.target.value)}
              >
                <option value="">All categories</option>
                {categoryNames.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>
            <label>
              Seller
              <select
                value={store}
                onChange={(e) => changeFilter('store', e.target.value)}
              >
                <option value="">All sellers</option>
                {storeNames.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>
            <fieldset className="catalog-price">
              <legend>Price ($)</legend>
              <label>
                Min
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => changeFilter('minPrice', e.target.value)}
                />
              </label>
              <label>
                Max
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Any"
                  value={maxPrice}
                  onChange={(e) => changeFilter('maxPrice', e.target.value)}
                />
              </label>
            </fieldset>
            {invalidPrice && (
              <p role="alert">Minimum price must not exceed maximum price.</p>
            )}
            <label className="catalog-stock">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => changeFilter('inStock', e.target.checked ? 'true' : '')}
              />{' '}
              In stock only
            </label>
          </div>
        </aside>
        <section className="catalog-results" aria-label="Products">
          <div className="catalog-toolbar">
            <div aria-live="polite">
              <strong>
                {visibleProducts.length}{' '}
                {visibleProducts.length === 1 ? 'product' : 'products'}
              </strong>
              {search && (
                <p>
                  Results for “{search}”{' '}
                  <button onClick={() => changeFilter('search', '')}>Clear search</button>
                </p>
              )}
            </div>
            <label>
              Sort by
              <select value={sort} onChange={(e) => changeFilter('sort', e.target.value)}>
                <option value="">Default</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="name-asc">Name: A–Z</option>
                <option value="name-desc">Name: Z–A</option>
              </select>
            </label>
          </div>
          <ErrorMessage message={error} />
          {!error &&
            (visibleProducts.length === 0 ? (
              <EmptyState message="No products match. Try changing your filters or search." />
            ) : (
              <div className="product-grid">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ))}
        </section>
      </div>
    </div>
  )
}
