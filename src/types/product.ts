import type { Category } from './category'

// Lists the product moderation statuses returned by the backend.
export type ProductStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELETED'

// Describes the converted product data used by the UI.
export interface Product {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  category: Category
  images: string[]
  imageDetails: { id: number; url: string }[]
  sellerId: number
  storeName: string
  productStatus: ProductStatus
}

// Describes the product shape returned by the backend before conversion.
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

// Contains one page of backend products and pagination totals.
export interface ProductPage {
  content: ProductResponse[]
  totalPages: number
  totalElements: number
}
