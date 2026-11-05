import { getToken } from '../utils/auth'

const BASE_URL = '/api'

interface ApiErrorBody {
  message?: string
  fieldErrors?: Record<string, string>
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {}
  if (typeof options?.body === 'string') headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...options?.headers },
  })

  if (!res.ok) {
    let message = `Request failed: ${res.status}`
    try {
      const body: ApiErrorBody = await res.json()
      const details = body.fieldErrors ? Object.values(body.fieldErrors) : []
      if (details.length > 0) message = details.join('. ')
      else if (body.message) message = body.message
    } catch {
      /* no JSON body */
    }
    throw new Error(message)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const apiGet = <T>(path: string) => request<T>(path)
export const apiPost = <T>(path: string, body: unknown) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body) })