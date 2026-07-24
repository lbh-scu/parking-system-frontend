<template>
  <div style="padding: 30px; max-width: 1400px; margin: 0 auto;">
    <div style="display:flex;align-items:center;margin-bottom:30px;">
      <div style="width:40px;height:40px;background:#67C23A;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-right:15px;">
        <span style="color:white;font-size:20px;">💰</span>
      </div>
      <h1 style="color:#303133;font-size:32px;margin:0;">停车费结算</h1>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:30px;">
      <!-- 左侧 -->
      <div>
        <div style="background:white;border-radius:12px;padding:25px;box-shadow:0 2px 12px 0 rgba(0,0,0,0.1);margin-bottom:30px;">
          <div style="font-size:18px;font-weight:500;margin-bottom:20px;color:#303133;display:flex;align-items:center;gap:10px;">
            <span style="color:#409EFF;">🚗</span> 已出场待结算车辆
            <span style="display:inline-block;background:#409EFF;color:white;font-size:12px;padding:2px 8px;border-radius:10px;margin-left:10px;">{{ exitedVehicles.length }}</span>
          </div>

          <div v-if="exitedVehicles.length > 0">
            <div v-for="vehicle in exitedVehicles" :key="vehicle.id"
              :style="{ padding:'15px', marginBottom:'15px', borderRadius:'8px', background: selectedVehicle?.id === vehicle.id ? '#ecf5ff' : '#f8f9fa', border: selectedVehicle?.id === vehicle.id ? '2px solid #409EFF' : '1px solid #e4e7ed', cursor:'pointer', transition:'all 0.3s' }"
              @click="selectVehicle(vehicle)">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                  <div style="font-size:18px;font-weight:500;color:#303133;">{{ vehicle.plate }}</div>
                  <div style="font-size:12px;color:#909399;margin-top:4px;">入场: {{ vehicle.entryTime }}</div>
                </div>
                <button @click.stop="handleSelectAndCalculate(vehicle)"
                  style="background:#E6A23C;color:white;border:none;border-radius:6px;padding:8px 16px;font-size:14px;cursor:pointer;">
                  {{ vehicle.calculated ? '已计算' : '结算' }}
                </button>
               </div>
            </div>
          </div>

          <div v-else style="text-align:center;padding:40px 20px;color:#909399;">
            <div style="font-size:48px;margin-bottom:20px;">🛒</div>
            <div style="font-size:16px;margin-bottom:10px;">暂无待结算车辆</div>
            <div style="color:#606266;font-size:14px;">请在车辆查询页面点击"出场结算"</div>
          </div>
        </div>

        <div style="background:white;border-radius:12px;padding:25px;box-shadow:0 2px 12px 0 rgba(0,0,0,0.1);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <div style="font-size:18px;font-weight:500;color:#303133;">今日收费统计</div>
            <button @click="handleExport"
              style="background:#67C23A;color:white;border:none;border-radius:6px;padding:6px 14px;font-size:13px;cursor:pointer;display:flex;align-items:center;gap:5px;">
              <span>📥</span> 导出 Excel
            </button>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
            <div style="text-align:center;padding:20px;background:linear-gradient(135deg,#ecf5ff,#d9ecff);border-radius:8px;">
              <div style="font-size:32px;font-weight:bold;color:#409EFF;">¥ {{ todayStats.total }}</div>
              <div style="color:#606266;margin-top:8px;">总收费金额</div>
            </div>
            <div style="text-align:center;padding:20px;background:linear-gradient(135deg,#f0f9eb,#e1f3d8);border-radius:8px;">
              <div style="font-size:32px;font-weight:bold;color:#67C23A;">{{ todayStats.vehicleCount }}</div>
              <div style="color:#606266;margin-top:8px;">收费车辆数</div>
            </div>
          </div>
          <div style="margin-top:20px;">
            <div style="font-size:14px;font-weight:500;margin-bottom:12px;color:#606266;">今日收费记录</div>
            <div style="max-height:200px;overflow-y:auto;">
              <div v-for="record in todayRecords" :key="record.id"
                style="display:flex;justify-content:space-between;align-items:center;padding:10px;border-bottom:1px solid #f5f7fa;">
                <div>
                  <div style="font-weight:500;">{{ record.plate }}</div>
                  <div style="font-size:12px;color:#909399;">{{ record.paymentTime }}</div>
                </div>
                <div style="font-weight:bold;color:#E6A23C;">{{ record.fee }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧 -->
      <div style="background:white;border-radius:12px;padding:25px;box-shadow:0 2px 12px 0 rgba(0,0,0,0.1);">
        <div style="font-size:18px;font-weight:500;margin-bottom:25px;color:#303133;"><span style="color:#E6A23C;">🧮</span> 费用计算</div>

        <div v-if="selectedVehicle" style="background:#f8f9fa;border-radius:8px;padding:20px;margin-bottom:25px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:15px;">
            <div style="font-size:16px;font-weight:500;color:#303133;">当前车辆</div>
            <button @click="clearSelection" style="background:transparent;color:#909399;border:none;font-size:12px;cursor:pointer;">取消选择</button>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
            <div>
              <div style="font-size:12px;color:#909399;margin-bottom:4px;">车牌号</div>
              <div style="font-size:18px;font-weight:500;color:#303133;">{{ selectedVehicle.plate }}</div>
            </div>
            <div>
              <div style="font-size:12px;color:#909399;margin-bottom:4px;">入场时间</div>
              <div style="font-size:14px;color:#303133;">{{ selectedVehicle.entryTime }}</div>
            </div>
            <div>
              <div style="font-size:12px;color:#909399;margin-bottom:4px;">出场时间</div>
              <div style="font-size:14px;color:#303133;">{{ selectedVehicle.exitTime || '等待计算' }}</div>
            </div>
            <div>
              <div style="font-size:12px;color:#909399;margin-bottom:4px;">停车时长</div>
              <div style="font-size:14px;color:#303133;">{{ selectedVehicle.duration || '等待计算' }}</div>
            </div>
          </div>
        </div>

        <!-- 立即计算费用按钮 -->
        <div v-if="selectedVehicle && !calculationResult" style="text-align:center;margin:30px 0;">
          <button @click="handleCalculateFee(selectedVehicle)" :disabled="calculating"
            style="background:#409EFF;color:white;border:none;border-radius:8px;padding:16px 40px;font-size:18px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:10px;">
            <span>{{ calculating ? '⏳' : '🧮' }}</span>
            {{ calculating ? '计算中...' : '立即计算费用' }}
          </button>
        </div>

        <!-- 计算结果 -->
        <div v-if="calculationResult" style="background:#f8f9fa;border-radius:8px;padding:25px;">
          <div style="font-size:20px;font-weight:500;color:#303133;margin-bottom:20px;display:flex;align-items:center;gap:10px;"><span>💰</span> 费用明细</div>
          <div style="display:grid;gap:15px;">
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #e4e7ed;">
              <span style="color:#606266;">车牌号</span>
              <span style="font-weight:500;">{{ calculationResult.plate }}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #e4e7ed;">
              <span style="color:#606266;">停车时长</span>
              <span>{{ calculationResult.duration }}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #e4e7ed;">
              <span style="color:#606266;">计费规则</span>
              <span style="font-size:12px;color:#909399;text-align:right;">
                每小时¥{{ feeConfig.hourlyRate }}，免费{{ feeConfig.freeMinutes }}分钟<br>
                每日封顶: ¥{{ feeConfig.dailyMax }}
              </span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:20px;background:white;border-radius:8px;margin:10px 0;border:2px solid #E6A23C;">
              <span style="color:#606266;font-weight:500;font-size:18px;">总费用</span>
              <div>
                <div style="font-size:36px;font-weight:bold;color:#E6A23C;text-align:right;">{{ calculationResult.totalFee }}</div>
                <div style="font-size:12px;color:#909399;text-align:right;">实付金额</div>
              </div>
            </div>
          </div>
          <div style="display:flex;gap:15px;margin-top:30px;">
            <button @click="showPayment = true" style="flex:1;background:#67C23A;color:white;border:none;border-radius:8px;padding:16px;font-size:16px;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
              <span>💳</span> 确认支付
            </button>
            <button @click="handlePrint" style="flex:1;background:white;color:#606266;border:1px solid #dcdfe6;border-radius:8px;padding:16px;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
              <span>🖨️</span> 打印凭据
            </button>
            <button @click="handleClear" style="flex:1;background:#F56C6C;color:white;border:none;border-radius:8px;padding:16px;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
              <span>🔄</span> 重新计算
            </button>
          </div>
        </div>

        <div v-if="!selectedVehicle && !calculationResult" style="text-align:center;padding:60px 20px;color:#909399;">
          <div style="font-size:48px;margin-bottom:20px;">👉</div>
          <div style="font-size:16px;margin-bottom:10px;">请先选择左侧车辆</div>
          <div style="color:#606266;font-size:14px;">点击车辆卡片进行选择</div>
        </div>
      </div>
    </div>

    <!-- 支付二维码弹窗 -->
    <div v-if="showPayment" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:9999;" @click.self="showPayment = false">
      <div style="background:white;border-radius:16px;padding:36px;width:380px;text-align:center;box-shadow:0 8px 40px rgba(0,0,0,.2);">
        <div style="font-size:20px;font-weight:600;color:#303133;margin-bottom:8px;">扫码支付</div>
        <div style="font-size:14px;color:#909399;margin-bottom:20px;">请选择支付方式</div>

        <!-- 金额 -->
        <div style="background:linear-gradient(135deg,#fdf6ec,#fce8c8);border-radius:12px;padding:16px;margin-bottom:20px;">
          <div style="font-size:13px;color:#E6A23C;margin-bottom:4px;">应付金额</div>
          <div style="font-size:36px;font-weight:bold;color:#E6A23C;">{{ calculationResult?.totalFee }}</div>
        </div>

        <!-- 支付方式切换 -->
        <div style="display:flex;gap:12px;margin-bottom:24px;">
          <div v-for="method in paymentMethods" :key="method.key"
            :style="{
              flex:1, padding:'12px 8px', borderRadius:'10px', cursor:'pointer',
              border: selectedPayment === method.key ? '2px solid ' + method.color : '2px solid #ebeef5',
              background: selectedPayment === method.key ? method.bg : '#f8f9fa',
              transition:'all .2s'
            }"
            @click="selectedPayment = method.key">
            <div style="font-size:28px;">{{ method.icon }}</div>
            <div style="font-size:12px;margin-top:4px;color:#303133;">{{ method.label }}</div>
          </div>
        </div>

        <!-- 二维码 -->
        <div style="background:white;border:2px dashed #ebeef5;border-radius:12px;padding:20px;margin-bottom:20px;display:flex;flex-direction:column;align-items:center;">
          <div :style="{
            width:'180px', height:'180px', background:'white', borderRadius:'8px',
            display:'flex', alignItems:'center', justifyContent:'center',
            position:'relative'
          }">
            <div style="width:160px;height:160px;background:currentColor;display:flex;align-items:center;justify-content:center;border-radius:4px;">
              <div style="width:140px;height:140px;background:white;display:flex;flex-wrap:wrap;gap:4px;padding:8px;align-content:flex-start;">
                <div v-for="n in 60" :key="n" :style="{
                  width:'14px', height:'14px',
                  background: Math.random() > 0.5 ? '#000' : '#fff',
                  borderRadius:'2px'
                }"></div>
              </div>
            </div>
            <!-- 支付平台logo -->
            <div :style="{
              position:'absolute', width:'44px', height:'44px', background:'white',
              borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'26px', boxShadow:'0 2px 8px rgba(0,0,0,.1)'
            }">{{ currentMethodIcon }}</div>
          </div>
          <div style="margin-top:10px;font-size:12px;color:#909399;">请使用{{ currentMethodLabel }}扫码支付</div>
        </div>

        <!-- 按钮 -->
        <div style="display:flex;gap:12px;">
          <button @click="showPayment = false" style="flex:1;padding:12px;border:1px solid #dcdfe6;border-radius:8px;background:white;cursor:pointer;font-size:14px;color:#606266;">取消支付</button>
          <button @click="handlePaymentComplete" style="flex:2;padding:12px;background:#67C23A;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;">支付完成</button>
        </div>
      </div>
    </div>

    <!-- 停车收费标准（动态展示系统配置值） -->
    <div style="background:white;border-radius:12px;padding:25px;margin-top:30px;box-shadow:0 2px 12px 0 rgba(0,0,0,0.1);">
      <div style="font-size:18px;font-weight:500;margin-bottom:20px;color:#303133;display:flex;align-items:center;gap:10px;">
        <span style="color:#409EFF;">📋</span> 停车收费标准
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;">
        <div style="background:#f0f9eb;border-radius:8px;padding:20px;">
          <div style="display:flex;align-items:center;margin-bottom:15px;">
            <div style="width:36px;height:36px;background:#67C23A;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-right:12px;">
              <span style="color:white;">💰</span>
            </div>
            <div style="font-size:16px;font-weight:500;color:#303133;">收费标准</div>
          </div>
          <div style="color:#606266;line-height:1.6;">
            <div style="margin-bottom:8px;">• <strong>每小时：</strong>¥{{ feeConfig.hourlyRate }}</div>
            <div style="margin-bottom:8px;">• <strong>免费时长：</strong>{{ feeConfig.freeMinutes }}分钟</div>
            <div>• <strong>不足1小时：</strong>按1小时计算</div>
          </div>
        </div>
        <div style="background:#fdf6ec;border-radius:8px;padding:20px;">
          <div style="display:flex;align-items:center;margin-bottom:15px;">
            <div style="width:36px;height:36px;background:#E6A23C;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-right:12px;">
              <span style="color:white;">🏷️</span>
            </div>
            <div style="font-size:16px;font-weight:500;color:#303133;">封顶优惠</div>
          </div>
          <div style="color:#606266;line-height:1.6;">
            <div style="margin-bottom:8px;">• <strong>每日封顶：</strong>¥{{ feeConfig.dailyMax }}（停n天封顶 × n）</div>
            <div style="margin-bottom:8px;">• <strong>VIP会员：</strong>9折优惠</div>
            <div>• <strong>月卡用户：</strong>固定¥300/月</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { feeApi, systemApi } from '../api/index.js'

const exitedVehicles = ref([])
const selectedVehicle = ref(null)
const calculating = ref(false)
const calculationResult = ref(null)
const showPayment = ref(false)
const selectedPayment = ref('wechat')
const currentFeeId = ref(null)

// ===== 从后端系统配置动态获取计费规则 =====
const feeConfig = ref({
  hourlyRate: '5.00',
  freeMinutes: '30',
  dailyMax: '50.00'
})

async function loadFeeConfig() {
  try {
    const res = await systemApi.config()
    const configs = res.data || []
    // configs 是 [{ configKey, configValue, description }] 格式
    const cfg = {}
    configs.forEach(item => {
      cfg[item.configKey] = item.configValue
    })
    feeConfig.value = {
      hourlyRate: cfg.hourly_rate || '5.00',
      freeMinutes: cfg.free_minutes || '30',
      dailyMax: cfg.daily_max || '50.00'
    }
  } catch (e) {
    console.warn('获取计费配置失败，使用默认值:', e.message)
  }
}

const paymentMethods = [
  { key: 'wechat', label: '微信支付', icon: '💚', color: '#07C160', bg: '#f0faf0' },
  { key: 'alipay', label: '支付宝', icon: '💙', color: '#1677FF', bg: '#f0f5ff' },
  { key: 'card', label: '银行卡', icon: '💳', color: '#E6A23C', bg: '#fdf6ec' }
]

const currentMethodIcon = computed(() => paymentMethods.find(m => m.key === selectedPayment.value)?.icon || '💚')
const currentMethodLabel = computed(() => paymentMethods.find(m => m.key === selectedPayment.value)?.label || '微信支付')

const todayStats = ref({ total: '0.00', vehicleCount: '0' })
const todayRecords = ref([])

onMounted(() => {
  loadPendingFees()
  loadStatistics()
  loadTodayRecords()
  loadFeeConfig()
})

// 从后端加载待结算车辆（通过 /fees/pending 获取状态为 PENDING 的费用记录）
async function loadPendingFees() {
  try {
    const res = await feeApi.pending()
    const fees = res.data || []
    exitedVehicles.value = fees.map(f => ({
      id: f.id,
      plateNumber: f.plateNumber,
      plate: f.plateNumber,
      entryTime: f.entryTime,
      exitTime: f.exitTime || '',
      duration: f.parkingHours ? f.parkingHours + '小时' : '',
      parkingHours: f.parkingHours,
      hourlyRate: f.hourlyRate,
      totalAmount: f.totalAmount
    }))
  } catch (e) {
    console.warn('获取待结算车辆失败：' + e.message)
  }
}

// 加载今日收费记录
async function loadTodayRecords() {
  try {
    const res = await feeApi.todayRecords()
    const records = res.data || []
    todayRecords.value = records.map(r => ({
      id: r.id,
      plate: r.plateNumber,
      fee: '¥' + (r.totalAmount ? r.totalAmount.toFixed(2) : '0.00'),
      paymentTime: r.paymentTime || ''
    }))
  } catch (e) {
    console.warn('获取今日记录失败：' + e.message)
  }
}

// 加载收费统计
async function loadStatistics() {
  try {
    const res = await feeApi.statistics()
    const data = res.data || {}
    todayStats.value = {
      total: (data.todayRevenue || 0).toFixed(2),
      vehicleCount: String(data.todayOrderCount != null ? data.todayOrderCount : 0)
    }
  } catch (e) {
    console.warn('获取统计失败：' + e.message)
  }
}

function selectVehicle(v) {
  selectedVehicle.value = v
  calculationResult.value = null
}

function clearSelection() {
  selectedVehicle.value = null
  calculationResult.value = null
}

// 点击车辆卡片上的"结算"按钮时：先选中该车辆，再自动计算费用
async function handleSelectAndCalculate(vehicle) {
  selectedVehicle.value = vehicle
  calculationResult.value = null
  await handleCalculateFee(vehicle)
}

async function handleCalculateFee(vehicle) {
  if (!vehicle) return
  calculating.value = true
  try {
    // 调用后端费控服务计算费用
    const res = await feeApi.calculate(vehicle.plateNumber || vehicle.plate)
    const fee = res.data
    vehicle.exitTime = fee.exitTime || new Date().toLocaleString()
    vehicle.duration = fee.parkingHours ? fee.parkingHours + '小时' : ''
    calculationResult.value = {
      id: fee.id,
      plate: fee.plateNumber,
      duration: fee.parkingHours ? fee.parkingHours + '小时' : '未知',
      hourlyRate: fee.hourlyRate,
      totalFee: '¥' + (fee.totalAmount ? fee.totalAmount.toFixed(2) : '0.00')
    }
    // 计算完费用后刷新配置，确保计费规则展示最新值
    await loadFeeConfig()
  } catch (e) {
    ElMessage.error('费用计算失败：' + e.message)
  } finally {
    calculating.value = false
  }
}

async function handlePaymentComplete() {
  if (!calculationResult.value) return
  try {
    await feeApi.pay(calculationResult.value.id)
    ElMessage.success('支付成功')
    showPayment.value = false
    // 从待结算列表中移除已支付车辆
    exitedVehicles.value = exitedVehicles.value.filter(v => (v.plateNumber || v.plate) !== calculationResult.value.plate)
    // 更新今日记录
    todayRecords.value.unshift({
      id: Date.now(),
      plate: calculationResult.value.plate,
      fee: calculationResult.value.totalFee,
      paymentTime: new Date().toLocaleTimeString()
    })
    // 重新统计
    await loadStatistics()
    selectedVehicle.value = null
    calculationResult.value = null
  } catch (e) {
    ElMessage.error('支付失败：' + e.message)
  }
}

function handlePrint() {
  if (!calculationResult.value) { ElMessage.warning('没有可打印的费用信息'); return }
  ElMessage.success('打印指令已发送')
}

function handleClear() { calculationResult.value = null }

function handleExport() {
  feeApi.exportExcel()
}
</script>