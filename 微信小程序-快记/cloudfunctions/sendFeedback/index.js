const cloud = require('wx-server-sdk')
const nodemailer = require('nodemailer')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

// 反馈频率限制
const FEEDBACK_RATE_COLLECTION = 'feedback_rate_limits'
const FEEDBACK_DAILY_LIMIT = 10

async function checkAndIncrementFeedback(openid, dailyLimit = FEEDBACK_DAILY_LIMIT) {
  const _ = db.command
  const today = new Date().toISOString().slice(0, 10)
  try {
    const res = await db.collection(FEEDBACK_RATE_COLLECTION).where({ _openid: openid, date: today }).limit(1).get()
    if (!res.data || res.data.length === 0) {
      await db.collection(FEEDBACK_RATE_COLLECTION).add({ data: { _openid: openid, date: today, count: 1, lastCallAt: new Date() } })
      return { allowed: true, remaining: dailyLimit - 1 }
    }
    const rec = res.data[0]
    if (rec.count >= dailyLimit) return { allowed: false, remaining: 0 }
    await db.collection(FEEDBACK_RATE_COLLECTION).doc(rec._id).update({ data: { count: _.inc(1), lastCallAt: new Date() } })
    return { allowed: true, remaining: dailyLimit - rec.count - 1 }
  } catch (e) {
    console.error('feedback rate limiter 错误:', e)
    return { allowed: true, remaining: -1 }
  }
}

// QQ 邮箱 SMTP 配置（凭证从环境变量读取，部署时通过 config.json envVariables 注入）
const MAIL_CONFIG = {
  host: 'smtp.qq.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

exports.main = async (event) => {
  const { content, contact } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  if (!content || !content.trim()) {
    return { code: 400, message: '反馈内容不能为空' }
  }

  // 简单频率限制
  const rate = await checkAndIncrementFeedback(openid)
  if (!rate.allowed) {
    return { code: 429, message: `今日反馈次数已达上限（${FEEDBACK_DAILY_LIMIT}次），请明日再试` }
  }

  if (!MAIL_CONFIG.auth.user || !MAIL_CONFIG.auth.pass) {
    console.error('SMTP 环境变量未配置，请在云函数 config.json 中设置 SMTP_USER 和 SMTP_PASS')
    return { code: 500, message: '邮件服务配置异常，请稍后重试' }
  }

  try {
    // 1. 存入数据库
    const now = new Date()
    await db.collection('feedbacks').add({
      data: {
        _openid: openid,
        content: content.trim(),
        contact: contact || '',
        createTime: now
      }
    })

    // 2. 发送邮件
    const transporter = nodemailer.createTransport(MAIL_CONFIG)
    const mailOptions = {
      from: `"快记" <${MAIL_CONFIG.auth.user}>`,
      to: '3423913491@qq.com',
      subject: '快记 — 用户意见反馈',
      html: `
        <div style="font-family: 'PingFang SC', sans-serif; max-width:600px; margin:0 auto; padding:20px; background:#f9f9f9;">
          <div style="background:#FF6B35; color:white; padding:16px 24px; border-radius:12px 12px 0 0;">
            <h2 style="margin:0; font-size:18px;">📬 快记 — 用户意见反馈</h2>
          </div>
          <div style="background:white; padding:24px; border-radius:0 0 12px 12px;">
            <p style="color:#999; font-size:13px;">用户 ID: ${openid}</p>
            <p style="color:#999; font-size:13px;">联系方式: ${contact || '未填写'}</p>
            <hr style="border:none; border-top:1px solid #eee; margin:16px 0;">
            <p style="font-size:15px; line-height:1.8; white-space:pre-wrap;">${escapeHtml(content.trim())}</p>
            <hr style="border:none; border-top:1px solid #eee; margin:16px 0;">
            <p style="color:#999; font-size:12px;">发送时间: ${now.toLocaleString('zh-CN')}</p>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)

    return { code: 0, message: '感谢你的反馈！' }

  } catch (e) {
    console.error('sendFeedback 错误:', e)
    return { code: 500, message: '发送失败，请稍后重试' }
  }
}
