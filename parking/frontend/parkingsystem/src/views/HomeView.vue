<template>
  <div style="padding: 50px; text-align: center; background: #f5f7fa; min-height: 100vh;">
    <h1 style="color: green; font-size: 60px;">🚗 智能停车系统</h1>
    
    <!-- 测试图标 -->
    <div style="margin: 30px;">
      <el-icon size="40" color="#409EFF"><Monitor /></el-icon>
      <span style="margin-left: 10px;">监控图标测试</span>
    </div>
    
    <!-- 简单功能卡片 -->
    <div style="display: flex; justify-content: center; gap: 20px; margin: 40px;">
      <el-card style="width: 200px; padding: 20px;">
        <el-icon size="40" color="#67C23A"><Cpu /></el-icon>
        <h3>边缘计算</h3>
        <p>Atlas 200DK</p>
      </el-card>
      
      <el-card style="width: 200px; padding: 20px;">
        <el-icon size="40" color="#E6A23C"><Camera /></el-icon>
        <h3>车牌识别</h3>
        <p>YOLOX+CRNN</p>
      </el-card>
    </div>
    
    <p style="color: #999; margin-top: 50px;">版本: 1.0 | 时间: {{ new Date().toLocaleTimeString() }}</p>
  </div>
</template>

<script setup>
import { Monitor, Cpu, Camera } from '@element-plus/icons-vue'
console.log('✅ HomeView.vue 加载成功 - 测试图标')
</script>