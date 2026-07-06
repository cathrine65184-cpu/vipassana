/**
 * 云函数：ai
 * AI 能力路由——前端 utils/ai.ts 的云端替换版。
 * 接入大模型（如 Claude API / 混元 / 文心）后，把对应 action 的 TODO 替换为真实调用。
 *
 * 调用方式：
 *   wx.cloud.callFunction({ name: 'ai', data: { action: 'coach', payload: { text } } })
 */
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const { action, payload = {} } = event

  switch (action) {
    case 'coach': {
      // TODO: 调用大模型，系统提示词要求：
      // 「你是一位正念陪伴者。永远不要给直接建议，只用温柔的开放式提问引导用户觉察当下。」
      return { reply: '（云端 AI 占位）如果给此刻的感受一个名字，你会叫它什么？' }
    }

    case 'reflect': {
      // TODO: 让大模型总结 payload.text 的情绪模式，返回 { emotions: string[], summary: string }
      return {
        emotions: ['平静'],
        summary: '（云端 AI 占位）觉察本身，就是改变的开始。'
      }
    }

    case 'dailySentence': {
      // TODO: 每日定时触发器生成一句正念句子，写入 daily 集合
      return { sentence: '今天，允许一切如其所是。' }
    }

    default:
      return { error: `unknown action: ${action}` }
  }
}
