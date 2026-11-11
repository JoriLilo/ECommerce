import { apiGet, apiPost } from './api'
import type { Refund, RefundPage } from '../types/refund'
import type { OrderStatus } from '../types/order'

export function canRefund(status: OrderStatus): boolean {
  return ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(status)
}

// Starts a refund for the whole remaining order amount or one seller's part.
// Pass null for the remaining order amount, or a sellerOrderId for that seller's part.
// The backend calculates the refund amount.
export function initiateRefund(orderId: number, sellerOrderId: number | null, admin = false) {
  const path = admin ? '/admin/orders' : '/orders'
  const body = sellerOrderId === null ? {} : { sellerOrderId }
  return apiPost<Refund>(`${path}/${orderId}/refunds`, body)
}

export function getRefunds(page: number, admin = false) {
  const path = admin ? '/admin/refunds' : '/refunds/mine'
  return apiGet<RefundPage>(`${path}?page=${page}&size=20&sort=createdOn,desc`)
}
