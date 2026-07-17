import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

// 拦截器：解包 ApiResponse { code, message, data }
api.interceptors.response.use(
  res => res.data,
  err => {
    const msg = err.response?.data?.message || err.message || '请求失败'
    return Promise.reject(new Error(msg))
  }
)

// ===== 车辆管理 =====
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

// ===== 住户管理 =====
export const residentApi = {
  list() {
    return api.get('/residents')
  },
  add(userName, plateNumber) {
    // POST /resident/add 用 JSON body，新建 axios 实例单独设置
    return axios.create({
      baseURL: 'http://localhost:8080/api',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    }).post('/residents/add', { userName, plateNumber }).then(res => res.data)
  },
  exportExcel() {
    window.open('http://localhost:8080/api/residents/export', '_blank')
  }
}

// ===== 费用结算 =====
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
  },
  exportExcel() {
    window.open('http://localhost:8080/api/fees/export', '_blank')
  }
}

// ===== 车位管理（待成员C完成后端后对接） =====
export const parkingSpotApi = {
  // list() { return api.get('/parking-spots') },
  // heatMap() { return api.get('/parking-spots/heatmap') },
  // occupancyRate() { return api.get('/parking-spots/occupancy') },
}

// ===== 数据统计（待成员C完成后端后对接） =====
export const statisticsApi = {
  // todaySummary() { return api.get('/statistics/today') },
  // hourlyTraffic() { return api.get('/statistics/hourly') },
  // weeklyTrend() { return api.get('/statistics/weekly') },
  // aiPrediction() { return api.get('/statistics/ai-prediction') },
}

// ===== 系统管理（待成员C完成后端后对接） =====
export const systemApi = {
  // config() { return api.get('/system/config') },
  // health() { return api.get('/system/health') },
  // logs() { return api.get('/system/logs') },
  // backup() { return api.post('/system/backup') },
}

export default api