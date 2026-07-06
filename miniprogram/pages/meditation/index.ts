/**
 * 冥想页：推荐 + 情绪识别（AI 功能 3）+ 分类 + 每日打卡
 */
import { categories, meditations, getMeditation } from '../../data/meditations'
import { emotions } from '../../data/emotions'
import { getState, currentStreak, checkedToday, weekProgress } from '../../utils/store'

Page({
  data: {
    loading: true,
    categories: ['全部'].concat(categories),
    cat: '全部',
    list: [] as any[],
    continueItem: null as any,
    emotions,
    pickedEmotion: null as any,
    recommend: null as any,
    streak: 0,
    checked: false,
    totalMinutes: 0,
    week: [] as any[]
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
    this.setData({
      continueItem: getMeditation(s.lastPlayed) || meditations[0],
      streak: currentStreak(),
      checked: checkedToday(),
      totalMinutes: s.totalMinutes,
      week: weekProgress()
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
