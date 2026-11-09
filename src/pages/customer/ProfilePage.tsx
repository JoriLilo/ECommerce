import { Link } from 'react-router-dom'
import { getUser } from '../../utils/auth'

// Displays account details from the locally saved user.
export default function ProfilePage() {
  const user = getUser()
  return (
    <section className="content-page">
      <h1>My Profile</h1>
      <p className="page-subtitle">Your account information.</p>
      <dl className="card profile-details">
        <dt>Full name</dt>
        <dd>{user?.fullName}</dd>
        <dt>Email</dt>
        <dd>{user?.email}</dd>
        <dt>Account type</dt>
        <dd>{user?.role}</dd>
      </dl>
      <p>Profile editing will be available when account updates are supported.</p>
      <div className="page-actions">
        {user?.role === 'SELLER' && (
          <Link to="/seller/profile" className="btn btn-primary">
            Edit business profile
          </Link>
        )}
        <Link to="/addresses" className="btn btn-primary">
          My addresses
        </Link>
        {user?.role === 'CUSTOMER' && (
          <Link to="/orders" className="btn btn-primary">
            My Orders
          </Link>
        )}
        <Link to="/seller/application-status" className="text-link">
          Seller application status
        </Link>
      </div>
    </section>
  )
}
