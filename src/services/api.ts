import { getToken } from '../utils/auth'

const BASE_URL = '/api/v1'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    
    const token = getToken()
 

    const headers: Record<string, string> = {
    "Content-Type": "application/json",
    };

    if (token) {
    headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...options?.headers },
    });

    if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
    }

    return res.json() as Promise<T>;

}

export const apiGet = <T>(path: string) => request<T>(path);

export const apiPost = <T>(path: string, body: unknown) =>
  request<T>(path, { method: "POST", body: JSON.stringify(body) });