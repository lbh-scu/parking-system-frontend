<template>
  <div class="parking-spots">
    <el-card shadow="never" class="mb-4" style="border-radius:12px;border:1px solid #ebeef5;">
      <template #header>
        <div class="card-header">
          <el-icon size="20" color="#409EFF"><Grid /></el-icon>
          <span>车位监控</span>
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
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Grid, DataAnalysis } from '@element-plus/icons-vue'
import { parkingSpotApi } from '../api/index.js'
import HeatMap from '../components/spot/HeatMap.vue'
import AreaCompare from '../components/spot/AreaCompare.vue'

const statusMap = { FREE: '空闲', OCCUPIED: '已占', MAINTENANCE: '维护' }
const labelMap = { FREE: '空闲', OCCUPIED: '已占用', MAINTENANCE: '维护中' }

const stats = ref({ total: 0, free: 0, occupied: 0, maintenance: 0 })
const heatData = ref([])
const areaData = ref([])
const zones = ref([])

onMounted(async () => {
  try {
    // 并行请求所有接口
    const [spotRes, heatRes, areaRes, occRes] = await Promise.all([
      parkingSpotApi.list(),
      parkingSpotApi.heatmap(),
      parkingSpotApi.areaCompare(),
      parkingSpotApi.occupancyRate()
    ])

    // 1) 处理占用率统计
    const occ = occRes.data
    stats.value = {
      total: occ.total || 0,
      free: occ.free || 0,
      occupied: occ.occupied || 0,
      maintenance: occ.maintenance || 0
    }

    // 2) 处理热力图数据
    heatData.value = (heatRes.data || []).map(d => ({
      area: d.area + '区',
      floor: d.floor === 1 ? '一楼' : d.floor === 2 ? '二楼' : `第${d.floor}层`,
      total: d.total,
      occupied: d.occupied,
      rate: d.rate
    }))

    // 3) 处理区域对比数据
    areaData.value = (areaRes.data || []).map(d => ({
      area: d.area + '区',
      total: d.total,
      occupied: d.occupied,
      free: d.free
    }))

    // 4) 处理车位列表 → 按区域分组
    const allSpots = spotRes.data || []
    const areaMap = {}
    const areaColors = { A: '#409EFF', B: '#67C23A', C: '#E6A23C', D: '#F56C6C' }
    allSpots.forEach(spot => {
      const area = spot.area || 'A'
      areaMap[area] = areaMap[area] || { name: area, desc: '', color: areaColors[area] || '#909399', spots: [] }
      areaMap[area].spots.push({
        id: spot.id,
        label: spot.spotNumber,
        status: (spot.status || 'FREE').toUpperCase()
      })
    })
    // 给每个区域加描述
    Object.keys(areaMap).forEach(key => {
      const spots = areaMap[key].spots
      areaMap[key].desc = `${spots[0]?.label || ''} ~ ${spots[spots.length - 1]?.label || ''} 号车位`
    })
    zones.value = Object.values(areaMap)

  } catch (e) {
    ElMessage.error('获取车位数据失败: ' + e.message)
  }
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
</style>