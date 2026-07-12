<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <el-header class="app-header">
      <div class="header-content">
        <div class="logo" @click="$router.push('/')">
          <el-icon size="28"><Opportunity /></el-icon>
          <span>智能停车系统</span>
        </div>
        
        <el-menu 
          :default-active="$route.path" 
          mode="horizontal" 
          router
          class="nav-menu"
        >
          <el-menu-item index="/">
            <el-icon><House /></el-icon>
            首页
          </el-menu-item>
          <el-menu-item index="/vehicle-query">
            <el-icon><Search /></el-icon>
            实时车辆查询
          </el-menu-item>
          <el-menu-item index="/fee-settlement">
            <el-icon><Money /></el-icon>
            停车费结算
          </el-menu-item>
        </el-menu>
        
        <div class="user-info">
          <el-dropdown>
            <span class="user-name">
              <el-avatar :size="32" :src="userAvatar" />
              李滨瀚
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleProfile">个人中心</el-dropdown-item>
                <el-dropdown-item @click="handleSettings">系统设置</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>
    
    <!-- 主内容区 -->
    <el-main class="app-main">
      <router-view />
    </el-main>
    
    <!-- 页脚 -->
    <el-footer class="app-footer">
      <div class="footer-content">
        <p>智能停车管理系统 © 2025 - 第10组项目</p>
        <p>技术栈：Vue 3 + Element Plus + SpringBoot + Atlas 200DK</p>
      </div>
    </el-footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Opportunity, House, Search, Money, Avatar 
} from '@element-plus/icons-vue'

const userAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

const handleProfile = () => {
  console.log('个人中心')
}

const handleSettings = () => {
  console.log('系统设置')
}

const handleLogout = () => {
  console.log('退出登录')
}
</script>

<style scoped>
/* 样式保持不变 */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: bold;
  color: #409EFF;
  cursor: pointer;
}

.nav-menu {
  flex: 1;
  justify-content: center;
  border-bottom: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-name {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.app-main {
  flex: 1;
  padding: 20px;
  background: #f5f7fa;
}

.app-footer {
  background: #303133;
  color: #fff;
  text-align: center;
  padding: 20px;
}

.footer-content p {
  margin: 5px 0;
  color: #c0c4cc;
  font-size: 14px;
}
</style>