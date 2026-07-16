<template>
  <div ref="chartRef" style="height: 300px;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: { type: Array, default: () => [] }
})

const chartRef = ref(null)
let chart = null

const defaultData = [
  { area: 'A区', total: 100, occupied: 57, free: 43 },
  { area: 'B区', total: 50, occupied: 24, free: 26 },
  { area: 'C区', total: 50, occupied: 36, free: 14 }
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
  chart.setOption({
    tooltip: {
      trigger: 'axis', axisPointer: { type: 'shadow' },
      formatter: p => {
        const d = displayData.value[p[0].dataIndex]
        return `${d.area}<br/>总车位: ${d.total}<br/>已占用: ${d.occupied} (${(d.occupied/d.total*100).toFixed(0)}%)<br/>空闲: ${d.free}`
      }
    },
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'value', axisLabel: { fontSize: 12 } },
    yAxis: { type: 'category', data: displayData.value.map(d => d.area), axisLabel: { fontSize: 13, fontWeight: 'bold' } },
    series: [
      { name: '已占用', type: 'bar', stack: 'total', data: displayData.value.map(d => d.occupied), itemStyle: { color: '#F56C6C', borderRadius: [0, 0, 0, 0] }, label: { show: true, position: 'inside', formatter: p => `${p.value}个`, fontSize: 12, color: '#fff' } },
      { name: '空闲', type: 'bar', stack: 'total', data: displayData.value.map(d => d.free), itemStyle: { color: '#67C23A', borderRadius: [0, 4, 4, 0] }, label: { show: true, position: 'inside', formatter: p => `${p.value}个`, fontSize: 12, color: '#fff' } }
    ],
    legend: { data: ['已占用', '空闲'], bottom: 0, icon: 'roundRect' }
  })
}

defineExpose({ refresh: () => render() })
</script>
