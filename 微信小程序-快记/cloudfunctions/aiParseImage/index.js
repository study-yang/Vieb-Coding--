const cloud = require('wx-server-sdk')
const tcb = require('@cloudbase/node-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const app = tcb.init({ env: process.env.TCB_ENV || cloud.DYNAMIC_CURRENT_ENV })

const { checkAndIncrement } = require('./shared/rate-limiter')
const { EXPENSE_CATEGORY_NAMES } = require('./shared/categories')
const CATEGORIES = EXPENSE_CATEGORY_NAMES

exports.main = async (event) => {
  const { fileID } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  if (!fileID) {
    return { code: 400, message: '缺少图片 fileID' }
  }

  if (!openid) {
    return { code: 401, message: '未获取到用户身份' }
  }

  const rateCheck = await checkAndIncrement(openid)
  if (!rateCheck.allowed) {
    return { code: 429, message: rateCheck.message }
  }

  try {
    const tempRes = await cloud.getTempFileURL({
      fileList: [fileID]
    })
    const fileList = tempRes.fileList || []
    if (fileList.length === 0 || !fileList[0].tempFileURL) {
      return { code: 400, message: '无法获取图片访问链接，fileID 可能无效' }
    }
    const imageUrl = fileList[0].tempFileURL

    const ai = app.ai()
    const model = ai.createModel('hunyuan-exp')

    const prompt = `你是一个专业的票据识别助手。请分析这张图片中的消费信息。

请提取以下信息，输出严格的 JSON 数组格式：
- amount: 数字，消费总金额（若有多项合并为一个总额）
- category: 字符串，从以下分类中选择最匹配的：
  ${CATEGORIES.join('、')}
- note: 字符串，消费内容简述
- date: 字符串（YYYY-MM-DD），票据上的日期，若无则留空
- confidence: 数字(0-1)，识别置信度

如果无法识别任何消费信息，请输出：{"error": "无法识别", "confidence": 0}

请只输出 JSON，不要输出其他内容。`

    const response = await model.streamText({
      model: 'hunyuan-2.0-instruct-20251111',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        }
      ]
    })

    let responseText = ''
    for await (const chunk of response.textStream) {
      responseText += chunk
    }

    responseText = responseText.trim()
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { code: 500, message: 'AI 返回格式错误', data: [] }
    }

    let parsed = JSON.parse(jsonMatch[0])
    if (parsed.error) {
      return { code: 0, data: [], message: parsed.error }
    }

    if (!Array.isArray(parsed)) {
      parsed = [parsed]
    }

    const validated = parsed.map(item => ({
      amount: parseFloat(item.amount) || 0,
      category: CATEGORIES.includes(item.category) ? item.category : '其他',
      note: item.note || '',
      date: item.date || '',
      confidence: Math.min(1, Math.max(0, parseFloat(item.confidence) || 0.5)),
      needConfirm: (parseFloat(item.confidence) || 0) < 0.7
    })).filter(item => item.amount > 0)

    return { code: 0, data: validated, message: '解析成功' }

  } catch (e) {
    console.error('aiParseImage 错误:', e)
    return { code: 500, message: '图片解析失败：' + (e.message || '未知错误'), data: [] }
  }
}