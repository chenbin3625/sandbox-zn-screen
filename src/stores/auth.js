import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    username: ''
  }),
  actions: {
    login(username, password) {
      // 简单的验证逻辑，可以在这里实现 API 调用
      if (username === 'admin' && password === 'admin') {
        this.isAuthenticated = true
        this.username = username
        localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, username }))
        return true
      } else {
        return false
      }
    },
    logout() {
      this.isAuthenticated = false
      this.username = ''
      localStorage.removeItem('auth')
    },
    loadAuth() {
      const auth = JSON.parse(localStorage.getItem('auth'))
      if (auth && auth.isAuthenticated) {
        this.isAuthenticated = true
        this.username = auth.username
      }
    }
  }
})
