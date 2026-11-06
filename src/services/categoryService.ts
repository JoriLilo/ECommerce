import { apiDelete, apiGet, apiPost, apiPut } from './api'
import type { Category } from '../types/category'

interface CategoryPage {
  content: Category[]
  totalPages: number
}

export async function getCategories(): Promise<Category[]> {
  const categories: Category[] = []
  let page = 0
  let totalPages = 1
  while (page < totalPages) {
    const result = await apiGet<CategoryPage>(`/categories?page=${page}&size=50&sort=name,asc`)
    categories.push(...result.content)
    totalPages = result.totalPages
    page++
  }
  return categories
}

export function createCategory(name: string) {
  return apiPost<Category>('/categories', { name: name.trim() })
}

export function updateCategory(id: number, name: string) {
  return apiPut<Category>(`/categories/${id}`, { name: name.trim() })
}

export function deleteCategory(id: number) {
  return apiDelete(`/categories/${id}`)
}
