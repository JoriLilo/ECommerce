import { useState } from 'react'
import StatusBadge from '../../components/common/StatusBadge'
import Button from '../../components/ui/Button'
import type { SellerApplication, SellerStatus } from '../../types/seller'

// Mock. Real: GET /admin/sellers, PATCH /admin/sellers/{id}/approve and /reject
const initial: SellerApplication[] = [
  { id: 1, name: 'Ana Hoxha', email: 'ana@shop.al', nipt: 'L12345678A', businessPhone: '+355 69 111 2222', businessAddress: 'Tirana', status: 'PENDING' },
  { id: 2, name: 'Besa Koci', email: 'besa@shop.al', nipt: 'K87654321B', businessPhone: '+355 68 333 4444', businessAddress: 'Durres', status: 'PENDING' },
]

export default function AdminSellerApplicationsPage() {
  const [apps, setApps] = useState(initial)

  function decide(id: number, status: SellerStatus) {
    setApps(apps.map((a) => (a.id === id ? { ...a, status } : a)))
  }

  return (
    <div>
      <h1>Seller Applications</h1>
      {apps.map((a) => (
        <div key={a.id} className="card">
          <h3>{a.name} <StatusBadge status={a.status} /></h3>
          <p>{a.email} · NIPT {a.nipt} · {a.businessPhone} · {a.businessAddress}</p>
          <Button onClick={() => decide(a.id, 'APPROVED')} disabled={a.status !== 'PENDING'}>Approve</Button>
          <Button variant="danger" onClick={() => decide(a.id, 'REJECTED')} disabled={a.status !== 'PENDING'}>Reject</Button>
        </div>
      ))}
    </div>
  )
}