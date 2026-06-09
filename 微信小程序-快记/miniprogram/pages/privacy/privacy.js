Page({
  data: {
    theme: '',
    themeClass: ''
  },

  onLoad() {
    const app = getApp()
    this.setData({
      theme: app.globalData.theme,
      themeClass: app.globalData.themeClass || ''
    })
  }
})
