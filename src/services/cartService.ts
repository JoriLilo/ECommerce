import type { CartItem } from '../types/cart'
import type { Product } from '../types/product'

const KEY = 'cart'

export function getCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as CartItem[]
  } catch {
    return []
  }
}

function save(items: CartItem[]): CartItem[] {
  localStorage.setItem(KEY, JSON.stringify(items))
  return items
}

export function addToCart(product: Product, quantity: number) {
  const items = getCart()
  const existing = items.find((i) => i.product.id === product.id)
  if (existing) existing.quantity += quantity
  else items.push({ id: product.id, product, quantity })
  save(items)
}

export function updateQuantity(productId: number, quantity: number): CartItem[] {
  return save(getCart().map((i) => (i.product.id === productId ? { ...i, quantity } : i)))
}

export function removeFromCart(productId: number): CartItem[] {
  return save(getCart().filter((i) => i.product.id !== productId))
}

export function clearCart() {
  localStorage.removeItem(KEY)
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
}