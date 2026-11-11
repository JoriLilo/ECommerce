import { NavLink, Outlet } from 'react-router-dom'
import { getUser } from '../../utils/auth'
import './AccountLayout.css'
import { logoutBackend } from '../../services/authService'

// Keeps account navigation visible while the selected child page changes.
export default function AccountLayout() {
  const user = getUser()
  const initials = user?.fullName.trim().split(/\s+/).slice(0, 2)
    .map((name) => name[0]).join('').toUpperCase() || '?'

  function handleLogout() {
    logoutBackend()
    window.location.href = '/login'
  }

  return (
    <div className="account-shell">
      <aside className="account-sidebar" aria-label="My account">
        <div className="account-identity">
          <span className="account-avatar" aria-hidden="true">{initials}</span>
          <div>
            <p className="account-name">{user?.fullName}</p>
            <p className="account-email">{user?.email}</p>
          </div>
        </div>

        <nav className="account-navigation" aria-label="Account navigation">
          <NavLink to="/profile" end>My profile</NavLink>
          <NavLink to="/orders">My orders</NavLink>
          <NavLink to="/addresses">My addresses</NavLink>
          {user?.role === 'CUSTOMER' && (
            <NavLink to="/seller/application-status">Seller application status</NavLink>
          )}
          {user?.role === 'SELLER' && (
            <>
              <NavLink to="/seller/dashboard">Seller dashboard</NavLink>
              <NavLink to="/seller/profile">Business profile</NavLink>
            </>
          )}
          {user?.role === 'ADMIN' && (
            <NavLink to="/admin/dashboard">Admin dashboard</NavLink>
          )}
        </nav>

        <button type="button" className="account-signout" onClick={handleLogout}>
          Sign out
        </button>
      </aside>

      <div className="account-content">
        <Outlet />
      </div>
    </div>
  )
}
