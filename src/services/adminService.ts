import type { ProductPage, ProductResponse } from '../types/product'
import { apiGet, apiPatch } from './api'
import type { SellerApplication, SellerApplicationPage } from '../types/seller'
import type { User } from '../types/user'
import type { Order, OrderSummary } from '../types/order'

// Loads one page of orders, optionally filtered by status.
export function getAdminOrders(page: number, status: string) {
  let path = `/admin/orders?page=${page}&size=20&sort=createdOn,desc`
  if (status) path += `&status=${status}`
  return apiGet<{ content: OrderSummary[]; totalPages: number }>(path)
}

// Loads the complete order for the admin details page.
export function getAdminOrder(id: number) {
  return apiGet<Order>(`/admin/orders/${id}`)
}

// Sends the requested suspend or activate action for a seller.
export function updateSellerStatus(id: number, action: 'suspend' | 'activate') {
  return apiPatch<SellerApplication>(`/admin/sellers/${id}/${action}`)
}

// Adds the account status used by the admin user list.
export interface AdminUser extends User {
  status: 'ACTIVE' | 'SUSPENDED'
}

// Loads one page of users with optional role and status filters.
export function getAdminUsers(page: number, role: string, status: string) {
  let path = `/admin/users?page=${page}&size=20&sort=createdOn,desc`
  if (role) path += `&role=${role}`
  if (status) path += `&status=${status}`
  return apiGet<{ content: AdminUser[]; totalPages: number }>(path)
}

// Activates or suspends the selected user account.
export function updateUserStatus(id: number, action: 'activate' | 'suspend') {
  return apiPatch<AdminUser>(`/admin/users/${id}/${action}`)
}

// Loads one page of seller applications, newest first.
export function getSellerApplications(page: number) {
  return apiGet<SellerApplicationPage>(
    `/admin/sellers?page=${page}&size=20&sort=createdOn,desc`,
  )
}

// Approves the selected seller application.
export function approveSeller(id: number) {
  return apiPatch<SellerApplication>(`/admin/sellers/${id}/approve`)
}

// Rejects the application and sends the reason to the backend.
export function rejectSeller(id: number, reason: string) {
  return apiPatch<SellerApplication>(`/admin/sellers/${id}/reject`, { reason })
}

// Loads one page of products matching the moderation status.
export function getAdminProducts(page: number, status: string) {
  return apiGet<ProductPage>(
    `/admin/products?page=${page}&size=20&sort=createdOn,desc&status=${status}`,
  )
}

// Approves the selected product.
export function approveProduct(id: number) {
  return apiPatch<ProductResponse>(`/admin/products/${id}/approve`)
}

// Rejects the selected product.
export function rejectProduct(id: number) {
  return apiPatch<ProductResponse>(`/admin/products/${id}/reject`)
}
