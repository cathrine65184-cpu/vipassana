/**
 * AI 正念教练（功能 2）：不给建议，以提问引导觉察。
 * 当前为本地规则回复；接入大模型时改调云函数 ai（action: 'coach'）。
 */
import { coachReply, coachDisclaimer } from '../../utils/ai'

interface Msg { id: number, role: 'user' | 'coach', text: string }

Page({
  data: {
    messages: [] as Msg[],
    input: '',
    typing: false,
    disclaimer: coachDisclaimer,
    scrollInto: ''
  },

  seq: 0,

  onLoad() {
    this.push('coach', coachReply(''))
  },

  push(role: 'user' | 'coach', text: string) {
    this.seq += 1
    const messages = this.data.messages.concat({ id: this.seq, role, text })
    this.setData({ messages, scrollInto: `msg-${this.seq}` })
  },

  onInput(e: any) {
    this.setData({ input: e.detail.value })
  },

  send() {
    const text = this.data.input.trim()
    if (!text || this.data.typing) return
    this.push('user', text)
    this.setData({ input: '', typing: true })
    // 模拟思考间隔，接大模型后替换为真实调用
    setTimeout(() => {
      this.push('coach', coachReply(text))
      this.setData({ typing: false })
    }, 900)
  }
})
