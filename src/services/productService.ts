import { apiGet } from './api'
import { mockProducts, categories } from '../features/products/mockProducts'
import { getUser } from '../utils/auth'
import type { Product } from '../types/product'

const USE_MOCK = true // set to false when GET /products works

export interface ProductInput {
  name: string
  description: string
  price: number
  quantity: number
  categoryId: number
  imageUrl: string
}

export async function getProducts(): Promise<Product[]> {
  if (USE_MOCK) return mockProducts
  return apiGet<Product[]>('/products')
}

export async function getProduct(id: number): Promise<Product | undefined> {
  if (USE_MOCK) return mockProducts.find((p) => p.id === id)
  return apiGet<Product>(`/products/${id}`)
}

export async function getMyProducts(): Promise<Product[]> {
  const user = getUser()
  return mockProducts.filter((p) => p.sellerId === user?.id) // later: GET /sellers/me/products
}

// The mock changes only the in-memory array, so a refresh resets it.
export async function createProduct(input: ProductInput): Promise<void> {
  const user = getUser()
  if (!user) return
  mockProducts.push({
    id: Date.now(),
    name: input.name,
    description: input.description,
    price: input.price,
    quantity: input.quantity,
    category: categories.find((c) => c.id === input.categoryId) ?? categories[0],
    images: [input.imageUrl],
    sellerId: user.id,
    storeName: `${user.name}'s store`,
    productStatus: 'APPROVED', // real flow: PENDING until the admin approves
  })
}

export async function updateProduct(id: number, input: ProductInput): Promise<void> {
  const p = mockProducts.find((x) => x.id === id)
  if (!p) return
  p.name = input.name
  p.description = input.description
  p.price = input.price
  p.quantity = input.quantity
  p.category = categories.find((c) => c.id === input.categoryId) ?? p.category
  p.images = [input.imageUrl]
}

export async function deleteProduct(id: number): Promise<void> {
  const index = mockProducts.findIndex((p) => p.id === id)
  if (index >= 0) mockProducts.splice(index, 1)
}