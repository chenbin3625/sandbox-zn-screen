import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginPage.vue'),
    meta: {
      requiresAuth: false,
      title: '登录 - 浙能集团生产安全监控系统'
    }
  },
  {
    path: '/admin',
    component: () => import('../views/AdminPage.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'admin-home',
        component: () => import('../views/AdminHomePage.vue'),
        meta: {
          title: '首页 - 浙能集团生产安全监控系统'
        }
      },
      {
        path: 'screen',
        name: 'admin-screen',
        component: () => import('../views/AdminScreenPage.vue'),
        meta: {
          title: '二楼大屏 - 浙能集团生产安全监控系统'
        }
      },
      {
        path: 'monitor',
        name: 'admin-monitor',
        component: () => import('../views/AdminMonitorPage.vue'),
        meta: {
          title: '数据监控 - 浙能集团生产安全监控系统'
        }
      }
    ]
  },
  {
    path: '/',
    name: 'root',
    redirect: (to) => {
      const authStore = useAuthStore()
      return authStore.isAuthenticated ? { name: 'admin-home' } : { name: 'login' }
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: (to) => {
      const authStore = useAuthStore()
      return authStore.isAuthenticated ? { name: 'admin-home' } : { name: 'login' }
    },
    meta: {
      title: '页面未找到 - 浙能集团生产安全监控系统'
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
  document.title = to.meta.title || '浙能集团生产安全监控系统'

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'admin-home' })
  } else {
    next()
  }
})

export default router
