<template>
  <div class="dashboard">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="welcome-text">
        <h2>欢迎回来，管理员</h2>
        <p>阳光小区停车库运行正常，今日已有 {{ stats.todayCars }} 辆车进出</p>
      </div>
      <div class="welcome-time">
        <el-icon size="28" color="#fff"><Clock /></el-icon>
        <span class="current-time">{{ currentTime }}</span>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6">
        <el-card shadow="never" class="stat-card" style="border-radius:12px;border:1px solid #ebeef5;">
          <div class="stat-card-inner">
            <div class="stat-icon" style="background:linear-gradient(135deg,#ecf5ff,#d9ecff)">
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
        <el-card shadow="never" class="stat-card" style="border-radius:12px;border:1px solid #ebeef5;">
          <div class="stat-card-inner">
            <div class="stat-icon" style="background:linear-gradient(135deg,#f0f9eb,#dbf0d0)">
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
        <el-card shadow="never" class="stat-card" style="border-radius:12px;border:1px solid #ebeef5;">
          <div class="stat-card-inner">
            <div class="stat-icon" style="background:linear-gradient(135deg,#fef0f0,#fcd5d5)">
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
        <el-card shadow="never" class="stat-card" style="border-radius:12px;border:1px solid #ebeef5;">
          <div class="stat-card-inner">
            <div class="stat-icon" style="background:linear-gradient(135deg,#fdf6ec,#fce8c8)">
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

    <!-- 占用率仪表盘 -->
    <el-row :gutter="20" class="mb-20">
      <el-col :span="12">
        <el-card shadow="never" style="border-radius:12px;border:1px solid #ebeef5;height:200px;">
          <template #header>
            <div class="card-header-inner">
              <el-icon size="18" color="#409EFF"><DataBoard /></el-icon>
              <span>车位占用率</span>
            </div>
          </template>
          <div style="display:flex;align-items:center;justify-content:center;height:110px;gap:40px;">
            <div ref="gaugeRef" style="width:130px;height:130px;"></div>
            <div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
                <span style="width:10px;height:10px;border-radius:50%;background:#F56C6C;display:inline-block;"></span>
                <span style="color:#606266;">已占用</span>
                <strong style="font-size:18px;color:#303133;">{{ stats.occupiedSpots }}</strong>
              </div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
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
        <!-- 快捷操作 -->
        <el-card shadow="never" class="quick-actions" style="border-radius:12px;border:1px solid #ebeef5;height:200px;">
          <template #header>
            <div class="card-header-inner">
              <el-icon size="18" color="#409EFF"><Opportunity /></el-icon>
              <span>快捷操作</span>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :span="6" v-for="action in quickActions" :key="action.path">
              <el-button :type="action.type" class="action-btn" @click="$router.push(action.path)">
                <el-icon :size="22"><component :is="action.icon" /></el-icon>
                <span>{{ action.label }}</span>
              </el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近入场车辆 + 今日概况 -->
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="never" style="border-radius:12px;border:1px solid #ebeef5;">
          <template #header>
            <div class="card-header-inner">
              <el-icon size="18" color="#409EFF"><List /></el-icon>
              <span>最近入场车辆</span>
            </div>
          </template>
          <el-table :data="recentVehicles" stripe style="width:100%">
            <el-table-column prop="plate" label="车牌号" width="150" />
            <el-table-column prop="entryTime" label="入场时间" />
            <el-table-column label="身份" width="100">
              <template #default="{ row }">
                <el-tag :type="row.isResident ? 'success' : 'warning'" size="small">
                  {{ row.isResident ? '住户' : '外来' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never" style="border-radius:12px;border:1px solid #ebeef5;">
          <template #header>
            <div class="card-header-inner">
              <el-icon size="18" color="#409EFF"><DataBoard /></el-icon>
              <span>今日概况</span>
            </div>
          </template>
          <div class="today-overview">
            <div class="overview-item">
              <span class="overview-label">进场车辆</span>
              <span class="overview-value">{{ stats.inCars }}</span>
            </div>
            <div class="overview-item">
              <span class="overview-label">出场车辆</span>
              <span class="overview-value">{{ stats.outCars }}</span>
            </div>
            <div class="overview-item">
              <span class="overview-label">当前停放</span>
              <span class="overview-value">{{ stats.occupiedSpots }}</span>
            </div>
            <div class="overview-item">
              <span class="overview-label">月卡住户</span>
              <span class="overview-value">{{ stats.residents }}</span>
            </div>
            <div class="overview-item">
              <span class="overview-label">空闲车位</span>
              <span class="overview-value" style="color:#67C23A">{{ stats.freeSpots }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { Van, CircleCheck, Remove, Money, Opportunity, List, DataBoard, Clock } from '@element-plus/icons-vue'
import { vehicleApi, feeApi, residentApi, parkingSpotApi } from '../api/index.js'

const route = useRoute()

const gaugeRef = ref(null)
let gaugeChart = null

const currentTime = ref('')

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', { hour12: false })
}

// ===== 从后端加载真实数据 =====
const stats = ref({
  totalSpots: 200, freeSpots: 200, occupiedSpots: 0,
  todayIncome: 0, todayCars: 0, inCars: 0, outCars: 0, residents: 0
})

const recentVehicles = ref([])

async function loadDashboardData() {
  try {
    // 并行请求：车位占用率、今日出入统计、当前停车车辆、收费标准统计、住户数量
    const [occRes, todayStatsRes, parkingRes, feeStatRes, residentRes] = await Promise.allSettled([
      parkingSpotApi.occupancyRate(),
      vehicleApi.todayStats(),
      vehicleApi.parking(),
      feeApi.statistics(),
      residentApi.list()
    ])

    // 车位总数/占用/空闲 —— 从 occupancyRate 接口获取（来自 ParkingSpot 表，与车位监控一致）
    if (occRes.status === 'fulfilled' && occRes.value?.data) {
      const data = occRes.value.data
      stats.value.totalSpots = data.total || stats.value.totalSpots
      stats.value.occupiedSpots = data.occupied || 0
      stats.value.freeSpots = data.free || 0
    }

    // 今日出入场统计（从 vehicle 表按 entryTime/exitTime 统计）
    if (todayStatsRes.status === 'fulfilled' && todayStatsRes.value?.data) {
      const data = todayStatsRes.value.data
      stats.value.inCars = parseInt(data.inCars || 0)
      stats.value.outCars = parseInt(data.outCars || 0)
      stats.value.todayCars = parseInt(data.todayCars || 0)
    }

    // 当前在场车辆列表 -> 最近入场车辆
    if (parkingRes.status === 'fulfilled' && parkingRes.value?.data) {
      const vehicles = parkingRes.value.data
      // 最近入场车辆（取最近5条）
      recentVehicles.value = vehicles.slice(-5).map(v => ({
        plate: v.plateNumber,
        entryTime: v.entryTime,
        isResident: v.isResident || false
      })).reverse()
    }

    // 收费标准统计（今日总收入）
    if (feeStatRes.status === 'fulfilled' && feeStatRes.value?.data != null) {
      const data = feeStatRes.value.data
      const totalRevenue = parseFloat(data.todayRevenue || 0) || 0
      stats.value.todayIncome = totalRevenue.toFixed(2)
    }

    // 住户列表 -> 住户数量
    if (residentRes.status === 'fulfilled' && residentRes.value?.data) {
      stats.value.residents = residentRes.value.data.length
    }

    // 渲染仪表盘
    await nextTick()
    renderGauge()
  } catch (e) {
    // 某些后端接口可能尚未实现，使用默认mock数据
    console.warn('Dashboard loads with partial data:', e.message)
  }
}

const occupancyRate = computed(() =>
  stats.value.totalSpots > 0
    ? ((stats.value.occupiedSpots / stats.value.totalSpots) * 100).toFixed(0)
    : '0'
)

const quickActions = [
  { label: '车辆入场', path: '/vehicle', icon: 'Van', type: 'primary' },
  { label: '住户管理', path: '/resident', icon: 'User', type: 'success' },
  { label: '费用结算', path: '/fee', icon: 'Money', type: 'warning' },
  { label: '车位监控', path: '/parking-spots', icon: 'Grid', type: 'info' }
]

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
  gaugeChart = echarts.init(gaugeRef.value)
  window.addEventListener('resize', handleResize)
})

// 每次回到首页时重新加载数据（在车辆管理页面操作入场/出场后返回时生效）
watch(() => route.path, (newPath) => {
  if (newPath === '/') {
    loadDashboardData()
  }
}, { immediate: true })

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  gaugeChart?.dispose()
})

function handleResize() { gaugeChart?.resize() }

function renderGauge() {
  const rate = occupancyRate.value
  const color = rate > 80 ? '#F56C6C' : rate > 50 ? '#E6A23C' : '#67C23A'
  gaugeChart?.setOption({
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
      style: { text: `${rate}%`, fontSize: 22, fontWeight: 'bold', fill: color, textAlign: 'center', textVerticalAlign: 'middle' }
    }]
  })
}
</script>

<style scoped>
.dashboard { max-width: 1400px; margin: 0 auto; }

.welcome-banner {
  background: linear-gradient(135deg, #409EFF 0%, #337ecc 100%);
  border-radius: 12px; padding: 28px 32px; margin-bottom: 24px;
  display: flex; justify-content: space-between; align-items: center;
}
.welcome-text h2 { color: #fff; font-size: 22px; margin-bottom: 6px; }
.welcome-text p { color: rgba(255,255,255,.85); font-size: 14px; }
.welcome-time { display: flex; align-items: center; gap: 10px; }
.current-time { color: #fff; font-size: 20px; font-weight: 600; }

.stat-cards { margin-bottom: 20px; }
.stat-card-inner { display: flex; align-items: center; gap: 15px; }
.stat-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.stat-value { font-size: 28px; font-weight: bold; color: #303133; }
.stat-label { font-size: 14px; color: #909399; margin-top: 4px; }

.quick-actions { margin-bottom: 20px; }
.card-header-inner { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; }

.action-btn {
  width: 100%; height: 80px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 6px; font-size: 14px; border-radius: 8px;
}

.today-overview { display: flex; flex-direction: column; gap: 12px; }
.overview-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #ebeef5; }
.overview-item:last-child { border-bottom: none; }
.overview-label { font-size: 14px; color: #606266; }
.overview-value { font-size: 16px; font-weight: bold; color: #303133; }
</style>