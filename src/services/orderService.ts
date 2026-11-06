import { getUser } from '../utils/auth'
import { cartTotal } from './cartService'
import type { CartItem } from '../types/cart'
import type { Address } from '../types/address'
import type { Order, OrderStatus, SellerOrder } from '../types/order'

const ORDERS_KEY = 'orders'

function loadOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) ?? '[]') as Order[]
  } catch {
    return []
  }
}

function saveOrders(orders: Order[]): void {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

// Demo only: one buyer order contains a separate part for each seller.
export function createOrder(items: CartItem[], address: Address): Order {
  const user = getUser()
  if (!user) {
    throw new Error('You must be logged in.')
  }
  if (items.length === 0) {
    throw new Error('Your cart is empty.')
  }
  for (const item of items) {
    if (
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > item.product.quantity
    ) {
      throw new Error('Please check the quantities in your cart.')
    }
  }

  const orders = loadOrders()
  const orderId = orders.length + 1
  const now = new Date().toISOString()
  const sellerOrders: SellerOrder[] = []

  for (const item of items) {
    const sellerId = item.product.sellerId
    let sellerOrder = sellerOrders.find(
      (sellerOrder) => sellerOrder.sellerId === sellerId,
    )

    if (!sellerOrder) {
      sellerOrder = {
        id: orderId * 100 + sellerOrders.length,
        sellerId: sellerId,
        storeName: item.product.storeName,
        status: 'PAID', // Demo status. No real payment is collected.
        totalPrice: 0,
        orderItems: [],
        createdAt: now,
        updatedAt: now,
      }
      sellerOrders.push(sellerOrder)
    }

    sellerOrder.orderItems.push({
      id: item.id,
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.images[0] ?? '',
      quantity: item.quantity,
      price: item.product.price,
      createdAt: now,
      updatedAt: now,
    })
    sellerOrder.totalPrice = sellerOrder.totalPrice + item.product.price * item.quantity
  }

  const order: Order = {
    id: orderId,
    customer: user,
    shippingAddress: address,
    status: 'PAID', // Real checkout must wait for backend payment verification.
    totalAmount: cartTotal(items),
    sellerOrders: sellerOrders,
    createdAt: now,
    updatedAt: now,
  }
  orders.push(order)
  saveOrders(orders)
  return order
}

export function getOrders(): Order[] {
  const user = getUser()
  const myOrders: Order[] = []
  for (const order of loadOrders()) {
    if (order.customer.id === user?.id) {
      myOrders.push(order)
    }
  }
  return myOrders
}

export function getOrder(id: number): Order | undefined {
  for (const order of getOrders()) {
    if (order.id === id) {
      return order
    }
  }
  return undefined
}

export function getSellerOrders(): SellerOrder[] {
  const user = getUser()
  const myOrders: SellerOrder[] = []
  for (const order of loadOrders()) {
    for (const sellerOrder of order.sellerOrders) {
      if (sellerOrder.sellerId === user?.id) {
        myOrders.push(sellerOrder)
      }
    }
  }
  return myOrders
}

export function updateSellerOrderStatus(id: number, status: OrderStatus): void {
  const user = getUser()
  const orders = loadOrders()
  for (const order of orders) {
    for (const sellerOrder of order.sellerOrders) {
      if (sellerOrder.id === id && sellerOrder.sellerId === user?.id) {
        sellerOrder.status = status
      }
    }
  }
  saveOrders(orders)
}
