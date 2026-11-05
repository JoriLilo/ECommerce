import type { Category } from './category'

export type ProductStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  category: Category
  images: string[] // TODO: confirm strings, not { id, url } objects
  sellerId: number
  storeName: string
  productStatus: ProductStatus
}