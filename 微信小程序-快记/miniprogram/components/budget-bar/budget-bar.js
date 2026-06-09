Component({
  properties: {
    usage: {
      type: Number,
      value: 0
    },
    budget: {
      type: Number,
      value: 100
    },
    type: {
      type: String,
      value: 'day'
    },
    showLabel: {
      type: Boolean,
      value: true
    }
  },

  data: {
    percent: 0,
    displayUsage: '0',
    remaining: 0,
    isOverBudget: false,
    barColor: 'var(--color-primary)'
  },

  observers: {
    'usage, budget'(usage, budget) {
      const budgetNum = Number(budget) || 1
      const percent = Math.min(100, Math.round((usage / budgetNum) * 100))
      const remaining = Math.max(0, budgetNum - usage)
      const isOverBudget = usage > budgetNum

      let barColor = 'var(--color-primary)'
      if (percent >= 100) {
        barColor = 'var(--color-danger)'
      } else if (percent >= 80) {
        barColor = 'var(--color-warning)'
      }

      this.setData({
        percent,
        displayUsage: String(Math.round(usage * 100) / 100),
        remaining: Math.round(remaining * 100) / 100,
        isOverBudget,
        barColor
      })
    }
  }
})