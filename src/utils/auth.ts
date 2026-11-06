import type { LoginResponse, User } from '../types/user'

const AUTH_KEY = 'auth'

export function saveAuth(data: LoginResponse) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data))
}

function getAuth(): LoginResponse | null {
  const authString = localStorage.getItem(AUTH_KEY)
  if (!authString) return null

  try {
    return JSON.parse(authString) as LoginResponse
  } catch {
    return null
  }
}

export function getUser(): User | null {
  const auth = getAuth()
  return auth ? auth.user : null
}

export function getToken(): string | null {
  const auth = getAuth()
  return auth ? auth.token : null
}

export function logout() {
  localStorage.removeItem(AUTH_KEY)
}

export function updateSavedUser(user: User) {
  const auth = getAuth()
  if (auth) {
    auth.user = user
    saveAuth(auth)
  }
}
