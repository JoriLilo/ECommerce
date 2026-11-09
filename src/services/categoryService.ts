import { apiDelete, apiGet, apiPost, apiPut } from './api'
import type { Category } from '../types/category'

// Describes one backend page of categories.
interface CategoryPage {
  content: Category[]
  totalPages: number
}

// Loads all category pages into one list, ordered by name.
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

// Trims the category name before sending it to the backend.
export function createCategory(name: string) {
  return apiPost<Category>('/categories', { name: name.trim() })
}

// Updates the selected category with the trimmed name.
export function updateCategory(id: number, name: string) {
  return apiPut<Category>(`/categories/${id}`, { name: name.trim() })
}

// Deletes the selected category.
export function deleteCategory(id: number) {
  return apiDelete(`/categories/${id}`)
}
