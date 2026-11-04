import type { Address } from './address'
import type { User } from './user'

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'

export interface OrderItem {
  id: number
  productId: number
  productName: string
  productImage: string
  quantity: number
  price: number
  createdAt: string
  updatedAt: string
}

export interface SellerOrder {
  id: number
  sellerId: number
  storeName: string
  status: OrderStatus
  totalPrice: number
  orderItems: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: number
  customer: User // import type { User } from './user'
  shippingAddress: Address
  status: OrderStatus
  totalAmount: number
  sellerOrders: SellerOrder[]
  createdAt: string
  updatedAt: string
}