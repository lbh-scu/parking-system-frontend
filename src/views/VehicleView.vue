<template>
  <div style="padding: 0;">
    <!-- 车辆入场/查询切换 -->
<el-card shadow="hover" class="mb-4">
  <template #header>
    <div style="display:flex;align-items:center;gap:10px;justify-content:space-between;">
      <div style="display:flex;align-items:center;gap:10px;">
        <el-icon size="20" color="#409EFF"><Van /></el-icon>
        <span>车辆管理</span>
      </div>
      <el-button type="success" size="small" @click="handleExport" style="display:flex;align-items:center;gap:4px;">
        <span>📥</span> 导出 Excel
      </el-button>
    </div>
  </template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="车辆入场" name="entry">
          <el-form :model="entryForm" label-width="100px" style="max-width:500px">
            <el-form-item label="车牌号">
              <LicensePlateInput v-model="entryForm.plate" ref="plateInputRef" :immediate-validate="false" />
            </el-form-item>
            <el-form-item label="身份">
              <el-radio-group v-model="entryForm.isResident">
                <el-radio :value="true">住户</el-radio>
                <el-radio :value="false">外来</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="住户姓名" v-if="entryForm.isResident">
              <el-input v-model="entryForm.residentName" placeholder="输入住户姓名" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleEntry">确认入场</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="在场车辆" name="query">
          <VehicleQueryView />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Van } from '@element-plus/icons-vue'
import VehicleQueryView from './VehicleQueryView.vue'
import LicensePlateInput from '../components/vehicle/LicensePlateInput.vue'

const activeTab = ref('entry')

const entryForm = ref({
  plate: '',
  isResident: false,
  residentName: ''
})

const handleExport = () => {
  window.location.href = '/api/vehicles/export'
}

const handleEntry = () => {
  if (!entryForm.value.plate) {
    ElMessage.warning('请输入车牌号')
    return
  }
  ElMessage.success(`车辆 ${entryForm.value.plate} 已入场`)
  entryForm.value.plate = ''
}
</script>