<template>
  <div class="dashboard">
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-card-inner">
            <div class="stat-icon" style="background:#ecf5ff">
              <el-icon size="28" color="#409EFF"><Van /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalSpots }}</div>
              <div class="stat-label">总车位数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-card-inner">
            <div class="stat-icon" style="background:#f0f9eb">
              <el-icon size="28" color="#67C23A"><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.freeSpots }}</div>
              <div class="stat-label">空闲车位</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-card-inner">
            <div class="stat-icon" style="background:#fef0f0">
              <el-icon size="28" color="#F56C6C"><Remove /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.occupiedSpots }}</div>
              <div class="stat-label">已占用</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-card-inner">
            <div class="stat-icon" style="background:#fdf6ec">
              <el-icon size="28" color="#E6A23C"><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ stats.todayIncome }}</div>
              <div class="stat-label">今日收入</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mb-20">
      <el-col :span="12">
        <el-card shadow="hover" style="height:220px;">
          <template #header><span>车位占用率</span></template>
          <div style="display:flex;align-items:center;justify-content:center;height:130px;gap:40px;">
            <div ref="gaugeRef" style="width:140px;height:140px;"></div>
            <div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
                <span style="width:10px;height:10px;border-radius:50%;background:#F56C6C;display:inline-block;"></span>
                <span style="color:#606266;">已占用</span>
                <strong style="font-size:18px;color:#303133;">{{ stats.occupiedSpots }}</strong>
              </div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
                <span style="width:10px;height:10px;border-radius:50%;background:#67C23A;display:inline-block;"></span>
                <span style="color:#606266;">空闲</span>
                <strong style="font-size:18px;color:#303133;">{{ stats.freeSpots }}</strong>
              </div>
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="width:10px;height:10px;border-radius:50%;background:#E6A23C;display:inline-block;"></span>
                <span style="color:#606266;">占用率</span>
                <strong style="font-size:18px;color:#E6A23C;">{{ occupancyRate }}%</strong>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" style="height:220px;">
          <template #header><span>快捷操作</span></template>
          <el-row :gutter="15">
            <el-col :span="6" v-for="action in quickActions" :key="action.path">
              <el-button :type="action.type" class="action-btn" @click="$router.push(action.path)">
                <el-icon :size="20"><component :is="action.icon" /></el-icon><span>{{ action.label }}</span>
              </el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover">
      <template #header><span>最近入场车辆</span></template>
      <el-table :data="recentVehicles" stripe style="width:100%">
        <el-table-column prop="plate" label="车牌号" width="150" />
        <el-table-column prop="entryTime" label="入场时间" />
        <el-table-column label="身份" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isResident ? 'success' : 'warning'" size="small">{{ row.isResident ? '住户' : '外来' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="$router.push('/vehicle')">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Van, CircleCheck, Remove, Money } from '@element-plus/icons-vue'

const gaugeRef = ref(null)
let gaugeChart = null

const stats = ref({ totalSpots: 200, freeSpots: 115, occupiedSpots: 85, todayIncome: 3240 })
const occupancyRate = computed(() => ((stats.value.occupiedSpots / stats.value.totalSpots) * 100).toFixed(0))

const quickActions = [
  { label: '车辆入场', path: '/vehicle', icon: 'Van', type: 'primary' },
  { label: '住户管理', path: '/resident', icon: 'User', type: 'success' },
  { label: '费用结算', path: '/fee', icon: 'Money', type: 'warning' },
  { label: '车位监控', path: '/parking-spots', icon: 'Grid', type: 'info' }
]

const recentVehicles = ref([
  { plate: '京A12345', entryTime: '2026-07-14 13:47:27', isResident: false },
  { plate: '京B66666', entryTime: '2026-07-14 13:48:02', isResident: false },
  { plate: '京C24680', entryTime: '2026-07-14 15:15:42', isResident: true },
  { plate: '京D13579', entryTime: '2026-07-14 14:20:33', isResident: false },
  { plate: '京E97531', entryTime: '2026-07-14 14:10:15', isResident: true }
])

onMounted(() => {
  gaugeChart = echarts.init(gaugeRef.value)
  renderGauge()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  gaugeChart?.dispose()
})

function handleResize() { gaugeChart?.resize() }

function renderGauge() {
  const rate = occupancyRate.value
  const color = rate > 80 ? '#F56C6C' : rate > 50 ? '#E6A23C' : '#67C23A'
  gaugeChart.setOption({
    series: [{
      type: 'pie', radius: ['65%', '85%'], avoidLabelOverlap: false, silent: true,
      label: { show: false }, emphasis: { scale: false },
      data: [
        { value: stats.value.occupiedSpots, itemStyle: { color } },
        { value: stats.value.freeSpots, itemStyle: { color: '#ebeef5' } }
      ]
    }],
    graphic: [{
      type: 'text', left: 'center', top: 'center',
      style: { text: `${rate}%`, fontSize: 24, fontWeight: 'bold', fill: color, textAlign: 'center', textVerticalAlign: 'middle' }
    }]
  })
}
</script>

<style scoped>
.dashboard { max-width: 1400px; margin: 0 auto; }
.stat-cards { margin-bottom: 20px; }
.mb-20 { margin-bottom: 20px; }
.stat-card-inner { display: flex; align-items: center; gap: 15px; }
.stat-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.stat-value { font-size: 28px; font-weight: bold; color: #303133; }
.stat-label { font-size: 14px; color: #909399; margin-top: 4px; }
.action-btn { width: 100%; height: 80px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; font-size: 14px; border-radius: 8px; }
</style>
