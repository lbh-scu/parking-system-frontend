<template>
  <div class="app-container">
    <!-- 侧边导航 -->
    <el-menu
      :default-active="$route.path"
      class="sidebar"
      router
      collapse-transition
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <div class="sidebar-logo">
        <el-icon size="24" color="#409EFF"><Opportunity /></el-icon>
        <span>智能停车系统</span>
      </div>

      <el-menu-item index="/">
        <el-icon><House /></el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="/resident">
        <el-icon><User /></el-icon>
        <span>住户管理</span>
      </el-menu-item>
      <el-menu-item index="/vehicle">
        <el-icon><Van /></el-icon>
        <span>车辆管理</span>
      </el-menu-item>
      <el-menu-item index="/fee">
        <el-icon><Money /></el-icon>
        <span>费用结算</span>
      </el-menu-item>
      <el-menu-item index="/parking-spots">
        <el-icon><Grid /></el-icon>
        <span>车位监控</span>
      </el-menu-item>
      <el-menu-item index="/statistics">
        <el-icon><DataAnalysis /></el-icon>
        <span>数据统计</span>
      </el-menu-item>
      <el-menu-item index="/settings">
        <el-icon><Setting /></el-icon>
        <span>系统设置</span>
      </el-menu-item>
    </el-menu>

    <!-- 主内容区 -->
    <div class="main-area">
      <!-- 顶部栏 -->
      <el-header class="app-header">
        <div class="header-left">
          <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="$route.meta?.title">{{ $route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-avatar :size="32" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
          <span class="user-name">管理员</span>
        </div>
      </el-header>

      <!-- 内容 -->
      <el-main class="app-main">
        <router-view />
      </el-main>
    </div>
  </div>
</template>

<script setup>
import {
  Opportunity, House, User, Van, Money, Grid, DataAnalysis, Setting
} from '@element-plus/icons-vue'
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #app { height: 100%; }

.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* 侧边栏 */
.sidebar {
  width: 220px;
  height: 100vh;
  overflow-y: auto;
  border-right: none !important;
  flex-shrink: 0;
}
.sidebar-logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

/* 主区域 */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px !important;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.user-name { color: #606266; font-size: 14px; }

.app-main {
  flex: 1;
  padding: 20px;
  background: #f5f7fa;
  overflow-y: auto;
}
</style>