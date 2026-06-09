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
    case 'create':
      return handleCreate(data, openid)
    case 'update':
      return handleUpdate(data, openid)
    case 'delete':
      return handleDelete(data, openid)
    case 'query':
      return handleQuery(data, openid)
    case 'exportAll':
      return handleExportAll(openid)
    default:
      return { code: 400, message: '未知操作: ' + action }
  }
}

async function handleCreate(data, openid) {
  const { bills = [] } = data

  if (!Array.isArray(bills)) {
    return { code: 400, message: '账单数据格式错误' }
  }

  if (!bills.length) {
    return { code: 400, message: '缺少账单数据' }
  }

  const now = new Date()
  const records = bills.map(bill => {
    const parsedDate = bill.date ? new Date(bill.date) : now
    if (bill.date && isNaN(parsedDate.getTime())) {
      throw new Error('日期格式无效: ' + bill.date)
    }
    return {
      _openid: openid,
      amount: bill.amount || 0,
      category: bill.category || 'other',
      categoryName: bill.categoryName || '其他',
      date: parsedDate,
      note: bill.note || '',
      source: bill.source || 'manual',
      imageUrl: bill.imageUrl || '',
      aiParsed: bill.aiParsed || false,
      createTime: now
    }
  })

  try {
    if (records.length === 1) {
      const res = await db.collection('bills').add({ data: records[0] })
      return { code: 0, data: { _id: res._id }, message: '创建成功' }
    } else {
      const insertPromises = records.map(record => db.collection('bills').add({ data: record }))
      const results = await Promise.all(insertPromises)
      return { code: 0, data: { ids: results.map(r => r._id) }, message: `已创建 ${records.length} 条记录` }
    }
  } catch (e) {
    console.error('create bills 错误:', e)
    return { code: 500, message: '创建失败' }
  }
}

async function handleUpdate(data, openid) {
  const { _id, ...updates } = data

  if (!_id) return { code: 400, message: '缺少记录 ID' }

  const updateData = {}
  if (updates.amount !== undefined) updateData.amount = updates.amount
  if (updates.category !== undefined) updateData.category = updates.category
  if (updates.categoryName !== undefined) updateData.categoryName = updates.categoryName
  if (updates.note !== undefined) updateData.note = updates.note
  if (updates.date !== undefined) updateData.date = new Date(updates.date)

  try {
    await db.collection('bills')
      .where({ _id, _openid: openid })
      .update({ data: updateData })
    return { code: 0, message: '更新成功' }
  } catch (e) {
    console.error('update bill 错误:', e)
    return { code: 500, message: '更新失败' }
  }
}

async function handleDelete(data, openid) {
  const { _id } = data

  if (!_id) return { code: 400, message: '缺少记录 ID' }

  try {
    const doc = await db.collection('bills').where({ _id, _openid: openid }).get()
    if (!doc.data || doc.data.length === 0) {
      return { code: 404, message: '记录不存在' }
    }

    await db.collection('bills')
      .where({ _id, _openid: openid })
      .remove()

    const imageUrl = doc.data[0].imageUrl
    if (imageUrl) {
      try {
        await cloud.deleteFile({ fileList: [imageUrl] })
      } catch (e) {
        console.warn('删除关联图片失败:', e.message)
      }
    }

    return { code: 0, message: '删除成功' }
  } catch (e) {
    console.error('delete bill 错误:', e)
    return { code: 500, message: '删除失败' }
  }
}

async function handleQuery(data, openid) {
  const { month, date, category, page = 1, pageSize = 20 } = data

  const condition = { _openid: openid }

  if (date) {
    // 按日查询：date 格式 YYYY-MM-DD
    const parts = date.split('-')
    if (parts.length !== 3) {
      return { code: 400, message: '日期格式无效，应为 YYYY-MM-DD' }
    }
    const [year, mon, day] = parts.map(Number)
    if (isNaN(year) || isNaN(mon) || isNaN(day) || mon < 1 || mon > 12 || day < 1 || day > 31) {
      return { code: 400, message: '日期值无效' }
    }
    const startDate = new Date(year, mon - 1, day, 0, 0, 0)
    const endDate = new Date(year, mon - 1, day, 23, 59, 59)
    condition.date = _.gte(startDate).and(_.lte(endDate))
  } else if (month) {
    // 按月查询：month 格式 YYYY-MM
    const parts = month.split('-')
    if (parts.length !== 2) {
      return { code: 400, message: '月份格式无效，应为 YYYY-MM' }
    }
    const [year, mon] = parts.map(Number)
    if (isNaN(year) || isNaN(mon) || mon < 1 || mon > 12) {
      return { code: 400, message: '月份值无效' }
    }
    const startDate = new Date(year, mon - 1, 1)
    const endDate = new Date(year, mon, 0, 23, 59, 59)
    condition.date = _.gte(startDate).and(_.lte(endDate))
  }

  if (category) {
    condition.category = category
  }

  try {
    const skip = (page - 1) * pageSize

    const totalRes = await db.collection('bills').where(condition).count()
    const total = totalRes.total

    const listRes = await db.collection('bills')
      .where(condition)
      .orderBy('date', 'desc')
      .orderBy('createTime', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()

    const bills = listRes.data || []

    let totalExpense = 0
    let totalIncome = 0
    try {
      const aggRes = await db.collection('bills')
        .aggregate()
        .match(condition)
        .group({
          _id: null,
          totalExpense: $.sum($.cond([$.lt(['$amount', 0]), 0, '$amount'])),
          totalIncome: $.sum($.cond([$.lt(['$amount', 0]), $.abs('$amount'), 0]))
        })
        .end()
      if (aggRes.data && aggRes.data.length > 0) {
        totalExpense = aggRes.data[0].totalExpense || 0
        totalIncome = aggRes.data[0].totalIncome || 0
      }
    } catch (e) {
      console.error('aggregate totals error:', e)
      throw e
    }

    return {
      code: 0,
      data: {
        list: bills,
        total,
        page,
        pageSize,
        totalExpense: Math.round(totalExpense * 100) / 100,
        totalIncome: Math.round(totalIncome * 100) / 100
      },
      message: '查询成功'
    }
  } catch (e) {
    console.error('query bills 错误:', e)
    return { code: 500, message: '查询失败', data: { list: [], total: 0 } }
  }
}

async function handleExportAll(openid) {
  try {
    const maxBatch = 10000
    const countRes = await db.collection('bills').where({ _openid: openid }).count()
    const total = countRes.total

    if (total === 0) {
      return { code: 0, data: { bills: [], total: 0 }, message: '暂无账单数据' }
    }

    const billsRes = await db.collection('bills')
      .where({ _openid: openid })
      .orderBy('date', 'desc')
      .orderBy('createTime', 'desc')
      .limit(maxBatch)
      .get()

    const bills = (billsRes.data || []).map(b => ({
      _id: b._id,
      amount: b.amount,
      category: b.category,
      categoryName: b.categoryName,
      note: b.note || '',
      date: b.date ? b.date.toISOString().slice(0, 10) : '',
      time: b.date ? b.date.toISOString().slice(11, 19) : '',
      source: b.source || 'manual',
      createTime: b.createTime ? b.createTime.toISOString() : ''
    }))

    return { code: 0, data: { bills, total }, message: '导出成功' }
  } catch (e) {
    console.error('exportAll bills 错误:', e)
    return { code: 500, message: '导出失败' }
  }
}