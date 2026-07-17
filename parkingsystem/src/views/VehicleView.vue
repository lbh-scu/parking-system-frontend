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
          <el-form :model="entryForm" label-width="100px" style="max-width:520px">
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
        </el-tab-pane>
        <el-tab-pane label="在场车辆" name="parking">
          <VehicleQueryView :key="queryKey" @exit-success="onExitSuccess" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Van, Download } from '@element-plus/icons-vue'
import LicensePlateInput from '../components/vehicle/LicensePlateInput.vue'
import VehicleQueryView from './VehicleQueryView.vue'
import { vehicleApi } from '../api/index.js'

const activeTab = ref('entry')
const queryKey = ref(0)
const loading = ref(false)
const plateInputRef = ref(null)

const entryForm = ref({
  plate: '',
  spotNumber: ''
})

async function handleEntry() {
  if (!entryForm.value.plate) {
    ElMessage.warning('请输入车牌号')
    return
  }
  loading.value = true
  try {
    const spot = entryForm.value.spotNumber || ''
    const res = await vehicleApi.entry(entryForm.value.plate, spot)
    ElMessage.success(`车辆 ${res.data.plateNumber} 已入场，车位 ${res.data.spotNumber}`)
    resetForm()
    activeTab.value = 'parking'
    queryKey.value++
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
</script>

<style scoped>
.mb-4 { margin-bottom: 20px; }
</style>
