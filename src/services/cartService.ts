import type { CartItem } from '../types/cart'
import type { Product } from '../types/product'

import { getUser } from '../utils/auth'

function cartKey(): string {
  const user = getUser()
  if (user) {
    return `cart-${user.id}`
  }
  return 'cart-guest'
}

export function getCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(cartKey()) ?? '[]') as CartItem[]
  } catch {
    return []
  }
}

function save(items: CartItem[]): CartItem[] {
  localStorage.setItem(cartKey(), JSON.stringify(items))
  window.dispatchEvent(new Event('cart-updated'))
  return items
}

export function addToCart(product: Product, quantity: number): void {
  const items = getCart()
  const existingItem = items.find((item) => item.product.id === product.id)
  let totalQuantity = quantity
  if (existingItem) {
    totalQuantity = existingItem.quantity + quantity
  }

  if (!Number.isInteger(quantity) || quantity < 1 || totalQuantity > product.quantity) {
    throw new Error('The requested quantity is not available.')
  }
  if (product.productStatus !== 'APPROVED') {
    throw new Error('This product is not available.')
  }

  if (existingItem) {
    existingItem.quantity = totalQuantity
  } else {
    items.push({ id: product.id, product: product, quantity: quantity })
  }
  save(items)
}

export function updateQuantity(productId: number, quantity: number): CartItem[] {
  const items = getCart()
  const selectedItem = items.find((item) => item.product.id === productId)
  if (!selectedItem) {
    return items
  }
  if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > selectedItem.product.quantity
  ) {
    return items
  }
  selectedItem.quantity = quantity
  return save(items)
}

export function removeFromCart(productId: number): CartItem[] {
  const remainingItems: CartItem[] = []
  for (const item of getCart()) {
    if (item.product.id !== productId) {
      remainingItems.push(item)
    }
  }
  return save(remainingItems)
}

export function clearCart() {
  localStorage.removeItem(cartKey())
  window.dispatchEvent(new Event('cart-updated'))
}

export function cartTotal(items: CartItem[]): number {
  let total = 0
  for (const item of items) {
    total = total + item.product.price * item.quantity
  }
  return total
}
