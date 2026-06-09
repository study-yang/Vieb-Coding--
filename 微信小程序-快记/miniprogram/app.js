const APP_CONFIG = require('./app-config.js')
const storage = require('./utils/storage.js')

App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      return
    }

    wx.cloud.init({
      env: APP_CONFIG.CLOUD_ENV_ID,
      traceUser: true
    })

    this.initTheme()
    this.loadDefaultCategory()
    this.loadUserInfo()
  },

  async loadUserInfo() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getUserProfile',
        data: { action: 'get' }
      })
      if (res.result && res.result.data) {
        this.globalData.userInfo = res.result.data
      }
    } catch (e) {
      console.warn('加载用户信息失败', e)
    }
  },

  initTheme() {
    const mode = storage.getThemeMode() || 'auto'
    this.globalData.themeMode = mode
    this.applyTheme(mode)

    wx.onThemeChange((res) => {
      if (this.globalData.themeMode === 'auto') {
        this.globalData.theme = res.theme
        this.notifyPages({ theme: res.theme, isDarkMode: res.theme === 'dark' })
      }
    })
  },

  applyTheme(mode) {
    let theme
    if (mode === 'dark') {
      theme = 'dark'
    } else if (mode === 'light') {
      theme = 'light'
    } else {
      const systemInfo = wx.getSystemInfoSync()
      theme = systemInfo.theme || 'light'
    }

    this.globalData.theme = theme
    this.globalData.themeMode = mode
    storage.setThemeMode(mode)

    const themeClass = mode === 'auto' ? '' : (mode === 'dark' ? 'theme-dark' : 'theme-light')
    this.globalData.themeClass = themeClass

    this.notifyPages({ theme, themeMode: mode, themeClass, isDarkMode: theme === 'dark' })
  },

  setThemeMode(mode) {
    this.applyTheme(mode)
  },

  notifyPages(data) {
    const pages = getCurrentPages()
    pages.forEach(page => {
      if (page.setData) {
        page.setData(data)
      }
    })
  },

  loadDefaultCategory() {
    try {
      const defaultCategory = wx.getStorageSync('defaultCategory')
      if (defaultCategory) {
        this.globalData.defaultCategory = defaultCategory
      }
    } catch (e) {
      console.warn('读取默认分类失败', e)
    }
  },

  // 全局错误捕获
  onError(err) {
    console.error('App onError:', err)
  },

  // 页面不存在处理
  onPageNotFound(res) {
    console.warn('Page not found:', res.path)
    wx.switchTab({ url: '/pages/index/index' })
  },

  globalData: {
    theme: 'light',
    themeMode: 'auto',
    defaultCategory: null,
    userInfo: null,
    todayExpense: 0,
    monthExpense: 0
  }
})
