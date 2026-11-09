import { apiDelete, apiGet, apiPost, apiPut } from './api'
import type { Cart, CartItem } from '../types/cart'
import type { Product } from '../types/product'

// Announces a cart change so listeners can reload cart information.
export function notifyCartChanged() {
  window.dispatchEvent(new Event('cart-updated'))
}

// Sends a request to the backend and receives the cart data and returns only its entries.
// The returned promise rejects if the request fails.
export async function getCart(): Promise<CartItem[]> {
  // Cart describes the expected response; it is not runtime validation.
  const cart = await apiGet<Cart>('/cart')
  return cart.items
}

// Sends the product id and quantity, then announces the successful change.
export async function addToCart(product: Product, quantity: number) {
  await apiPost<Cart>('/cart/items', { productId: product.id, quantity })
  notifyCartChanged()
}

// Sets the quantity for a cart entry, identified by its cart item id.
export async function updateQuantity(itemId: number, quantity: number) {
  await apiPut<Cart>(`/cart/items/${itemId}`, { quantity })
  notifyCartChanged()
}

// Removes a cart entry. If the request throws, no notification is sent.
export async function removeFromCart(itemId: number) {
  await apiDelete(`/cart/items/${itemId}`)
  notifyCartChanged()
}

// Sums the line totals. Returns zero when the cart is empty.
export function cartTotal(items: CartItem[]): number {
  let total = 0
  for (const item of items) total += Number(item.lineTotal)
  return total
}