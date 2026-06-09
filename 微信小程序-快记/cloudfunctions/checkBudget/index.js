const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    const budgetRes = await db.collection('budgets')
      .where({ _openid: openid, isActive: true })
      .get()

    const budgets = budgetRes.data || []
    if (budgets.length === 0) {
      return { code: 0, data: [], message: 'success' }
    }

    const results = []
    for (const budget of budgets) {
      const now = new Date()
      let startDate, endDate

      if (budget.type === 'day') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      } else {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
      }

      const aggRes = await db.collection('bills')
        .aggregate()
        .match({
          _openid: openid,
          date: _.gte(startDate).and(_.lte(endDate)),
          amount: _.gt(0)
        })
        .group({ _id: null, total: $.sum('$amount') })
        .end()

      const totalExpense = (aggRes.data && aggRes.data.length > 0) ? aggRes.data[0].total : 0
      const usageRate = budget.amount > 0 ? totalExpense / budget.amount : 0
      const exceeded = totalExpense > budget.amount

      results.push({
        type: budget.type,
        budget: budget.amount,
        usage: Math.round(totalExpense * 100) / 100,
        usageRate: Math.round(usageRate * 100) / 100,
        exceeded
      })
    }

    return { code: 0, data: results, message: 'success' }

  } catch (e) {
    console.error('checkBudget 错误:', e)
    return { code: 500, message: '检查失败', data: [] }
  }
}
