import { apiGet, apiPost, apiPut } from './api'
import type { Store } from '../types/seller'

// Describes the backend store response, including its description field.
interface StoreResponse {
  id: number
  sellerId: number
  name: string
  description: string | null
}

// Maps the backend description field and replaces a missing description with empty text.
function toStore(data: StoreResponse): Store {
  return { id: data.id, name: data.name, description: data.description ?? '' }
}

// Loads the seller store; returns null for the backend no-store message.
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

// Loads and converts the selected public store.
export async function getStore(id: number): Promise<Store> {
  return toStore(await apiGet<StoreResponse>(`/stores/${id}`))
}

// Creates the seller's store after trimming its name and description.
export async function createStore(name: string, description: string): Promise<Store> {
  const data = await apiPost<StoreResponse>('/sellers/me/store', {
    name: name.trim(),
    description: description.trim(),
  })
  return toStore(data)
}

// Updates the seller's store after trimming its name and description.
export async function updateStore(name: string, description: string): Promise<Store> {
  const data = await apiPut<StoreResponse>('/sellers/me/store', {
    name: name.trim(),
    description: description.trim(),
  })
  return toStore(data)
}
