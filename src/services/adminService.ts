import type { ProductPage, ProductResponse } from '../types/product'
import { apiGet, apiPatch } from './api'
import type { SellerApplication, SellerApplicationPage } from '../types/seller'
import type { User } from '../types/user'
import type { Order, OrderSummary } from '../types/order'

export function getAdminOrders(page: number, status: string) {
  let path = `/admin/orders?page=${page}&size=20&sort=createdOn,desc`
  if (status) path += `&status=${status}`
  return apiGet<{ content: OrderSummary[]; totalPages: number }>(path)
}

export function getAdminOrder(id: number) {
  return apiGet<Order>(`/admin/orders/${id}`)
}

export function updateSellerStatus(id: number, action: 'suspend' | 'activate') {
  return apiPatch<SellerApplication>(`/admin/sellers/${id}/${action}`)
}

export interface AdminUser extends User {
  status: 'ACTIVE' | 'SUSPENDED'
}

export function getAdminUsers(page: number, role: string, status: string) {
  let path = `/admin/users?page=${page}&size=20&sort=createdOn,desc`
  if (role) path += `&role=${role}`
  if (status) path += `&status=${status}`
  return apiGet<{ content: AdminUser[]; totalPages: number }>(path)
}

export function updateUserStatus(id: number, action: 'activate' | 'suspend') {
  return apiPatch<AdminUser>(`/admin/users/${id}/${action}`)
}

export function getSellerApplications(page: number) {
  return apiGet<SellerApplicationPage>(
    `/admin/sellers?page=${page}&size=20&sort=createdOn,desc`,
  )
}

export function approveSeller(id: number) {
  return apiPatch<SellerApplication>(`/admin/sellers/${id}/approve`)
}

export function rejectSeller(id: number, reason: string) {
  return apiPatch<SellerApplication>(`/admin/sellers/${id}/reject`, { reason })
}

export function getAdminProducts(page: number, status: string) {
  return apiGet<ProductPage>(
    `/admin/products?page=${page}&size=20&sort=createdOn,desc&status=${status}`,
  )
}

export function approveProduct(id: number) {
  return apiPatch<ProductResponse>(`/admin/products/${id}/approve`)
}

export function rejectProduct(id: number) {
  return apiPatch<ProductResponse>(`/admin/products/${id}/reject`)
}
