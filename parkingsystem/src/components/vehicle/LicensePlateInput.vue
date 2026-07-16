<template>
  <div class="license-plate-input">
    <el-input
      v-model="displayValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :size="size"
      :class="{ 'is-invalid': showError }"
      :maxlength="8"
      @input="handleInput"
      @blur="handleBlur"
      @clear="handleClear"
      clearable
    >
      <template #prefix>
        <span class="plate-icon">🚗</span>
      </template>
    </el-input>
    <div v-if="showError" class="plate-error">{{ errorMsg }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '请输入车牌号，如 京A12345' },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: 'default' },
  immediateValidate: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'valid-change'])

const displayValue = ref(props.modelValue)
const errorMsg = ref('')
const touched = ref(false)

const showError = computed(() => (touched.value || props.immediateValidate) && errorMsg.value)

const provinces = '京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤川青藏琼宁'
const plateReg = new RegExp(
  `^[${provinces}][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警]$|^[${provinces}][A-HJ-NP-Z][DDF][A-HJ-NP-Z0-9]{5}$`
)

function validate(val) {
  if (!val || !val.trim()) return '车牌号不能为空'
  const upper = val.trim().toUpperCase()
  if (upper.length < 7 || upper.length > 8) return '车牌号长度不正确（应为7-8位）'
  if (!plateReg.test(upper)) return '车牌号格式不正确（示例：京A12345）'
  return ''
}

function handleInput(val) {
  const raw = val.replace(/[\s]/g, '').toUpperCase()
  displayValue.value = raw
  emit('update:modelValue', raw)
  if (touched.value || props.immediateValidate) {
    errorMsg.value = validate(raw)
    emit('valid-change', !errorMsg.value)
  }
}

function handleBlur() {
  touched.value = true
  errorMsg.value = validate(displayValue.value)
  emit('valid-change', !errorMsg.value)
}

function handleClear() {
  displayValue.value = ''
  errorMsg.value = ''
  emit('update:modelValue', '')
  emit('valid-change', false)
}

function reset() {
  displayValue.value = ''
  errorMsg.value = ''
  touched.value = false
  emit('update:modelValue', '')
}

defineExpose({ reset, validate: () => validate(displayValue.value) })
</script>

<style scoped>
.license-plate-input { width: 100%; }
.plate-icon { font-size: 16px; }
.plate-error {
  font-size: 12px;
  color: #F56C6C;
  line-height: 1.2;
  padding: 4px 0 0 2px;
}
.plate-error::before { content: '⚠ '; }
:deep(.is-invalid .el-input__wrapper) {
  box-shadow: 0 0 0 1px #F56C6C inset !important;
}
</style>
