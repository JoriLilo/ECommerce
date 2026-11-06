import { useEffect, useState } from 'react'
import { getSellerProfile } from '../../services/sellerService'
import { Navigate, NavLink, Outlet } from 'react-router-dom'
import './SellerLayout.css'

export default function SellerLayout() {
  const [approved, setApproved] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    async function checkApproval() {
      try {
        const profile = await getSellerProfile()
        if (!cancelled) {
          setApproved(profile.status === 'APPROVED')
        }
      } catch {
        if (!cancelled) {
          setApproved(false)
        }
      }
    }
    checkApproval()
    return () => {
      cancelled = true
    }
  }, [])

  if (approved === null)
    return (
      <p className="seller-area" role="status">
        Checking seller access…
      </p>
    )
  if (!approved) return <Navigate to="/seller/application-status" replace />

  return (
    <section className="seller-area">
      <nav className="seller-navigation" aria-label="Seller navigation">
        <NavLink to="/seller/dashboard">Dashboard</NavLink>
        <NavLink to="/seller/store">My Store</NavLink>
        <NavLink to="/seller/profile">Business Profile</NavLink>
        <NavLink to="/seller/products">My Products</NavLink>
        <NavLink to="/seller/products/new">Add Product</NavLink>
        <NavLink to="/seller/orders">Orders</NavLink>
      </nav>
      <Outlet />
    </section>
  )
}
