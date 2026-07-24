import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

// 拦截器：解包 ApiResponse { code, message, data }
api.interceptors.response.use(
  res => {
    // 检查后端返回的 ApiResponse.code，如果不是成功状态码则 reject
    const body = res.data
    if (body && body.code !== undefined && body.code !== 200) {
      return Promise.reject(new Error(body.message || '请求失败'))
    }
    return body
  },
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
  },
  todayStats() {
    return api.get('/vehicles/today-stats')
  }
}

// ===== 住户管理 =====
export const residentApi = {
  list() {
    return api.get('/residents')
  },
  search(plateNumber) {
    return api.get('/residents/search', { params: { plateNumber } })
  },
  add(userName, plateNumber) {
    return axios.create({
      baseURL: 'http://localhost:8080/api',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    }).post('/residents/resident/add', { userName, plateNumber }).then(res => res.data)
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
  todayRecords() {
    return api.get('/fees/today-records')
  },
  exportExcel() {
    window.open('http://localhost:8080/api/fees/export', '_blank')
  }
}

// ===== 车位管理（使用其他成员更新的 API 路径） =====
export const parkingSpotApi = {
  list() { return api.get('/spots') },
  free() { return api.get('/spots/free') },
  assign(plateNumber) { return api.post('/spots/assign', null, { params: { plateNumber } }) },
  release(spotNumber) { return api.post('/spots/release', null, { params: { spotNumber } }) },
  heatmap() { return api.get('/spots/heatmap') },
  areaCompare() { return api.get('/spots/area-compare') },
  occupancyRate() { return api.get('/spots/occupancy-rate') },
}

// ===== 数据统计（M5） =====
export const statisticsApi = {
  /** 今日/本周/本月营收概览 */
  summary() { return api.get('/statistics/summary') },
  /** 24小时高峰时段统计 */
  peakHours() { return api.get('/statistics/peak-hours') },
  /** 车位占用率趋势 */
  trend(days = 7) { return api.get('/statistics/trend', { params: { days } }) },
  /** AI占用率预测 */
  aiPrediction(hours = 12) { return api.get('/statistics/ai-prediction', { params: { hours } }) },
  /** 收费趋势 */
  revenueTrend(period = 'day') { return api.get('/statistics/revenue-trend', { params: { period } }) },
  /** 导出统计报表（Excel .xlsx） */
  async exportExcel() {
    try {
      const res = await axios.get('http://localhost:8080/api/statistics/export', {
        baseURL: '',
        responseType: 'blob',
        timeout: 30000
      })
      // 创建下载链接并自动点击
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', '导出报表.xlsx')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (e) {
      console.error('导出失败:', e)
    }
  },
}

// ===== 系统管理（M6） =====
export const systemApi = {
  /** 获取所有系统配置 */
  config() { return api.get('/system/config') },
  /** 更新配置 */
  updateConfig(configKey, configValue) {
    return api.post('/system/config/update', null, { params: { configKey, configValue } })
  },
  /** 健康检查 */
  health() { return api.get('/system/health') },
  /** 查看日志 */
  logs(lines = 100) { return api.get('/system/logs', { params: { lines } }) },
  /** 一键备份 */
  backup() { window.open('http://localhost:8080/api/system/backup', '_blank') },
}

export default api