import { getUser } from '../utils/auth'
import { cartTotal } from './cartService'
import type { CartItem } from '../types/cart'
import type { Address } from '../types/address'
import type { Order, OrderStatus, SellerOrder } from '../types/order'

const KEY = 'orders'

function load(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as Order[]
  } catch {
    return []
  }
}

function save(orders: Order[]) {
  localStorage.setItem(KEY, JSON.stringify(orders))
}

// One customer order, split into one seller order per seller (SRS 4.4)
export function createOrder(items: CartItem[], address: Address): Order {
  const user = getUser()
  if (!user) throw new Error('You must be logged in')
  const now = new Date().toISOString()
  const orders = load()
  const orderId = orders.length + 1

  const sellerIds = [...new Set(items.map((i) => i.product.sellerId))]
  const sellerOrders: SellerOrder[] = sellerIds.map((sellerId, index) => {
    const mine = items.filter((i) => i.product.sellerId === sellerId)
    return {
      id: orderId * 100 + index,
      sellerId,
      storeName: mine[0].product.storeName,
      status: 'PAID',
      totalPrice: cartTotal(mine),
      orderItems: mine.map((i) => ({
        id: i.id,
        productId: i.product.id,
        productName: i.product.name,
        productImage: i.product.images[0] ?? '',
        quantity: i.quantity,
        price: i.product.price,
        createdAt: now,
        updatedAt: now,
      })),
      createdAt: now,
      updatedAt: now,
    }
  })

  const order: Order = {
    id: orderId,
    customer: user,
    shippingAddress: address,
    status: 'PAID', // mock: real flow starts at PENDING_PAYMENT until Stripe confirms
    totalAmount: cartTotal(items),
    sellerOrders,
    createdAt: now,
    updatedAt: now,
  }
  save([...orders, order])
  return order
}

export function getOrders(): Order[] {
  const user = getUser()
  return load().filter((o) => o.customer.id === user?.id)
}

export function getOrder(id: number): Order | undefined {
  return load().find((o) => o.id === id)
}

// Mock: every seller order. Real: GET /sellers/me/orders
export function getSellerOrders(): SellerOrder[] {
  return load().flatMap((o) => o.sellerOrders)
}

// Real: PATCH /seller-orders/{id}/status
export function updateSellerOrderStatus(id: number, status: OrderStatus) {
  save(
    load().map((o) => ({
      ...o,
      sellerOrders: o.sellerOrders.map((s) => (s.id === id ? { ...s, status } : s)),
    })),
  )
}