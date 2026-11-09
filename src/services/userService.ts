// src/services/userService.ts
import type { User } from '../types/user'
import { apiPut } from './api'

// Only include fields the user is allowed to edit.
export interface UpdateProfileInput {
  fullName: string
}

export function updateMyProfile(data: UpdateProfileInput,): Promise<User> {
  return apiPut<User>('/users/me', {
    fullName: data.fullName.trim(),
  })
}