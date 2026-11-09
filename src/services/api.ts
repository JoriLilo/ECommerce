import { getToken } from '../utils/auth'

const BASE_URL = '/api'


// Reads backend validation errors, then falls back to a message for the HTTP status.
async function getErrorMessage(response: Response): Promise<string> {
  const text = await response.text()

  if (text.trim() === 'Invalid CORS request') {
    return 'The backend does not allow this frontend address. Check the backend CORS settings.'
  }

  try {
    const error: { message?: string; fieldErrors?: Record<string, string> } = JSON.parse(text)
    const fields = Object.values(error.fieldErrors || {})
    if (fields.length > 0) return fields.join('. ')
    if (error.message) return error.message
  } catch {

  }

  if (response.status === 401) return 'Please sign in again.'
  if (response.status === 403) return 'You do not have permission to do this.'
  return `Request failed: ${response.status}`
}

// T is the response type, similar to a generic type in Java.
async function request<T>(path: string, method: string, body?: unknown): Promise<T> {
  // 1. Add the saved login token.
  const headers: Record<string, string> = {}
  const token = getToken()
  let requestBody: string | FormData | undefined

  // 2. Send images as FormData and other data as JSON.
  if (body instanceof FormData) {
    requestBody = body
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    requestBody = JSON.stringify(body)
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  // 3. Send the request to the backend.
  const response = await fetch(BASE_URL + path, {
    method,
    headers,
    body: requestBody,
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  // 4. Return the result. A 204 response has no JSON body.
  if (response.status === 204) {
    return undefined as T
  }
  const text = await response.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}

// Sends a GET request and returns the expected response type.
export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, 'GET')
}

// Sends data in a POST request and returns the response.
export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, 'POST', body)
}

// Sends a PATCH request, with a body when one is provided.
export function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, 'PATCH', body)
}

// Sends replacement data in a PUT request.
export function apiPut<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, 'PUT', body)
}

// Sends a DELETE request without returning response data.
export function apiDelete(path: string): Promise<void> {
  return request<void>(path, 'DELETE')
}
