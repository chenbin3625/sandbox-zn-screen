<template>
    <div class="admin-page">
        <header>
            <h1>浙能集团生产安全监控</h1>
            <div class="user-info">
                <span>用户：{{ username }}</span>
                <button @click="logout" class="logout-btn">退出</button>
            </div>
        </header>
        <div class="main-content">
            <aside class="sidebar">
                <button v-for="(item, index) in menuItems" :key="index" @click="activeMenu = item.key"
                    :class="{ active: activeMenu === item.key }">
                    <img :src="item.icon" :alt="item.label" />
                    {{ item.label }}
                </button>
            </aside>
            <main>
                <iframe :src="currentIframeSrc" frameborder="0"></iframe>
            </main>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

export default {
    name: 'AdminPage',
    setup() {
        const authStore = useAuthStore()
        const router = useRouter()

        const activeMenu = ref('overview')

        const menuItems = [
            { key: 'overview', label: '全景图', icon: '/elecscreen/img/全景.png', iframe: '/elecscreen/overallView.html' },
            { key: 'windPower', label: '风电项目', icon: '/elecscreen/img/风电.png', iframe: '/elecscreen/windPower.html' },
            { key: 'intelligent', label: '智慧台区', icon: '/elecscreen/img/智慧平台.png', iframe: '/elecscreen/intelligent.html' },
        ]

        const currentIframeSrc = computed(() => {
            const item = menuItems.find(item => item.key === activeMenu.value)
            return item ? item.iframe : ''
        })

        const logout = () => {
            authStore.logout()
            alert('退出成功！')
            router.push('/')
        }

        onMounted(() => {
            if (!authStore.isAuthenticated) {
                router.push('/')
            }
            document.title = '管理后台-浙能集团生产安全监控'
        })

        return {
            username: authStore.username,
            logout,
            menuItems,
            activeMenu,
            currentIframeSrc
        }
    }
}
</script>


<style scoped>
html,
body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
}

.admin-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    background: linear-gradient(135deg, #1a2a6c, #2a4858, #2c3e50);
    color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

header {
    background-color: rgba(0, 0, 0, 0.2);
    padding: 0.8rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

h1 {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.user-info {
    display: flex;
    align-items: center;
}

.user-info span {
    margin-right: 1rem;
    font-size: 1rem;
}

.logout-btn {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    cursor: pointer;
    border-radius: 4px;
    font-size: 0.9rem;
    transition: background-color 0.3s ease, transform 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.logout-btn:hover {
    background-color: #c0392b;
    transform: translateY(-2px);
}

.main-content {
    display: flex;
    flex: 1;
    overflow: hidden;
}

.sidebar {
    width: 100px;
    background-color: rgba(0, 0, 0, 0.3);
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar button {
    background-color: transparent;
    border: none;
    color: #ecf0f1;
    padding: 1rem 1rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: background-color 0.3s ease, transform 0.3s ease;
    border-radius: 4px;
}

.sidebar button:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

.sidebar button.active {
    background-color: rgba(52, 152, 219, 0.5);
    font-weight: 600;
}

.sidebar button img {
    width: 24px;
    height: 24px;
    margin-bottom: 0.5rem;
    opacity: 0.7;
    transition: opacity 0.3s ease;
}

.sidebar button:hover img {
    opacity: 1;
}

main {
    flex: 1;
    overflow: hidden;
    border-radius: 4px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
}

iframe {
    width: 100%;
    height: 100%;
    border: none;
}
</style>
