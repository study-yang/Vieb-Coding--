const cloud = require('wx-server-sdk')
const https = require('https')
const crypto = require('crypto')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

// 简单的绑定手机号频率限制（每日上限）
const BIND_COLLECTION = 'bind_phone_attempts'
const BIND_DAILY_LIMIT = 3

async function checkAndIncrementBind(openid, dailyLimit = BIND_DAILY_LIMIT) {
  const _ = db.command
  const today = new Date().toISOString().slice(0, 10)
  try {
    const res = await db.collection(BIND_COLLECTION)
      .where({ _openid: openid, date: today })
      .limit(1)
      .get()

    if (!res.data || res.data.length === 0) {
      await db.collection(BIND_COLLECTION).add({ data: { _openid: openid, date: today, count: 1, lastCallAt: new Date() } })
      return { allowed: true, remaining: dailyLimit - 1 }
    }

    const rec = res.data[0]
    if (rec.count >= dailyLimit) {
      return { allowed: false, remaining: 0 }
    }

    await db.collection(BIND_COLLECTION).doc(rec._id).update({ data: { count: _.inc(1), lastCallAt: new Date() } })
    return { allowed: true, remaining: dailyLimit - rec.count - 1 }
  } catch (e) {
    console.error('bind rate limiter 错误:', e)
    return { allowed: true, remaining: -1 }
  }
}

// access_token 缓存
let cachedToken = null
let tokenExpireAt = 0

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpireAt) {
    return cachedToken
  }

  const appid = process.env.APPID
  const appsecret = process.env.APPSECRET
  if (!appid || !appsecret) {
    throw new Error('APPID/APPSECRET 环境变量未配置')
  }

  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`
  const data = await httpGet(url)
  const parsed = JSON.parse(data)

  if (!parsed.access_token) {
    // 避免在日志中打印完整响应以防泄露敏感信息
    throw new Error('获取 access_token 失败: ' + (parsed.errmsg || 'no_access_token_returned'))
  }

  cachedToken = parsed.access_token
  tokenExpireAt = Date.now() + (parsed.expires_in - 300) * 1000 // 提前 5 分钟刷新
  return cachedToken
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(data))
    }).on('error', reject)
  })
}

function httpPost(url, body) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body)
    const urlObj = new URL(url)
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) }
    }
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(data))
    })
    req.on('error', reject)
    req.write(postData)
    req.end()
  })
}

exports.main = async (event) => {
  const { action, data = {} } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  switch (action) {
    case 'get':
      return handleGet(openid)
    case 'update':
      return handleUpdate(data, openid)
    case 'bindPhone':
      return handleBindPhone(data, openid)
    default:
      return { code: 400, message: '未知操作: ' + action }
  }
}

async function handleGet(openid) {
  try {
    const res = await db.collection('users')
      .where({ _openid: openid })
      .get()

    if (res.data && res.data.length > 0) {
      const user = res.data[0]
      return {
        code: 0,
        data: {
          _id: user._id,
          nickName: user.nickName || '',
          avatarUrl: user.avatarUrl || '',
          phone: user.phone || '',
          createTime: user.createTime
        }
      }
    }

    const now = new Date()
    const createRes = await db.collection('users').add({
      data: {
        _openid: openid,
        nickName: '',
        avatarUrl: '',
        createTime: now,
        updateTime: now
      }
    })

    return {
      code: 0,
      data: {
        _id: createRes._id,
        nickName: '',
        avatarUrl: '',
        createTime: now
      }
    }
  } catch (e) {
    console.error('getUserProfile get 错误:', e)
    return { code: 500, message: '获取用户信息失败' }
  }
}

async function handleUpdate(data, openid) {
  const updateData = { updateTime: new Date() }
  if (data.nickName !== undefined) {
    if (typeof data.nickName !== 'string' || data.nickName.length > 50) {
      return { code: 400, message: '昵称长度不能超过 50 个字符' }
    }
    updateData.nickName = data.nickName
  }
  if (data.avatarUrl !== undefined) {
    if (typeof data.avatarUrl !== 'string' || data.avatarUrl.length > 500) {
      return { code: 400, message: '头像地址格式无效' }
    }
    updateData.avatarUrl = data.avatarUrl
  }

  try {
    await db.collection('users')
      .where({ _openid: openid })
      .update({ data: updateData })

    return { code: 0, message: '更新成功' }
  } catch (e) {
    console.error('getUserProfile update 错误:', e)
    return { code: 500, message: '更新用户信息失败' }
  }
}

async function handleBindPhone(data, openid) {
  const { code } = data

  if (!code) {
    return { code: 400, message: '缺少手机号授权 code' }
  }
  // 使用简单限流，防止刷绑
  const rate = await checkAndIncrementBind(openid)
  if (!rate.allowed) {
    return { code: 429, message: `今日绑定手机号次数已达上限（${BIND_DAILY_LIMIT}次），请明日再试` }
  }

  // 检查环境配置
  const appid = process.env.APPID
  const appsecret = process.env.APPSECRET
  if (!appid || !appsecret) {
    console.error('APPID/APPSECRET 未配置')
    return { code: 500, message: '服务器未配置小程序凭证，请联系管理员在云函数环境变量中设置 APPID 和 APPSECRET' }
  }

    try {
      // If front-end provided encryptedData + iv + js_code, prefer decrypting locally via session_key
      if (!code && data.encryptedData && data.iv && data.js_code) {
        const js_code = data.js_code
        // 1. code2session to get session_key
        const appid = process.env.APPID
        const appsecret = process.env.APPSECRET
        const sessionUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appsecret}&js_code=${js_code}&grant_type=authorization_code`
        const sessionRes = await httpGet(sessionUrl)
        const sessionObj = JSON.parse(sessionRes)
        if (!sessionObj.session_key) {
          console.error('code2session failed:', sessionObj.errmsg || sessionRes)
          return { code: 500, message: '获取登录会话失败' }
        }
        const sessionKey = sessionObj.session_key
        const phoneNumber = decryptPhoneData(data.encryptedData, data.iv, sessionKey)
        if (!phoneNumber) {
          return { code: 500, message: '解密手机号失败' }
        }
        // proceed with phoneNumber below

        // assign to variable used by later logic
        data._resolvedPhoneNumber = phoneNumber
      } else {
        // 1. 获取 access_token
        const accessToken = await getAccessToken()

        // 2. 用 code 换取手机号
        const phoneUrl = `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${accessToken}`
        const phoneRes = await httpPost(phoneUrl, { code })
        const phoneData = JSON.parse(phoneRes)

        if (phoneData.errcode !== 0) {
          console.error('获取手机号失败: errcode=', phoneData.errcode, 'errmsg=', phoneData.errmsg)
          return { code: 500, message: '获取手机号失败: ' + (phoneData.errmsg || '未知错误') }
        }

        const phoneInfo = phoneData.phone_info
        if (!phoneInfo || !phoneInfo.phoneNumber) {
          return { code: 500, message: '未获取到手机号' }
        }

        data._resolvedPhoneNumber = phoneInfo.phoneNumber
      }

    const phoneNumber = data._resolvedPhoneNumber

    // 3. 检查是否有旧设备的用户已绑定此手机号（换机场景）
    const existingRes = await db.collection('users')
      .where({ phone: phoneNumber, _openid: db.command.neq(openid) })
      .get()

    if (existingRes.data && existingRes.data.length > 0) {
      // 旧设备用户存在，将数据关联到当前 OPENID
      const oldUser = existingRes.data[0]
      const oldOpenid = oldUser._openid
      // 迁移旧用户的数据为分批处理，避免单次大规模更新超时
      const collections = ['bills', 'budgets', 'feedbacks']
      for (const col of collections) {
        try {
          // 分页读取并按文档更新 _openid
          while (true) {
            const res = await db.collection(col).where({ _openid: oldOpenid }).limit(500).get()
            if (!res.data || res.data.length === 0) break
            const updates = res.data.map(d => db.collection(col).doc(d._id).update({ data: { _openid: openid } }))
            await Promise.all(updates)
            // 下一轮继续，直至全部迁移
          }
        } catch (e) {
          console.warn(`迁移 ${col} 数据失败:`, e && e.message ? e.message : e)
        }
      }

      // 删除旧用户文档（当前用户的文档会在下面更新）
      try {
        await db.collection('users').doc(oldUser._id).remove()
      } catch (e) {
        console.warn('删除旧用户文档失败:', e && e.message ? e.message : e)
      }
    }

    // 4. 更新当前用户的手机号
    await db.collection('users')
      .where({ _openid: openid })
      .update({ data: { phone: phoneNumber, updateTime: new Date() } })

    return {
      code: 0,
      data: { phone: phoneNumber },
      message: '绑定成功'
    }

  } catch (e) {
    console.error('bindPhone 错误:', e)
    return { code: 500, message: '绑定失败: ' + (e.message || '未知错误') }
  }
}

function decryptPhoneData(encryptedData, iv, sessionKey) {
  try {
    const sessionKeyBuf = Buffer.from(sessionKey, 'base64')
    const encryptedDataBuf = Buffer.from(encryptedData, 'base64')
    const ivBuf = Buffer.from(iv, 'base64')
    const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKeyBuf, ivBuf)
    decipher.setAutoPadding(true)
    let decoded = decipher.update(encryptedDataBuf, null, 'utf8')
    decoded += decipher.final('utf8')
    const dataObj = JSON.parse(decoded)
    return dataObj && (dataObj.phoneNumber || dataObj.purePhoneNumber) || null
  } catch (e) {
    console.error('decryptPhoneData 错误:', e && e.message ? e.message : e)
    return null
  }
}
