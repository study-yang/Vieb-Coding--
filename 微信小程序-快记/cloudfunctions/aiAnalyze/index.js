const cloud = require('wx-server-sdk')
const tcb = require('@cloudbase/node-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const app = tcb.init({ env: process.env.TCB_ENV || cloud.DYNAMIC_CURRENT_ENV })

const { checkAndIncrement } = require('./shared/rate-limiter')

function extractJson(text) {
  // 去除 markdown 代码围栏
  let cleaned = text.replace(/```(?:json)?\s*/g, '').replace(/```\s*/g, '').trim()
  const match = cleaned.match(/\{[\s\S]*\}/)
  if (!match) return null
  try {
    return JSON.parse(match[0])
  } catch (e) {
    // 尝试修复常见 JSON 问题（尾部逗号）
    try {
      const fixed = match[0].replace(/,\s*([}\]])/g, '$1')
      return JSON.parse(fixed)
    } catch (e2) {
      return null
    }
  }
}

exports.main = async (event) => {
  const { period, statsData } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  if (!statsData) {
    return { code: 400, message: '缺少统计数据' }
  }

  const rateCheck = await checkAndIncrement(openid)
  if (!rateCheck.allowed) {
    return { code: 429, message: rateCheck.message }
  }

  try {
    const statsStr = JSON.stringify(statsData, null, 2)

    const prompt = `你是一位温暖贴心的个人理财助手，风格像朋友聊天一样自然亲切。

以下是用户近期的消费数据：

${statsStr}

请生成一份消费分析报告，包含：
1. 总体评价（一句话概括，鼓励性语气）
2. 分类占比分析（指出占比最高的 2-3 个分类）
3. 超支预警（如有异常增长，友好提醒）
4. 鼓励与建议（正面的消费习惯肯定 + 1-2 条改善建议）

语言要求：
- 口语化、亲切，使用 emoji 点缀
- 避免冷冰冰的数据罗列，要用对话的语气
- 即使消费偏高也要先肯定再建议，不要批评

请输出 JSON 格式：
{"report": "完整报告文本", "highlights": ["要点1", "要点2"], "warning": "预警内容或null"}`

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
      console.error('AI 返回非 JSON 内容:', responseText.slice(0, 200))
      return { code: 500, message: 'AI 返回格式错误', data: { report: responseText, highlights: [], warning: null } }
    }
    return { code: 0, data: parsed, message: '分析成功' }

  } catch (e) {
    console.error('aiAnalyze 错误:', e)
    return { code: 500, message: '分析失败：' + (e.message || '未知错误'), data: { report: '分析暂时不可用，请稍后再试', highlights: [], warning: null } }
  }
}