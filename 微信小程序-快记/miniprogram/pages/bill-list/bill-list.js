const API = require('../../utils/api.js')
const { EXPENSE_CATEGORIES } = require('../../app-config.js')
const fmt = require('../../utils/format.js')

Page({
  data: {
    theme: 'light',
    themeClass: '',
    loading: true,
    loadingMore: false,
    bills: [],
    groupedBills: [],
    currentYear: 0,
    currentMonth: 0,
    currentDay: 0, // 0=查看整月，>0=查看指定日
    currentMonthPad: '05',
    currentDayPad: '',
    isCurrentMonth: true,
    isToday: true,
    viewMode: 'month', // 'month' | 'day'
    activeCategory: '',
    filterCategories: [],
    totalExpense: 0,
    totalIncome: 0,
    page: 1,
    pageSize: 20,
    hasMore: true,
    isEmpty: false
  },

  onLoad() {
    const app = getApp()
    this.setData({ theme: app.globalData.theme, themeClass: app.globalData.themeClass || '' })

    const now = new Date()
    const { year, month } = fmt.getCurrentMonth()
    this.setData({
      currentYear: year,
      currentMonth: month,
      currentMonthPad: String(month).padStart(2, '0'),
      currentDay: 0,
      currentDayPad: '',
      isCurrentMonth: true,
      isToday: true,
      viewMode: 'month'
    })
    this.setupFilterCategories()
  },

  onShow() {
    const app = getApp()
    this.setData({
      theme: app.globalData.theme,
      themeClass: app.globalData.themeClass || ''
    })
    this.loadBills(true)
  },

  onReachBottom() {
    this.loadMore()
  },

  setupFilterCategories() {
    const filterCategories = [
      { key: '', name: '全部', emoji: '📋' }
    ]
    EXPENSE_CATEGORIES.forEach(c => {
      filterCategories.push({ key: c.key, name: c.name, emoji: c.emoji })
    })
    this.setData({ filterCategories })
  },

  checkCurrentMonth() {
    const now = new Date()
    const isCurrent = this.data.currentYear === now.getFullYear() && this.data.currentMonth === now.getMonth() + 1
    this.setData({ isCurrentMonth: isCurrent })
  },

  checkIsToday() {
    const now = new Date()
    const { currentYear, currentMonth, currentDay } = this.data
    const isToday = currentDay > 0 && currentYear === now.getFullYear() && currentMonth === now.getMonth() + 1 && currentDay === now.getDate()
    this.setData({ isToday })
  },

  async loadBills(reset = false) {
    if (reset) {
      this.setData({ page: 1, loading: true, isEmpty: false })
    } else {
      if (this.data.loadingMore) return
      this.setData({ loadingMore: true })
    }

    try {
      const { currentYear, currentMonth, currentDay, activeCategory, page, pageSize, viewMode } = this.data

      const params = { page, pageSize }

      if (viewMode === 'day' && currentDay > 0) {
        const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`
        params.date = dateStr
      } else {
        const monthStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}`
        params.month = monthStr
      }

      if (activeCategory) {
        params.category = activeCategory
      }

      const res = await API.queryBills(params)
      const bills = res && res.data ? (res.data.list || []) : []

      let groupedBills = []
      if (reset) {
        groupedBills = this.groupByDate(bills)
      } else {
        const existing = this.data.bills
        groupedBills = this.groupByDate([...existing, ...bills])
      }

      this.setData({
        bills: reset ? bills : [...this.data.bills, ...bills],
        groupedBills,
        loading: false,
        loadingMore: false,
        hasMore: bills.length >= pageSize,
        isEmpty: reset && bills.length === 0,
        totalExpense: res.data ? (res.data.totalExpense || 0) : 0,
        totalIncome: res.data ? (res.data.totalIncome || 0) : 0
      })
    } catch (e) {
      console.warn('加载账单失败', e)
      this.setData({ loading: false, loadingMore: false, isEmpty: false })
      if (reset) {
        wx.showToast({ title: '加载失败，请下拉刷新重试', icon: 'none' })
      }
    }
  },

  groupByDate(bills) {
    const groups = new Map()
    bills.forEach(bill => {
      const dateStr = fmt.formatDate(bill.date || bill.createTime)
      const dayLabel = fmt.formatDateChinese(bill.date || bill.createTime)
      const dayOfWeek = fmt.getDayOfWeek(bill.date || bill.createTime)

      if (!groups.has(dateStr)) {
        groups.set(dateStr, {
          date: dateStr,
          label: dayLabel + ' ' + dayOfWeek,
          bills: []
        })
      }
      groups.get(dateStr).bills.push(bill)
    })
    return Array.from(groups.values())
  },

  loadMore() {
    if (!this.data.hasMore || this.data.loading || this.data.loadingMore) return
    this.setData({ page: this.data.page + 1 })
    this.loadBills(false)
  },

  onSwitchToMonth() {
    this.setData({ viewMode: 'month', currentDay: 0, currentDayPad: '' })
    this.loadBills(true)
  },

  onSwitchToDay(e) {
    const now = new Date()
    const day = now.getDate()
    this.setData({
      viewMode: 'day',
      currentDay: day,
      currentDayPad: String(day).padStart(2, '0')
    })
    this.checkIsToday()
    this.loadBills(true)
  },

  onPrevDay() {
    let { currentYear, currentMonth, currentDay } = this.data
    currentDay--
    if (currentDay < 1) {
      currentMonth--
      if (currentMonth < 1) {
        currentMonth = 12
        currentYear--
      }
      const lastDay = new Date(currentYear, currentMonth, 0).getDate()
      currentDay = lastDay
    }
    this.setData({
      currentYear,
      currentMonth,
      currentMonthPad: String(currentMonth).padStart(2, '0'),
      currentDay,
      currentDayPad: String(currentDay).padStart(2, '0')
    })
    this.checkIsToday()
    this.checkCurrentMonth()
    this.loadBills(true)
  },

  onNextDay() {
    let { currentYear, currentMonth, currentDay } = this.data
    const now = new Date()
    // 不能超过今天
    if (currentYear === now.getFullYear() && currentMonth === now.getMonth() + 1 && currentDay >= now.getDate()) {
      return
    }
    currentDay++
    const lastDay = new Date(currentYear, currentMonth, 0).getDate()
    if (currentDay > lastDay) {
      currentDay = 1
      currentMonth++
      if (currentMonth > 12) {
        currentMonth = 1
        currentYear++
      }
    }
    this.setData({
      currentYear,
      currentMonth,
      currentMonthPad: String(currentMonth).padStart(2, '0'),
      currentDay,
      currentDayPad: String(currentDay).padStart(2, '0')
    })
    this.checkIsToday()
    this.checkCurrentMonth()
    this.loadBills(true)
  },

  onDayPick(e) {
    const val = e.detail.value // YYYY-MM-DD
    const [year, month, day] = val.split('-').map(Number)
    this.setData({
      currentYear: year,
      currentMonth: month,
      currentMonthPad: String(month).padStart(2, '0'),
      currentDay: day,
      currentDayPad: String(day).padStart(2, '0'),
      viewMode: 'day'
    })
    this.checkIsToday()
    this.checkCurrentMonth()
    this.loadBills(true)
  },

  onPrevMonth() {
    this.setData({ viewMode: 'month', currentDay: 0, currentDayPad: '' })
    let { currentYear, currentMonth } = this.data
    if (currentMonth === 1) {
      currentMonth = 12
      currentYear--
    } else {
      currentMonth--
    }
    this.setData({
      currentYear,
      currentMonth,
      currentMonthPad: String(currentMonth).padStart(2, '0')
    })
    this.checkCurrentMonth()
    this.loadBills(true)
  },

  onNextMonth() {
    this.setData({ viewMode: 'month', currentDay: 0, currentDayPad: '' })
    let { currentYear, currentMonth } = this.data
    const now = new Date()
    if (currentYear === now.getFullYear() && currentMonth === now.getMonth() + 1) {
      return
    }
    if (currentMonth === 12) {
      currentMonth = 1
      currentYear++
    } else {
      currentMonth++
    }
    this.setData({
      currentYear,
      currentMonth,
      currentMonthPad: String(currentMonth).padStart(2, '0')
    })
    this.checkCurrentMonth()
    this.loadBills(true)
  },

  onBackToToday() {
    const { year, month } = fmt.getCurrentMonth()
    const now = new Date()
    const day = now.getDate()
    this.setData({
      currentYear: year,
      currentMonth: month,
      currentMonthPad: String(month).padStart(2, '0'),
      currentDay: 0,
      currentDayPad: '',
      viewMode: 'month',
      isCurrentMonth: true,
      isToday: true
    })
    this.loadBills(true)
  },

  onMonthPick(e) {
    const val = e.detail.value
    const [year, month] = val.split('-').map(Number)
    this.setData({
      currentYear: year,
      currentMonth: month,
      currentMonthPad: String(month).padStart(2, '0')
    })
    this.checkCurrentMonth()
    this.loadBills(true)
  },

  onCategoryFilter(e) {
    const { key } = e.currentTarget.dataset
    this.setData({ activeCategory: key === this.data.activeCategory ? '' : key })
    this.loadBills(true)
  },

  onBillDelete(e) {
    const { bill } = e.detail
    API.deleteBill(bill._id).then(() => {
      this.loadBills(true)
    }).catch((err) => {
      console.warn('删除账单失败', err)
      wx.showToast({ title: '删除失败，请重试', icon: 'none' })
    })
  }
})
