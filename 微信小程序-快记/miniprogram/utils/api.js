const API = {
  call(name, data = {}, options = {}) {
    return wx.cloud.callFunction({
      name,
      data,
      ...options
    }).then(res => {
      const result = res.result || {}
      if (result.code !== 0 && result.code !== undefined) {
        return Promise.reject(result)
      }
      return result
    }).catch(err => {
      const msg = (err && err.message) || '操作失败'
      const isTimeout = (err && err.errCode === -1) || msg.includes('timeout') || msg.includes('超时')
      const isBusinessError = err && err.code !== undefined

      console.error(`云函数 [${name}] 调用失败:`, err)

      // 业务错误（如 429 限流）由调用方处理，不在这里弹 toast
      if (!isTimeout && !isBusinessError) {
        wx.showToast({
          title: msg || '操作失败，请重试',
          icon: 'none',
          duration: 2000
        })
      }
      return Promise.reject(err)
    })
  },

  createBill(billData) {
    return this.call('billCRUD', {
      action: 'create',
      data: { bills: Array.isArray(billData) ? billData : [billData] }
    })
  },

  updateBill(billData) {
    return this.call('billCRUD', {
      action: 'update',
      data: billData
    })
  },

  deleteBill(billId) {
    return this.call('billCRUD', {
      action: 'delete',
      data: { _id: billId }
    })
  },

  queryBills(params = {}) {
    return this.call('billCRUD', {
      action: 'query',
      data: params
    })
  },

  getStatistics(params = {}) {
    return this.call('getStatistics', params)
  },

  aiParseVoice(text) {
    return this.call('aiParseVoice', { text })
  },

  aiParseImage(fileID) {
    return this.call('aiParseImage', { fileID })
  },

  aiAnalyze(period, statsData) {
    return this.call('aiAnalyze', { period, statsData })
  },

  aiSuggest(months = 3) {
    return this.call('aiSuggest', { months })
  },

  checkBudget(userId) {
    return this.call('checkBudget', { manualUserId: userId })
  },

  uploadImage(filePath) {
    const timestamp = Date.now()
    const random = Math.random().toString(36).slice(2, 10)
    const cloudPath = `bills/${timestamp}-${random}.jpg`
    return wx.cloud.uploadFile({
      cloudPath,
      filePath
    })
  },

  getUserProfile() {
    return this.call('getUserProfile', { action: 'get' })
  },

  updateUserProfile(data) {
    return this.call('getUserProfile', { action: 'update', data })
  },

  exportAllBills() {
    return this.call('billCRUD', { action: 'exportAll' })
  },

  sendFeedback(content, contact) {
    return this.call('sendFeedback', { content, contact })
  }
}

module.exports = API