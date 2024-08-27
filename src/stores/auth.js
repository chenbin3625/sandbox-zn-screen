import { defineStore } from 'pinia'

const AUTH_STORAGE_KEY = 'auth'
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000 // 1天的毫秒数

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    username: '',
    token: null,
    expireTime: null
  }),

  getters: {
    userInfo: (state) => ({
      username: state.username,
      isAuthenticated: state.isAuthenticated
    })
  },

  actions: {
    async login(username, password) {
      // 简单的前端验证逻辑
      if (username === 'admin' && password === 'admin') {
        const token = 'frontend_token_' + Date.now()
        const expireTime = Date.now() + ONE_DAY_IN_MS
        this.setAuthState(username, token, expireTime)
        return true
      }
      return false
    },

    logout() {
      this.clearAuthState()
    },

    loadAuth() {
      const authData = this.getAuthFromStorage()
      if (authData && this.isTokenValid(authData.expireTime)) {
        this.setAuthState(authData.username, authData.token, authData.expireTime)
      } else {
        this.clearAuthState()
      }
    },

    setAuthState(username, token, expireTime) {
      this.isAuthenticated = true
      this.username = username
      this.token = token
      this.expireTime = expireTime
      this.saveAuthToStorage()
    },

    clearAuthState() {
      this.isAuthenticated = false
      this.username = ''
      this.token = null
      this.expireTime = null
      localStorage.removeItem(AUTH_STORAGE_KEY)
    },

    saveAuthToStorage() {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        username: this.username,
        token: this.token,
        expireTime: this.expireTime
      }))
    },

    getAuthFromStorage() {
      const authData = localStorage.getItem(AUTH_STORAGE_KEY)
      return authData ? JSON.parse(authData) : null
    },

    isTokenValid(expireTime) {
      return expireTime && Date.now() < expireTime
    }
  }
})