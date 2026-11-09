import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminOrders, getAdminProducts, getAdminUsers } from '../../services/adminService'
import ErrorMessage from '../../components/common/ErrorMessage'
import type { ProductResponse, ProductStatus } from '../../types/product'
import type { OrderSummary } from '../../types/order'
import type { AdminUser } from '../../services/adminService'
import './AdminDashboardPage.css'

// Collects every page so dashboard counts are not limited to the first 20 entries.
async function loadAllPages<T>(
  loadPage: (page: number) => Promise<{ content: T[]; totalPages: number }>,
): Promise<T[]> {
  const items: T[] = []
  let page = 0
  let totalPages = 1

  while (page < totalPages) {
    const result = await loadPage(page)
    items.push(...result.content)
    totalPages = result.totalPages
    page++
  }

  return items
}

// Loads marketplace-wide data rather than the signed-in seller's products and orders.
export default function AdminDashboardPage() {
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshCount, setRefreshCount] = useState(0)
  const [users, setUsers] = useState<AdminUser[]>([])

  useEffect(function loadDashboardEffect() {
    let cancelled = false

    async function loadStats() {
      setLoading(true)
      setError(null)

      try {
        // Explicit statuses avoid relying on an undocumented "all products" filter.
        const statuses: ProductStatus[] = ['PENDING', 'APPROVED', 'REJECTED']
        async function loadProductsForStatus(status: ProductStatus) {
          function loadProductPage(page: number) {
            return getAdminProducts(page, status)
          }
          return loadAllPages(loadProductPage)
        }

        function loadOrderPage(page: number) {
          return getAdminOrders(page, '')
        }

        function loadUserPage(page: number) {
          // Empty filters include all account roles and statuses.
          return getAdminUsers(page, '', '')
        }

        const productRequests: Promise<ProductResponse[]>[] = []
        for (const status of statuses) {
          productRequests.push(loadProductsForStatus(status))
        }

        const [productGroups, loadedOrders, loadedUsers] = await Promise.all([
          Promise.all(productRequests),
          loadAllPages(loadOrderPage),
          loadAllPages(loadUserPage),
        ])

        if (!cancelled) {
          // Avoid counting the same product twice across status pages.
          const uniqueProducts = new Map<number, ProductResponse>()
          for (const group of productGroups) {
            for (const product of group) {
              uniqueProducts.set(product.id, product)
            }
          }
          setProducts([...uniqueProducts.values()])
          setOrders(loadedOrders)
          setUsers(loadedUsers)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not load dashboard statistics.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadStats()

    return function cleanup() {
      // Ignore results from a previous load or a page that has been left.
      cancelled = true
    }
  }, [refreshCount])

  const activeOrders: OrderSummary[] = []
  for (const order of orders) {
    if (order.status === 'PAID' || order.status === 'PROCESSING') {
      activeOrders.push(order)
    }
  }

  const outOfStock: ProductResponse[] = []
  for (const product of products) {
    if (product.quantity === 0) outOfStock.push(product)
  }

  const totalUsers = users.length

  function incrementRefreshCount(count: number) {
    return count + 1
  }

  function handleRefresh() {
    setRefreshCount(incrementRefreshCount)
  }

  return (
    <section className="content-page">
      <h1>Admin Dashboard</h1>
      <p className="page-subtitle">Manage the marketplace.</p>
      <button
        type="button"
        className="admin-stats-refresh"
        disabled={loading}
        onClick={handleRefresh}
      >
        {loading ? 'Loading statistics…' : 'Refresh statistics'}
      </button>

      <ErrorMessage message={error} />
      {loading && <p role="status">Loading marketplace statistics…</p>}
      {!loading && !error && (
        <>
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <h2>Total products</h2>
              <strong>{products.length}</strong>
              <p>Pending, approved, and rejected products. Deleted products are excluded.</p>
            </div>
            <div className="admin-stat-card">
              <h2>Total orders</h2>
              <strong>{activeOrders.length}</strong>
              <p>Marketplace orders marked paid or processing.</p>
            </div>
             <div className="admin-stat-card">
              <h2>Total users</h2>
              <strong>{totalUsers}</strong>
              <p>All customer, seller, and admin accounts, including suspended accounts.</p>
            </div>
          
            
            <div className="admin-stat-card">
              <h2>Out of stock</h2>
              <strong>{outOfStock.length}</strong>
              <p>Non-deleted products with zero stock.</p>
            </div>
          </div>
        </>
      )}
      <p>
        <Link to="/profile">My account</Link> · <Link to="/products">Back to shop</Link>
      </p>
    </section>
  )
}
