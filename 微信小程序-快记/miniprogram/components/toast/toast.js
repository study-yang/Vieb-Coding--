Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    message: {
      type: String,
      value: ''
    },
    showUndo: {
      type: Boolean,
      value: false
    },
    undoCountdown: {
      type: Number,
      value: 3
    }
  },

  data: {
    countdown: 3,
    timer: null
  },

  observers: {
    'show'(val) {
      if (val && this.properties.showUndo) {
        this.startCountdown()
      }
    }
  },

  detached() {
    this.clearTimer()
  },

  methods: {
    startCountdown() {
      this.clearTimer()
      this.setData({ countdown: this.properties.undoCountdown })

      this.data.timer = setInterval(() => {
        const countdown = this.data.countdown - 1
        if (countdown <= 0) {
          this.clearTimer()
          this.triggerEvent('timeout')
          this.setData({ countdown: 0 })
        } else {
          this.setData({ countdown })
        }
      }, 1000)
    },

    clearTimer() {
      if (this.data.timer) {
        clearInterval(this.data.timer)
        this.data.timer = null
      }
    },

    onUndo() {
      this.clearTimer()
      this.triggerEvent('undo')
    },

    onClose() {
      this.clearTimer()
      this.triggerEvent('close')
    }
  }
})