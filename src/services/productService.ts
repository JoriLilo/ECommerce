import { apiGet, apiPost, apiPut, apiDelete } from './api'
import type { Product, ProductPage, ProductResponse } from '../types/product'

export interface ProductInput {
  name: string
  description: string
  price: number
  quantity: number
  categoryId: number
}

export function toProduct(data: ProductResponse): Product {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: Number(data.price),
    quantity: data.quantity,
    category: { id: data.categoryId, name: data.categoryName },
    images: data.images.map((image) => image.url),
    imageDetails: data.images,
    sellerId: data.sellerId,
    storeName: `Seller #${data.sellerId}`,
    productStatus: data.status,
  }
}

async function loadProducts(path: string): Promise<Product[]> {
  const products: Product[] = []
  let page = 0
  let totalPages = 1
  while (page < totalPages) {
    const result = await apiGet<ProductPage>(
      `${path}?page=${page}&size=50&sort=createdOn,desc`,
    )
    for (const product of result.content) {
      products.push(toProduct(product))
    }
    totalPages = result.totalPages
    page = page + 1
  }
  return products
}

export function getProducts(): Promise<Product[]> {
  return loadProducts('/products')
}

export async function getProduct(id: number): Promise<Product> {
  const product = await apiGet<ProductResponse>(`/products/${id}`)
  return toProduct(product)
}

export function getMyProducts(): Promise<Product[]> {
  return loadProducts('/sellers/me/products')
}

export function getStoreProducts(storeId: number): Promise<Product[]> {
  return loadProducts(`/stores/${storeId}/products`)
}

export function deleteProductImage(productId: number, imageId: number) {
  return apiDelete(`/products/${productId}/images/${imageId}`)
}

export async function getMyProduct(id: number): Promise<Product> {
  const product = await apiGet<ProductResponse>(`/sellers/me/products/${id}`)
  return toProduct(product)
}

function productBody(input: ProductInput) {
  return {
    name: input.name.trim(),
    description: input.description.trim(),
    price: input.price,
    stockQuantity: input.quantity,
    categoryId: input.categoryId,
  }
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const product = await apiPost<ProductResponse>('/products', productBody(input))
  return toProduct(product)
}

export async function updateProduct(id: number, input: ProductInput): Promise<Product> {
  const product = await apiPut<ProductResponse>(`/products/${id}`, productBody(input))
  return toProduct(product)
}

export function deleteProduct(id: number): Promise<void> {
  return apiDelete(`/products/${id}`)
}

export function uploadProductImage(id: number, file: File) {
  const form = new FormData()
  form.append('file', file)
  return apiPost<{ id: number; url: string }>(`/products/${id}/images`, form)
}
