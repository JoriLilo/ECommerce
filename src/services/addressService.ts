import { apiDelete, apiGet, apiPost, apiPut } from './api'
import type { Address } from '../types/address'

// Contains address fields supplied by the form, without a backend id.
export type AddressInput = Omit<Address, 'id'>

// Loads every page of saved addresses and combines them into one list.
export async function getAddresses(): Promise<Address[]> {
  const addresses: Address[] = []
  let page = 0
  let totalPages = 1
  while (page < totalPages) {
    const result = await apiGet<{ content: Address[]; totalPages: number }>(
      `/addresses?page=${page}&size=50&sort=id,desc`,
    )
    addresses.push(...result.content)
    totalPages = result.totalPages
    page++
  }
  return addresses
}

// Saves a new address and returns the saved address.
export function createAddress(address: AddressInput) {
  return apiPost<Address>('/addresses', address)
}

// Replaces the address identified by its id.
export function updateAddress(id: number, address: AddressInput) {
  return apiPut<Address>(`/addresses/${id}`, address)
}

// Deletes the address identified by its id.
export function deleteAddress(id: number) {
  return apiDelete(`/addresses/${id}`)
}
