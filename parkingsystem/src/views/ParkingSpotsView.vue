<template>
  <div class="parking-spots">
    <el-row :gutter="20" class="mb-4">
      <el-col :span="6">
        <div class="spot-stat" style="background:#ecf5ff">
          <div class="spot-stat-value">{{ stats.total }}</div>
          <div class="spot-stat-label">总车位</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="spot-stat" style="background:#f0f9eb">
          <div class="spot-stat-value">{{ stats.free }}</div>
          <div class="spot-stat-label">空闲</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="spot-stat" style="background:#fef0f0">
          <div class="spot-stat-value">{{ stats.occupied }}</div>
          <div class="spot-stat-label">已占用</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="spot-stat" style="background:#fdf6ec">
          <div class="spot-stat-value">{{ occupancyRate }}%</div>
          <div class="spot-stat-label">占用率</div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mb-4">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div style="display:flex;align-items:center;gap:8px;">
              <el-icon color="#409EFF"><Grid /></el-icon><span>车位热力图</span>
            </div>
          </template>
          <HeatMap :data="heatData" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div style="display:flex;align-items:center;gap:8px;">
              <el-icon color="#67C23A"><DataAnalysis /></el-icon><span>区域占用对比</span>
            </div>
          </template>
          <AreaCompare :data="areaData" />
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover">
      <template #header>
        <div style="display:flex;align-items:center;gap:8px;">
          <el-icon color="#E6A23C"><Grid /></el-icon><span>车位分布</span>
        </div>
      </template>
      <div class="spot-grid">
        <div v-for="spot in spots" :key="spot.id" class="spot-item"
          :class="{ 'spot-free': spot.status === 'free', 'spot-occupied': spot.status === 'occupied', 'spot-maintenance': spot.status === 'maintenance' }"
          @click="handleSpotClick(spot)">
          <div class="spot-number">{{ spot.label }}</div>
          <div class="spot-status">{{ statusMap[spot.status] }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Grid, DataAnalysis } from '@element-plus/icons-vue'
import HeatMap from '../components/spot/HeatMap.vue'
import AreaCompare from '../components/spot/AreaCompare.vue'

const statusMap = { free: '空闲', occupied: '已占', maintenance: '维护' }
const stats = ref({ total: 200, free: 113, occupied: 85, maintenance: 2 })
const occupancyRate = computed(() => ((stats.value.occupied / stats.value.total) * 100).toFixed(0))

const heatData = ref([
  { area: 'A区', floor: 'B1', total: 50, occupied: 38, rate: 0.76 },
  { area: 'A区', floor: 'B2', total: 50, occupied: 19, rate: 0.38 },
  { area: 'B区', floor: 'B1', total: 30, occupied: 18, rate: 0.60 },
  { area: 'B区', floor: 'B2', total: 20, occupied: 5, rate: 0.25 },
  { area: 'C区', floor: 'B1', total: 30, occupied: 25, rate: 0.83 },
  { area: 'C区', floor: 'B2', total: 20, occupied: 13, rate: 0.65 }
])

const areaData = ref([
  { area: 'A区', total: 100, occupied: 57, free: 43 },
  { area: 'B区', total: 50, occupied: 23, free: 27 },
  { area: 'C区', total: 50, occupied: 38, free: 12 }
])

const spots = ref(
  Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    label: `${String(Math.floor(i / 20) + 1).padStart(2, '0')}-${String((i % 20) + 1).padStart(2, '0')}`,
    status: i < 85 ? 'occupied' : i >= 198 ? 'maintenance' : 'free'
  }))
)

function handleSpotClick(spot) {
  const tips = { free: '空闲中', occupied: '已占用', maintenance: '维护中' }
  ElMessage.info(`车位 ${spot.label} ${tips[spot.status] || ''}`)
}
</script>

<style scoped>
.parking-spots { max-width: 1400px; margin: 0 auto; }
.mb-4 { margin-bottom: 20px; }
.spot-stat { padding: 20px; border-radius: 8px; text-align: center; }
.spot-stat-value { font-size: 32px; font-weight: bold; color: #303133; }
.spot-stat-label { font-size: 14px; color: #606266; margin-top: 4px; }
.spot-grid { display: grid; grid-template-columns: repeat(10, 1fr); gap: 8px; }
.spot-item { padding: 10px 6px; border-radius: 6px; text-align: center; cursor: pointer; transition: all 0.2s; }
.spot-item:hover { transform: scale(1.05); }
.spot-free { background: #f0f9eb; border: 1px solid #b3e19d; }
.spot-occupied { background: #fef0f0; border: 1px solid #fbc4c4; }
.spot-maintenance { background: #fdf6ec; border: 1px solid #f5dab1; }
.spot-number { font-size: 12px; font-weight: bold; color: #303133; }
.spot-status { font-size: 10px; color: #909399; margin-top: 2px; }
</style>
