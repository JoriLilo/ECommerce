import { apiGet, apiPost, apiPut } from './api'
import { getUser, updateSavedUser } from '../utils/auth'
import type { SellerApplicationInput, SellerProfile } from '../types/seller'

// Seller profile and application endpoints from the current backend.
export async function getSellerProfile() {
  const profile = await apiGet<SellerProfile>('/sellers/me')
  updateSavedUser(profile.user)
  return profile
}

// Submits the business details for a seller application.
export function applyAsSeller(data: SellerApplicationInput) {
  return apiPost<SellerProfile>('/sellers/apply', {
    nipt: data.nipt,
    businessPhone: data.businessPhone,
    businessAddress: data.businessAddress,
  })
}

// Updates the signed-in seller's business details.
export function updateSellerProfile(data: {
  nipt: string
  businessPhone: string
  businessAddress: string
}) {
  return apiPut<SellerProfile>('/sellers/me', data)
}

// Saves application details locally under the current user id.
export function saveSellerDraft(data: SellerApplicationInput) {
  localStorage.setItem(`seller-draft-${getUser()?.id}`, JSON.stringify(data))
}

// Reads the current user's draft; returns null if it cannot be parsed.
export function getSellerDraft(): SellerApplicationInput | null {
  try {
    return JSON.parse(localStorage.getItem(`seller-draft-${getUser()?.id}`) ?? 'null')
  } catch {
    return null
  }
}

// Removes the current user's saved application draft.
export function clearSellerDraft() {
  localStorage.removeItem(`seller-draft-${getUser()?.id}`)
}
