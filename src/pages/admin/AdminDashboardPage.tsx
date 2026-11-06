import { Link } from 'react-router-dom'

export default function AdminDashboardPage() {
  return (
    <section className="content-page">
      <h1>Admin Dashboard</h1>
      <p className="page-subtitle">Manage the marketplace.</p>
      <div className="card">
        <h2>Categories</h2>
        <p>Add, rename or delete product categories.</p>
        <Link to="/admin/categories" className="btn btn-primary">Manage categories</Link>
      </div>
      <div className="card">
        <h2>Users</h2>
        <p>View accounts and activate or suspend users.</p>
        <Link to="/admin/users" className="btn btn-primary">Manage users</Link>
      </div>
      <div className="card">
        <h2>Seller applications</h2>
        <p>Review business details and seller requests.</p>
        <Link to="/admin/seller-applications" className="btn btn-primary">
          View applications
        </Link>
      </div>
      <div className="card">
        <h2>Product approval</h2>
        <p>Review seller products before they appear in the shop.</p>
        <Link to="/admin/products" className="btn btn-primary">
          Review products
        </Link>
      </div>
      <p>
        Seller requests and approval decisions are connected to the backend. Marketplace
        statistics are not implemented yet.
      </p>
    </section>
  )
}
