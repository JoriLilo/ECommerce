import { apiGet, apiPost, apiPut, apiDelete } from './api'
import type { Product, ProductPage, ProductResponse } from '../types/product'

// Contains the editable product fields submitted by the form.
export interface ProductInput {
  name: string
  description: string
  price: number
  quantity: number
  categoryId: number
}

// Converts the backend response into the product shape used by components.
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

// Loads all product pages and converts each response for display.
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

// Loads products from the public catalog.
export function getProducts(): Promise<Product[]> {
  return loadProducts('/products')
}

// Loads and converts one public product.
export async function getProduct(id: number): Promise<Product> {
  const product = await apiGet<ProductResponse>(`/products/${id}`)
  return toProduct(product)
}

// Loads products belonging to the signed-in seller.
export function getMyProducts(): Promise<Product[]> {
  return loadProducts('/sellers/me/products')
}

// Loads products for the selected store.
export function getStoreProducts(storeId: number): Promise<Product[]> {
  return loadProducts(`/stores/${storeId}/products`)
}

// Deletes one image using both the product id and image id.
export function deleteProductImage(productId: number, imageId: number) {
  return apiDelete(`/products/${productId}/images/${imageId}`)
}

// Loads a product through the signed-in seller's endpoint.
export async function getMyProduct(id: number): Promise<Product> {
  const product = await apiGet<ProductResponse>(`/sellers/me/products/${id}`)
  return toProduct(product)
}

// Trims text and maps quantity to the backend stockQuantity field.
function productBody(input: ProductInput) {
  return {
    name: input.name.trim(),
    description: input.description.trim(),
    price: input.price,
    stockQuantity: input.quantity,
    categoryId: input.categoryId,
  }
}

// Creates a product and converts the saved response.
export async function createProduct(input: ProductInput): Promise<Product> {
  const product = await apiPost<ProductResponse>('/products', productBody(input))
  return toProduct(product)
}

// Updates product details and converts the saved response.
export async function updateProduct(id: number, input: ProductInput): Promise<Product> {
  const product = await apiPut<ProductResponse>(`/products/${id}`, productBody(input))
  return toProduct(product)
}

// Requests deletion of the selected product.
export function deleteProduct(id: number): Promise<void> {
  return apiDelete(`/products/${id}`)
}

// Sends the image as multipart form data under the file field.
export function uploadProductImage(id: number, file: File) {
  const form = new FormData()
  form.append('file', file)
  return apiPost<{ id: number; url: string }>(`/products/${id}/images`, form)
}
