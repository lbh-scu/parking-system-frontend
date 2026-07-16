import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

api.interceptors.response.use(
  res => res.data,
  err => {
    const msg = err.response?.data?.message || err.message || '请求失败'
    return Promise.reject(new Error(msg))
  }
)

export const vehicleApi = {
  entry(plateNumber, spotNumber) {
    return api.post('/vehicles/entry', null, { params: { plateNumber, spotNumber } })
  },
  exit(plateNumber) {
    return api.post('/vehicles/exit', null, { params: { plateNumber } })
  },
  parking() {
    return api.get('/vehicles/parking')
  },
  history(plateNumber) {
    return api.get('/vehicles/history', { params: { plateNumber: plateNumber || undefined } })
  }
}

export const feeApi = {
  calculate(plateNumber) {
    return api.post('/fees/calculate', null, { params: { plateNumber } })
  },
  pay(feeId) {
    return api.post('/fees/pay', null, { params: { feeId } })
  },
  pending() {
    return api.get('/fees/pending')
  },
  statistics() {
    return api.get('/fees/statistics')
  }
}

export default api
