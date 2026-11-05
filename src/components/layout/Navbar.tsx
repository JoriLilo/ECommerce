
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getUser, logout } from '../../utils/auth'

export default function Navbar() {
  const user = getUser()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    window.location.href = '/login'
  }

  return (
    <nav className="navbar">

      <div className="navbar-left">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/products" className="nav-link">Products</Link>

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

      <Link to="/" className="navbar-brand">
        Via<span>Buy</span>
      </Link>

      <div className="navbar-right">

        <Link to="/cart" className="nav-link cart-link">
          <svg viewBox="0 0 24 24" width="20" height="20"
            fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Cart
        </Link>

        {user ? (
          <div className="profile-menu">

            <button
              className="profile-button"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="profile-circle">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </button>

            {menuOpen && (
              <div className="dropdown-menu">

                <div className="dropdown-header">
                  <strong>{user.name}</strong>
                  <span>{user.role}</span>
                </div>

                <div className="dropdown-divider" />

                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                >
                  My Profile
                </Link>

                <Link
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                >
                  My Orders
                </Link>

                <div className="dropdown-divider" />

                <button onClick={handleLogout}>
                  Logout
                </button>

              </div>
            )}

          </div>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}

      </div>
    </nav>
  )
}
