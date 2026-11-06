import type { ProductPage, ProductResponse } from '../types/product'
import { apiGet, apiPatch } from './api'
import type { SellerApplication, SellerApplicationPage } from '../types/seller'

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
