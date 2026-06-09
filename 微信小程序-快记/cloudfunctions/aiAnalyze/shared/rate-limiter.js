/**
 * AI 调用频率限制器
 * 基于 CloudBase NoSQL 数据库，按用户 + 日期追踪调用次数
 */

const cloud = require('wx-server-sdk')

const COLLECTION_NAME = 'rate_limits'
const DEFAULT_DAILY_LIMIT = 20

/**
 * 检查并记录一次 AI 调用
 * @param {string} openid - 用户 openid
 * @param {number} dailyLimit - 每日调用上限，默认 20
 * @returns {Promise<{allowed: boolean, remaining: number, message?: string}>}
 */
async function checkAndIncrement(openid, dailyLimit = DEFAULT_DAILY_LIMIT) {
  const db = cloud.database()
  const _ = db.command
  const today = new Date().toISOString().slice(0, 10) // "2024-01-15"

  try {
    // 查询今日记录
    const res = await db.collection(COLLECTION_NAME)
      .where({ _openid: openid, date: today })
      .limit(1)
      .get()

    if (res.data.length === 0) {
      // 今日首次调用，创建记录
      await db.collection(COLLECTION_NAME).add({
        data: {
          _openid: openid,
          date: today,
          count: 1,
          lastCallAt: new Date()
        }
      })
      return { allowed: true, remaining: dailyLimit - 1 }
    }

    const record = res.data[0]
    if (record.count >= dailyLimit) {
      return {
        allowed: false,
        remaining: 0,
        message: `今日 AI 调用次数已达上限（${dailyLimit}次），请明天再试`
      }
    }

    // 原子递增计数
    await db.collection(COLLECTION_NAME)
      .doc(record._id)
      .update({
        data: {
          count: _.inc(1),
          lastCallAt: new Date()
        }
      })

    return { allowed: true, remaining: dailyLimit - record.count - 1 }
  } catch (e) {
    // 限流器失败时放行，避免阻塞正常业务
    console.error('rate-limiter 错误:', e)
    return { allowed: true, remaining: -1 }
  }
}

module.exports = { checkAndIncrement, DEFAULT_DAILY_LIMIT }
