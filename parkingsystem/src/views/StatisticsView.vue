<template>
  <div class="statistics">
    <el-card shadow="hover">
      <template #header>
        <div style="display:flex;align-items:center;gap:10px;">
          <el-icon size="20" color="#409EFF"><DataAnalysis /></el-icon>
          <span>数据统计与AI预测</span>
        </div>
      </template>

      <!-- 统计概览 -->
      <el-row :gutter="20" class="mb-4">
        <el-col :span="6">
          <div class="stat-box" style="background:linear-gradient(135deg,#ecf5ff,#d9ecff)">
            <div class="stat-title">今日营收</div>
            <div class="stat-val">¥{{ summary.todayIncome }}</div>
            <div class="stat-sub">今日 {{ summary.todayCount }} 笔</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-box" style="background:linear-gradient(135deg,#f0f9eb,#e1f3d8)">
            <div class="stat-title">本周营收</div>
            <div class="stat-val">¥{{ summary.weekIncome }}</div>
            <div class="stat-sub">本周 {{ summary.weekCount }} 笔</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-box" style="background:linear-gradient(135deg,#fdf6ec,#faecd8)">
            <div class="stat-title">本月营收</div>
            <div class="stat-val">¥{{ summary.monthIncome }}</div>
            <div class="stat-sub">本月 {{ summary.monthCount }} 笔</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-box" style="background:linear-gradient(135deg,#fef0f0,#fde2e2)">
            <div class="stat-title">累计营收</div>
            <div class="stat-val">¥{{ summary.totalIncome }}</div>
            <div class="stat-sub">历史累计</div>
          </div>
        </el-col>
      </el-row>

      <!-- 图表区域 -->
      <el-row :gutter="20" class="mb-4">
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <span>每小时车流量（高峰时段）</span>
            </template>
            <div ref="hourlyChart" style="height:300px"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header><span>最近7天占用率趋势</span></template>
            <div ref="trendChart" style="height:300px"></div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="mb-4">
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span>AI占用率预测（未来12小时）</span>
                <el-tag :type="modelReady ? 'success' : 'warning'" size="small">
                  {{ modelReady ? '模型已就绪' : '数据不足' }}
                </el-tag>
              </div>
            </template>
            <div ref="predictionChart" style="height:300px"></div>
            <div v-if="modelReady" style="text-align:center;margin-top:8px;font-size:12px;color:#909399;">
              MSE: {{ mse.toFixed(6) }} &nbsp;|&nbsp; 训练样本: {{ trainingSize }} 条
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span>每日收费趋势</span>
                <el-radio-group v-model="revenuePeriod" size="small" @change="loadRevenueTrend">
                  <el-radio-button value="day">日</el-radio-button>
                  <el-radio-button value="week">周</el-radio-button>
                  <el-radio-button value="month">月</el-radio-button>
                </el-radio-group>
              </div>
            </template>
            <div ref="revenueChart" style="height:300px"></div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 导出按钮 -->
      <div style="text-align:right;margin-top:12px;">
        <el-button type="primary" @click="exportReport">
          <el-icon><Download /></el-icon> 导出统计报表
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { DataAnalysis, Download } from '@element-plus/icons-vue'
import { statisticsApi } from '@/api/index.js'

const hourlyChart = ref(null)
const trendChart = ref(null)
const predictionChart = ref(null)
const revenueChart = ref(null)

const summary = ref({
  todayIncome: '0.00',
  todayCount: 0,
  weekIncome: '0.00',
  weekCount: 0,
  monthIncome: '0.00',
  monthCount: 0,
  totalIncome: '0.00'
})

const modelReady = ref(false)
const mse = ref(0)
const trainingSize = ref(0)
const revenuePeriod = ref('day')

async function loadSummary() {
  try {
    const res = await statisticsApi.summary()
    if (res.code === 200 && res.data) {
      summary.value = res.data
    }
  } catch (e) {
    console.error('加载营收概览失败:', e)
  }
}

async function loadPeakHours() {
  try {
    const res = await statisticsApi.peakHours()
    if (res.code === 200 && res.data) {
      await nextTick()
      const chart = echarts.init(hourlyChart.value)
      chart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['入场', '出场'] },
        xAxis: { type: 'category', data: res.data.map(d => `${d.hour}时`) },
        yAxis: { type: 'value' },
        series: [
          {
            name: '入场',
            type: 'bar',
            data: res.data.map(d => d.entryCount),
            itemStyle: { color: '#409EFF' }
          },
          {
            name: '出场',
            type: 'bar',
            data: res.data.map(d => d.exitCount),
            itemStyle: { color: '#67C23A' }
          }
        ],
        grid: { left: 50, right: 20, top: 40, bottom: 30 }
      })
    }
  } catch (e) {
    console.error('加载高峰时段数据失败:', e)
  }
}

async function loadTrend() {
  try {
    const res = await statisticsApi.trend(7)
    if (res.code === 200 && res.data) {
      await nextTick()
      const chart = echarts.init(trendChart.value)
      chart.setOption({
        tooltip: { trigger: 'axis', formatter: p => `${p[0].name}<br/>占用率: ${(p[0].value * 100).toFixed(1)}%` },
        xAxis: { type: 'category', data: res.data.map(d => d.date) },
        yAxis: { type: 'value', axisLabel: { formatter: v => (v * 100).toFixed(0) + '%' }, max: 1 },
        series: [{
          type: 'line',
          data: res.data.map(d => d.rate),
          smooth: true,
          lineStyle: { color: '#409EFF', width: 3 },
          areaStyle: { color: 'rgba(64,158,255,0.1)' },
          markLine: { data: [{ type: 'average', name: '平均值' }] }
        }],
        grid: { left: 50, right: 20, top: 20, bottom: 30 }
      })
    }
  } catch (e) {
    console.error('加载趋势数据失败:', e)
  }
}

async function loadPrediction() {
  try {
    const res = await statisticsApi.aiPrediction(12)
    if (res.code === 200 && res.data) {
      modelReady.value = res.data.modelReady
      mse.value = res.data.mse || 0
      trainingSize.value = res.data.trainingSize || 0

      await nextTick()
      const chart = echarts.init(predictionChart.value)

      const historyData = res.data.historyData || []
      const predictions = res.data.predictions || []

      const allHours = []
      const historyMap = {}
      const predictMap = {}

      historyData.forEach(d => {
        const label = `${d.hour}时`
        if (!allHours.includes(label)) allHours.push(label)
        historyMap[label] = d.rate
      })
      predictions.forEach(d => {
        const label = `${d.hour}时`
        if (!allHours.includes(label)) allHours.push(label)
        predictMap[label] = d.predictedRate
      })

      // 注意：不要按数值排序！因为预测序列是从当前小时开始的连续跨天序列
      // 例如 14,15,16,17,18,19,20,21,22,23,0,1 需要保持原始时序
      // 不能排序成 0,1,14,15,...,23 这会打乱预测线的时序
      // allHours.sort((a, b) => parseInt(a) - parseInt(b))

      const historyRates = allHours.map(h => historyMap[h] !== undefined ? historyMap[h] : null)
      const predictRates = allHours.map(h => predictMap[h] !== undefined ? predictMap[h] : null)

      chart.setOption({
        tooltip: { trigger: 'axis', formatter: p => {
          let html = p[0].axisValue
          p.forEach(item => {
            html += `<br/>${item.marker} ${item.seriesName}: ${(item.value * 100).toFixed(1)}%`
          })
          return html
        }},
        legend: { data: ['历史占用率', 'AI预测占用率'] },
        xAxis: { type: 'category', data: allHours },
        yAxis: { type: 'value', axisLabel: { formatter: v => (v * 100).toFixed(0) + '%' }, max: 1 },
        series: [
          {
            name: '历史占用率',
            type: 'line',
            data: historyRates,
            smooth: true,
            lineStyle: { color: '#909399', width: 2 },
            symbol: 'none'
          },
          {
            name: 'AI预测占用率',
            type: 'line',
            data: predictRates,
            smooth: true,
            lineStyle: { color: '#E6A23C', width: 3, type: 'dashed' },
            areaStyle: { color: 'rgba(230,162,60,0.1)' }
          }
        ],
        grid: { left: 50, right: 20, top: 40, bottom: 30 }
      })
    }
  } catch (e) {
    console.error('加载AI预测数据失败:', e)
  }
}

async function loadRevenueTrend() {
  try {
    const res = await statisticsApi.revenueTrend(revenuePeriod.value)
    if (res.code === 200 && res.data) {
      await nextTick()
      const chart = echarts.init(revenueChart.value)
      chart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: res.data.map(d => d.period) },
        yAxis: { type: 'value', axisLabel: { formatter: v => '¥' + v } },
        series: [{
          type: 'line',
          data: res.data.map(d => d.totalAmount),
          smooth: true,
          lineStyle: { color: '#67C23A', width: 3 },
          areaStyle: { color: 'rgba(103,194,58,0.1)' }
        }],
        grid: { left: 60, right: 20, top: 20, bottom: 30 }
      })
    }
  } catch (e) {
    console.error('加载收费趋势数据失败:', e)
  }
}

function exportReport() {
  statisticsApi.exportExcel()
}

onMounted(() => {
  loadSummary()
  loadPeakHours()
  loadTrend()
  loadPrediction()
  loadRevenueTrend()
})
</script>

<style scoped>
.statistics { max-width: 1400px; margin: 0 auto; }
.mb-4 { margin-bottom: 20px; }
.stat-box { padding: 20px; border-radius: 12px; text-align: center; }
.stat-title { font-size: 14px; color: #606266; margin-bottom: 8px; }
.stat-val { font-size: 28px; font-weight: bold; color: #303133; }
.stat-sub { font-size: 12px; color: #909399; margin-top: 4px; }
</style>