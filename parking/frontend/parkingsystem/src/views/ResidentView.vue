<template>
  <div class="placeholder-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-icon size="20" color="#409EFF"><User /></el-icon>
          <span>住户管理</span>
        </div>
      </template>
      <el-empty description="住户管理功能开发中..." />
    </el-card>
  </div>
</template>

<script setup>
import { User } from '@element-plus/icons-vue'
</script>