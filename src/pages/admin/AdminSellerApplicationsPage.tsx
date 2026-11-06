import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  approveSeller,
  getSellerApplications,
  rejectSeller,
  updateSellerStatus,
} from '../../services/adminService'
import ErrorMessage from '../../components/common/ErrorMessage'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import type { SellerApplication } from '../../types/seller'

export default function AdminSellerApplicationsPage() {
  const [applications, setApplications] = useState<SellerApplication[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [refreshCount, setRefreshCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<number | null>(null)
  const [rejectingId, setRejectingId] = useState<number | null>(null)
  const [reason, setReason] = useState('')

  useEffect(() => {
    let cancelled = false
    async function loadApplications() {
      try {
        const result = await getSellerApplications(page)
        if (!cancelled) {
          setApplications(result.content)
          setTotalPages(result.totalPages)
          setTotal(result.totalElements)
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : 'Could not load applications.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    loadApplications()
    return () => {
      cancelled = true
    }
  }, [page, refreshCount])

  async function changeSellerStatus(application: SellerApplication) {
    const action = application.status === 'APPROVED' ? 'suspend' : 'activate'
    if (
      !window.confirm(
        `${action === 'suspend' ? 'Suspend' : 'Activate'} seller ${application.user.fullName}?`,
      )
    )
      return
    setSavingId(application.id)
    setError(null)
    try {
      const updated = await updateSellerStatus(application.id, action)
      setApplications(
        applications.map((item) => (item.id === updated.id ? updated : item)),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not change seller status.')
    } finally {
      setSavingId(null)
    }
  }

  function loadPage(nextPage: number) {
    setLoading(true)
    setError(null)
    setRejectingId(null)
    setReason('')
    setPage(nextPage)
    setRefreshCount(refreshCount + 1)
  }

  async function decide(id: number, approve: boolean) {
    if (!approve && !reason.trim()) {
      setError('Enter a reason before rejecting this application.')
      return
    }
    setSavingId(id)
    setError(null)
    try {
      let updatedApplication: SellerApplication
      if (approve) {
        updatedApplication = await approveSeller(id)
      } else {
        updatedApplication = await rejectSeller(id, reason.trim())
      }
      const updatedList: SellerApplication[] = []
      for (const application of applications) {
        if (application.id === id) {
          updatedList.push(updatedApplication)
        } else {
          updatedList.push(application)
        }
      }
      setApplications(updatedList)
      setRejectingId(null)
      setReason('')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not update this application. Please refresh and try again.',
      )
    } finally {
      setSavingId(null)
    }
  }

  return (
    <section className="content-page">
      <Link to="/admin/dashboard" className="text-link">
        ← Admin Dashboard
      </Link>
      <h1>Seller Applications</h1>
      <p className="page-subtitle">
        Review applications and manage approved or suspended sellers.
      </p>
      <div className="page-actions">
        <span>{total} applications</span>
        <button
          type="button"
          className="btn btn-primary admin-action"
          disabled={loading || savingId !== null}
          onClick={() => loadPage(0)}
        >
          Refresh applications
        </button>
      </div>
      <ErrorMessage message={error} />
      {loading && <Loading />}
      {!loading && !error && applications.length === 0 && (
        <EmptyState message="No seller applications have been submitted yet." />
      )}
      {!loading &&
        applications.map((application) => (
          <article key={application.id} className="card">
            <h2>
              {application.user.fullName} <StatusBadge status={application.status} />
            </h2>
            <p>{application.user.email}</p>
            <p>NIPT: {application.nipt}</p>
            <p>
              Phone: {application.businessPhone || 'Not provided'} · Address:{' '}
              {application.businessAddress || 'Not provided'}
            </p>
            <p>Submitted: {new Date(application.createdOn).toLocaleDateString()}</p>
            {application.rejectionReason && (
              <p>Rejection reason: {application.rejectionReason}</p>
            )}
            {(application.status === 'APPROVED' ||
              application.status === 'SUSPENDED') && (
              <button
                type="button"
                className="btn"
                disabled={savingId !== null}
                onClick={() => changeSellerStatus(application)}
              >
                {application.status === 'APPROVED' ? 'Suspend seller' : 'Activate seller'}
              </button>
            )}
            {application.status === 'PENDING' && (
              <div>
                <div className="page-actions">
                  <button
                    type="button"
                    className="btn btn-primary admin-action"
                    disabled={savingId !== null}
                    onClick={() => decide(application.id, true)}
                  >
                    {savingId === application.id ? 'Saving…' : 'Approve'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    disabled={savingId !== null}
                    onClick={() => {
                      setRejectingId(application.id)
                      setReason('')
                      setError(null)
                    }}
                  >
                    Reject
                  </button>
                </div>
                {rejectingId === application.id && (
                  <div className="admin-rejection">
                    <label htmlFor={`reason-${application.id}`}>
                      Why is this application being rejected?
                    </label>
                    <textarea
                      id={`reason-${application.id}`}
                      className="form-input"
                      value={reason}
                      maxLength={500}
                      rows={3}
                      onChange={(event) => setReason(event.target.value)}
                    />
                    <div className="page-actions">
                      <button
                        type="button"
                        className="btn btn-danger"
                        disabled={savingId !== null || !reason.trim()}
                        onClick={() => decide(application.id, false)}
                      >
                        Confirm rejection
                      </button>
                      <button
                        type="button"
                        className="text-link"
                        disabled={savingId !== null}
                        onClick={() => setRejectingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </article>
        ))}
      {!loading && totalPages > 1 && (
        <nav className="page-actions" aria-label="Application pages">
          <button
            type="button"
            disabled={page === 0 || savingId !== null}
            onClick={() => loadPage(page - 1)}
          >
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page + 1 >= totalPages || savingId !== null}
            onClick={() => loadPage(page + 1)}
          >
            Next
          </button>
        </nav>
      )}
    </section>
  )
}
