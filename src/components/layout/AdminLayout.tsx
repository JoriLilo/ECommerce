import { Link, NavLink, Outlet } from 'react-router-dom'
import { getUser, logout } from '../../utils/auth'
import './AdminLayout.css'
import { logoutBackend } from '../../services/authService'

// Keeps admin navigation visible while the selected management page changes.
export default function AdminLayout() {
  const user = getUser()

  function handleLogout() {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="admin-workspace">
      <aside className="admin-sidebar" aria-label="Admin panel">
        <div className="admin-sidebar-heading">
          <h2>Admin Panel</h2>
          <p>Manage the marketplace</p>
        </div>

        <nav className="admin-sidebar-nav" aria-label="Admin navigation">
          <NavLink to="/admin/dashboard" end>Dashboard</NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
          <NavLink to="/admin/categories">Categories</NavLink>
          <NavLink to="/admin/seller-applications">Seller applications</NavLink>
        </nav>

        <div className="admin-sidebar-account">
          <p>{user?.fullName}</p>
          <Link to="/profile">My account</Link>
          <Link to="/products">Back to shop</Link>
          <button type="button" onClick={logoutBackend}>Sign out</button>
        </div>
      </aside>

      <div className="admin-workspace-content">
        <Outlet />
      </div>
    </div>
  )
}
