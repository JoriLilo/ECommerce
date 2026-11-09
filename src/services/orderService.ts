import { apiGet, apiPatch, apiPost } from './api'
import type { Order, OrderStatus, OrderSummary, SellerOrderDetails } from '../types/order'

// Combines all pages of the signed-in customer's order summaries.
export async function getOrders(): Promise<OrderSummary[]> {
  const orders: OrderSummary[] = []
  let page = 0
  let totalPages = 1
  while (page < totalPages) {
    const result = await apiGet<{ content: OrderSummary[]; totalPages: number }>(
      `/orders?page=${page}&size=50&sort=createdOn,desc`,
    )
    orders.push(...result.content)
    totalPages = result.totalPages
    page++
  }
  return orders
}

// Loads one order including its address and seller orders.
export function getOrder(id: number) {
  return apiGet<Order>(`/orders/${id}`)
}

// Creates an order from the cart using the selected address.
export function createOrder(addressId: number) {
  return apiPost<Order>('/checkout', { addressId })
}

// Requests cancellation of the selected order.
export function cancelOrder(id: number) {
  return apiPost<Order>(`/orders/${id}/cancel`, {})
}

// Combines all pages of orders belonging to the signed-in seller.
export async function getSellerOrders(): Promise<SellerOrderDetails[]> {
  const orders: SellerOrderDetails[] = []
  let page = 0
  let totalPages = 1
  while (page < totalPages) {
    const result = await apiGet<{ content: SellerOrderDetails[]; totalPages: number }>(
      `/sellers/me/orders?page=${page}&size=50&sort=createdOn,desc`,
    )
    orders.push(...result.content)
    totalPages = result.totalPages
    page++
  }
  return orders
}

// Sends the new status for a seller order.
export function updateSellerOrderStatus(id: number, status: OrderStatus) {
  return apiPatch<SellerOrderDetails>(`/seller-orders/${id}/status`, { status })
}
