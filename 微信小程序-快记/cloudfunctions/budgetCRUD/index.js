const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

exports.main = async (event) => {
  const { action, data = {} } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  switch (action) {
    case 'list':
      return handleList(openid)
    case 'save':
      return handleSave(data, openid)
    case 'updateSubscribe':
      return handleUpdateSubscribe(data, openid)
    case 'checkUsage':
      return handleCheckUsage(openid)
    default:
      return { code: 400, message: '未知操作: ' + action }
  }
}

async function handleList(openid) {
  try {
    const res = await db.collection('budgets')
      .where({ _openid: openid })
      .get()

    return { code: 0, data: res.data || [], message: 'success' }
  } catch (e) {
    console.error('budgetCRUD list 错误:', e)
    return { code: 500, message: '查询失败', data: [] }
  }
}

async function handleSave(data, openid) {
  const { type, amount } = data

  if (!type || !['day', 'month'].includes(type)) {
    return { code: 400, message: '无效的预算类型' }
  }
  if (!amount || amount <= 0) {
    return { code: 400, message: '无效的预算金额' }
  }
  if (amount > 999999) {
    return { code: 400, message: '预算金额超出限制（最大 999999）' }
  }

  try {
    const existing = await db.collection('budgets')
      .where({ _openid: openid, type })
      .get()

    if (existing.data && existing.data.length > 0) {
      await db.collection('budgets')
        .doc(existing.data[0]._id)
        .update({ data: { amount, updateTime: new Date() } })
    } else {
      await db.collection('budgets').add({
        data: {
          _openid: openid,
          type,
          amount,
          isActive: true,
          subscribeEnabled: false,
          createTime: new Date()
        }
      })
    }

    return { code: 0, message: '保存成功' }
  } catch (e) {
    console.error('budgetCRUD save 错误:', e)
    return { code: 500, message: '保存失败' }
  }
}

async function handleUpdateSubscribe(data, openid) {
  const { type, subscribeEnabled } = data

  if (!type || !['day', 'month'].includes(type)) {
    return { code: 400, message: '无效的预算类型' }
  }

  try {
    const existing = await db.collection('budgets')
      .where({ _openid: openid, type })
      .get()

    if (existing.data && existing.data.length > 0) {
      await db.collection('budgets')
        .doc(existing.data[0]._id)
        .update({ data: { subscribeEnabled: !!subscribeEnabled, updateTime: new Date() } })
    }

    return { code: 0, message: '更新成功' }
  } catch (e) {
    console.error('budgetCRUD updateSubscribe 错误:', e)
    return { code: 500, message: '更新失败' }
  }
}

async function handleCheckUsage(openid) {
  try {
    const budgetRes = await db.collection('budgets')
      .where({ _openid: openid, isActive: true })
      .get()

    const budgets = budgetRes.data || []
    const result = {}

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
      result[budget.type] = {
        budget: budget.amount,
        usage: Math.round(totalExpense * 100) / 100,
        exceeded: totalExpense > budget.amount
      }
    }

    return { code: 0, data: result, message: 'success' }
  } catch (e) {
    console.error('budgetCRUD checkUsage 错误:', e)
    return { code: 500, message: '查询失败', data: {} }
  }
}
