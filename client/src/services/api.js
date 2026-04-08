import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('wellnest_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401 || status === 403) {
      const path = window.location.pathname
      const isAuthRoute = path === '/login' || path === '/register'
      if (!isAuthRoute) {
        localStorage.removeItem('wellnest_token')
        window.location.replace('/login')
      }
    }
    return Promise.reject(error)
  },
)

const cacheStore = new Map()

export async function getCached(url, options = {}, ttlMs = 15000) {
  const key = `${url}:${JSON.stringify(options?.params || {})}`
  const now = Date.now()
  const hit = cacheStore.get(key)
  if (hit && now - hit.at < ttlMs) return hit.response

  const response = await api.get(url, options)
  cacheStore.set(key, { at: now, response })
  return response
}

export function invalidateCache(prefix = '') {
  for (const key of cacheStore.keys()) {
    if (!prefix || key.startsWith(prefix)) cacheStore.delete(key)
  }
}

export default api
