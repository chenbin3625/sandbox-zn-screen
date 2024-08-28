<template>
  <div class="login-page">
    <div class="login-container">
      <header class="header">
        <img src="/src/assets/logo.png" alt="Logo" class="logo" />
        <span class="system-name">生产安全监控系统</span>
      </header>
      <div class="login-banner">
        <img src="/src/assets/login-background.jpg" alt="Banner" class="banner" />
        <div class="login-box">
          <div class="login-form-wrapper">
            <a-form
              :model="formState"
              @finish="handleLogin"
              class="login-form"
            >
              <a-form-item
                name="username"
                :rules="[{ required: true, message: '请输入用户名' }]"
              >
                <a-input
                  v-model:value="formState.username"
                  placeholder="请输入用户名"
                >
                  <template #prefix>
                    <UserOutlined class="site-form-item-icon" />
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item
                name="password"
                :rules="[{ required: true, message: '请输入密码' }]"
              >
                <a-input-password
                  v-model:value="formState.password"
                  placeholder="请输入密码"
                >
                  <template #prefix>
                    <LockOutlined class="site-form-item-icon" />
                  </template>
                </a-input-password>
              </a-form-item>

              <a-form-item class="forgot-password-item">
                <a class="forgot-password" href="#">忘记账号密码?</a>
              </a-form-item>

              <a-form-item class="button-item">
                <a-button type="primary" html-type="submit" class="login-btn" block>
                  登录
                </a-button>
              </a-form-item>

              <a-form-item class="button-item">
                <a :href="vpnDownloadLink" class="domain-computer-link" download>
                  已加域电脑
                </a>
              </a-form-item>

              <a-form-item class="button-item">
                <a-button @click="quickLogin" class="quick-login-btn" block>
                  一键登录
                </a-button>
              </a-form-item>
            </a-form>
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

<script setup>
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const formState = reactive({
  username: '',
  password: '',
});

const vpnDownloadLink = ref('/vpn.exe');

const handleLogin = async (values) => {
  try {
    const success = await authStore.login(values.username, values.password);
    if (success) {
      message.success('登录成功！');
      router.push('/admin');
    } else {
      message.error('用户名或密码错误，请重试。');
    }
  } catch (error) {
    message.error(`登录失败: ${error.message || '未知错误'}`);
  }
};

const quickLogin = () => {
  message.warning('您未加入域，无法进行一键登录。');
};
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  background-image: url('/src/assets/background.jpg');
  background-size: cover;
  background-position: center;
}

.login-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.logo {
  margin-right: 15px;
}

.system-name {
  font-size: 28px;
  font-weight: bold;
  color: #000000;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}

.login-banner {
  position: relative;
  width: 100%;
  max-width: 1100px;
  height: 500px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.banner {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login-box {
  position: absolute;
  top: 50%;
  right: 5%;
  transform: translateY(-50%);
  width: 380px;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.login-form-wrapper {
  padding-top: 40px;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.forgot-password-item {
  margin-bottom: 15px;
}

.button-item {
  margin-bottom: 10px;
}

.forgot-password {
  float: right;
  font-size: 14px;
  color: #1890ff;
}

.login-btn {
  background-color: #1c7ecb;
  border-color: #1c7ecb;
  height: 40px;
  font-size: 16px;
}

.quick-login-btn {
  background-color: #2b9e2b;
  border-color: #2b9e2b;
  color: #fff;
  height: 40px;
  font-size: 16px;
}

.domain-computer-link {
  display: block;
  text-align: center;
  color: #0066cc;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 15px;
}

.domain-computer-link:hover {
  text-decoration: underline;
}

.footer {
  background-color: rgba(244, 244, 244, 0.8);
  padding: 15px;
  text-align: center;
  font-size: 12px;
  color: #666;
}

.footer p {
  margin: 5px 0;
}

@media (max-width: 768px) {
  .login-banner {
    height: auto;
  }

  .login-box {
    position: static;
    transform: none;
    width: 100%;
    max-width: 380px;
    margin: 20px auto;
  }
}
</style>