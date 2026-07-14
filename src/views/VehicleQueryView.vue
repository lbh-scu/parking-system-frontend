<template>
  <div style="padding: 30px; max-width: 1400px; margin: 0 auto;">
    <!-- 标题 -->
    <div style="display: flex; align-items: center; margin-bottom: 30px;">
      <div style="
        width: 40px;
        height: 40px;
        background: #409EFF;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
      ">
        <span style="color: white; font-size: 20px;">🔍</span>
      </div>
      <h1 style="color: #303133; font-size: 32px; margin: 0;">实时车辆查询</h1>
    </div>
    
    <!-- 搜索框 -->
    <div style="background: white; border-radius: 12px; padding: 25px; margin-bottom: 30px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);">
      <div style="font-size: 18px; font-weight: 500; margin-bottom: 20px; color: #303133;">搜索车辆</div>
      
      <div style="display: flex; gap: 20px; align-items: center;">
        <!-- 车牌搜索 -->
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; background: #f5f7fa; border-radius: 8px; padding: 0 15px; height: 48px;">
            <span style="margin-right: 10px; color: #909399;">🚗</span>
            <input 
              v-model="searchPlate" 
              placeholder="输入车牌号查询..." 
              style="border: none; background: transparent; outline: none; font-size: 16px; width: 100%;"
              @keyup.enter="handleSearch"
            />
          </div>
        </div>
        
        <!-- 搜索按钮 -->
        <button 
          @click="handleSearch"
          style="
            background: #409EFF;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0 30px;
            height: 48px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
          "
        >
          <span>🔍</span>
          查询
        </button>
        
        <!-- 重置按钮 -->
        <button 
          @click="handleReset"
          style="
            background: white;
            color: #606266;
            border: 1px solid #dcdfe6;
            border-radius: 8px;
            padding: 0 20px;
            height: 48px;
            font-size: 16px;
            cursor: pointer;
          "
        >
          重置
        </button>
      </div>
    </div>
    
    <!-- 车辆列表 -->
    <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div style="font-size: 18px; font-weight: 500; color: #303133;">
          在场车辆 <span style="color: #409EFF;">{{ filteredVehicles.length }}</span> 辆
        </div>
        <button 
          @click="refreshData"
          style="
            background: white;
            color: #606266;
            border: 1px solid #dcdfe6;
            border-radius: 6px;
            padding: 8px 16px;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
          "
        >
          <span>🔄</span>
          刷新数据
        </button>
      </div>
      
      <!-- 车辆表格 -->
      <div v-if="filteredVehicles.length > 0" style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f5f7fa;">
              <th style="padding: 15px; text-align: left; color: #606266; font-weight: 500; border-bottom: 1px solid #e4e7ed;">车牌号</th>
              <th style="padding: 15px; text-align: left; color: #606266; font-weight: 500; border-bottom: 1px solid #e4e7ed;">入场时间</th>
              <th style="padding: 15px; text-align: left; color: #606266; font-weight: 500; border-bottom: 1px solid #e4e7ed;">停车时长</th>
              <th style="padding: 15px; text-align: left; color: #606266; font-weight: 500; border-bottom: 1px solid #e4e7ed;">状态</th>
              <th style="padding: 15px; text-align: left; color: #606266; font-weight: 500; border-bottom: 1px solid #e4e7ed;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="vehicle in filteredVehicles" :key="vehicle.id" style="border-bottom: 1px solid #f5f7fa;">
              <td style="padding: 15px; font-weight: 500;">{{ vehicle.plate }}</td>
              <td style="padding: 15px;">{{ vehicle.entryTime }}</td>
              <td style="padding: 15px;">{{ calculateDuration(vehicle.entryTime) }}</td>
              <td style="padding: 15px;">
                <span 
                  style="
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 500;
                    background: #f0f9eb;
                    color: #67C23A;
                  "
                >
                  停车中
                </span>
              </td>
              <td style="padding: 15px;">
                <button 
                  @click="handleExit(vehicle)"
                  style="
                    background: #E6A23C;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    padding: 8px 16px;
                    font-size: 14px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                  "
                >
                  <span>💰</span>
                  出场结算
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 无数据提示 -->
      <div v-else style="text-align: center; padding: 60px 20px; color: #909399;">
        <div style="font-size: 48px; margin-bottom: 20px;">🚗</div>
        <div style="font-size: 18px; margin-bottom: 10px;">没有找到车辆</div>
        <div style="color: #606266;">尝试修改搜索条件或刷新数据</div>
      </div>
    </div>
    
    <!-- 停车场统计 -->
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 30px;">
      <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 32px; font-weight: bold; color: #67C23A;">{{ parkingStats.totalSpots }}</div>
        <div style="color: #606266; margin-top: 8px;">总车位数</div>
      </div>
      
      <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 32px; font-weight: bold; color: #F56C6C;">{{ parkingStats.occupiedSpots }}</div>
        <div style="color: #606266; margin-top: 8px;">已占用车位</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 搜索条件
const searchPlate = ref('')

// 停车场统计
const parkingStats = ref({
  totalSpots: 200,
  occupiedSpots: 150
})

// 模拟数据 - 只有停车中的车辆
const vehicles = ref([
  { id: 1, plate: '京A12345', entryTime: '2025-12-06 10:30:25' },
  { id: 2, plate: '京B67890', entryTime: '2025-12-06 10:25:18' },
  { id: 3, plate: '京C24680', entryTime: '2025-12-06 10:15:42' },
  { id: 4, plate: '京D13579', entryTime: '2025-12-06 11:20:33' },
  { id: 5, plate: '京E97531', entryTime: '2025-12-06 11:10:15' }
])

// 计算过滤后的车辆
const filteredVehicles = computed(() => {
  if (!searchPlate.value) {
    return vehicles.value
  }
  
  return vehicles.value.filter(vehicle => 
    vehicle.plate.includes(searchPlate.value)
  )
})

// 方法
const handleSearch = () => {
  console.log('搜索车牌:', searchPlate.value)
}

const handleReset = () => {
  searchPlate.value = ''
}

const refreshData = () => {
  console.log('刷新数据')
}

const calculateDuration = (entryTime) => {
  const entry = new Date(entryTime)
  const now = new Date()
  const diff = now - entry
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}小时${minutes}分钟`
}

const handleExit = (vehicle) => {
  // 1. 存储到 localStorage 供结算页面使用
  localStorage.setItem('pendingSettlement', JSON.stringify(vehicle))
  
  // 2. 从当前列表中移除
  vehicles.value = vehicles.value.filter(v => v.id !== vehicle.id)
  
  // 3. 更新统计
  parkingStats.value.occupiedSpots = vehicles.value.length
  
  // 4. 跳转到结算页面
  router.push('/fee-settlement')
}
</script>