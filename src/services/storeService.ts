import { apiGet, apiPost, apiPut } from './api'
import type { Store } from '../types/seller'

interface StoreResponse {
  id: number
  sellerId: number
  name: string
  descriptionl: string | null
}

function toStore(data: StoreResponse): Store {
  return { id: data.id, name: data.name, description: data.descriptionl ?? '' }
}

export async function getMyStore(): Promise<Store | null> {
  try {
    const data = await apiGet<StoreResponse>('/sellers/me/store')
    return toStore(data)
  } catch (err) {
    // This is the backend's message when an approved seller has no store.
    if (err instanceof Error && err.message === 'You have no store yet') return null
    throw err
  }
}

export async function getStore(id: number): Promise<Store> {
  return toStore(await apiGet<StoreResponse>(`/stores/${id}`))
}

export async function createStore(name: string, description: string): Promise<Store> {
  const data = await apiPost<StoreResponse>('/sellers/me/store', {
    name: name.trim(),
    description: description.trim(),
  })
  return toStore(data)
}

export async function updateStore(name: string, description: string): Promise<Store> {
  const data = await apiPut<StoreResponse>('/sellers/me/store', {
    name: name.trim(),
    description: description.trim(),
  })
  return toStore(data)
}
