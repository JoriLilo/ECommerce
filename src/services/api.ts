import { getToken } from '../utils/auth'

const BASE_URL = '/api'

interface ApiErrorBody {
  message?: string
  fieldErrors?: Record<string, string>
}

// T describes the response, similar to a generic type in Java.
async function request<T>(path: string, method: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {}
  const token = getToken()
  let requestBody: string | FormData | undefined

  if (body instanceof FormData) {
    requestBody = body
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    requestBody = JSON.stringify(body)
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(BASE_URL + path, {
    method: method,
    headers: headers,
    body: requestBody,
  })

  if (!response.ok) {
    let message = `Request failed: ${response.status}`
    if (response.status === 401)
      message = 'Your session has expired. Please sign in again.'
    if (response.status === 403)
      message =
        'This account does not have access. Please sign in again to refresh your role.'
    try {
      const errorBody: ApiErrorBody = await response.json()
      const fieldMessages = Object.values(errorBody.fieldErrors || {})
      if (fieldMessages.length > 0) {
        message = fieldMessages.join('. ')
      } else if (errorBody.message) {
        message = errorBody.message
      }
    } catch {
      // Some failed responses do not have a JSON body.
    }
    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }
  return response.json() as Promise<T>
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, 'GET')
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, 'POST', body)
}

export function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, 'PATCH', body)
}

export function apiPut<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, 'PUT', body)
}

export function apiDelete(path: string): Promise<void> {
  return request<void>(path, 'DELETE')
}
