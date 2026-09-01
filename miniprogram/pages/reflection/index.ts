/**
 * AI 觉察日记（功能 1）：写日记 → AI 总结情绪模式
 */
import { reflectWithAI } from '../../utils/ai'
import { getState, setState, dateKey } from '../../utils/store'

Page({
  data: {
    text: '',
    analyzing: false,
    result: null as any,
    history: [] as any[]
  },

  onShow() {
    this.setData({ history: getState().journal })
  },

  onInput(e: any) {
    this.setData({ text: e.detail.value })
  },

  async analyze() {
    const text = this.data.text.trim()
    if (text.length < 5) {
      wx.showToast({ title: '再多写两句吧', icon: 'none' })
      return
    }
    this.setData({ analyzing: true })
    try {
      const result = await reflectWithAI(text)
      const s = getState()
      const entry = {
        id: `j-${Date.now()}`,
        date: dateKey(),
        text,
        summary: result.summary,
        emotions: result.emotions
      }
      setState({ journal: [entry].concat(s.journal), treePoints: s.treePoints + 2 })
      this.setData({ analyzing: false, result, text: '', history: getState().journal })
      if (result.crisis) {
        wx.showModal({
          title: '请优先照顾安全',
          content: '如果你正处于伤害自己或他人的危险中，请立即联系当地急救、可信任的人或专业心理援助。AI 不能处理紧急情况。',
          showCancel: false,
          confirmColor: '#57663F'
        })
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'AI 小结生成失败'
      this.setData({ analyzing: false })
      wx.showModal({
        title: '暂时无法生成 AI 小结',
        content: `${message}\n\n你的文字仍保留在输入框中，请稍后重试。`,
        showCancel: false,
        confirmColor: '#57663F'
      })
    }
  },

  removeEntry(e: any) {
    const id = e.currentTarget.dataset.id
    const self = this
    wx.showModal({
      title: '删除这篇日记？',
      confirmColor: '#C0392B',
      success(res: any) {
        if (res.confirm) {
          const s = getState()
          setState({ journal: s.journal.filter(j => j.id !== id) })
          self.setData({ history: getState().journal })
        }
      }
    })
  }
})
