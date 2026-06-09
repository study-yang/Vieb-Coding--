const fmt = require('../../utils/format.js')

Component({
  properties: {
    todayExpense: {
      type: Number,
      value: 0
    },
    monthExpense: {
      type: Number,
      value: 0
    }
  },

  data: {
    displayToday: '0.00',
    displayMonth: '0.00'
  },

  observers: {
    'todayExpense'(val) {
      this.setData({ displayToday: fmt.formatAmount(val) })
    },
    'monthExpense'(val) {
      this.setData({ displayMonth: fmt.formatAmount(val) })
    }
  }
})