/**
 * 禅修营模式（功能 8）：模拟十日内观禅修营。
 * 结构化日程 + 禁语提醒 + 纯本地数据（离线可用）。
 */
import { retreatDays, retreatSchedule } from '../../data/retreat'
import { getState, setState, dateKey } from '../../utils/store'

Page({
  data: {
    days: retreatDays,
    schedule: retreatSchedule,
    currentDay: 0,          // 0 = 未开始
    startDate: '',
    silenceOn: true,
    expanded: 0             // 展开的日卡
  },

  onShow() {
    this.sync()
  },

  sync() {
    const s = getState()
    let day = s.retreatDay
    // 按开始日期自动推进天数
    if (day > 0 && s.retreatStartDate) {
      const start = new Date(s.retreatStartDate)
      const diff = Math.floor((Date.now() - start.getTime()) / 86400000) + 1
      day = Math.min(10, Math.max(1, diff))
      if (day !== s.retreatDay) setState({ retreatDay: day })
    }
    this.setData({
      currentDay: day,
      startDate: s.retreatStartDate,
      expanded: day > 0 ? day : 1
    })
  },

  start() {
    const self = this
    wx.showModal({
      title: '开始十日禅修营',
      content: '接下来的十天，建议：\n· 每天完成日程中的静坐\n· 尽量保持禁语\n· 减少手机使用\n\n准备好了吗？',
      confirmText: '开始',
      success(res: any) {
        if (res.confirm) {
          setState({ retreatDay: 1, retreatStartDate: dateKey() })
          self.sync()
          wx.showToast({ title: '第 1 天，安顿身心', icon: 'none' })
        }
      }
    })
  },

  quit() {
    const self = this
    wx.showModal({
      title: '结束禅修营？',
      content: '进度将被清除。任何时候都可以重新开始。',
      confirmColor: '#C0392B',
      success(res: any) {
        if (res.confirm) {
          setState({ retreatDay: 0, retreatStartDate: '' })
          self.sync()
        }
      }
    })
  },

  toggleSilence(e: any) {
    this.setData({ silenceOn: e.detail.value })
    // 生产环境：结合 wx.requestSubscribeMessage 定时推送禁语提醒
    wx.showToast({ title: e.detail.value ? '禁语提醒已开启' : '禁语提醒已关闭', icon: 'none' })
  },

  expand(e: any) {
    const day = Number(e.currentTarget.dataset.day)
    this.setData({ expanded: this.data.expanded === day ? 0 : day })
  },

  goSilent() {
    wx.navigateTo({ url: '/pages/silent/index' })
  }
})
