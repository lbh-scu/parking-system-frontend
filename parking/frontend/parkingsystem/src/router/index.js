import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/vehicle-query',
      name: 'vehicle-query',
      component: () => import('../views/VehicleQueryView.vue')
    },
    {
      path: '/fee-settlement',
      name: 'fee-settlement',
      component: () => import('../views/FeeSettlementView.vue')
    }
    // 注意：不要有 DashboardView 的路由！
  ]
})

export default router