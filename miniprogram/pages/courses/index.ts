/**
 * 课程页：四大学习路径（数据源于课程 PDF）
 */
import { courses } from '../../data/courses'
import { getState } from '../../utils/store'

Page({
  data: {
    loading: true,
    list: [] as any[]
  },

  onLoad() {
    this.refresh()
    setTimeout(() => this.setData({ loading: false }), 400)
  },

  onShow() {
    const tabBar = (this as any).getTabBar && (this as any).getTabBar()
    if (tabBar) tabBar.setActive(1)
    this.refresh()
  },

  onPullDownRefresh() {
    this.refresh()
    setTimeout(() => wx.stopPullDownRefresh(), 500)
  },

  refresh() {
    const s = getState()
    const list = courses.map(c => {
      const done = (s.courseProgress[c.id] || []).length
      return Object.assign({}, c, {
        unlocked: s.purchases.indexOf(c.id) >= 0 || s.vip,
        progress: c.chapters.length ? Math.round((done / c.chapters.length) * 100) : 0
      })
    })
    this.setData({ list })
  },

  goDetail(e: any) {
    wx.navigateTo({ url: `/pages/course-detail/index?id=${e.currentTarget.dataset.id}` })
  },

  goVip() {
    wx.navigateTo({ url: '/pages/vip/index' })
  }
})
