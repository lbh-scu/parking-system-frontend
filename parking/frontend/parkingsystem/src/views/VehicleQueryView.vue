<template>
  <div>
    <el-tabs v-model="activeSubTab" @tab-change="onTabChange">
      <el-tab-pane label="在场车辆" name="parking">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <span style="font-size:14px;color:#606266;">
            共 <strong style="color:#409EFF;">{{ parkingData.length }}</strong> 辆在场
          </span>
          <div style="display:flex;gap:8px;">
            <el-button size="small" :loading="loadingParking" @click="loadParking">
              <el-icon><Refresh /></el-icon> 刷新
            </el-button>
            <el-button size="small" type="success" @click="handleExport">
              <el-icon><Download /></el-icon> 导出Excel
            </el-button>
          </div>
        </div>
        <el-table v-loading="loadingParking" :data="parkingData" stripe style="width:100%">
          <el-table-column prop="plateNumber" label="车牌号" width="140" />
          <el-table-column prop="spotNumber" label="车位" width="100" />
          <el-table-column prop="entryTime" label="入场时间" />
          <el-table-column label="身份" width="90">
            <template #default="{ row }">
              <el-tag :type="row.isResident ? 'success' : 'warning'" size="small">
                {{ row.isResident ? '住户' : '外来' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button type="warning" size="small" @click="handleExit(row)" :loading="exitingId === row.id">出场结算</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-empty v-if="!loadingParking && parkingData.length === 0" description="暂无在场车辆" />
      </el-tab-pane>
      <el-tab-pane label="历史记录" name="history">
        <div style="display:flex;gap:12px;margin-bottom:16px;">
          <el-input v-model="historyKeyword" placeholder="按车牌号筛选" clearable style="width:260px" @keyup.enter="loadHistory" @clear="loadHistory">
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
          <el-button type="primary" @click="loadHistory" :loading="loadingHistory">查询</el-button>
          <el-button type="success" @click="handleExport" style="margin-left:auto;">
            <el-icon><Download /></el-icon> 导出Excel
          </el-button>
        </div>
        <el-table v-loading="loadingHistory" :data="historyData" stripe style="width:100%">
          <el-table-column prop="plateNumber" label="车牌号" width="140" />
          <el-table-column prop="spotNumber" label="车位" width="100" />
          <el-table-column prop="entryTime" label="入场时间" />
          <el-table-column prop="exitTime" label="出场时间">
            <template #default="{ row }">{{ row.exitTime || '—' }}</template>
          </el-table-column>
          <el-table-column label="状态" width="90">
            <template #default="{ row }">
              <el-tag :type="row.status === 'EXITED' ? 'info' : 'success'" size="small">
                {{ row.status === 'EXITED' ? '已出场' : '在场' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
        <el-empty v-if="!loadingHistory && historyData.length === 0" description="暂无历史记录" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Search, Download } from '@element-plus/icons-vue'
import { vehicleApi } from '../api/index.js'

const emit = defineEmits(['exit-success'])
const activeSubTab = ref('parking')
const parkingData = ref([])
const loadingParking = ref(false)
const exitingId = ref(null)
const historyData = ref([])
const loadingHistory = ref(false)
const historyKeyword = ref('')

onMounted(() => { loadParking() })

async function loadParking() {
  loadingParking.value = true
  try {
    const res = await vehicleApi.parking()
    parkingData.value = res.data || []
  } catch (e) {
    ElMessage.error('获取在场车辆失败：' + e.message)
    parkingData.value = []
  } finally {
    loadingParking.value = false
  }
}

async function handleExit(row) {
  try {
    await ElMessageBox.confirm(`确定出场车辆 ${row.plateNumber}？`, '出场确认', {
      confirmButtonText: '确定出场', cancelButtonText: '取消', type: 'warning'
    })
  } catch { return }
  exitingId.value = row.id
  try {
    const res = await vehicleApi.exit(row.plateNumber)
    ElMessage.success(`车辆 ${res.data.plateNumber} 出场成功`)
    parkingData.value = parkingData.value.filter(v => v.id !== row.id)
    emit('exit-success')
  } catch (e) {
    ElMessage.error(e.message || '出场失败')
  } finally {
    exitingId.value = null
  }
}

async function loadHistory() {
  loadingHistory.value = true
  try {
    const kw = historyKeyword.value || ''
    const res = await vehicleApi.history(kw)
    historyData.value = res.data || []
  } catch (e) {
    ElMessage.error('获取历史记录失败：' + e.message)
    historyData.value = []
  } finally {
    loadingHistory.value = false
  }
}

function onTabChange(name) {
  if (name === 'parking') loadParking()
  if (name === 'history') loadHistory()
}

function handleExport() {
  window.location.href = '/api/vehicles/export'
}
</script>
