import type { Category } from './category'

export type ProductStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELETED'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  category: Category
  images: string[]
  sellerId: number
  storeName: string
  productStatus: ProductStatus
}

export interface ProductResponse {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  status: ProductStatus
  categoryId: number
  categoryName: string
  sellerId: number
  images: { id: number; url: string; primaryImage: boolean }[]
}

export interface ProductPage {
  content: ProductResponse[]
  totalPages: number
  totalElements: number
}