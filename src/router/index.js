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
      path: '/resident',
      name: 'resident',
      component: () => import('../views/ResidentView.vue')
    },
    {
      path: '/vehicle',
      name: 'vehicle',
      component: () => import('../views/VehicleView.vue')
    },
    {
      path: '/fee',
      name: 'fee',
      component: () => import('../views/FeeView.vue')
    },
    {
      path: '/parking-spots',
      name: 'parking-spots',
      component: () => import('../views/ParkingSpotsView.vue')
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('../views/StatisticsView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue')
    }
  ]
})

export default router