import { getToken , getRefreshToken , saveAuth} from '../utils/auth'

const BASE_URL = '/api'

//the refresh operation currently running.
let refreshPromise: Promise<void> | null = null



// Used when the backend provides no usable error message.
function getFallbackMessage(status: number): string {
  let msg = 'Something went wrong. Please try again.'

  switch (status) {
    case 400:
    case 422:
      msg = 'Please check your information and try again.'
      break
    case 401:
      msg = 'Please sign in again.'
      break
    case 403:
      msg = 'You do not have permission to do this.'
      break
    case 404:
      msg = 'The requested item could not be found.'
      break
    case 409:
      msg = 'This action conflicts with the current information. Refresh and try again.'
      break
    case 413:
      msg = 'The uploaded file is too large.'
      break
    case 429:
      msg = 'Too many requests. Please wait a moment and try again.'
      break
    default:
      if (status >= 500 && status < 600) {
        msg = 'The server could not complete your request. Please try again later.'
      }
      break
  }

  return msg
}

// Reads backend validation errors, then falls back to the HTTP status.
async function getErrorMessage(response: Response): Promise<string> {
  let msg = getFallbackMessage(response.status)

  try {
    const text = await response.text()

    if (text.trim() === 'Invalid CORS request') {
      msg = 'The backend does not allow this frontend address. Check the backend CORS settings.'
    } else {
      const error: {
        message?: string
        fieldErrors?: Record<string, string>
      } = JSON.parse(text)

      const fields = Object.values(error.fieldErrors || {})

      if (fields.length > 0) {
        msg = fields.join('. ')
      } else if (
        typeof error.message === 'string' &&
        error.message.trim().length > 0
      ) {
        msg = error.message.trim()
      }
    }
  } catch {
    // Keep the fallback if reading or parsing the response fails.
  }

  return msg
}


//requests and saves a new token pair.
async function refreshSession(): Promise<void> {


  // 1. Get the refresh token from local storage.
  const refreshToken = getRefreshToken()
  if(!refreshToken) {
    throw new Error('No refresh token available.')
  }

  // 2. Send the refresh token to the backend to get a new access token and refresh token.
  const response = await fetch(BASE_URL + '/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  })

  if(response.status === 401) {
    throw new Error("Session expired. Please sign in again.")
  }

  // 3. If the response is not OK, throw an error. 
 if (!response.ok) {
  throw new Error(`Failed to refresh token: ${response.status}`)
}

  // 4. Parse the response and save the new tokens.
  const data = await response.json()
  const accessToken = data.accessToken
  const newRefreshToken = data.refreshToken
  const tokenType = data.tokenType
  const user = data.user
  if(accessToken && newRefreshToken && tokenType && user) {
    saveAuth({ accessToken,  refreshToken: newRefreshToken, tokenType, user })
  } else {
    throw new Error('Invalid response from refresh token endpoint.')
  }
}



async function checkAndRefreshToken(): Promise<void> {

  if(!refreshPromise) {
    refreshPromise = refreshSession();
  }
  const existingRefresh = refreshPromise;
  try{
    await existingRefresh;
  }finally {
    if(refreshPromise === existingRefresh) {
      refreshPromise = null;
    }
  }
}

// T is the response type (similar to a generic type in Java).
async function request<T>(path: string, method: string, body?: unknown): Promise<T> {
  // 1. Add the saved login token.
  const headers: Record<string, string> = {}
  const token = getToken()
  const refreshToken = getRefreshToken()
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

  // 3. Send the request to the backend. If backend is unreachable and response.ok is never called this will throw an error.
  let response: Response

  try {
    response = await fetch(BASE_URL + path, {
      method,
      headers,
      body: requestBody,
    })
  } catch {
    throw new Error(
      'Could not reach the server. Check your connection and try again.'
    )
  }

  if (response.status === 401 && token && refreshToken && !path.startsWith('/auth/')) {
    
  
      if (token === getToken()) {
        await checkAndRefreshToken()
      }
      // Retry the original request with the new token.
      const newToken = getToken()

      if (!newToken) {
        throw new Error('Please sign in again.')
      }
        
      headers.Authorization = `Bearer ${newToken}`
      try {
        response = await fetch(BASE_URL + path, {
          method,
          headers,
          body: requestBody,
     
        })
      } catch {
        throw new Error(
          'Could not reach the server. Check your connection and try again.'
        )
      }
  }


  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  // 4. Return the result. A 204 (No Content) response has no JSON body.
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
