import type { Address } from './address'

// Lists the order status values understood by the frontend.
export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'

// Describes one purchased product entry and its prices.
export interface OrderItem {
  id: number
  productId: number
  productName: string
  unitPrice: number
  quantity: number
  lineTotal: number
}

// Groups an order's items and subtotal for one seller.
export interface SellerOrder {
  id: number
  sellerId: number
  status: OrderStatus
  subtotal: number
  items: OrderItem[]
}

// Contains the fields used in the order history list.
export interface OrderSummary {
  id: number
  status: OrderStatus
  totalAmount: number
  createdOn: string
}

// Adds the delivery address and seller orders to the order summary.
export interface Order extends OrderSummary {
  shippingAddress: Omit<Address, 'id' | 'defaultAddress'>
  sellerOrders: SellerOrder[]
}

// Describes the seller's part of an order, including customer and shipping details.
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
