import { useEffect, useState } from 'react'
import type { Product } from '../../types/product'
import type { SellerOrderDetails } from '../../types/order'
import ErrorMessage from '../../components/common/ErrorMessage'
import { Link } from 'react-router-dom'
import { getMyProducts } from '../../services/productService'
import { getSellerOrders } from '../../services/orderService'
import { getUser } from '../../utils/auth'

// Loads the seller's products and orders for the dashboard.
export default function SellerDashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<SellerOrderDetails[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  // Loads data for this view when the effect dependencies change.
  useEffect(() => {
    // Cleanup marks this effect as cancelled so pending results do not update its state.
    let cancelled = false
    // Loads all product pages and converts each response for display.
    async function loadProducts() {
      try {
        const result = await getMyProducts()
        if (!cancelled) setProducts(result)
        const sellerOrders = await getSellerOrders()
        if (!cancelled) setOrders(sellerOrders)
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
  const activeOrders = orders.filter(
    (order) => order.status === 'PAID' || order.status === 'PROCESSING',
  )

  return (
    <div>
      <h1>Seller Dashboard</h1>
      <p>Welcome, {getUser()?.fullName}. Manage your products and orders here.</p>
      <p className="seller-note">
        Products and orders are loaded from the server. Unpaid orders are not shown.
      </p>
      <ErrorMessage message={error} />
      {loading && <p role="status">Loading products…</p>}
      {!loading && !error && (
        <div className="seller-stats">
          <div className="seller-panel">
            <h2>My Products</h2>
            <strong>{products.length}</strong>
          </div>
          <div className="seller-panel">
            <h2>Orders to prepare</h2>
            <strong>{activeOrders.length}</strong>
          </div>
          <div className="seller-panel">
            <h2>Out of stock</h2>
            <strong>{products.filter((product) => product.quantity === 0).length}</strong>
          </div>
        </div>
      )}
      <div className="seller-actions">
        <Link to="/seller/products/new">Add Product</Link>
        <Link to="/seller/products">Manage Products</Link>
        <Link to="/seller/orders">View Orders</Link>
      </div>
    </div>
  )
}
