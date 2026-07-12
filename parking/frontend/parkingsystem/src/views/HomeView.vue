<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
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

    <!-- 快捷操作 -->
    <el-card shadow="hover" class="quick-actions">
      <template #header>
        <span>快捷操作</span>
      </template>
      <el-row :gutter="20">
        <el-col :span="6" v-for="action in quickActions" :key="action.path">
          <el-button :type="action.type" class="action-btn" @click="$router.push(action.path)">
            <el-icon :size="20"><component :is="action.icon" /></el-icon>
            <span>{{ action.label }}</span>
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 最近在场车辆 -->
    <el-card shadow="hover">
      <template #header>
        <span>最近入场车辆</span>
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
import { ref } from 'vue'
import { Van, CircleCheck, Remove, Money } from '@element-plus/icons-vue'

const stats = ref({
  totalSpots: 200,
  freeSpots: 120,
  occupiedSpots: 80,
  todayIncome: 3240
})

const quickActions = [
  { label: '车辆入场', path: '/vehicle', icon: 'Van', type: 'primary' },
  { label: '住户管理', path: '/resident', icon: 'User', type: 'success' },
  { label: '费用结算', path: '/fee', icon: 'Money', type: 'warning' },
  { label: '车位监控', path: '/parking-spots', icon: 'Grid', type: 'info' }
]

const recentVehicles = ref([
  { plate: '京A12345', entryTime: '2026-07-12 15:30:25', isResident: true },
  { plate: '京B67890', entryTime: '2026-07-12 15:25:18', isResident: false },
  { plate: '京C24680', entryTime: '2026-07-12 15:15:42', isResident: true },
  { plate: '京D13579', entryTime: '2026-07-12 14:20:33', isResident: false },
  { plate: '京E97531', entryTime: '2026-07-12 14:10:15', isResident: true }
])
</script>

<style scoped>
.dashboard { max-width: 1400px; margin: 0 auto; }
.stat-cards { margin-bottom: 20px; }
.stat-card-inner { display: flex; align-items: center; gap: 15px; }
.stat-icon {
  width: 56px; height: 56px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
}
.stat-value { font-size: 28px; font-weight: bold; color: #303133; }
.stat-label { font-size: 14px; color: #909399; margin-top: 4px; }
.quick-actions { margin-bottom: 20px; }
.action-btn {
  width: 100%; height: 80px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 6px; font-size: 14px; border-radius: 8px;
}
</style>