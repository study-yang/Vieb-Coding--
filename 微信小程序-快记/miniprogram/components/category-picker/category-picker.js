const { EXPENSE_CATEGORIES, INCOME_CATEGORIES } = require('../../app-config.js')

Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    selectedKey: {
      type: String,
      value: ''
    },
    tab: {
      type: String,
      value: 'expense'
    }
  },

  data: {
    expenseCategories: EXPENSE_CATEGORIES,
    incomeCategories: INCOME_CATEGORIES,
    activeTab: 'expense'
  },

  lifetimes: {
    attached() {
      this.setData({ activeTab: this.properties.tab })
    }
  },

  observers: {
    'tab'(val) {
      this.setData({ activeTab: val })
    }
  },

  methods: {
    onTabChange(e) {
      const tab = e.currentTarget.dataset.tab
      this.setData({ activeTab: tab })
      this.triggerEvent('tabchange', { tab })
    },

    onCategoryTap(e) {
      const { key, name, emoji, color } = e.currentTarget.dataset
      this.triggerEvent('select', { key, name, emoji, color, type: this.data.activeTab })

      const storage = require('../../utils/storage.js')
      storage.setRecentCategory(key)
    },

    onCategoryLongPress(e) {
      const { key, name, emoji } = e.currentTarget.dataset

      wx.vibrateShort({ type: 'medium' })

      const categories = require('../../utils/categories.js')
      categories.setDefaultCategory(key)

      wx.showToast({
        title: `已设为默认：${emoji} ${name}`,
        icon: 'none',
        duration: 1500
      })

      this.triggerEvent('setdefault', { key, name, emoji })
    },

    onClose() {
      this.triggerEvent('close')
    },

    preventBubble() {
    }
  }
})