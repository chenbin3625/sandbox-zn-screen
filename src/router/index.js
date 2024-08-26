import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Admin from '../views/Admin.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        authStore.loadAuth() // 确保加载本地存储中的认证状态
        if (authStore.isAuthenticated) {
          next('/admin') // 已登录时重定向到 /admin
        } else {
          next() // 未登录则继续访问登录页面
        }
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        authStore.loadAuth() // 确保加载本地存储中的认证状态
        if (authStore.isAuthenticated) {
          next() // 已登录则继续访问 admin 页面
        } else {
          next('/') // 未登录则重定向到登录页面
        }
      }
    }
  ]
})

export default router
