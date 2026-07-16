<template>
  <div class="resident-page">
    <div class="page-title">
      <h1>阳光小区停车库</h1>
      <p>住户信息概览</p>
    </div>

    <div class="content-grid">
      <el-card class="list-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon size="20" color="#409EFF"><UserFilled /></el-icon>
            <span>住户信息列表</span>
            <el-tag type="info" effect="plain" class="count-tag">共 {{ residents.length }} 人</el-tag>
            <el-button type="success" size="small" @click="handleExport" style="margin-left:8px">
              <el-icon><Download /></el-icon> 导出Excel
            </el-button>
          </div>
        </template>

        <el-table :data="residents" style="width: 100%" stripe>
          <el-table-column prop="id" label="住户ID" width="120" align="center" />
          <el-table-column prop="name" label="住户姓名" />
          <el-table-column prop="plate" label="车牌号" />
        </el-table>

        <el-empty v-if="!residents.length" description="暂无住户数据，请在右侧添加" />
      </el-card>

      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon size="20" color="#67C23A"><Edit /></el-icon>
            <span>录入住户信息</span>
          </div>
        </template>

        <el-form :model="form" label-width="80px">
          <el-form-item label="住户姓名">
            <el-input v-model="form.name" placeholder="请输入住户姓名" prefix-icon="User" />
          </el-form-item>

          <el-form-item label="车牌号">
            <el-input v-model="form.plate" placeholder="如：京A12345" prefix-icon="Aim" />
          </el-form-item>

          <el-form-item label=" ">
            <el-button type="primary" size="large" @click="handleAdd" :disabled="!form.name || !form.plate" style="width:100%">
              <el-icon><Plus /></el-icon> 添加住户
            </el-button>
          </el-form-item>
        </el-form>

        <div class="form-tip">
          <el-icon color="#909399"><InfoFilled /></el-icon>
          <span>住户ID将自动生成</span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { UserFilled, Edit, Plus, InfoFilled, Aim, Download } from '@element-plus/icons-vue'
import axios from 'axios'

const API_BASE = 'http://localhost:8080/api'

const residents = ref([])
const form = reactive({ name: '', plate: '' })

// 从后端加载住户列表
async function loadResidents() {
  try {
    const res = await axios.get(`${API_BASE}/residents`)
    if (res.data?.code === 200) {
      residents.value = res.data.data
    }
  } catch (e) {
    console.error('加载住户列表失败', e)
  }
}

onMounted(loadResidents)

function handleAdd() {
  if (!form.name || !form.plate) return
  residents.value.push({
    id: 'R' + String(residents.value.length + 1).padStart(4, '0'),
    name: form.name,
    plate: form.plate.toUpperCase()
  })
  form.name = ''
  form.plate = ''
}

// 导出 Excel
function handleExport() {
  window.open(`${API_BASE}/residents/export`, '_blank')
}
</script>

<style scoped>
.resident-page { height: 100%; }

.page-title { margin-bottom: 24px; }
.page-title h1 {
  font-size: 24px; color: #303133;
  padding-left: 12px;
  border-left: 4px solid #409EFF;
  letter-spacing: 2px;
  margin-bottom: 6px;
}
.page-title p { font-size: 13px; color: #909399; margin-left: 16px; }

.content-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 20px;
  align-items: start;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
}
.count-tag { margin-left: auto; }

.list-card {
  border-radius: 12px;
  border: 1px solid #ebeef5;
}
.list-card :deep(.el-card__body) { padding: 0; }

.form-card {
  border-radius: 12px;
  border: 1px solid #ebeef5;
}
.form-card :deep(.el-form-item) { margin-bottom: 20px; }
.form-card :deep(.el-card__body) { padding: 24px; }

.form-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #909399;
  margin-top: 12px;
  justify-content: center;
}
</style>