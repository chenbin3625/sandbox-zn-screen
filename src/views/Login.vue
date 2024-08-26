<template>
    <div class="login-page">
        <div class="login-container">
            <div class="header">
                <img src="/src/assets/logo.png" alt="Logo" class="logo" />
                <span class="system-name">生产安全监控系统</span>
            </div>
            <div class="login-banner">
                <img src="/src/assets/login-background.jpg" alt="Banner" class="banner" />
                <div class="login-box">
                    <div class="login-form">
                        <label for="username">用户名:</label>
                        <input type="text" id="username" v-model="username" placeholder="请输入用户名"
                            @input="clearError('username')" />
                        <span class="error-message" v-if="errors.username">{{ errors.username }}</span>

                        <label for="password">密码:</label>
                        <input type="password" id="password" v-model="password" placeholder="请输入密码"
                            @input="clearError('password')" />
                        <span class="error-message" v-if="errors.password">{{ errors.password }}</span>

                        <a href="#" class="forgot-password">忘记账号密码?</a>
                        <button class="login-btn" @click="handleLogin">登录</button>
                        <!-- Update the domain-computer-link to trigger download -->
                        <a :href="vpnDownloadLink" class="domain-computer-link" download>已加域电脑</a>
                        <button class="quick-login-btn" @click="quickLogin">一键登录</button>
                    </div>
                </div>
            </div>
        </div>
        <footer class="footer">
            <p>浙能集团统一认证中心 Zhejiang Provincial Energy Group Company Ltd.浙江省能源集团有限公司</p>
            <p>浙江浙能数字科技有限公司 人工运维热线: 0571-86664099 工作日 08:30-17:30</p>
        </footer>
    </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

export default {
    name: 'LoginPage',
    setup() {
        const authStore = useAuthStore()
        const router = useRouter()
        const username = ref('')
        const password = ref('')
        const errors = reactive({
            username: '',
            password: ''
        })

        const vpnDownloadLink = '/vpn.exe' // Link to the VPN executable

        const validateInputs = () => {
            let isValid = true

            if (!username.value.trim()) {
                errors.username = '用户名不能为空。'
                isValid = false
            } else if (username.value.length < 3) {
                errors.username = '用户名长度不能少于3个字符。'
                isValid = false
            }

            if (!password.value.trim()) {
                errors.password = '密码不能为空。'
                isValid = false
            } else if (password.value.length < 5) {
                errors.password = '密码长度不能少于5个字符。'
                isValid = false
            }

            return isValid
        }

        const clearError = (field) => {
            errors[field] = ''
        }

        const handleLogin = async () => {
            if (!validateInputs()) {
                return
            }

            setTimeout(async () => {
                try {
                    const success = await authStore.login(username.value, password.value)
                    if (success) {
                        alert('登录成功！')
                        router.push('/admin')
                    } else {
                        alert('用户名或密码错误，请重试。')
                    }
                } catch (error) {
                    alert(`登录失败: ${error.message || '未知错误'}`)
                }
            }, 500) // 0.5 seconds delay
        }

        const quickLogin = () => {
            alert('您未加入域，无法进行一键登录。')
        }

        const checkIfLoggedIn = () => {
            if (authStore.isAuthenticated) {
                router.push('/admin')
            }
        }

        onMounted(checkIfLoggedIn)

        return {
            username,
            password,
            errors,
            handleLogin,
            quickLogin,
            clearError,
            vpnDownloadLink
        }
    }
}
</script>



<style scoped>
.login-page {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
    background-image: url('/src/assets/background.jpg');
    /* Add your background image path here */
    background-size: cover;
    background-position: center;
    overflow: hidden;
}

.login-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
}

.header {
    display: flex;
    align-items: center;
    margin: 20px 0 10px 20px;
}

.logo {
    margin-right: 10px;
}

.system-name {
    font-size: 24px;
    font-weight: bold;
    color: #333;
}

.login-banner {
    width: 1100px;
    height: 450px;
    position: relative;
}

.banner {
    width: 100%;
    height: 100%;
    position: absolute;
}

.login-box {
    position: absolute;
    top: 50%;
    right: 5%;
    transform: translateY(-50%);
    width: 350px;
    height: 350px;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login-form {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
}

.login-form label {
    margin-top: 10px;
    text-align: left;
    color: #333;
}

.login-form input {
    margin-top: 5px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
}

.forgot-password {
    margin-top: 10px;
    font-size: 12px;
    color: #0066cc;
    text-align: right;
}

.login-btn,
.quick-login-btn {
    margin-top: 10px;
    padding: 10px;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.login-btn {
    background-color: #1c7ecb;
}

.quick-login-btn {
    background-color: #2b9e2b;
}

.domain-computer-link {
    display: block;
    margin-top: 10px;
    text-align: center;
    color: #0066cc;
    text-decoration: none;
    font-size: 14px;
}

.domain-computer-link:hover {
    text-decoration: underline;
}

.footer {
    background-color: #f4f4f4;
    padding: 10px;
    text-align: center;
    font-size: 12px;
    color: #666;
}

.footer p {
    margin: 5px 0;
}

.error-message {
    color: red;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}
</style>