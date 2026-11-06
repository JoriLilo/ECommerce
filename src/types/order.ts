import type { Address } from './address'

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
  unitPrice: number
  quantity: number
  lineTotal: number
}

export interface SellerOrder {
  id: number
  sellerId: number
  status: OrderStatus
  subtotal: number
  items: OrderItem[]
}

export interface OrderSummary {
  id: number
  status: OrderStatus
  totalAmount: number
  createdOn: string
}

export interface Order extends OrderSummary {
  shippingAddress: Omit<Address, 'id' | 'defaultAddress'>
  sellerOrders: SellerOrder[]
}

export interface SellerOrderDetails {
  id: number
  orderId: number
  status: OrderStatus
  subtotal: number
  customerName: string
  customerEmail: string
  shippingAddress: Omit<Address, 'id' | 'defaultAddress'>
  items: OrderItem[]
  createdOn: string
}
