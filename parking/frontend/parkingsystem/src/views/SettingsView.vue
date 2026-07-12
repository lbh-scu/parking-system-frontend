<template>
  <div class="settings">
    <el-card shadow="hover">
      <template #header>
        <div style="display:flex;align-items:center;gap:10px;">
          <el-icon size="20" color="#409EFF"><Setting /></el-icon>
          <span>系统设置</span>
        </div>
      </template>
      <el-empty description="系统设置功能开发中..." />
    </el-card>
  </div>
</template>

<script setup>
import { Setting } from '@element-plus/icons-vue'
</script>