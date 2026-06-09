const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const _ = db.command
const MAX_LIMIT = 100

exports.main = async (event) => {
  const { period = 'month', startDate, endDate } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  if (!openid) {
    return { code: 401, message: '未获取到用户身份', data: { totalExpense: 0, totalIncome: 0, todayExpense: 0, todayIncome: 0, categoryBreakdown: [], dailySummary: [] } }
  }

  let rangeStart, rangeEnd
  const now = new Date()

  if (period === 'week') {
    const dayOfWeek = now.getDay() || 7
    rangeStart = new Date(now)
    rangeStart.setDate(now.getDate() - dayOfWeek + 1)
    rangeStart.setHours(0, 0, 0, 0)
    rangeEnd = new Date(rangeStart)
    rangeEnd.setDate(rangeStart.getDate() + 6)
    rangeEnd.setHours(23, 59, 59)
  } else if (period === 'lastMonth') {
    rangeStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    rangeEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
  } else if (period === 'custom' && startDate && endDate) {
    rangeStart = new Date(startDate)
    rangeEnd = new Date(endDate)
  } else {
    rangeStart = new Date(now.getFullYear(), now.getMonth(), 1)
    rangeEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
  }

  try {
    // 改用 where + js 聚合，避免 aggregate match 的 _.gte/_.lte 兼容问题
    const allRes = await db.collection('bills')
      .where({ _openid: openid, date: _.gte(rangeStart).and(_.lte(rangeEnd)) })
      .orderBy('date', 'desc')
      .limit(MAX_LIMIT)
      .get()

    const bills = allRes.data || []

    // JS 层聚合
    let totalExpense = 0
    let totalIncome = 0
    const categoryMap = {}
    const dailyMap = {}

    const todayKey = now.toISOString().slice(0, 10)
    let todayExpense = 0
    let todayIncome = 0

    for (const bill of bills) {
      const amount = bill.amount || 0
      if (amount > 0) {
        totalExpense += amount
      } else {
        totalIncome += Math.abs(amount)
      }

      // 分类汇总（仅支出）
      if (amount > 0) {
        const cat = bill.category || 'other'
        if (!categoryMap[cat]) {
          categoryMap[cat] = { category: cat, name: bill.categoryName || cat, total: 0, count: 0 }
        }
        categoryMap[cat].total += amount
        categoryMap[cat].count += 1
      }

      // 日期汇总
      const dateStr = bill.date instanceof Date
        ? bill.date.toISOString().slice(0, 10)
        : new Date(bill.date).toISOString().slice(0, 10)
      if (!dailyMap[dateStr]) {
        dailyMap[dateStr] = { date: dateStr, expense: 0, income: 0 }
      }
      if (amount > 0) {
        dailyMap[dateStr].expense += amount
      } else {
        dailyMap[dateStr].income += Math.abs(amount)
      }

      // 今日数据
      if (dateStr === todayKey) {
        if (amount > 0) {
          todayExpense += amount
        } else {
          todayIncome += Math.abs(amount)
        }
      }
    }

    // 分类占比
    const categoryBreakdown = Object.values(categoryMap)
      .sort((a, b) => b.total - a.total)
      .map(c => ({
        category: c.category,
        name: c.name,
        total: Math.round(c.total * 100) / 100,
        count: c.count,
        percent: totalExpense > 0 ? Math.round((c.total / totalExpense) * 100) : 0
      }))

    // 日期汇总
    const dailySummary = Object.values(dailyMap)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(d => ({
        date: d.date,
        expense: Math.round(d.expense * 100) / 100,
        income: Math.round(d.income * 100) / 100
      }))

    return {
      code: 0,
      data: {
        totalExpense: Math.round(totalExpense * 100) / 100,
        totalIncome: Math.round(totalIncome * 100) / 100,
        todayExpense: Math.round(todayExpense * 100) / 100,
        todayIncome: Math.round(todayIncome * 100) / 100,
        categoryBreakdown,
        dailySummary
      },
      message: 'success'
    }

  } catch (e) {
    console.error('getStatistics 错误:', e)
    return { code: 500, message: '查询失败：' + (e.message || '未知错误'), data: { totalExpense: 0, totalIncome: 0, categoryBreakdown: [], dailySummary: [] } }
  }
}
