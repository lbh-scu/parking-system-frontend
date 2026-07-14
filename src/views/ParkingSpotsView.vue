<template>
  <div class="parking-spots">
    <el-card shadow="hover" class="mb-4">
      <template #header>
        <div style="display:flex;align-items:center;gap:10px;">
          <el-icon size="20" color="#409EFF"><Grid /></el-icon>
          <span>车位监控</span>
        </div>
      </template>

      <!-- 车位统计 -->
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
            <div class="spot-stat-value">{{ stats.maintenance }}</div>
            <div class="spot-stat-label">维护中</div>
          </div>
        </el-col>
      </el-row>

      <!-- 车位网格 -->
      <div class="spot-grid">
        <div
          v-for="spot in spots"
          :key="spot.id"
          class="spot-item"
          :class="{
            'spot-free': spot.status === 'free',
            'spot-occupied': spot.status === 'occupied',
            'spot-maintenance': spot.status === 'maintenance'
          }"
          @click="handleSpotClick(spot)"
        >
          <div class="spot-number">{{ spot.label }}</div>
          <div class="spot-status">
            {{ statusMap[spot.status] }}
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Grid } from '@element-plus/icons-vue'

const statusMap = { free: '空闲', occupied: '已占', maintenance: '维护' }

const stats = ref({ total: 200, free: 118, occupied: 80, maintenance: 2 })

const spots = ref(
  Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
      label: `${String(Math.floor(i / 20) + 1).padStart(2, '0')}-${String((i % 20) + 1).padStart(2, '0')}`,
    status: i < 80 ? 'occupied' : i >= 198 ? 'maintenance' : 'free'
  }))
)

const handleSpotClick = (spot) => {
  if (spot.status === 'free') {
    ElMessage.info(`车位 ${spot.label} 空闲中`)
  } else if (spot.status === 'occupied') {
    ElMessage.info(`车位 ${spot.label} 已占用`)
  } else {
    ElMessage.warning(`车位 ${spot.label} 维护中`)
  }
}
</script>

<style scoped>
.parking-spots { max-width: 1400px; margin: 0 auto; }
.mb-4 { margin-bottom: 20px; }
.spot-stat { padding: 20px; border-radius: 8px; text-align: center; }
.spot-stat-value { font-size: 32px; font-weight: bold; color: #303133; }
.spot-stat-label { font-size: 14px; color: #606266; margin-top: 4px; }
.spot-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 8px;
}
.spot-item {
  padding: 10px 6px;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}
.spot-item:hover { transform: scale(1.05); }
.spot-free { background: #f0f9eb; border: 1px solid #b3e19d; }
.spot-occupied { background: #fef0f0; border: 1px solid #fbc4c4; }
.spot-maintenance { background: #fdf6ec; border: 1px solid #f5dab1; }
.spot-number { font-size: 12px; font-weight: bold; color: #303133; }
.spot-status { font-size: 10px; color: #909399; margin-top: 2px; }
</style>