import { apiGet, apiPost, apiPut } from './api'
import { getUser, updateSavedUser } from '../utils/auth'
import type { SellerApplicationInput, SellerProfile } from '../types/seller'

// Seller profile and application endpoints from the current backend.
export async function getSellerProfile() {
  const profile = await apiGet<SellerProfile>('/sellers/me')
  updateSavedUser(profile.user)
  return profile
}

export function applyAsSeller(data: SellerApplicationInput) {
  return apiPost<SellerProfile>('/sellers/apply', {
    nipt: data.nipt,
    businessPhone: data.businessPhone,
    businessAddress: data.businessAddress,
  })
}

export function updateSellerProfile(data: {
  nipt: string
  businessPhone: string
  businessAddress: string
}) {
  return apiPut<SellerProfile>('/sellers/me', data)
}

export function saveSellerDraft(data: SellerApplicationInput) {
  localStorage.setItem(`seller-draft-${getUser()?.id}`, JSON.stringify(data))
}

export function getSellerDraft(): SellerApplicationInput | null {
  try {
    return JSON.parse(localStorage.getItem(`seller-draft-${getUser()?.id}`) ?? 'null')
  } catch {
    return null
  }
}

export function clearSellerDraft() {
  localStorage.removeItem(`seller-draft-${getUser()?.id}`)
}
