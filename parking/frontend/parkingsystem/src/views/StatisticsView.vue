<template>
  <div class="statistics">
    <el-card shadow="hover">
      <template #header>
        <div style="display:flex;align-items:center;gap:10px;">
          <el-icon size="20" color="#409EFF"><DataAnalysis /></el-icon>
          <span>数据统计</span>
        </div>
      </template>

      <!-- 统计概览 -->
      <el-row :gutter="20" class="mb-4">
        <el-col :span="8">
          <div class="stat-box" style="background:linear-gradient(135deg,#ecf5ff,#d9ecff)">
            <div class="stat-title">今日营收</div>
            <div class="stat-val">¥3,240</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-box" style="background:linear-gradient(135deg,#f0f9eb,#e1f3d8)">
            <div class="stat-title">本周营收</div>
            <div class="stat-val">¥22,680</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-box" style="background:linear-gradient(135deg,#fdf6ec,#faecd8)">
            <div class="stat-title">本月营收</div>
            <div class="stat-val">¥97,200</div>
          </div>
        </el-col>
      </el-row>

      <!-- 图表区域占位 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header><span>每小时车流量</span></template>
            <div ref="hourlyChart" style="height:300px"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header><span>每日营收趋势</span></template>
            <div ref="revenueChart" style="height:300px"></div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { DataAnalysis } from '@element-plus/icons-vue'

const hourlyChart = ref(null)
const revenueChart = ref(null)

onMounted(() => {
  // 小时车流量柱状图
  const hourly = echarts.init(hourlyChart.value)
  hourly.setOption({
    xAxis: { type: 'category', data: Array.from({length:24}, (_,i) => `${i}时`) },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar',
      data: [12,8,5,3,2,4,18,42,56,48,38,45,52,41,36,44,58,62,55,48,38,28,20,15],
      itemStyle: { color: '#409EFF' }
    }],
    grid: { left: 50, right: 20, top: 20, bottom: 30 }
  })

  // 每日营收折线图
  const revenue = echarts.init(revenueChart.value)
  revenue.setOption({
    xAxis: { type: 'category', data: ['周一','周二','周三','周四','周五','周六','周日'] },
    yAxis: { type: 'value' },
    series: [{
      type: 'line',
      data: [2800,3200,2950,3400,3800,4200,3600],
      smooth: true,
      lineStyle: { color: '#67C23A', width: 3 },
      areaStyle: { color: 'rgba(103,194,58,0.1)' }
    }],
    grid: { left: 50, right: 20, top: 20, bottom: 30 }
  })
})
</script>

<style scoped>
.statistics { max-width: 1400px; margin: 0 auto; }
.mb-4 { margin-bottom: 20px; }
.stat-box { padding: 24px; border-radius: 12px; text-align: center; }
.stat-title { font-size: 14px; color: #606266; margin-bottom: 8px; }
.stat-val { font-size: 36px; font-weight: bold; color: #303133; }
</style>