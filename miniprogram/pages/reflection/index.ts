/**
 * AI 觉察日记（功能 1）：写日记 → AI 总结情绪模式
 */
import { reflect } from '../../utils/ai'
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

  analyze() {
    const text = this.data.text.trim()
    if (text.length < 5) {
      wx.showToast({ title: '再多写两句吧', icon: 'none' })
      return
    }
    this.setData({ analyzing: true })
    // 本地情绪分析；接大模型后调云函数 ai（action: 'reflect'）
    setTimeout(() => {
      const result = reflect(text)
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
    }, 1200)
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
