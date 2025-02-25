import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// 系统标题常量
const SYSTEM_TITLE = '生产安全监控系统'

// 通用跳转逻辑
const redirectToDefaultPage = () => {
  const authStore = useAuthStore()
  return authStore.isAuthenticated ? { name: 'admin-home' } : { name: 'login' }
}

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginPage.vue'),
    meta: {
      requiresAuth: false,
      title: '登录'
    }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminPage.vue'),
    meta: {
      requiresAuth: true,
      title: '管理后台'
    },
    children: [
      {
        path: 'home',
        name: 'admin-home',
        component: () => import('../views/AdminHomePage.vue'),
        meta: {
          requiresAuth: true,
          title: '首页'
        }
      },
      {
        path: 'screen',
        name: 'admin-screen',
        component: () => import('../views/AdminScreenPage.vue'),
        meta: {
          requiresAuth: true,
          title: '二楼大屏'
        }
      },
      {
        path: 'monitor',
        name: 'admin-monitor',
        component: () => import('../views/AdminMonitorPage.vue'),
        meta: {
          requiresAuth: true,
          title: '数据监控'
        }
      },
      {
        path: '',
        redirect: { name: 'admin-home' }
      }
    ]
  },
  {
    path: '/',
    name: 'root',
    redirect: redirectToDefaultPage
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: redirectToDefaultPage,
    meta: {
      title: '页面未找到'
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
  document.title = to.meta.title ? `${to.meta.title} - ${SYSTEM_TITLE}` : SYSTEM_TITLE

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'admin-home' })
  } else {
    next()
  }
})

export default router
