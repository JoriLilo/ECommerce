import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUser, logout } from '../../utils/auth'

export default function Navbar() {
  const user = getUser()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchText, setSearchText] = useState('')

  function handleLogout() {
    logout()
    window.location.href = '/login'
  }

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    navigate(`/products?search=${encodeURIComponent(searchText)}`)
    setSearchOpen(false)
  }

  const links = (
    <>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      <Link to="/orders">My Orders</Link>
      {user?.role === 'SELLER' && <Link to="/seller/products">My Products</Link>}
      {user?.role === 'ADMIN' && <Link to="/admin/dashboard">Admin</Link>}
    </>
  )

  return (
    <>
      <header className="site-header">
        <div className="site-topbar">
          <Link to="/" className="site-logo">Marketplace</Link>

          <nav className="site-nav">{links}</nav>

          <div className="site-icons">
            <button
              className="icon-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <i className="bi bi-search" />
            </button>

            <Link to="/cart" className="icon-btn" aria-label="Cart">
              <i className="bi bi-bag" />
            </Link>

            {user ? (
              <>
                <Link to="/profile" className="icon-btn" aria-label="Profile" title={user.name}>
                  <i className="bi bi-person-check" />
                </Link>
                <span className="user-name">{user.name}</span>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <Link to="/login" className="icon-btn" aria-label="Login">
                <i className="bi bi-person" />
              </Link>
            )}

            <button
              className="hamburger"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <i className="bi bi-list" />
            </button>
          </div>
        </div>

        {searchOpen && (
          <form className="search-bar" onSubmit={handleSearch}>
            <i className="bi bi-search" />
            <input
              type="search"
              placeholder="Search for a product..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              autoFocus
            />
            <button type="button" className="icon-btn" onClick={() => setSearchOpen(false)} aria-label="Close search">
              <i className="bi bi-x" />
            </button>
          </form>
        )}
      </header>

      {menuOpen && (
        <>
          <div className="drawer-backdrop" onClick={() => setMenuOpen(false)} />
          <aside className="drawer">
            <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <i className="bi bi-x" />
            </button>

            <nav className="drawer-links" onClick={() => setMenuOpen(false)}>
              {links}
              <Link to="/cart">Cart</Link>
              {user ? (
                <Link to="/profile">My Profile</Link>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                </>
              )}
            </nav>

            {user && (
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            )}
          </aside>
        </>
      )}
    </>
  )
}