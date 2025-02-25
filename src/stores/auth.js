import { defineStore } from 'pinia'
import { generateRandomData, getDataCountByDate, MONITOR_DATA_KEY, generateDashboardData, DASHBOARD_DATA_KEY } from '../utils/monitorDataGenerator'

const AUTH_STORAGE_KEY = 'auth'
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000 // 1天的毫秒数

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    username: '',
    token: null,
    expireTime: null,
    monitorData: [], // 添加存储监控数据的状态
    lastDataGenTime: null, // 添加最后生成数据的时间记录
    dashboardData: [], // 添加仪表盘数据的状态
    lastDashboardGenTime: null // 添加最后生成仪表盘数据的时间记录
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
        
        // 登录成功后生成随机数据
        this.generateMonitorData()
        
        // 登录成功后生成仪表盘数据
        this.generateDashboardData()
        
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
        
        // 尝试从存储中加载监控数据
        this.loadMonitorData()
        
        // 尝试从存储中加载仪表盘数据
        this.loadDashboardData()
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
      this.monitorData = []
      this.lastDataGenTime = null
      this.dashboardData = []
      this.lastDashboardGenTime = null
      localStorage.removeItem(AUTH_STORAGE_KEY)
      localStorage.removeItem(MONITOR_DATA_KEY) // 清除监控数据
      localStorage.removeItem(DASHBOARD_DATA_KEY) // 清除仪表盘数据
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
    },

    // 修改：使用导入的函数生成监控数据
    generateMonitorData() {
      const dataCount = getDataCountByDate();
      this.monitorData = generateRandomData(dataCount);
      this.lastDataGenTime = new Date().toISOString();
      this.saveMonitorDataToStorage();
    },

    // 修改：保存监控数据到存储，包括生成时间
    saveMonitorDataToStorage() {
      localStorage.setItem(MONITOR_DATA_KEY, JSON.stringify({
        data: this.monitorData,
        genTime: this.lastDataGenTime
      }))
    },

    // 修改：从存储加载监控数据，检查是否需要根据日期重新生成
    loadMonitorData() {
      const savedData = localStorage.getItem(MONITOR_DATA_KEY)
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        
        // 如果有数据并且有生成时间
        if (parsedData.data && parsedData.genTime) {
          const lastGenDate = new Date(parsedData.genTime);
          const now = new Date();
          
          // 如果数据是今天生成的，直接使用
          if (lastGenDate.toDateString() === now.toDateString()) {
            this.monitorData = parsedData.data;
            this.lastDataGenTime = parsedData.genTime;
            return;
          }
        }
      }
      
      // 如果没有找到存储的数据，或者数据不是今天生成的，则生成新数据
      this.generateMonitorData();
    },

    // 修改：获取监控数据，确保数据是基于当前日期的
    getMonitorData() {
      if (this.monitorData.length === 0 || !this.lastDataGenTime) {
        this.loadMonitorData();
      } else {
        // 检查数据是否是今天生成的，如果不是则重新生成
        const lastGenDate = new Date(this.lastDataGenTime);
        const now = new Date();
        if (lastGenDate.toDateString() !== now.toDateString()) {
          this.generateMonitorData();
        }
      }
      return this.monitorData;
    },

    // 修改：生成仪表盘数据
    generateDashboardData() {
      this.dashboardData = generateDashboardData();
      this.lastDashboardGenTime = new Date().toISOString();
      this.saveDashboardDataToStorage();
    },

    // 修改：保存仪表盘数据到存储，包括生成时间
    saveDashboardDataToStorage() {
      localStorage.setItem(DASHBOARD_DATA_KEY, JSON.stringify({
        data: this.dashboardData,
        genTime: this.lastDashboardGenTime
      }))
    },

    // 修改：从存储加载仪表盘数据，检查是否需要根据日期重新生成
    loadDashboardData() {
      const savedData = localStorage.getItem(DASHBOARD_DATA_KEY)
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        
        // 如果有数据并且有生成时间
        if (parsedData.data && parsedData.genTime) {
          const lastGenDate = new Date(parsedData.genTime);
          const now = new Date();
          
          // 如果数据是今天生成的，直接使用
          if (lastGenDate.toDateString() === now.toDateString()) {
            this.dashboardData = parsedData.data;
            this.lastDashboardGenTime = parsedData.genTime;
            return;
          }
        }
      }
      
      // 如果没有找到存储的数据，或者数据不是今天生成的，则生成新数据
      this.generateDashboardData();
    },

    // 修改：获取仪表盘数据，确保数据是基于当前日期的
    getDashboardData() {
      if (this.dashboardData.length === 0 || !this.lastDashboardGenTime) {
        this.loadDashboardData();
      } else {
        // 检查数据是否是今天生成的，如果不是则重新生成
        const lastGenDate = new Date(this.lastDashboardGenTime);
        const now = new Date();
        if (lastGenDate.toDateString() !== now.toDateString()) {
          this.generateDashboardData();
        }
      }
      return this.dashboardData;
    }
  }
})