const categoriesUtil = require('../../utils/categories.js')
const fmt = require('../../utils/format.js')

Component({
  properties: {
    bill: {
      type: Object,
      value: {}
    }
  },

  data: {
    categoryInfo: null,
    displayAmount: '',
    isIncome: false,
    displayTime: '',
    isDeleting: false,
    translateX: 0,
    startX: 0,
    startY: 0,
    animating: false,
    _ticking: false
  },

  observers: {
    'bill'(val) {
      if (!val) return
      const cat = categoriesUtil.getCategoryByKey(val.category)
      const isIncome = (val.amount || 0) < 0
      this.setData({
        categoryInfo: cat || { emoji: '📋', name: val.categoryName || '其他', color: '#94A3B8' },
        displayAmount: fmt.formatDisplayAmount(val.amount),
        isIncome,
        displayTime: fmt.formatTime(val.date || val.createTime)
      })
    }
  },

  methods: {
    onDelete() {
      wx.showModal({
        title: '确认删除',
        content: '删除后无法恢复，确定要删除这笔记录吗？',
        confirmColor: '#FF4D4F',
        success: (res) => {
          if (res.confirm) {
            this.setData({ isDeleting: true })
            this.triggerEvent('delete', { bill: this.properties.bill })
          }
        }
      })
    },

    onTouchStart(e) {
      this.setData({ startX: e.touches[0].clientX, startY: e.touches[0].clientY, animating: false })
    },

    onTouchMove(e) {
      if (this.data._ticking) return
      this.data._ticking = true
      wx.nextTick(() => {
        const dx = e.touches[0].clientX - this.data.startX
        const dy = e.touches[0].clientY - this.data.startY
        if (Math.abs(dy) > Math.abs(dx)) {
          this.data._ticking = false
          return
        }
        const maxOffset = 140
        let translateX = Math.min(0, Math.max(-maxOffset, dx))
        this.setData({ translateX }, () => {
          this.data._ticking = false
        })
      })
    },

    onTouchEnd() {
      const { translateX } = this.data
      this.setData({
        translateX: translateX < -70 ? -140 : 0,
        animating: true
      })
    }
  }
})