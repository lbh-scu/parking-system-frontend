<template>
  <div style="padding: 0;">
    <el-card shadow="hover" class="mb-4">
      <template #header>
        <div style="display:flex;align-items:center;gap:10px;">
          <el-icon size="20" color="#409EFF"><Van /></el-icon>
          <span>车辆管理</span>
          <el-button type="success" size="small" @click="handleExport" style="margin-left:auto">
            <el-icon><Download /></el-icon> 导出Excel
          </el-button>
        </div>
      </template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="车辆入场" name="entry">
          <div style="display:flex;gap:40px;flex-wrap:wrap;">
            <el-form :model="entryForm" label-width="100px" style="max-width:520px;flex:1;">
              <el-form-item label="车牌号">
                <LicensePlateInput
                  v-model="entryForm.plate"
                  ref="plateInputRef"
                  :immediate-validate="false"
                />
              </el-form-item>
              <el-form-item label="车位号">
                <el-input v-model="entryForm.spotNumber" placeholder="如 A001（留空自动分配）" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleEntry" :loading="loading">确认入场</el-button>
                <el-button @click="resetForm">重置</el-button>
              </el-form-item>
            </el-form>
            <div ref="speedGaugeRef" style="width:280px;height:260px;"></div>
            <div ref="tempGaugeRef" style="width:360px;height:320px;"></div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="在场车辆" name="parking">
          <VehicleQueryView :key="queryKey" @exit-success="onExitSuccess" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { Van, Download } from '@element-plus/icons-vue'
import LicensePlateInput from '../components/vehicle/LicensePlateInput.vue'
import VehicleQueryView from './VehicleQueryView.vue'
import { vehicleApi } from '../api/index.js'

const activeTab = ref('entry')
const queryKey = ref(0)
const loading = ref(false)
const plateInputRef = ref(null)
const speedGaugeRef = ref(null)
const tempGaugeRef = ref(null)
let speedGauge = null
let tempGauge = null
let speedTimer = null

const entryForm = ref({
  plate: '',
  spotNumber: ''
})

// ===== 入场 =====
async function handleEntry() {
  if (!entryForm.value.plate) {
    ElMessage.warning('请输入车牌号')
    return
  }
  const plateError = plateInputRef.value?.validate?.()
  if (plateError) {
    ElMessage.warning(plateError)
    return
  }
  loading.value = true
  try {
    const spot = entryForm.value.spotNumber || ''
    const res = await vehicleApi.entry(entryForm.value.plate, spot)
    // res = { code, data, message }
    if (res && res.data) {
      const spotNum = res.data.spotNumber
      ElMessage.success(`车辆 ${res.data.plateNumber} 已入场，车位 ${spotNum}`)
      resetForm()
      activeTab.value = 'parking'
      queryKey.value++
    } else {
      ElMessage.error(res?.message || '入场失败')
    }
  } catch (e) {
    ElMessage.error(e.message || '入场失败')
  } finally {
    loading.value = false
  }
}

function resetForm() {
  entryForm.value = { plate: '', spotNumber: '' }
  plateInputRef.value?.reset()
}

function onExitSuccess() {
  nextTick(() => queryKey.value++)
}

function handleExport() {
  window.open('http://localhost:8080/api/vehicles/export', '_blank')
}

// ===== 仪表盘 =====
function initSpeedGauge() {
  if (!speedGaugeRef.value) return
  speedGauge = echarts.init(speedGaugeRef.value)
  speedGauge.setOption({
    series: [{
      type: 'gauge',
      min: 0, max: 200, splitNumber: 5,
      axisLine: {
        lineStyle: {
          color: [[0.1, '#67C23A'], [0.2, '#409EFF'], [0.5, '#E6A23C'], [0.75, '#F56C6C'], [1, '#C03639']]
        }
      },
      detail: { formatter: '{value} km/h', fontSize: 14 },
      title: { offsetCenter: [0, '80%'], fontSize: 12 },
      data: [{ value: 20, name: '⚠ 限速 20' }]
    }]
  })
}

function initTempGauge() {
  if (!tempGaugeRef.value) return
  tempGauge = echarts.init(tempGaugeRef.value)
  tempGauge.setOption({
    series: [{
      type: 'gauge',
      center: ['50%', '60%'], startAngle: 200, endAngle: -20, min: 0, max: 60, splitNumber: 12,
      progress: { show: true, width: 30 },
      pointer: { show: false },
      axisLine: { lineStyle: { width: 30 } },
      detail: { valueAnimation: true, offsetCenter: [0, '-15%'], fontSize: 40, fontWeight: 'bolder', formatter: '{value} °C' },
      data: [{ value: 20 }]
    }]
  })
}

function updateSpeed() {
  if (!speedGauge) return
  const speed = Math.floor(Math.random() * 21)
  speedGauge.setOption({ series: [{ data: [{ value: speed }] }] })
}

onMounted(() => {
  initSpeedGauge()
  initTempGauge()
  speedTimer = setInterval(updateSpeed, 2000)
})

onBeforeUnmount(() => {
  if (speedTimer) clearInterval(speedTimer)
  if (speedGauge) speedGauge.dispose()
  if (tempGauge) tempGauge.dispose()
})
</script>

<style scoped>
.mb-4 { margin-bottom: 20px; }
</style>