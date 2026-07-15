/**
 * 首页：照片 Hero（设计稿同款）+ 四支柱速览 + 禅语轮播 + 今日冥想 / 打卡
 */
import { dailyQuote, dailySentence } from '../../utils/ai'
import { getMeditation, meditations } from '../../data/meditations'
import { quotes } from '../../data/quotes'
import { img } from '../../data/images'
import { getState, currentStreak, weekProgress, checkedToday, checkinToday } from '../../utils/store'

// 四大支柱：Hero 中的圆形速览按钮 + 下方详情卡共用
const pillars = [
  {
    id: 'guan', title: '内观', en: 'Vipassana', icon: 'aim', cover: 'g-forest',
    desc: '看见事物的本来面目',
    items: [
      { label: '什么是内观', url: '/pages/course-detail/index?id=foundation' },
      { label: '历史与源流', url: '/pages/article/index?id=history' },
      { label: '练习的益处', url: '/pages/article/index?id=benefits' },
      { label: '新手指南', url: '/pages/course-detail/index?id=guide' }
    ]
  },
  {
    id: 'jue', title: '觉知', en: 'Awareness', icon: 'eye-o', cover: 'g-moss',
    desc: '与身心的运作模式相遇',
    items: [
      { label: '日常觉察', url: '/pages/coach/index' },
      { label: '觉知练习', url: '/pages/player/index?id=m2' },
      { label: '正念练习', url: '/pages/player/index?id=m1' },
      { label: '情绪观察', url: '/pages/player/index?id=m11' }
    ]
  },
  {
    id: 'you', title: '自由', en: 'Freedom', icon: 'flower-o', cover: 'g-dawn',
    desc: '不执着，不抗拒',
    items: [
      // 「生命转化」内容方向待共创，暂为筹备中占位
      { label: '生命转化', url: '' },
      { label: '同修故事', url: '/pages/post-detail/index?id=p4' },
      { label: '智慧卡片', url: '/pages/cards/index' },
      { label: '今日反思', url: '/pages/reflection/index' }
    ]
  }
]

Page({
  data: {
    loading: true,
    heroImg: img.heroForest,
    pillars,
    heroQuotes: [] as any[],   // 禅语轮播（含每日一句）
    quoteIndex: 0,
    continueItem: null as any,
    streak: 0,
    totalMinutes: 0,
    checked: false,
    week: [] as any[],
    statusBar: 20
  },

  onLoad() {
    const sys = wx.getSystemInfoSync()
    this.setData({ statusBar: sys.statusBarHeight || 20 })
    this.refresh()
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
    // 轮播三页：今日禅语 + 相邻两条，配合设计稿的三个圆点
    const dq = dailyQuote()
    const base = quotes.indexOf(dq)
    const heroQuotes = [dq, quotes[(base + 1) % quotes.length], quotes[(base + 2) % quotes.length]]
      .map(q => ({ text: q.text, author: q.author }))
    heroQuotes[0] = { text: s.dailySentence || dailySentence(), author: '每日一句' }

    this.setData({
      heroQuotes,
      continueItem,
      streak: currentStreak(),
      totalMinutes: s.totalMinutes,
      checked: checkedToday(),
      week: weekProgress()
    })
  },

  onQuoteSwipe(e: any) {
    this.setData({ quoteIndex: e.detail.current })
  },

  /** Hero 圆形按钮：平滑滚动到对应支柱卡 */
  scrollToPillar(e: any) {
    wx.pageScrollTo({ selector: `#pillar-${e.currentTarget.dataset.id}`, duration: 400, offsetTop: -20 })
  },

  goPillar(e: any) {
    const url = e.currentTarget.dataset.url
    if (!url) {
      wx.showModal({
        title: '生命转化',
        content: '这个板块正在筹备中——\n打算收录转化故事、阶段回顾与长期练习地图。\n欢迎一起头脑风暴 🌿',
        showCancel: false,
        confirmText: '期待'
      })
      return
    }
    wx.navigateTo({ url })
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
