const api =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:8002'
    : 'https://drlaptop-api.mhqb365.com'

export default api
