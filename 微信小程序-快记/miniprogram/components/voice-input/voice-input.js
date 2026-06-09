Component({
  properties: {
    disabled: {
      type: Boolean,
      value: false
    }
  },

  data: {
    state: 'idle', // idle | recording | processing
    recordText: '',
    duration: 0,
    manager: null,
    pluginReady: false,
    timer: null,
    silentTimer: null,
    lastRecognized: '',
    silentCount: 0
  },

  lifetimes: {
    attached() {
      this.initRecognition()
    },
    detached() {
      this.stopTimer()
      this.stopSilentCheck()
      if (this.data.manager) {
        try { this.data.manager.stop() } catch (e) { /* ignore */ }
      }
    }
  },

  methods: {
    initRecognition() {
      try {
        const plugin = requirePlugin('WechatSI')
        const manager = plugin.getRecordRecognitionManager()
        this.data.manager = manager
        this.data.lastRecognized = ''

        manager.onStart = () => {
          // 录音已开始
        }

        manager.onStop = (res) => {
          const result = res && res.result
          if (result && result.trim()) {
            this.triggerEvent('voiceText', { text: result.trim() })
            wx.showToast({ title: '语音识别成功', icon: 'success', duration: 1000 })
          } else {
            wx.showToast({ title: '未识别到语音', icon: 'none', duration: 1500 })
          }
          this.setStateIdle()
        }

        manager.onRecognize = (res) => {
          const result = res && res.result
          if (result && result.trim()) {
            this.setData({ recordText: result.trim() })
            // 检测是否连续 3 秒没有说话（文本没变化）
            if (result.trim() === this.data.lastRecognized) {
              this.data.silentCount++
            } else {
              this.data.silentCount = 0
              this.data.lastRecognized = result.trim()
            }
            // 如果已识别到有效文字且连续 2 秒无变化，提前结束
            if (this.data.silentCount >= 2 && result.trim().length > 3) {
              this.stopRecognition()
            }
          }
        }

        manager.onError = (res) => {
          this.setStateIdle()
          if (!res) return

          if (res.retcode === -30001 || (res.msg && res.msg.includes('auth'))) {
            this.showAuthModal()
          } else if (res.retcode === -30004 || res.retcode === -30006) {
            this.triggerEvent('needManualInput', {})
            wx.showToast({ title: '录音失败，请手动输入', icon: 'none', duration: 2000 })
          } else if (res.retcode === -30005) {
            wx.showToast({ title: '语音识别超时', icon: 'none', duration: 1500 })
          } else {
            wx.showToast({ title: '语音识别失败，请重试', icon: 'none', duration: 1500 })
          }
        }
        this.setData({ pluginReady: true })
      } catch (e) {
        console.error('语音插件初始化失败:', e)
        this.setData({ pluginReady: false })
        wx.showToast({ title: '语音功能加载失败，请手动输入', icon: 'none', duration: 2500 })
      }
    },

    // === 交互 ===

    async onMicTap() {
      if (this.properties.disabled) return
      if (this.data.state !== 'idle') return

      if (!this.data.pluginReady) {
        this.triggerEvent('needManualInput', {})
        wx.showToast({ title: '语音功能不可用，请手动输入', icon: 'none', duration: 2000 })
        return
      }

      // 检查权限
      const authed = await this.checkPermission()
      if (!authed) return

      this.startRecognition()
    },

    onStopTap() {
      this.stopRecognition()
    },

    // === 录音控制 ===

    async startRecognition() {
      this.setData({
        state: 'recording',
        recordText: '',
        duration: 0,
        lastRecognized: '',
        silentCount: 0
      })

      wx.vibrateShort({ type: 'light' }).catch(() => {})

      this.startTimer()

      if (this.data.manager) {
        try {
          this.data.manager.start({ duration: 15000, lang: 'zh_CN' })
        } catch (e) {
          console.error('录音启动失败:', e)
          wx.showToast({ title: '启动录音失败', icon: 'none' })
          this.setStateIdle()
        }
      }
    },

    stopRecognition() {
      if (this.data.manager) {
        try {
          this.data.manager.stop()
        } catch (e) {
          console.error('停止录音失败:', e)
          this.setStateIdle()
        }
      }
    },

    setStateIdle() {
      this.stopTimer()
      this.setData({
        state: 'idle',
        recordText: '',
        duration: 0
      })
    },

    setStateProcessing() {
      this.stopTimer()
      this.setData({ state: 'processing' })
    },

    // === 权限 ===

    async checkPermission() {
      try {
        const settingRes = await wx.getSetting({})
        const recordAuth = settingRes.authSetting['scope.record']

        if (recordAuth === false) {
          this.showAuthModal()
          return false
        }

        if (recordAuth === undefined) {
          try {
            await wx.authorize({ scope: 'scope.record' })
          } catch (e) {
            this.showAuthModal()
            return false
          }
        }

        return true
      } catch (e) {
        console.error('权限检查失败:', e)
        return false
      }
    },

    showAuthModal() {
      wx.showModal({
        title: '需要录音权限',
        content: '请在设置中开启麦克风权限，用于语音记账',
        confirmText: '去设置',
        success: (modalRes) => {
          if (modalRes.confirm) wx.openSetting()
        }
      })
    },

    // === 计时器 ===

    startTimer() {
      this.stopTimer()
      this.data.timer = setInterval(() => {
        const dur = this.data.duration + 1
        this.setData({ duration: dur })
        if (dur >= 15) {
          // 超时自动结束
          wx.showToast({ title: '录音已结束', icon: 'none', duration: 1000 })
          this.stopRecognition()
        }
      }, 1000)
    },

    stopTimer() {
      if (this.data.timer) {
        clearInterval(this.data.timer)
        this.data.timer = null
      }
    },

    stopSilentCheck() {
      this.data.silentCount = 0
      this.data.lastRecognized = ''
    }
  }
})
