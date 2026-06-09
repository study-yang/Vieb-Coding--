const API = require('../../utils/api.js')
const { PERIOD_OPTIONS, EXPENSE_CATEGORIES, INCOME_CATEGORIES } = require('../../app-config.js')

const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]

function lookupEmoji(categoryKey) {
  const found = ALL_CATEGORIES.find(c => c.key === categoryKey)
  return found ? found.emoji : '📋'
}

Page({
  data: {
    theme: 'light',
    themeClass: '',
    loading: false,
    loadError: false,
    activePeriod: 'month',
    periodOptions: PERIOD_OPTIONS,
    statsData: null,
    categoryBreakdown: [],
    totalExpense: 0,
    aiReport: '',
    aiHighlights: [],
    aiWarning: '',
    suggestions: [],
    showReport: false,
    showSuggestions: false,
    aiLoading: false
  },

  onLoad() {
    const app = getApp()
    this.setData({ theme: app.globalData.theme, themeClass: app.globalData.themeClass || '' })
  },

  onShow() {
    const app = getApp()
    this.setData({
      theme: app.globalData.theme,
      themeClass: app.globalData.themeClass || ''
    })
    this.setData({ activePeriod: 'month' })
    this.loadStats('month')
  },

  async loadStats(period) {
    this.setData({
      activePeriod: period,
      loading: true,
      loadError: false,
      showReport: false,
      showSuggestions: false,
      aiReport: '',
      aiHighlights: [],
      aiWarning: '',
      suggestions: []
    })

    try {
      const statsRes = await API.getStatistics({ period })
      const statsData = statsRes && statsRes.data ? statsRes.data : null

      if (!statsData) {
        this.setData({ loading: false })
        return
      }

      const breakdown = (statsData.categoryBreakdown || []).map(item => ({
        ...item,
        emoji: lookupEmoji(item.category || item._id)
      }))

      this.setData({
        statsData,
        categoryBreakdown: breakdown,
        totalExpense: statsData.totalExpense || 0,
        loading: false,
        loadError: false
      })
    } catch (e) {
      console.warn('加载统计数据失败', e)
      this.setData({ loading: false, loadError: true })
      const msg = (e && e.message) || '加载失败，请稍后重试'
      wx.showToast({ title: msg, icon: 'none', duration: 2500 })
    }
  },

  async startAiAnalysis() {
    const { statsData, activePeriod, aiLoading } = this.data
    if (aiLoading || !statsData) return

    this.setData({ aiLoading: true, showReport: false, showSuggestions: false })

    try {
      const analyzeRes = await API.aiAnalyze(activePeriod, statsData)
      if (analyzeRes && analyzeRes.data) {
        const warning = analyzeRes.data.warning
        this.setData({
          aiReport: analyzeRes.data.report || '',
          aiHighlights: analyzeRes.data.highlights || [],
          aiWarning: (warning && warning !== 'null') ? warning : '',
          showReport: true
        })
      } else {
        wx.showToast({ title: 'AI 分析暂无结果', icon: 'none' })
      }
    } catch (e) {
      console.warn('AI 分析失败', e)
      const msg = (e && e.message) || 'AI 分析失败，请稍后重试'
      wx.showToast({ title: msg, icon: 'none', duration: 2500 })
      this.setData({ aiLoading: false })
      return
    }

    // showReport 已显示，保持 aiLoading=true 以显示建议加载提示
    this.setData({ showReport: true })

    try {
      const suggestRes = await API.aiSuggest(3)
      if (suggestRes && suggestRes.data && suggestRes.data.suggestions) {
        this.setData({
          suggestions: suggestRes.data.suggestions,
          showSuggestions: true
        })
      }
    } catch (e) {
      console.warn('AI 建议生成失败', e)
    }

    this.setData({ aiLoading: false })
  },

  onPeriodChange(e) {
    const { period } = e.currentTarget.dataset
    this.loadStats(period)
  },

  onRetryLoad() {
    this.loadStats(this.data.activePeriod)
  }
})