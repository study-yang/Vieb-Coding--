const API = require('../../utils/api.js')
const categories = require('../../utils/categories.js')
const fmt = require('../../utils/format.js')
const budgetChecker = require('../../mixins/budget-checker.js')

Page({
  behaviors: [budgetChecker],
  data: {
    theme: 'light',
    themeClass: '',
    amount: '',
    displayAmount: '0.00',
    selectedCategory: null,
    note: '',
    showCategoryPicker: false,
    activeTab: 'expense',
    quickCategories: [],
    todayExpense: 0,
    monthExpense: 0,
    toastShow: false,
    toastMessage: '',
    toastShowUndo: false,
    lastCreatedBillId: null,
    isSaving: false,
    showManualInput: false,
    manualInputText: ''
  },

  timerIds: [],

  onLoad() {
    const app = getApp()
    this.setData({ theme: app.globalData.theme, themeClass: app.globalData.themeClass || '' })

    this.loadQuickCategories()
    this.setDefaultCategory()
  },

  onUnload() {
    this.clearAllTimers()
  },

  clearAllTimers() {
    this.timerIds.forEach(id => clearTimeout(id))
    this.timerIds = []
  },

  addTimer(fn, delay) {
    const id = setTimeout(() => {
      this.timerIds = this.timerIds.filter(t => t !== id)
      fn()
    }, delay)
    this.timerIds.push(id)
    return id
  },

  onShow() {
    const app = getApp()
    this.setData({
      theme: app.globalData.theme,
      themeClass: app.globalData.themeClass || ''
    })
    this.loadSummary()
  },

  loadQuickCategories() {
    const quick = categories.getQuickCategories(4)
    this.setData({ quickCategories: quick })
  },

  setDefaultCategory() {
    const defaultCat = categories.getDefaultCategory()
    if (defaultCat) {
      this.setData({
        selectedCategory: defaultCat,
        activeTab: categories.isExpenseCategory(defaultCat.key) ? 'expense' : 'income'
      })
    }
  },

  async loadSummary() {
    try {
      const res = await API.getStatistics({ period: 'month' })
      if (res && res.data) {
        this.setData({
          todayExpense: res.data.todayExpense || 0,
          monthExpense: res.data.totalExpense || 0
        })
      }
    } catch (e) {
      console.warn('加载摘要失败', e)
    }
  },

  onAmountChange(e) {
    const { value } = e.detail
    const displayAmount = value || '0.00'

    this.setData({
      amount: value,
      displayAmount: value ? fmt.formatAmount(parseFloat(value)) : '0.00'
    })
  },

  onCategoryTap(e) {
    const { key, name, emoji, color } = e.currentTarget.dataset
    if (key === 'more') {
      this.setData({ showCategoryPicker: true })
      return
    }
    this.setData({
      selectedCategory: { key, name, emoji, color },
      showCategoryPicker: false
    })
  },

  onCategorySelect(e) {
    const { key, name, emoji, color, type } = e.detail
    this.setData({
      selectedCategory: { key, name, emoji, color },
      activeTab: type,
      showCategoryPicker: false
    })
    this.loadQuickCategories()
  },

  onCategoryLongPress(e) {
    const { key } = e.currentTarget.dataset
    if (key === 'more') return
    categories.setDefaultCategory(key)

    wx.vibrateShort({ type: 'medium' })
    wx.showToast({
      title: '已设为默认分类',
      icon: 'none',
      duration: 1500
    })
    this.loadQuickCategories()
  },

  onCategorySetDefault(e) {
    const { key } = e.detail
    categories.setDefaultCategory(key)
    this.loadQuickCategories()
  },

  onNoteInput(e) {
    this.setData({ note: e.detail.value })
  },

  onShowCategoryPicker() {
    this.setData({ showCategoryPicker: true })
  },

  onCloseCategoryPicker() {
    this.setData({ showCategoryPicker: false })
  },

  onPickerTabChange(e) {
    this.setData({ activeTab: e.detail.tab })
  },


  onKeySave() {
    this.saveBill()
  },

  async saveBill() {
    const { amount, selectedCategory, note } = this.data

    if (!amount || parseFloat(amount) === 0) {
      wx.showToast({ title: '请输入金额', icon: 'none', duration: 1500 })
      return
    }

    if (!selectedCategory) {
      this.setData({ showCategoryPicker: true })
      return
    }

    if (this.data.isSaving) return
    this.setData({ isSaving: true })

    try {
      const parsedAmount = parseFloat(amount)
      const isIncome = categories.isIncomeCategory(selectedCategory.key)
      const finalAmount = isIncome ? -Math.abs(parsedAmount) : Math.abs(parsedAmount)

      const res = await API.createBill({
        amount: finalAmount,
        category: selectedCategory.key,
        categoryName: selectedCategory.name,
        date: new Date(),
        note: note || '',
        source: 'manual'
      })

      const billId = (res && res.data && res.data._id) || null

      this.setData({
        amount: '',
        displayAmount: '0.00',
        note: '',
        toastShow: true,
        toastMessage: '已记录 ✓',
        toastShowUndo: true,
        lastCreatedBillId: billId,
        isSaving: false
      })

      categories.updateRecentCategory(selectedCategory.key)
      this.loadSummary()
      this.checkDayBudget()

    } catch (e) {
      console.error('保存账单失败', e)
      this.setData({ isSaving: false })
      wx.showToast({ title: '保存失败，请重试', icon: 'none', duration: 2000 })
    }
  },

  onToastUndo() {
    const { lastCreatedBillId } = this.data
    this.setData({
      toastShow: false,
      toastMessage: '',
      toastShowUndo: false
    })

    if (!lastCreatedBillId) return

    API.deleteBill(lastCreatedBillId).then(() => {
      this.setData({
        amount: '',
        displayAmount: '0.00',
        note: ''
      })
      this.loadSummary()
    }).catch(err => {
      wx.showToast({ title: '撤销失败', icon: 'none', duration: 1500 })
    })
  },

  onToastClose() {
    this.setData({
      toastShow: false,
      toastMessage: '',
      toastShowUndo: false,
      lastCreatedBillId: null
    })
  },

  onToastTimeout() {
    this.setData({
      toastShow: false,
      toastMessage: '',
      toastShowUndo: false,
      lastCreatedBillId: null
    })
  },

  onVoiceText(e) {
    const { text } = e.detail
    if (text) {
      this.processManualText(text)
    }
  },

  onNeedManualInput() {
    this.setData({ showManualInput: true })
  },

  onManualInputChange(e) {
    this.setData({ manualInputText: e.detail.value })
  },

  onCloseManualInput() {
    this.setData({ showManualInput: false, manualInputText: '' })
  },

  onManualInputConfirm() {
    const text = this.data.manualInputText.trim()
    if (!text) {
      wx.showToast({ title: '请输入文字描述', icon: 'none', duration: 1500 })
      return
    }
    this.onCloseManualInput()
    this.processManualText(text)
  },

  async processManualText(text) {
    wx.showLoading({ title: 'AI 解析中...', mask: true })

    try {
      const res = await API.aiParseVoice(text)
      wx.hideLoading()

      if (!res || !res.data || res.data.length === 0) {
        wx.showToast({ title: '未能识别消费信息', icon: 'none', duration: 2000 })
        return
      }

      if (res.data.length === 1) {
        const item = res.data[0]
        if (item.needConfirm) {
          wx.showModal({
            title: '确认账单',
            content: `${item.note || '未知消费'} ¥${item.amount}\n分类：${item.category}\n置信度较低，请确认`,
            confirmText: '确认',
            cancelText: '修改',
            success: (modalRes) => {
              if (modalRes.confirm) {
                this.saveAIBill(item)
              } else {
                this.setData({
                  amount: String(item.amount),
                  selectedCategory: categories.getCategoryByKey(item.category),
                  note: item.note || ''
                })
              }
            }
          })
        } else {
          this.saveAIBill(item)
        }
      } else {
        this.handleMultipleBills(res.data)
      }
    } catch (e) {
      wx.hideLoading()
      const msg = (e && e.message) || 'AI 解析失败，请手动记账'
      wx.showToast({ title: msg, icon: 'none', duration: 2500 })
    }
  },

  handleMultipleBills(bills) {
    const itemList = bills.map((b, i) => `${i + 1}. ${b.note || '消费'} ¥${b.amount} [${b.category}]`).join('\n')
    wx.showModal({
      title: '识别到多笔记录',
      content: itemList + '\n\n确认保存所有记录？',
      confirmText: '全部保存',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          this.saveAIBills(bills)
        }
      }
    })
  },

  async saveAIBill(item) {
    const isIncome = categories.isIncomeCategory(item.category)
    const finalAmount = isIncome ? -Math.abs(item.amount) : Math.abs(item.amount)

    try {
      await API.createBill({
        amount: finalAmount,
        category: item.category,
        categoryName: categories.getCategoryName(item.category),
        date: new Date(),
        note: item.note || '',
        source: item.imageUrl ? 'image' : 'voice',
        imageUrl: item.imageUrl || '',
        aiParsed: true
      })

      this.setData({
        toastShow: true,
        toastMessage: '已记录 ✓',
        toastShowUndo: false,
        isSaving: false
      })

      this.addTimer(() => this.onToastClose(), 2000)
      this.loadSummary()
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none', duration: 2000 })
    }
  },

  async saveAIBills(bills) {
    const billData = bills.map(item => ({
      amount: categories.isIncomeCategory(item.category) ? -Math.abs(item.amount) : Math.abs(item.amount),
      category: item.category,
      categoryName: categories.getCategoryName(item.category),
      date: new Date(),
      note: item.note || '',
      source: item.imageUrl ? 'image' : 'voice',
      imageUrl: item.imageUrl || '',
      aiParsed: true
    }))

    try {
      await API.createBill(billData)
      this.setData({
        toastShow: true,
        toastMessage: `已记录 ${billData.length} 笔 ✓`,
        toastShowUndo: false,
        isSaving: false
      })
      this.addTimer(() => this.onToastClose(), 2000)
      this.loadSummary()
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none', duration: 2000 })
    }
  },

  onTakePhoto() {
    wx.showActionSheet({
      itemList: ['拍照识别', '从相册选择'],
      success: (res) => {
        const sourceType = res.tapIndex === 0 ? ['camera'] : ['album']
        this.pickAndParseImage(sourceType)
      }
    })
  },

  pickAndParseImage(sourceType) {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType,
      sizeType: ['compressed'],
      success: async (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        wx.showLoading({ title: '上传中...', mask: true })

        try {
          const uploadRes = await API.uploadImage(tempFilePath)
          const fileID = uploadRes.fileID
          wx.hideLoading()

          wx.showLoading({ title: 'AI 识别中...', mask: true })
          const parseRes = await API.aiParseImage(fileID)
          wx.hideLoading()

          if (!parseRes || !parseRes.data || parseRes.data.length === 0) {
            wx.showToast({ title: '未识别到消费信息', icon: 'none', duration: 2000 })
            return
          }

          const items = parseRes.data
          if (items.length === 1) {
            const item = items[0]
            item.imageUrl = fileID
            if (item.needConfirm) {
              wx.showModal({
                title: '确认账单',
                content: `${item.note || '未知消费'} ¥${item.amount}\n分类：${item.category}\n置信度较低，请确认`,
                confirmText: '确认',
                cancelText: '修改',
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    this.saveAIBill(item)
                  } else {
                    this.setData({
                      amount: String(item.amount),
                      selectedCategory: categories.getCategoryByKey(item.category),
                      note: item.note || ''
                    })
                  }
                }
              })
            } else {
              this.saveAIBill(item)
            }
          } else {
            this.handleMultipleBills(items.map(item => ({ ...item, imageUrl: fileID })))
          }
        } catch (e) {
          wx.hideLoading()
          wx.showToast({ title: '识别失败，请手动记账', icon: 'none', duration: 2000 })
        }
      }
    })
  },

})