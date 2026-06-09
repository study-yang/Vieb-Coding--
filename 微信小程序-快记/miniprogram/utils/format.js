function formatAmount(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '0.00'
  const absAmt = Math.abs(amount)
  const formatted = absAmt.toFixed(2)
  if (absAmt >= 10000) {
    const wan = (absAmt / 10000).toFixed(1)
    if (wan.endsWith('.0')) {
      return wan.slice(0, -2) + '万'
    }
    return wan + '万'
  }
  return formatted
}

function formatDisplayAmount(amount) {
  const sign = amount < 0 ? '+' : '-'
  return sign + '¥' + formatAmount(amount)
}

function formatDate(date) {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDateChinese(date) {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  const month = d.getMonth() + 1
  const day = d.getDate()
  return `${month}月${day}日`
}

function formatTime(date) {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

function getDayOfWeek(date) {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const d = typeof date === 'string' ? new Date(date) : date
  return days[d.getDay()]
}

function getCurrentMonth() {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1
  }
}

module.exports = {
  formatAmount,
  formatDisplayAmount,
  formatDate,
  formatDateChinese,
  formatTime,
  getDayOfWeek,
  getCurrentMonth
}