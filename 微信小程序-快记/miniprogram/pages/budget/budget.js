const API = require('../../utils/api.js')
const { DEFAULT_BUDGET_AMOUNTS, DEFAULT_MONTHLY_BUDGETS, SUBSCRIBE_TEMPLATE_ID } = require('../../app-config.js')

Page({
  data: {
    theme: 'light',
    themeClass: '',
    switchColor: '#FF6B35',
    dayBudget: 0,
    monthBudget: 0,
    dayBudgetInput: '',
    monthBudgetInput: '',
    dayUsage: 0,
    monthUsage: 0,
    dayRemaining: 0,
    monthRemaining: 0,
    subscribeEnabled: false,
    quickDayAmounts: DEFAULT_BUDGET_AMOUNTS,
    quickMonthAmounts: DEFAULT_MONTHLY_BUDGETS,
    showDayQuick: false,
    showMonthQuick: false
  },

  onLoad() {
    const app = getApp()
    const theme = app.globalData.theme || 'light'
    this.setData({
      theme,
      themeClass: app.globalData.themeClass || '',
      switchColor: theme === 'dark' ? '#FF8A5C' : '#FF6B35'
    })
  },

  onShow() {
    this.loadBudgets()
    this.loadUsage()
  },

  async loadBudgets() {
    try {
      const res = await API.call('budgetCRUD', { action: 'list' })
      const budgets = (res && res.data) || []

      const dayBudget = budgets.find(b => b.type === 'day')
      const monthBudget = budgets.find(b => b.type === 'month')

      this.setData({
        dayBudget: dayBudget ? dayBudget.amount : 0,
        monthBudget: monthBudget ? monthBudget.amount : 0,
        dayBudgetInput: dayBudget ? String(dayBudget.amount) : '',
        monthBudgetInput: monthBudget ? String(monthBudget.amount) : '',
        subscribeEnabled: dayBudget ? dayBudget.subscribeEnabled || false : false
      })
    } catch (e) {
      console.warn('加载预算失败', e)
    }
  },

  async loadUsage() {
    try {
      const res = await API.call('budgetCRUD', { action: 'checkUsage' })
      if (res && res.data) {
        const usageData = res.data
        if (usageData.day) {
          this.setData({
            dayUsage: usageData.day.usage || 0,
            dayRemaining: Math.max(0, (usageData.day.budget || 0) - (usageData.day.usage || 0))
          })
        }
        if (usageData.month) {
          this.setData({
            monthUsage: usageData.month.usage || 0,
            monthRemaining: Math.max(0, (usageData.month.budget || 0) - (usageData.month.usage || 0))
          })
        }
      }
    } catch (e) {
      console.warn('加载预算使用情况失败', e)
    }
  },

  onDayInput(e) {
    this.setData({ dayBudgetInput: e.detail.value })
  },

  onMonthInput(e) {
    this.setData({ monthBudgetInput: e.detail.value })
  },

  async saveDayBudget() {
    const amount = parseFloat(this.data.dayBudgetInput)
    if (!amount || amount <= 0) {
      wx.showToast({ title: '请输入有效的预算金额', icon: 'none' })
      return
    }

    try {
      await API.call('budgetCRUD', { action: 'save', data: { type: 'day', amount } })
      this.setData({ dayBudget: amount })
      wx.showToast({ title: '每日预算已保存', icon: 'success' })
      this.loadUsage()

      if (!this.data.subscribeEnabled && SUBSCRIBE_TEMPLATE_ID) {
        setTimeout(() => this.requestSubscribe(), 1500)
      }
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none' })
    }
  },

  async saveMonthBudget() {
    const amount = parseFloat(this.data.monthBudgetInput)
    if (!amount || amount <= 0) {
      wx.showToast({ title: '请输入有效的预算金额', icon: 'none' })
      return
    }

    try {
      await API.call('budgetCRUD', { action: 'save', data: { type: 'month', amount } })
      this.setData({ monthBudget: amount })
      wx.showToast({ title: '每月预算已保存', icon: 'success' })
      this.loadUsage()
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none' })
    }
  },

  onQuickDayAmount(e) {
    const { amount } = e.currentTarget.dataset
    this.setData({ dayBudgetInput: String(amount), showDayQuick: false })
  },

  onQuickMonthAmount(e) {
    const { amount } = e.currentTarget.dataset
    this.setData({ monthBudgetInput: String(amount), showMonthQuick: false })
  },

  onToggleDayQuick() {
    this.setData({ showDayQuick: !this.data.showDayQuick, showMonthQuick: false })
  },

  onToggleMonthQuick() {
    this.setData({ showMonthQuick: !this.data.showMonthQuick, showDayQuick: false })
  },

  async requestSubscribe() {
    if (!SUBSCRIBE_TEMPLATE_ID) {
      wx.showToast({ title: '提醒功能配置中，暂不可用', icon: 'none', duration: 2000 })
      return
    }

    wx.showModal({
      title: '开启提醒',
      content: '开启超支提醒后，每天 20:00 会推送当日消费和预算使用情况，帮助你更好地管理支出',
      confirmText: '开启',
      cancelText: '暂不',
      success: async (modalRes) => {
        if (modalRes.confirm) {
          try {
            const tmplRes = await wx.requestSubscribeMessage({
              tmplIds: [SUBSCRIBE_TEMPLATE_ID]
            })

            if (tmplRes[SUBSCRIBE_TEMPLATE_ID] === 'accept') {
              await API.call('budgetCRUD', {
                action: 'updateSubscribe',
                data: { type: 'day', subscribeEnabled: true }
              })
              this.setData({ subscribeEnabled: true })
              wx.showToast({ title: '已开启提醒', icon: 'success' })
            }
          } catch (e) {
            console.warn('订阅消息请求失败', e)
            wx.showToast({ title: '开启提醒失败', icon: 'none' })
          }
        }
      }
    })
  },

  onToggleSubscribe() {
    if (this.data.subscribeEnabled) {
      API.call('budgetCRUD', {
        action: 'updateSubscribe',
        data: { type: 'day', subscribeEnabled: false }
      }).catch(e => console.warn('关闭提醒失败', e))
      this.setData({ subscribeEnabled: false })
      wx.showToast({ title: '已关闭提醒', icon: 'none' })
    } else {
      this.requestSubscribe()
    }
  }
})
