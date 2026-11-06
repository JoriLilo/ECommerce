import { apiDelete, apiGet, apiPost, apiPut } from './api'
import type { Address } from '../types/address'

export type AddressInput = Omit<Address, 'id'>

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

export function createAddress(address: AddressInput) {
  return apiPost<Address>('/addresses', address)
}

export function updateAddress(id: number, address: AddressInput) {
  return apiPut<Address>(`/addresses/${id}`, address)
}

export function deleteAddress(id: number) {
  return apiDelete(`/addresses/${id}`)
}
