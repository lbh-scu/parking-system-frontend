<template>
  <div class="parking-spots">
    <el-card shadow="never" class="mb-4" style="border-radius:12px;border:1px solid #ebeef5;">
      <template #header>
        <div class="card-header">
          <el-icon size="20" color="#409EFF"><Grid /></el-icon>
          <span>车位监控</span>
          <el-button size="small" style="margin-left:auto" @click="refreshData" :loading="loading">
            <el-icon><Refresh /></el-icon> 刷新
          </el-button>
        </div>
      </template>

      <el-row :gutter="20" class="mb-4">
        <el-col :span="6">
          <div class="spot-stat" style="background:linear-gradient(135deg,#ecf5ff,#d9ecff)">
            <div class="spot-stat-value">{{ stats.total }}</div>
            <div class="spot-stat-label">总车位</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="spot-stat" style="background:linear-gradient(135deg,#f0f9eb,#dbf0d0)">
            <div class="spot-stat-value">{{ stats.free }}</div>
            <div class="spot-stat-label">空闲</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="spot-stat" style="background:linear-gradient(135deg,#fef0f0,#fcd5d5)">
            <div class="spot-stat-value">{{ stats.occupied }}</div>
            <div class="spot-stat-label">已占用</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="spot-stat" style="background:linear-gradient(135deg,#fdf6ec,#fce8c8)">
            <div class="spot-stat-value">{{ stats.maintenance }}</div>
            <div class="spot-stat-label">维护中</div>
          </div>
        </el-col>
      </el-row>

      <!-- 热力图 + 区域对比 -->
      <el-row :gutter="20" class="mb-4">
        <el-col :span="12">
          <el-card shadow="never" style="border-radius:12px;border:1px solid #ebeef5;">
            <template #header>
              <div class="card-header">
                <el-icon color="#409EFF"><Grid /></el-icon>
                <span>车位热力图</span>
              </div>
            </template>
            <HeatMap :data="heatData" />
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="never" style="border-radius:12px;border:1px solid #ebeef5;">
            <template #header>
              <div class="card-header">
                <el-icon color="#67C23A"><DataAnalysis /></el-icon>
                <span>区域占用对比</span>
              </div>
            </template>
            <AreaCompare :data="areaData" />
          </el-card>
        </el-col>
      </el-row>

      <!-- A/B/C 三个区域 -->
      <div v-for="zone in zones" :key="zone.name" class="zone-section">
        <div class="zone-title">
          <el-tag :color="zone.color" effect="dark" size="small">{{ zone.name }}区</el-tag>
          <span class="zone-desc">{{ zone.desc }}</span>
        </div>
        <div class="spot-grid">
          <div v-for="spot in zone.spots" :key="spot.id" class="spot-item"
            :class="{ 'spot-free': spot.status === 'free', 'spot-occupied': spot.status === 'occupied', 'spot-maintenance': spot.status === 'maintenance' }"
            @click="handleSpotClick(spot)">
            <div class="spot-number">{{ spot.label }}</div>
            <div class="spot-status">{{ statusMap[spot.status] }}</div>
            <div v-if="spot.status === 'occupied' && plateMap[spot.label]" class="spot-plate">{{ plateMap[spot.label] }}</div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Grid, DataAnalysis, Refresh } from '@element-plus/icons-vue'
import { parkingSpotApi, vehicleApi } from '../api/index.js'
import HeatMap from '../components/spot/HeatMap.vue'
import AreaCompare from '../components/spot/AreaCompare.vue'

const statusMap = { free: '空闲', occupied: '已占', maintenance: '维护' }
const labelMap = { free: '空闲', occupied: '已占用', maintenance: '维护中' }

const loading = ref(false)
const stats = ref({ total: 0, free: 0, occupied: 0, maintenance: 0 })
const heatData = ref([])
const areaData = ref([])
const zones = ref([])
const plateMap = ref({}) // spotNumber -> plateNumber 映射

// ===== 备用 mock 数据（后端离线或空数据时使用） =====
function buildMockSpots() {
  const areas = ['A', 'B', 'C']
  const spots = []
  let id = 1
  for (const area of areas) {
    for (let n = 1; n <= 28; n++) {
      spots.push({
        id: id++,
        area: area,
        floor: n <= 14 ? 1 : 2,
        spotNumber: `${area}${String(n).padStart(2, '0')}`,
        status: 'FREE'
      })
    }
  }
  const occupied = [3, 7, 12, 15, 19, 23, 28, 31, 35, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80]
  occupied.forEach(i => { if (spots[i]) spots[i].status = 'OCCUPIED' })
  const maintenance = [9, 37, 65]
  maintenance.forEach(i => { if (spots[i]) spots[i].status = 'MAINTENANCE' })
  return spots
}
function buildMockStats(spots) {
  const free = spots.filter(s => s.status === 'FREE').length
  const occupied = spots.filter(s => s.status === 'OCCUPIED').length
  const maintenance = spots.filter(s => s.status === 'MAINTENANCE').length
  return { total: spots.length, free, occupied, maintenance }
}
function buildMockHeatmap(spots) {
  const map = {}
  spots.forEach(s => {
    const key = `${s.area}|${s.floor}`
    if (!map[key]) { map[key] = { area: s.area, floor: s.floor, total: 0, occupied: 0 } }
    map[key].total++
    if (s.status === 'OCCUPIED') map[key].occupied++
  })
  return Object.values(map).map(d => ({
    area: d.area + '区',
    total: d.total,
    occupied: d.occupied,
    rate: d.total ? d.occupied / d.total : 0
  }))
}
function buildMockAreaCompare(spots) {
  const map = {}
  spots.forEach(s => {
    if (!map[s.area]) { map[s.area] = { area: s.area, total: 0, occupied: 0, free: 0 } }
    map[s.area].total++
    if (s.status === 'OCCUPIED') map[s.area].occupied++
    if (s.status === 'FREE') map[s.area].free++
  })
  return Object.values(map).map(d => ({
    area: d.area + '区',
    total: d.total,
    occupied: d.occupied,
    free: d.free
  }))
}
function buildMockZones(spots) {
  const areaColors = { A: '#409EFF', B: '#67C23A', C: '#E6A23C', D: '#F56C6C' }
  const map = {}
  spots.forEach(s => {
    const a = s.area
    if (!map[a]) { map[a] = { name: a, desc: '', color: areaColors[a] || '#909399', spots: [] } }
    map[a].spots.push({ id: s.id, label: s.spotNumber, status: s.status.toLowerCase() })
  })
  Object.keys(map).forEach(k => {
    const sp = map[k].spots
    map[k].desc = `${sp[0]?.label || ''} ~ ${sp[sp.length - 1]?.label || ''} 号车位`
  })
  return Object.values(map)
}
function applySpotsToZones(allSpots) {
  const areaMap = {}
  const areaColors = { A: '#409EFF', B: '#67C23A', C: '#E6A23C', D: '#F56C6C' }
  allSpots.forEach(spot => {
    const area = spot.area || 'A'
    if (!areaMap[area]) areaMap[area] = { name: area, desc: '', color: areaColors[area] || '#909399', spots: [] }
    const raw = (spot.status || 'FREE').toLowerCase()
    areaMap[area].spots.push({ id: spot.id, label: spot.spotNumber, status: raw })
  })
  Object.keys(areaMap).forEach(key => {
    const sp = areaMap[key].spots
    areaMap[key].desc = `${sp[0]?.label || ''} ~ ${sp[sp.length - 1]?.label || ''} 号车位`
  })
  return Object.values(areaMap)
}

async function loadPlateMap() {
  try {
    const parkingRes = await vehicleApi.parking()
    const parkingVehicles = parkingRes.data || []
    const map = {}
    parkingVehicles.forEach(v => {
      if (v.spotNumber) map[v.spotNumber] = v.plateNumber
    })
    plateMap.value = map
  } catch (e) {
    console.warn('获取停放车辆失败:', e.message)
    plateMap.value = {}
  }
}

async function refreshData() {
  loading.value = true
  try {
    const [spotRes, heatRes, areaRes, occRes] = await Promise.allSettled([
      parkingSpotApi.list(),
      parkingSpotApi.heatmap(),
      parkingSpotApi.areaCompare(),
      parkingSpotApi.occupancyRate()
    ])

    // 获取车位列表（必需，没有则用mock）
    const allSpots = spotRes.status === 'fulfilled' ? (spotRes.value.data || []) : []

    if (!allSpots.length) {
      console.warn('车位接口返回空，使用Mock数据')
      const mockSpots = buildMockSpots()
      stats.value = buildMockStats(mockSpots)
      heatData.value = buildMockHeatmap(mockSpots)
      areaData.value = buildMockAreaCompare(mockSpots)
      zones.value = buildMockZones(mockSpots)
      return
    }

    // 1) 处理占用率统计（可选接口）
    if (occRes.status === 'fulfilled' && occRes.value?.data) {
      const occ = occRes.value.data
      stats.value = {
        total: occ.total || 0,
        free: occ.free || 0,
        occupied: occ.occupied || 0,
        maintenance: occ.maintenance || 0
      }
    } else {
      const free = allSpots.filter(s => s.status === 'FREE').length
      const occupied = allSpots.filter(s => s.status === 'OCCUPIED').length
      stats.value = { total: allSpots.length, free, occupied, maintenance: 0 }
    }

    // 2) 处理热力图数据（可选接口）
    if (heatRes.status === 'fulfilled' && heatRes.value?.data?.length) {
      heatData.value = heatRes.value.data.map(d => ({
        area: d.area, total: d.total, occupied: d.occupied, rate: d.rate
      }))
    } else {
      heatData.value = buildMockHeatmap(allSpots)
    }

    // 3) 处理区域对比数据（可选接口）
    if (areaRes.status === 'fulfilled' && areaRes.value?.data?.length) {
      areaData.value = areaRes.value.data.map(d => ({
        area: d.area, total: d.total, occupied: d.occupied, free: d.free
      }))
    } else {
      areaData.value = buildMockAreaCompare(allSpots)
    }

    // 4) 处理车位列表 → 按区域分组
    zones.value = applySpotsToZones(allSpots)

    // 5) 加载车牌映射
    await loadPlateMap()
  } catch (e) {
    console.warn('refreshData 异常:', e.message)
    const mockSpots = buildMockSpots()
    stats.value = buildMockStats(mockSpots)
    heatData.value = buildMockHeatmap(mockSpots)
    areaData.value = buildMockAreaCompare(mockSpots)
    zones.value = buildMockZones(mockSpots)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  refreshData()
})

const handleSpotClick = (spot) => {
  ElMessage.info(`${spot.label} 号车位 ${labelMap[spot.status] || spot.status}`)
}
</script>

<style scoped>
.parking-spots { max-width: 1400px; margin: 0 auto; }
.mb-4 { margin-bottom: 20px; }
.card-header { display:flex; align-items:center; gap:10px; font-size:16px; font-weight:600; }

.spot-stat { padding: 20px; border-radius: 12px; text-align: center; }
.spot-stat-value { font-size: 32px; font-weight: bold; color: #303133; }
.spot-stat-label { font-size: 14px; color: #606266; margin-top: 4px; }

.zone-section { margin-bottom: 24px; }
.zone-title { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.zone-desc { font-size: 13px; color: #909399; }

.spot-grid { display: grid; grid-template-columns: repeat(14, 1fr); gap: 6px; }
.spot-item {
  padding: 8px 4px; border-radius: 6px; text-align: center;
  cursor: pointer; transition: all 0.2s;
}
.spot-item:hover { transform: scale(1.08); }
.spot-free { background: #f0f9eb; border: 1px solid #b3e19d; }
.spot-occupied { background: #fef0f0; border: 1px solid #fbc4c4; }
.spot-maintenance { background: #fdf6ec; border: 1px solid #f5dab1; }
.spot-number { font-size: 12px; font-weight: bold; color: #303133; }
.spot-status { font-size: 10px; color: #909399; margin-top: 2px; }
.spot-plate { font-size: 9px; color: #F56C6C; font-weight: bold; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>