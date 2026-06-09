const API = require('../../utils/api.js')
const fmt = require('../../utils/format.js')

Page({
  data: {
    theme: 'light',
    themeClass: '',
    themeMode: 'auto',
    userInfo: null,
    nickName: '',
    avatarUrl: '',
    totalBills: 0,
    totalDays: 0,
    isDarkMode: false,
    appVersion: '1.1.0',
    todayExpense: 0,
    monthExpense: 0,
    monthIncome: 0,
    topCategory: null,
    dailyAvgExpense: 0,
    themeOptions: [
      { key: 'auto', name: '跟随系统' },
      { key: 'light', name: '浅色' },
      { key: 'dark', name: '深色' }
    ],
    showThemePicker: false,
    showFeedback: false,
    feedbackContent: '',
    feedbackContact: '',
    exporting: false
  },

  onLoad() {
    const app = getApp()
    const themeMode = app.globalData.themeMode || 'auto'
    this.setData({
      theme: app.globalData.theme,
      themeMode,
      themeClass: app.globalData.themeClass || '',
      isDarkMode: app.globalData.theme === 'dark'
    })
  },

  onShow() {
    this.loadUserInfo()
    this.loadAllStats()
  },

  async loadUserInfo() {
    try {
      const res = await API.getUserProfile()
      if (res && res.data) {
        const userInfo = res.data
        this.setData({
          userInfo,
          nickName: userInfo.nickName || '',
          avatarUrl: userInfo.avatarUrl || ''
        })
        const app = getApp()
        app.globalData.userInfo = userInfo
      }
    } catch (e) {
      console.warn('加载用户信息失败', e)
    }
  },

  async loadAllStats() {
    // 合并 loadStats + loadDataOverview，只调用一次 getStatistics
    const statsPromise = API.getStatistics({ period: 'month' })
    const billsPromise = API.queryBills({ page: 1, pageSize: 1 })

    try {
      const [statsRes, billsRes] = await Promise.all([statsPromise, billsPromise])

      if (billsRes && billsRes.data) {
        this.setData({ totalBills: billsRes.data.total || 0 })
      }

      if (statsRes && statsRes.data) {
        const data = statsRes.data
        const categoryBreakdown = data.categoryBreakdown || []
        const dailySummary = data.dailySummary || []
        const topCat = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null
        const days = dailySummary.length || 1
        const dailyAvg = data.totalExpense / days

        this.setData({
          totalDays: dailySummary.length,
          todayExpense: data.todayExpense || 0,
          monthExpense: data.totalExpense || 0,
          monthIncome: data.totalIncome || 0,
          topCategory: topCat,
          dailyAvgExpense: Math.round(dailyAvg * 100) / 100
        })
      }
    } catch (e) {
      console.warn('加载统计数据失败', e)
    }
  },

  async onOneTapLogin() {
    // 使用 wx.getUserProfile 获取用户昵称和头像并更新到服务端
    try {
      const that = this
      wx.getUserProfile({
        desc: '用于完善个人资料',
        success: async (res) => {
          const userInfo = res.userInfo || {}
          // 更新到服务端
          try {
            await API.updateUserProfile({ nickName: userInfo.nickName || '', avatarUrl: userInfo.avatarUrl || '' })
          } catch (e) {
            console.warn('更新用户资料到服务端失败', e)
          }

          // 刷新本地显示
          that.setData({ nickName: userInfo.nickName || '', avatarUrl: userInfo.avatarUrl || '' })
          const app = getApp()
          if (app) {
            app.globalData.userInfo = Object.assign(app.globalData.userInfo || {}, { nickName: userInfo.nickName, avatarUrl: userInfo.avatarUrl })
          }
          wx.showToast({ title: '登录成功', icon: 'success' })
        },
        fail: () => {
          wx.showToast({ title: '授权已取消', icon: 'none' })
        }
      })
    } catch (e) {
      console.warn('一键登录失败', e)
      wx.showToast({ title: '登录失败', icon: 'none' })
    }
  },

  async onChooseAvatar(e) {
    const tempFilePath = e.detail.avatarUrl
    if (!tempFilePath) return

    try {
      wx.showLoading({ title: '保存中' })
      const uploadRes = await API.uploadImage(tempFilePath)
      const avatarUrl = uploadRes.fileID

      await API.updateUserProfile({ avatarUrl })

      this.setData({ avatarUrl })
      wx.hideLoading()
      wx.showToast({ title: '头像已更新', icon: 'success' })
    } catch (e) {
      wx.hideLoading()
      console.warn('头像更新失败', e)
      wx.showToast({ title: '头像更新失败', icon: 'none' })
    }
  },

  async onNicknameInput(e) {
    const nickName = e.detail.value
    if (!nickName || !nickName.trim()) return

    try {
      await API.updateUserProfile({ nickName: nickName.trim() })
      this.setData({ nickName: nickName.trim() })
      wx.showToast({ title: '昵称已更新', icon: 'success' })
    } catch (e) {
      console.warn('昵称更新失败', e)
      wx.showToast({ title: '昵称更新失败', icon: 'none' })
    }
  },

  onThemeModeTap() {
    this.setData({ showThemePicker: true })
  },

  onThemeModeSelect(e) {
    const { key } = e.currentTarget.dataset
    const app = getApp()
    app.setThemeMode(key)

    this.setData({
      themeMode: key,
      theme: app.globalData.theme,
      themeClass: app.globalData.themeClass || '',
      isDarkMode: app.globalData.theme === 'dark',
      showThemePicker: false
    })
  },

  onThemePickerCancel() {
    this.setData({ showThemePicker: false })
  },

  onNavigateToBudget() {
    wx.navigateTo({ url: '/pages/budget/budget' })
  },

  onNavigateTo(e) {
    const { path } = e.currentTarget.dataset
    if (path === 'export') {
      this.onExportData()
    } else {
      wx.showToast({ title: '功能开发中', icon: 'none', duration: 1500 })
    }
  },

  async onExportData() {
    if (this.data.exporting) return
    this.setData({ exporting: true })
    wx.showLoading({ title: '导出中...', mask: true })

    try {
      const res = await API.exportAllBills()
      wx.hideLoading()
      this.setData({ exporting: false })

      if (!res || !res.data || !res.data.bills) {
        wx.showToast({ title: res.message || '暂无账单数据', icon: 'none', duration: 2000 })
        return
      }

      const { bills, total } = res.data

      // 生成 CSV 内容
      const header = '日期,时间,分类,金额(元),类型,备注,来源'

      function sanitizeCell(val) {
        if (val === null || val === undefined) return ''
        let s = String(val)
        s = s.replace(/"/g, '""')
        // 防止 CSV/Excel 注入：若以 = + - @ 开头，前置单引号
        if (/^[=+\-@]/.test(s)) {
          s = `'${s}`
        }
        return s
      }

      const rows = bills.map(b => {
        const amount = Math.abs(b.amount).toFixed(2)
        const type = b.amount < 0 ? '收入' : '支出'
        const note = sanitizeCell(b.note || '')
        const categoryName = sanitizeCell(b.categoryName || '')
        const source = sanitizeCell(b.source || '')
        return `${sanitizeCell(b.date)},${sanitizeCell(b.time)},${categoryName},${amount},${type},"${note}",${source}`
      })
      const csv = '\uFEFF' + header + '\n' + rows.join('\n')

      // 保存文件
      const fileName = `快记账单_${Date.now()}.csv`
      const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`
      const fs = wx.getFileSystemManager()
      fs.writeFileSync(filePath, csv, 'utf8')

      wx.showModal({
        title: '导出成功',
        content: `已导出 ${total} 条账单记录\n是否保存到本地或分享？`,
        confirmText: '分享文件',
        cancelText: '取消',
        success: (modalRes) => {
          if (modalRes.confirm) {
            wx.shareFileMessage({
              filePath,
              fileName,
              success: () => {
                wx.showToast({ title: '分享成功', icon: 'success' })
              },
              fail: () => {
                wx.showToast({ title: '分享失败', icon: 'none' })
              }
            })
          } else {
            wx.showToast({ title: `已保存到: ${fileName}`, icon: 'none', duration: 2000 })
          }
        }
      })
    } catch (e) {
      wx.hideLoading()
      this.setData({ exporting: false })
      console.warn('导出数据失败', e)
      wx.showToast({ title: '导出失败，请重试', icon: 'none', duration: 2000 })
    }
  },

  onFeedback() {
    this.setData({
      showFeedback: true,
      feedbackContent: '',
      feedbackContact: ''
    })
  },

  onFeedbackContentInput(e) {
    this.setData({ feedbackContent: e.detail.value })
  },

  onFeedbackContactInput(e) {
    this.setData({ feedbackContact: e.detail.value })
  },

  onFeedbackCancel() {
    this.setData({ showFeedback: false })
  },

  async onFeedbackSubmit() {
    const { feedbackContent } = this.data
    if (!feedbackContent || !feedbackContent.trim()) {
      wx.showToast({ title: '请输入反馈内容', icon: 'none', duration: 1500 })
      return
    }

    wx.showLoading({ title: '发送中...', mask: true })
    try {
      const res = await API.sendFeedback(feedbackContent.trim(), this.data.feedbackContact)
      wx.hideLoading()
      this.setData({ showFeedback: false })
      wx.showToast({ title: res.message || '感谢你的反馈！', icon: 'success', duration: 2000 })
    } catch (e) {
      wx.hideLoading()
      console.warn('发送反馈失败', e)
      wx.showToast({ title: '发送失败，请稍后重试', icon: 'none', duration: 2000 })
    }
  },

  onAbout() {
    wx.showModal({
      title: '关于快记',
      content: '快记 v1.0.0\nAI 原生极速记账\n打开就记，记完就走\n\n你的智能记账伙伴',
      showCancel: false,
      confirmText: '好的'
    })
  },
})
