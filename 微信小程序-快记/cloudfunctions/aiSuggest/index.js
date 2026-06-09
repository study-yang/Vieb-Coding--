const cloud = require('wx-server-sdk')
const tcb = require('@cloudbase/node-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const app = tcb.init({ env: process.env.TCB_ENV || cloud.DYNAMIC_CURRENT_ENV })

const { checkAndIncrement } = require('./shared/rate-limiter')

function extractJson(text) {
  let cleaned = text.replace(/```(?:json)?\s*/g, '').replace(/```\s*/g, '').trim()
  const match = cleaned.match(/\{[\s\S]*\}/)
  if (!match) return null
  try {
    return JSON.parse(match[0])
  } catch (e) {
    try {
      const fixed = match[0].replace(/,\s*([}\]])/g, '$1')
      return JSON.parse(fixed)
    } catch (e2) {
      return null
    }
  }
}

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

exports.main = async (event) => {
  const { months = 3 } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  const rateCheck = await checkAndIncrement(openid)
  if (!rateCheck.allowed) {
    return { code: 429, message: rateCheck.message }
  }

  try {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - months)

    // 使用 aggregate 管道，不受单次 get 20条限制
    const aggRes = await db.collection('bills')
      .aggregate()
      .match({
        _openid: openid,
        date: _.gte(startDate).and(_.lte(endDate)),
        amount: _.gt(0)
      })
      .group({
        _id: '$category',
        name: $.first('$categoryName'),
        total: $.sum('$amount'),
        count: $.sum(1)
      })
      .sort({ total: -1 })
      .end()

    const categoryData = (aggRes.data || []).map(c => ({
      category: c._id,
      name: c.name || c._id,
      total: Math.round(c.total * 100) / 100,
      count: c.count,
      monthlyAvg: Math.round((c.total / months) * 100) / 100
    }))

    const totalExpense = categoryData.reduce((sum, c) => sum + c.total, 0)
    const categoryBreakdown = categoryData.map(c => ({
      ...c,
      percent: totalExpense > 0 ? Math.round((c.total / totalExpense) * 100) : 0
    }))

    const prompt = `你是一位务实的省钱达人，擅长给出具体可执行的省钱建议。

以下是用户近 ${months} 个月的分类消费数据：
总支出：¥${Math.round(totalExpense * 100) / 100}

${categoryBreakdown.map(c => `- ${c.name}: ¥${c.total} (${c.percent}%), 月均 ¥${c.monthlyAvg}, ${c.count}笔`).join('\n')}

请根据数据生成 3-5 条个性化的省钱建议，每条需满足：
1. 具体可执行（如"每周自带 2 次午餐"而不是"减少外卖"）
2. 包含预估节省金额（基于用户实际消费数据估算）
3. 语气亲切鼓励，像朋友给你出主意

输出 JSON 格式：
{"suggestions": [{"title": "建议标题", "content": "详细建议", "estimatedSave": 200}]}`

    const ai = app.ai()
    const model = ai.createModel('hunyuan-exp')

    const response = await model.streamText({
      model: 'hunyuan-2.0-instruct-20251111',
      messages: [{ role: 'user', content: prompt }]
    })

    let responseText = ''
    for await (const chunk of response.textStream) {
      responseText += chunk
    }

    responseText = responseText.trim()
    const parsed = extractJson(responseText)
    if (!parsed) {
      console.error('aiSuggest AI 返回非 JSON 内容:', responseText.slice(0, 200))
      return { code: 0, data: { suggestions: [], categoryBreakdown }, message: responseText }
    }
    return { code: 0, data: { suggestions: parsed.suggestions || [], categoryBreakdown }, message: '分析成功' }

  } catch (e) {
    console.error('aiSuggest 错误:', e)
    return { code: 500, message: '建议生成失败', data: { suggestions: [], categoryBreakdown: [] } }
  }
}
