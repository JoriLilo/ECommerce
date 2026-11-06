import { apiDelete, apiGet, apiPost, apiPut } from './api'
import type { Cart, CartItem } from '../types/cart'
import type { Product } from '../types/product'

export function notifyCartChanged() {
  window.dispatchEvent(new Event('cart-updated'))
}

export async function getCart(): Promise<CartItem[]> {
  const cart = await apiGet<Cart>('/cart')
  return cart.items
}

export async function addToCart(product: Product, quantity: number) {
  await apiPost<Cart>('/cart/items', { productId: product.id, quantity })
  notifyCartChanged()
}

export async function updateQuantity(itemId: number, quantity: number) {
  await apiPut<Cart>(`/cart/items/${itemId}`, { quantity })
  notifyCartChanged()
}

export async function removeFromCart(itemId: number) {
  await apiDelete(`/cart/items/${itemId}`)
  notifyCartChanged()
}

export function cartTotal(items: CartItem[]): number {
  let total = 0
  for (const item of items) total += Number(item.lineTotal)
  return total
}
