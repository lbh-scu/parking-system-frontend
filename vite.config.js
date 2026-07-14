import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 确保没有奇怪的配置
  server: {
    host: 'localhost',
    port: 5173
  }
})