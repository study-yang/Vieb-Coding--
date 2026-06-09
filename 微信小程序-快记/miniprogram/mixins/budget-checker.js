module.exports = Behavior({
  methods: {
    async checkDayBudget() {
      try {
        const API = require('../utils/api.js')
        const res = await API.checkBudget()
        if (res && Array.isArray(res.data)) {
          // 查找日预算
          const dayBudget = res.data.find(b => b.type === 'day')
          if (!dayBudget) return
          if (dayBudget.exceeded) {
            wx.showToast({
              title: `今日已支出 ¥${dayBudget.usage}，已超预算哦`,
              icon: 'none',
              duration: 3000
            })
          } else if (dayBudget.usageRate > 0.8) {
            wx.showToast({
              title: `今日已支出 ¥${dayBudget.usage}，距离预算还差 ¥${dayBudget.budget - dayBudget.usage} 哦`,
              icon: 'none',
              duration: 2500
            })
          }
        }
      } catch (e) {
        console.warn('预算检查失败', e)
      }
    }
  }
})