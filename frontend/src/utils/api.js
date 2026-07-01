import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true
      try {
        const refresh = localStorage.getItem('refresh')
        if (refresh) {
          const { data } = await axios.post('/api/auth/refresh/', { refresh })
          localStorage.setItem('access', data.access)
          error.config.headers.Authorization = `Bearer ${data.access}`
          return api(error.config)
        }
      } catch { localStorage.removeItem('access'); localStorage.removeItem('refresh') }
    }
    return Promise.reject(error)
  }
)

export default api
