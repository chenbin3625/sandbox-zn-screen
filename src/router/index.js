import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { message } from 'ant-design-vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/LoginPage.vue'),
    meta: {
      requiresAuth: false,
      title: '登录 - 浙能生产安全监控系统'
    }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminPage.vue'),
    meta: {
      requiresAuth: true,
      title: '管理后台 - 浙能生产安全监控系统'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: (to) => {
      const authStore = useAuthStore()
      return authStore.isAuthenticated ? { name: 'admin' } : { name: 'login' }
    },
    meta: {
      title: '页面未找到 - 浙能生产安全监控系统'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    await authStore.loadAuth()
  }

  // 设置页面标题
  document.title = to.meta.title || '浙能生产安全监控系统'

  if (to.name === 'not-found') {
    const redirectPath = authStore.isAuthenticated ? '后台管理页' : '登录页'
    message.warning(`路由 "${to.fullPath}" 不存在，正在跳转${redirectPath}`)
    next(authStore.isAuthenticated ? { name: 'admin' } : { name: 'login' })
  } else if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    message.warning('请先登录')
    next({ name: 'login' })
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'admin' })
  } else {
    next()
  }
})

export default router
