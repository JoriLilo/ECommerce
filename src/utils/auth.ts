import type { LoginResponse, User } from '../types/user'

const AUTH_KEY = 'auth'

// Stores the user and login token together in local storage.
export function saveAuth(data: LoginResponse) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data))
}

// Reads the stored session; returns null when missing or invalid JSON.
function getAuth(): LoginResponse | null {
  const authString = localStorage.getItem(AUTH_KEY)
  if (!authString) return null

  try {
    return JSON.parse(authString) as LoginResponse
  } catch {
    return null
  }
}

// Returns the saved user, or null when there is no stored session.
export function getUser(): User | null {
  const auth = getAuth()
  return auth ? auth.user : null
}

// Returns the saved token used by backend requests.
export function getToken(): string | null {
  const auth = getAuth()
  return auth ? auth.accessToken : null
}

//Returns the saved refresh token used by backend requests.
export function getRefreshToken(): string | null {
  const auth = getAuth()
  return auth ? auth.refreshToken : null
}

// Removes the saved session from this browser.
export function logout() {
  localStorage.removeItem(AUTH_KEY)
}

// Refreshes user details while keeping the existing login token.
export function updateSavedUser(user: User) {
  const auth = getAuth()
  if (auth) {
    auth.user = user
    saveAuth(auth)
  }
}
