const cloud = require('wx-server-sdk')
const tcb = require('@cloudbase/node-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const app = tcb.init({ env: process.env.TCB_ENV || cloud.DYNAMIC_CURRENT_ENV })

const { checkAndIncrement } = require('./shared/rate-limiter')
const { EXPENSE_CATEGORY_NAMES } = require('./shared/categories')
const CATEGORIES = EXPENSE_CATEGORY_NAMES

function extractJsonArray(text) {
  let cleaned = text.replace(/```(?:json)?\s*/g, '').replace(/```\s*/g, '').trim()
  const match = cleaned.match(/\[[\s\S]*\]/)
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

function cleanExtract(rawText) {
  let text = rawText
    .replace(/[“”""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[\r\n]+/g, '，')
    .trim()

  return text
}

exports.main = async (event, context) => {
  const { text } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  if (!text || !text.trim()) {
    return { code: 400, message: '文本内容为空' }
  }

  const rateCheck = await checkAndIncrement(openid)
  if (!rateCheck.allowed) {
    return { code: 429, message: rateCheck.message }
  }

  try {
    const cleanedText = cleanExtract(text)

    const ai = app.ai()
    const model = ai.createModel('hunyuan-exp')

    const prompt = `你是一个专业的记账助手。用户通过语音口述了一笔或多笔消费记录，请从以下文本中提取消费信息。

文本内容："""${cleanedText}"""

请输出严格的 JSON 数组格式，每个元素包含：
- amount: 数字，消费金额（保留数字，支持中文数字如"二十五块五"转为25.5）
- category: 字符串，消费分类，必须从以下列表中选择：
  ${CATEGORIES.join('、')}
- note: 字符串，消费备注/描述
- confidence: 数字(0-1)，你对这条识别结果的置信度

如果文本中包含多条消费记录，请拆分为多个元素。
请只输出 JSON 数组，不要输出其他内容。`

    const response = await model.streamText({
      model: 'hunyuan-2.0-instruct-20251111',
      messages: [
        { role: 'user', content: prompt }
      ]
    })

    let responseText = ''
    for await (const chunk of response.textStream) {
      responseText += chunk
    }

    responseText = responseText.trim()
    const parsed = extractJsonArray(responseText)
    if (!parsed || !Array.isArray(parsed)) {
      console.error('aiParseVoice AI 返回非 JSON 数组:', responseText.slice(0, 200))
      return {
        code: 500,
        message: 'AI 返回格式错误，无法解析',
        data: []
      }
    }

    const validated = parsed.map(item => ({
      amount: parseFloat(item.amount) || 0,
      category: CATEGORIES.includes(item.category) ? item.category : '其他',
      note: item.note || '',
      confidence: Math.min(1, Math.max(0, parseFloat(item.confidence) || 0.5)),
      needConfirm: (parseFloat(item.confidence) || 0) < 0.7
    })).filter(item => item.amount > 0)

    return {
      code: 0,
      data: validated,
      message: '解析成功'
    }

  } catch (e) {
    console.error('aiParseVoice 错误:', e)
    return {
      code: 500,
      message: 'AI 解析失败：' + (e.message || '未知错误'),
      data: []
    }
  }
}