import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminUsers, updateUserStatus } from '../../services/adminService'
import type { AdminUser } from '../../services/adminService'
import ErrorMessage from '../../components/common/ErrorMessage'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [refreshCount, setRefreshCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const result = await getAdminUsers(page, role, status)
        if (!cancelled) { setUsers(result.content); setTotalPages(result.totalPages) }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load users.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [page, role, status, refreshCount])

  async function changeStatus(user: AdminUser) {
    const action = user.status === 'ACTIVE' ? 'suspend' : 'activate'
    if (!window.confirm(`${action === 'suspend' ? 'Suspend' : 'Activate'} ${user.email}?`)) return
    setSaving(true)
    setError(null)
    try {
      await updateUserStatus(user.id, action)
      setRefreshCount(refreshCount + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update user.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="content-page">
      <Link to="/admin/dashboard">Back to admin dashboard</Link>
      <h1>Users</h1>
      <div className="page-actions">
        <label>Role <select className="form-input" value={role} disabled={saving} onChange={(event) => { setRole(event.target.value); setPage(0) }}>
          <option value="">All roles</option><option value="CUSTOMER">Customer</option><option value="SELLER">Seller</option><option value="ADMIN">Admin</option>
        </select></label>
        <label>Status <select className="form-input" value={status} disabled={saving} onChange={(event) => { setStatus(event.target.value); setPage(0) }}>
          <option value="">All statuses</option><option value="ACTIVE">Active</option><option value="SUSPENDED">Suspended</option>
        </select></label>
      </div>
      <ErrorMessage message={error} />
      {loading && <p role="status">Loading users…</p>}
      {!loading && !error && users.length === 0 && <p>No matching users.</p>}
      {!loading && users.map((user) => (
        <article key={user.id} className="card">
          <h2>{user.fullName}</h2><p>{user.email}</p><p>{user.role} · {user.status}</p>
          {user.role !== 'ADMIN' && <button className="btn" disabled={saving} onClick={() => changeStatus(user)}>{user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}</button>}
        </article>
      ))}
      <div className="page-actions">
        <button className="btn" disabled={loading || saving || page === 0} onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page {totalPages === 0 ? 0 : page + 1} of {totalPages}</span>
        <button className="btn" disabled={loading || saving || page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </section>
  )
}
