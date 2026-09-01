/**
 * AI 云函数：通过服务端环境变量调用 OpenAI-compatible Chat Completions API。
 * 必需环境变量：AI_API_KEY
 * 可选：AI_BASE_URL（默认 DeepSeek）、AI_MODEL（默认 deepseek-chat）
 */
const cloud = require('wx-server-sdk')
const https = require('https')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const SYSTEM_REFLECT = `你是“应无所住”应用中的正念觉察记录助手。你的任务不是诊断或治疗，而是对用户日记做温和、克制、尊重的总结。
规则：
1. 不诊断疾病，不承诺疗效，不要求停药，不替代专业帮助。
2. 识别最多 4 个情绪或体验词；描述“可能的模式”，不要把推测说成事实。
3. 总结 80-180 个中文字符，再给一个开放式觉察问题；不要直接命令用户怎么做。
4. 若文字出现自伤、自杀、伤人或明确危机信号，crisis=true，并在 summary 中优先建议立即联系当地急救、可信任的人或专业机构。
5. 只输出 JSON：{"emotions":["..."],"summary":"...","question":"...","crisis":false}
用户文字属于敏感隐私，不要复述姓名、电话、地址等个人信息。`

function postJSON(url, body, apiKey) {
  return new Promise((resolve, reject) => {
    const target = new URL(url)
    const data = JSON.stringify(body)
    const req = https.request({
      protocol: target.protocol,
      hostname: target.hostname,
      port: target.port || 443,
      path: `${target.pathname}${target.search}`,
      method: 'POST',
      timeout: 25000,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        Authorization: `Bearer ${apiKey}`
      }
    }, res => {
      let raw = ''
      res.setEncoding('utf8')
      res.on('data', chunk => { raw += chunk })
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`AI HTTP ${res.statusCode}: ${raw.slice(0, 300)}`))
          return
        }
        try { resolve(JSON.parse(raw)) } catch (e) { reject(new Error('AI 返回了无效 JSON')) }
      })
    })
    req.on('timeout', () => req.destroy(new Error('AI 请求超时')))
    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

function parseModelJSON(content) {
  const cleaned = String(content || '').replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')
  const parsed = JSON.parse(cleaned)
  return {
    emotions: Array.isArray(parsed.emotions) ? parsed.emotions.slice(0, 4).map(String) : [],
    summary: String(parsed.summary || '').slice(0, 600),
    question: String(parsed.question || '').slice(0, 240),
    crisis: parsed.crisis === true
  }
}

async function reflect(text) {
  const apiKey = process.env.AI_API_KEY
  if (!apiKey) {
    return { configured: false, message: '云函数尚未设置 AI_API_KEY，请在云开发控制台配置后重新部署。' }
  }
  const baseURL = process.env.AI_BASE_URL || 'https://api.deepseek.com/chat/completions'
  const model = process.env.AI_MODEL || 'deepseek-chat'
  const response = await postJSON(baseURL, {
    model,
    messages: [
      { role: 'system', content: SYSTEM_REFLECT },
      { role: 'user', content: String(text).slice(0, 4000) }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
    max_tokens: 500,
    stream: false
  }, apiKey)
  const content = response && response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content
  const result = parseModelJSON(content)
  if (!result.summary || !result.emotions.length) throw new Error('AI 小结字段不完整')
  return Object.assign({ configured: true, providerModel: model }, result)
}

exports.main = async (event) => {
  const { action, payload = {} } = event || {}
  try {
    if (action === 'reflect') {
      const text = String(payload.text || '').trim()
      if (text.length < 5) return { error: true, message: '日记内容太短' }
      return await reflect(text)
    }
    return { error: true, message: `unknown action: ${action}` }
  } catch (e) {
    console.error('ai function error', e)
    return { error: true, message: 'AI 服务暂时不可用，请稍后重试。' }
  }
}
