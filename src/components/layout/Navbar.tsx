import useCart from '../../hooks/useCart'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getUser, logout } from '../../utils/auth'

// Displays navigation, product search, and the total cart quantity.
export default function Navbar() {
  const { items } = useCart()
  let cartCount = 0
  for (const item of items) {
    cartCount = cartCount + item.quantity
  }
  const user = getUser()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  // Trims the search text and navigates to the product results URL.
  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const search = String(new FormData(event.currentTarget).get('search') ?? '').trim()
    const next = new URLSearchParams()
    if (search) next.set('search', search)
    navigate(`/products${next.size ? `?${next}` : ''}`)
  }
  const [menuOpen, setMenuOpen] = useState(false)

  // Clears the saved session and opens the login page.
  function handleLogout() {
    logout()
    window.location.href = '/login'
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          Via<span>Buy</span>
        </Link>
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/products" className="nav-link">
          Products
        </Link>

        {user?.role === 'SELLER' && (
          <Link to="/seller/products" className="nav-link">
            My Products
          </Link>
        )}

        {user?.role === 'ADMIN' && (
          <Link to="/admin/dashboard" className="nav-link">
            Admin
          </Link>
        )}
      </div>

      <form className="navbar-search" role="search" onSubmit={handleSearch}>
        <input
          key={params.get('search') ?? ''}
          type="search"
          name="search"
          defaultValue={params.get('search') ?? ''}
          placeholder="Search products…"
          aria-label="Search products"
        />
        <button type="submit">Search</button>
      </form>

      <div className="navbar-right">
        {(!user || user.role === 'CUSTOMER') && (
          <Link to="/cart" className="nav-link cart-link">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Cart ({cartCount})
          </Link>
        )}

        {user ? (
          <div className="profile-menu">
            <button className="profile-button" onClick={() => setMenuOpen(!menuOpen)}>
              <span className="profile-circle">
                {user.fullName?.charAt(0).toUpperCase()}
              </span>
            </button>

            {menuOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <strong>{user.fullName}</strong>
                  <span>{user.role}</span>
                </div>

                <div className="dropdown-divider" />

                {user.role !== 'ADMIN' && (
                  <Link
                    to="/seller/application-status"
                    onClick={() => setMenuOpen(false)}
                  >
                    Seller application
                  </Link>
                )}

                <Link to="/profile" onClick={() => setMenuOpen(false)}>
                  My Profile
                </Link>

                {user.role === 'CUSTOMER' && (
                  <Link to="/orders" onClick={() => setMenuOpen(false)}>
                    My Orders
                  </Link>
                )}

                <div className="dropdown-divider" />

                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
