<template>
  <a-layout class="layout">
    <a-layout-header class="header">
      <div class="logo-title">
        <img src="/src/assets/logo-mini.png" alt="Logo" class="logo" />
        <span class="title">浙能集团生产安全监控系统</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="horizontal"
        class="header-menu"
        @select="handleMenuSelect"
      >
        <a-menu-item v-for="item in menuItems" :key="item.key">
          {{ item.label }}
        </a-menu-item>
      </a-menu>
      <div class="user-info">
        <span>用户名：{{ username }}</span>
        <a-button @click="showLogoutConfirm" class="logout-btn">退出</a-button>
      </div>
    </a-layout-header>
    <a-layout-content class="content">
      <router-view></router-view>
    </a-layout-content>

    <a-modal
      v-model:visible="logoutModalVisible"
      title="确认退出"
      @ok="handleLogout"
      @cancel="cancelLogout"
      okText="确认"
      cancelText="取消"
    >
      <p>您确定要退出系统吗？</p>
    </a-modal>
  </a-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

const authStore = useAuthStore()
const router = useRouter()

const selectedKeys = ref(['home'])
const username = computed(() => authStore.user?.username || 'admin')
const logoutModalVisible = ref(false)

const menuItems = [
  { key: 'home', label: '首页', path: '/admin/home' },
  { key: 'screen', label: '二楼大屏', path: '/admin/screen' },
  { key: 'monitor', label: '数据监控', path: '/admin/monitor' },
]

const showLogoutConfirm = () => {
  logoutModalVisible.value = true
}

const handleLogout = () => {
  authStore.logout()
  logoutModalVisible.value = false
  message.success('退出成功')
  router.push('/login')
}

const cancelLogout = () => {
  logoutModalVisible.value = false
}

const handleMenuSelect = ({ key }) => {
  const selectedItem = menuItems.find(item => item.key === key)
  if (selectedItem) {
    router.push(selectedItem.path)
  }
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
})
</script>


<style scoped>
.layout {
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(59, 106, 147, 0.8); /* Semi-transparent background */
  backdrop-filter: blur(10px); /* Add blur effect for better readability */
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.logo-title {
  display: flex;
  align-items: center;
}

.logo {
  height: 40px;
  margin-right: 16px;
}

.title {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}

.header-menu {
  flex: 1;
  display: flex;
  justify-content: center;
  background: transparent;
  border-bottom: none;
}

:deep(.ant-menu-horizontal) {
  line-height: 64px;
  border-bottom: none;
  background: transparent;
}

:deep(.ant-menu-item) {
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
  margin: 0 10px;
  padding: 0 15px;
  transition: all 0.3s ease;
}

:deep(.ant-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: #fff;
}

:deep(.ant-menu-item-selected) {
  background-color: rgba(24, 144, 255, 0.2) !important;
  color: #fff !important;
  font-weight: bold;
}

:deep(.ant-menu-item-selected::after) {
  border-bottom: 2px solid #fff !important;
}

.user-info {
  display: flex;
  align-items: center;
  color: #fff;
}

.user-info span {
  margin-right: 16px;
}

.logout-btn {
  color: #fff;
  background-color: rgba(255, 77, 79, 0.8);
  border-color: rgba(255, 77, 79, 0.8);
  font-weight: bold;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: rgba(255, 120, 117, 0.9);
  border-color: rgba(255, 120, 117, 0.9);
}

.content {
  min-height: calc(100vh - 64px);
}

@media (max-width: 768px) {
  /* ... (previous mobile styles remain unchanged) ... */
}
</style>