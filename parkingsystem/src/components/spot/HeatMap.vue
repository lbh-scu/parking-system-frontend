<template>
  <div>
    <div ref="chartRef" style="height: 320px;"></div>
    <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-top:8px;">
      <span style="font-size:12px;color:#909399;">低占用</span>
      <span v-for="c in colorSteps" :key="c" :style="{width:'20px',height:'12px',display:'inline-block',background:c,borderRadius:'2px'}"></span>
      <span style="font-size:12px;color:#909399;">高占用</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: { type: Array, default: () => [] }
})

const chartRef = ref(null)
let chart = null
const colorSteps = ['#f0f9eb','#d9f0d3','#a8ddb5','#43a2ca','#2b6b9e','#1a3b5c']

const defaultData = [
  { area: 'A区', floor: '地面', total: 70, occupied: 30, rate: 0.43 },
  { area: 'B区', floor: '地面', total: 70, occupied: 25, rate: 0.36 },
  { area: 'C区', floor: '地面', total: 70, occupied: 30, rate: 0.43 }
]

const displayData = computed(() => props.data.length ? props.data : defaultData)

onMounted(() => {
  chart = echarts.init(chartRef.value)
  render()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})

function handleResize() { chart?.resize() }

function render() {
  const areas = [...new Set(displayData.value.map(d => d.area))]
  const floors = [...new Set(displayData.value.map(d => d.floor))]
  const heatData = displayData.value.map(d => [
    areas.indexOf(d.area), floors.indexOf(d.floor), +(d.rate * 100).toFixed(0)
  ])
  chart.setOption({
    tooltip: {
      formatter: p => {
        const d = displayData.value[p.dataIndex]
        return `${d.area} ${d.floor}<br/>占用率: ${(d.rate * 100).toFixed(0)}%<br/>已占/总数: ${d.occupied}/${d.total}`
      }
    },
    grid: { left: 60, right: 20, top: 20, bottom: 40 },
    xAxis: { type: 'category', data: areas, axisLabel: { fontSize: 13, fontWeight: 'bold' } },
    yAxis: { type: 'category', data: floors, axisLabel: { fontSize: 13, fontWeight: 'bold' } },
    series: [{
      type: 'heatmap',
      data: heatData,
      label: { show: true, formatter: p => `${p.value[2]}%`, fontSize: 14, fontWeight: 'bold', color: '#303133' },
      emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' } },
      itemStyle: { borderRadius: 4 }
    }],
    visualMap: { min: 0, max: 100, show: false, inRange: { color: colorSteps } }
  })
}

defineExpose({ refresh: () => render() })
</script>
