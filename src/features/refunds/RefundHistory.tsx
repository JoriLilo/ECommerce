import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRefunds } from '../../services/refundService'
import type { Refund } from '../../types/refund'
import StatusBadge from '../../components/common/StatusBadge'
import './Refunds.css'

export default function RefundHistory({ admin = false }: { admin?: boolean }) {
  const [refunds, setRefunds] = useState<Refund[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [refresh, setRefresh] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(function loadRefundEffect() {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const response = await getRefunds(page, admin)
        if (!cancelled) {
          setRefunds(response.content)
          setTotalPages(response.totalPages)
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load refunds.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return function cleanup() { cancelled = true }
  }, [page, admin, refresh])
  function increment(value: number) { return value + 1 }
  function handleRefresh() { setRefresh(increment) }
  function handlePrevious() { setPage(page - 1) }
  function handleNext() { setPage(page + 1) }
  const entries = []
  for (const refund of refunds) {
    entries.push(<article className="refund-panel" key={refund.id}>
      <div className="refund-heading">
        <h2>Refund #{refund.id}</h2>
        <StatusBadge status={refund.status} />
      </div>
      <p>
        <Link to={`${admin ? '/admin/orders' : '/orders'}/${refund.orderId}`}>Order #{refund.orderId}
        </Link>{refund.sellerOrderId !== null ? ` · Seller order #${refund.sellerOrderId}` : ' · Remaining order amount'}
      </p>
      <p>Amount: {Number(refund.amount).toFixed(2)}</p>
      <p>{new Date(refund.createdOn).toLocaleString()}</p>
    </article>)
  }
  return (
    <section className="content-page refunds-page">
      <h1>{admin ? 'Refunds' : 'My refunds'}</h1>
      <p className="page-subtitle">Payment provider refund records.</p>
      <button className="refund-refresh" type="button" disabled={loading} onClick={handleRefresh}>Refresh status</button>
      {loading && <p role="status">Loading refunds…</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      {!loading && !error && <>{entries.length ? entries : <p>No refunds found.</p>}
        <div className="page-actions">
          <button type="button" disabled={page === 0} onClick={handlePrevious}>Previous</button>
          <span>Page {page + 1} of {Math.max(1, totalPages)}</span>
          <button type="button" disabled={page + 1 >= totalPages} onClick={handleNext}>Next</button>
        </div>
      </>}
    </section>
  )
}
