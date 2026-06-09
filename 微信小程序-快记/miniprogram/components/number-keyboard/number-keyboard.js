Component({
  properties: {
    value: {
      type: String,
      value: ''
    },
    maxLength: {
      type: Number,
      value: 9
    },
    maxDecimal: {
      type: Number,
      value: 2
    }
  },

  data: {
    keys: [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['backspace', '0', '.']
    ]
  },

  methods: {
    onKeyTap(e) {
      const key = e.currentTarget.dataset.key
      const { value, maxLength, maxDecimal } = this.data

      switch (key) {
        case 'backspace':
          this.handleBackspace(value)
          break
        case '.':
          this.handleDot(value, maxDecimal)
          break
        default:
          this.handleNumber(key, value, maxLength, maxDecimal)
          break
      }
    },

    handleBackspace(value) {
      if (value.length > 0) {
        this.triggerEvent('change', { value: value.slice(0, -1) })
      }
    },

    handleDot(value, maxDecimal) {
      if (value.includes('.')) return
      if (maxDecimal === 0) return
      const newVal = value === '' || value === '-' ? '0.' : value + '.'
      this.triggerEvent('change', { value: newVal })
    },

    handleNumber(key, value, maxLength, maxDecimal) {
      if (key === '0' && (value === '0' || value === '')) return

      const parts = value.split('.')
      if (parts.length === 2 && parts[1].length >= maxDecimal) return

      const displayLen = value.replace(/[.-]/g, '').length
      if (displayLen >= maxLength) return

      let newVal = value + key
      if (parts.length === 2 && parts[0] === '' && key !== '0') {
        newVal = '0' + newVal
      }
      if (value === '0' && key !== '.') {
        newVal = key
      }

      this.triggerEvent('change', { value: newVal })
    }
  }
})
