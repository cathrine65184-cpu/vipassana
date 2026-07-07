/**
 * 冥想页（设计稿版）：内嵌播放卡 + 今日打卡 + 打卡记录 + 情绪识别 + 分类列表
 */
import { categories, meditations, getMeditation } from '../../data/meditations'
import { emotions } from '../../data/emotions'
import { getState, currentStreak, checkedToday, weekProgress, dateKey } from '../../utils/store'

function fmt(sec: number): string {
  const m = `${Math.floor(sec / 60)}`.padStart(2, '0')
  const s = `${Math.floor(sec % 60)}`.padStart(2, '0')
  return `${m}:${s}`
}

Page({
  data: {
    loading: true,
    categories: ['全部'].concat(categories),
    cat: '全部',
    list: [] as any[],
    // 内嵌播放卡
    continueItem: null as any,
    curText: '00:00',
    totalText: '00:00',
    percent: 0,
    // 打卡
    emotions,
    pickedEmotion: null as any,
    recommend: null as any,
    streak: 0,
    checked: false,
    totalDays: 0,
    totalHours: 0,
    totalMinutesRemain: 0,
    week: [] as any[],
    weekBars: [] as any[]   // 近 4 周打卡次数迷你柱状
  },

  onLoad() {
    this.refresh()
    setTimeout(() => this.setData({ loading: false }), 400)
  },

  onShow() {
    const tabBar = (this as any).getTabBar && (this as any).getTabBar()
    if (tabBar) tabBar.setActive(3)
    this.refresh()
  },

  onPullDownRefresh() {
    this.refresh()
    setTimeout(() => wx.stopPullDownRefresh(), 500)
  },

  refresh() {
    const s = getState()
    const continueItem = getMeditation(s.lastPlayed) || meditations[0]
    const total = continueItem.minutes * 60
    const cur = s.lastPlayed === continueItem.id ? Math.min(s.lastPlayedAt || 0, total) : 0

    // 近 4 周打卡次数
    const weekBars: any[] = []
    for (let w = 3; w >= 0; w--) {
      let count = 0
      for (let d = 0; d < 7; d++) {
        const day = new Date()
        day.setDate(day.getDate() - w * 7 - d)
        if (s.checkins.indexOf(dateKey(day)) >= 0) count += 1
      }
      weekBars.push({ id: w, height: Math.max(8, Math.round((count / 7) * 100)) })
    }

    this.setData({
      continueItem,
      curText: fmt(cur),
      totalText: fmt(total),
      percent: total ? Math.round((cur / total) * 100) : 0,
      streak: currentStreak(),
      checked: checkedToday(),
      totalDays: s.checkins.length,
      totalHours: Math.floor(s.totalMinutes / 60),
      totalMinutesRemain: s.totalMinutes % 60,
      week: weekProgress(),
      weekBars
    })
    this.filter()
  },

  filter() {
    const cat = this.data.cat
    const list = cat === '全部' ? meditations : meditations.filter(m => m.category === cat)
    this.setData({ list })
  },

  pickCat(e: any) {
    this.setData({ cat: e.currentTarget.dataset.cat })
    this.filter()
  },

  /** 情绪识别：选择情绪 → 教练式回应 + 推荐冥想 */
  pickEmotion(e: any) {
    const id = e.currentTarget.dataset.id
    const emo = emotions.find(x => x.id === id)!
    this.setData({
      pickedEmotion: emo,
      recommend: getMeditation(emo.meditationId)
    })
  },

  /** 内嵌播放卡的一切操作都进入完整播放器 */
  openPlayer() {
    wx.navigateTo({ url: `/pages/player/index?id=${this.data.continueItem.id}` })
  },

  goPlay(e: any) {
    wx.navigateTo({ url: `/pages/player/index?id=${e.currentTarget.dataset.id}` })
  },

  goCheckin() {
    wx.navigateTo({ url: '/pages/checkin/index' })
  },

  goSilent() {
    wx.navigateTo({ url: '/pages/silent/index' })
  },

  goRetreat() {
    wx.navigateTo({ url: '/pages/retreat/index' })
  }
})
