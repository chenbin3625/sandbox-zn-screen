// 导入Vue和Pinia的创建函数
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 导入根组件App和路由器
import App from './App.vue'
import router from './router'

// 创建Vue应用实例
const app = createApp(App)

// 使用Pinia和路由器
app.use(createPinia())
app.use(router)

// 将应用挂载到DOM元素上
app.mount('#app')
