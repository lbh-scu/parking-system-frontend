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
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Grid, DataAnalysis } from '@element-plus/icons-vue'
import HeatMap from '../components/spot/HeatMap.vue'
import AreaCompare from '../components/spot/AreaCompare.vue'

const statusMap = { free: '空闲', occupied: '已占', maintenance: '维护' }

const stats = ref({ total: 210, free: 123, occupied: 85, maintenance: 2 })

const heatData = ref([
  { area: 'A区', floor: '地面', total: 70, occupied: 30, rate: 0.43 },
  { area: 'B区', floor: '地面', total: 70, occupied: 25, rate: 0.36 },
  { area: 'C区', floor: '地面', total: 70, occupied: 30, rate: 0.43 }
])

const areaData = ref([
  { area: 'A区', total: 70, occupied: 30, free: 40 },
  { area: 'B区', total: 70, occupied: 25, free: 45 },
  { area: 'C区', total: 70, occupied: 30, free: 40 }
])

function makeSpots(zone, prefix, count, occupiedEnd) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${zone}-${i + 1}`,
    label: `${prefix}${String(i + 1).padStart(2, '0')}`,
    status: i < occupiedEnd ? 'occupied' : i === count - 2 ? 'maintenance' : 'free'
  }))
}

const zones = ref([
  { name: 'A', desc: '1-70 号车位', color: '#409EFF', spots: makeSpots('A', 'A', 70, 30) },
  { name: 'B', desc: '71-140 号车位', color: '#67C23A', spots: makeSpots('B', 'B', 70, 25) },
  { name: 'C', desc: '141-210 号车位', color: '#E6A23C', spots: makeSpots('C', 'C', 70, 30) }
])

const handleSpotClick = (spot) => {
  const msg = spot.status === 'free' ? '空闲中' : spot.status === 'occupied' ? '已占用' : '维护中'
  ElMessage.info(`${spot.label} 号车位 ${msg}`)
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