/**
 * 首页：品牌 Hero + 四大支柱 + 今日禅语 / 冥想 / 打卡
 */
import { dailyQuote, dailySentence } from '../../utils/ai'
import { getMeditation, meditations } from '../../data/meditations'
import { getState, currentStreak, weekProgress, checkedToday, checkinToday } from '../../utils/store'

const pillars = [
  {
    id: 'guan', title: '内观', en: 'Vipassana', icon: 'eye-o', cover: 'g-forest',
    desc: '看见事物的本来面目',
    items: [
      { label: '什么是内观', url: '/pages/course-detail/index?id=foundation' },
      { label: '历史与源流', url: '/pages/course-detail/index?id=foundation' },
      { label: '练习的益处', url: '/pages/course-detail/index?id=foundation' },
      { label: '新手指南', url: '/pages/course-detail/index?id=foundation' }
    ]
  },
  {
    id: 'jue', title: '觉知', en: 'Awareness', icon: 'bulb-o', cover: 'g-moss',
    desc: '与身心的运作模式相遇',
    items: [
      { label: '日常觉察', url: '/pages/coach/index' },
      { label: '觉知练习', url: '/pages/player/index?id=m2' },
      { label: '身体扫描', url: '/pages/player/index?id=m3' },
      { label: '情绪观察', url: '/pages/player/index?id=m11' }
    ]
  },
  {
    id: 'zheng', title: '正念', en: 'Mindfulness', icon: 'clock-o', cover: 'g-dew',
    desc: '把心带回此时此地',
    items: [
      { label: '正念练习', url: '/pages/player/index?id=m1' },
      { label: '呼吸冥想', url: '/pages/player/index?id=m12' },
      { label: '行走冥想', url: '/pages/player/index?id=m10' },
      { label: '饮食冥想', url: '/pages/post-detail/index?id=p2' }
    ]
  },
  {
    id: 'you', title: '自由', en: 'Freedom', icon: 'flower-o', cover: 'g-dawn',
    desc: '不执着，不抗拒',
    items: [
      { label: '生命转化', url: '/pages/course-detail/index?id=group' },
      { label: '同修故事', url: '/pages/post-detail/index?id=p4' },
      { label: '智慧卡片', url: '/pages/cards/index' },
      { label: '今日反思', url: '/pages/reflection/index' }
    ]
  }
]

Page({
  data: {
    loading: true,
    pillars,
    quote: { text: '', author: '' },
    sentence: '',
    continueItem: null as any,
    streak: 0,
    minutesToday: 0,
    totalMinutes: 0,
    checked: false,
    week: [] as any[],
    statusBar: 20
  },

  onLoad() {
    const sys = wx.getSystemInfoSync()
    this.setData({ statusBar: sys.statusBarHeight || 20 })
    this.refresh()
    // 骨架屏短暂停留，避免闪烁
    setTimeout(() => this.setData({ loading: false }), 400)
  },

  onShow() {
    const tabBar = (this as any).getTabBar && (this as any).getTabBar()
    if (tabBar) tabBar.setActive(0)
    this.refresh()
  },

  onPullDownRefresh() {
    this.refresh()
    setTimeout(() => wx.stopPullDownRefresh(), 500)
  },

  refresh() {
    const s = getState()
    const continueItem = getMeditation(s.lastPlayed) || meditations[0]
    this.setData({
      quote: dailyQuote(),
      sentence: s.dailySentence || dailySentence(),
      continueItem,
      streak: currentStreak(),
      totalMinutes: s.totalMinutes,
      checked: checkedToday(),
      week: weekProgress()
    })
  },

  goPillar(e: any) {
    wx.navigateTo({ url: e.currentTarget.dataset.url })
  },

  goContinue() {
    wx.navigateTo({ url: `/pages/player/index?id=${this.data.continueItem.id}` })
  },

  goCheckin() {
    wx.navigateTo({ url: '/pages/checkin/index' })
  },

  doCheckin() {
    if (this.data.checked) {
      this.goCheckin()
      return
    }
    const streak = checkinToday()
    this.setData({ checked: true, streak, week: weekProgress() })
    wx.showToast({ title: `已连续 ${streak} 天`, icon: 'none' })
  },

  goSilent() {
    wx.navigateTo({ url: '/pages/silent/index' })
  },

  goMeditationTab() {
    wx.switchTab({ url: '/pages/meditation/index' })
  },

  onShareAppMessage() {
    return {
      title: '应无所住 · 内观觉知正念自由',
      path: '/pages/home/index',
      imageUrl: '/assets/share-cover.png'
    }
  }
})
