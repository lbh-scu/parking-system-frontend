<template>
  <div class="settings">
    <el-row :gutter="20">
      <!-- 系统配置 -->
      <el-col :span="12">
        <el-card shadow="hover" class="mb-4">
          <template #header>
            <div style="display:flex;align-items:center;gap:10px;">
              <el-icon size="20" color="#409EFF"><Setting /></el-icon>
              <span>系统参数配置</span>
            </div>
          </template>

          <el-form label-width="140px" v-if="configs.length > 0">
            <el-form-item v-for="cfg in configs" :key="cfg.configKey" :label="cfg.description">
              <el-input v-model="cfg.configValue" style="width:200px" />
              <el-button type="primary" size="small" style="margin-left:10px" @click="updateConfig(cfg)">
                保存
              </el-button>
            </el-form-item>
          </el-form>
          <el-skeleton :rows="4" animated v-else />
        </el-card>

        <!-- 健康检查 -->
        <el-card shadow="hover">
          <template #header>
            <div style="display:flex;align-items:center;gap:10px;">
              <el-icon size="20" color="#67C23A"><Monitor /></el-icon>
              <span>服务健康检查</span>
            </div>
          </template>

          <el-button type="primary" @click="checkHealth" :loading="healthLoading">
            检查服务状态
          </el-button>

          <div v-if="healthResult" style="margin-top:16px;">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="整体状态">
                <el-tag :type="healthResult.overall === 'UP' ? 'success' : 'danger'">
                  {{ healthResult.overall === 'UP' ? '正常' : '异常' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="检查时间">{{ healthResult.timestamp }}</el-descriptions-item>
              <el-descriptions-item label="数据库状态">
                <el-tag :type="healthResult.database?.status === 'UP' ? 'success' : 'danger'" size="small">
                  {{ healthResult.database?.status === 'UP' ? '连接正常' : '连接异常' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="数据库类型" v-if="healthResult.database?.database">
                {{ healthResult.database.database }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </el-col>

      <!-- 系统工具 -->
      <el-col :span="12">
        <el-card shadow="hover" class="mb-4">
          <template #header>
            <div style="display:flex;align-items:center;gap:10px;">
              <el-icon size="20" color="#E6A23C"><Tickets /></el-icon>
              <span>系统日志</span>
            </div>
          </template>

          <div style="margin-bottom:12px;">
            <el-button type="primary" size="small" @click="loadLogs" :loading="logLoading">
              刷新日志
            </el-button>
            <span style="margin-left:8px;font-size:12px;color:#909399;">显示最近 100 行</span>
          </div>

          <el-input
            type="textarea"
            :rows="12"
            readonly
            :value="logContent"
            placeholder="点击「刷新日志」查看系统日志"
          />
        </el-card>

        <el-card shadow="hover">
          <template #header>
            <div style="display:flex;align-items:center;gap:10px;">
              <el-icon size="20" color="#F56C6C"><Folder /></el-icon>
              <span>数据备份与恢复</span>
            </div>
          </template>

          <el-alert
            title="定期备份数据可以有效防止数据丢失"
            type="info"
            :closable="false"
            show-icon
            style="margin-bottom:16px;"
          />

          <el-button type="warning" @click="backupData">
            <el-icon><Download /></el-icon> 一键备份数据
          </el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Setting, Monitor, Tickets, Folder, Download } from '@element-plus/icons-vue'
import { systemApi } from '@/api/index.js'
import { ElMessage } from 'element-plus'

const configs = ref([])
const healthResult = ref(null)
const healthLoading = ref(false)
const logContent = ref('')
const logLoading = ref(false)

async function loadConfigs() {
  try {
    const res = await systemApi.config()
    if (res.code === 200 && res.data) {
      configs.value = res.data
    }
  } catch (e) {
    ElMessage.error('加载配置失败: ' + e.message)
  }
}

async function updateConfig(cfg) {
  try {
    const res = await systemApi.updateConfig(cfg.configKey, cfg.configValue)
    if (res.code === 200) {
      ElMessage.success(`配置 ${cfg.description} 更新成功`)
    }
  } catch (e) {
    ElMessage.error('更新配置失败: ' + e.message)
  }
}

async function checkHealth() {
  healthLoading.value = true
  try {
    const res = await systemApi.health()
    if (res.code === 200 && res.data) {
      healthResult.value = res.data
    }
  } catch (e) {
    ElMessage.error('健康检查失败: ' + e.message)
  } finally {
    healthLoading.value = false
  }
}

async function loadLogs() {
  logLoading.value = true
  try {
    const res = await systemApi.logs(100)
    if (res.code === 200 && res.data) {
      logContent.value = res.data.join('\n')
    }
  } catch (e) {
    ElMessage.error('读取日志失败: ' + e.message)
  } finally {
    logLoading.value = false
  }
}

function backupData() {
  systemApi.backup()
}

onMounted(() => {
  loadConfigs()
})
</script>

<style scoped>
.settings { max-width: 1400px; margin: 0 auto; }
.mb-4 { margin-bottom: 20px; }
</style>