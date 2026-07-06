/**
 * 我的：用户信息、等级、会员、内容入口、设置
 */
import { getState, setState, level, currentStreak } from '../../utils/store'
import { courses } from '../../data/courses'
import { meditations } from '../../data/meditations'

Page({
  data: {
    nickname: '',
    vip: false,
    vipPlan: '',
    levelInfo: { name: '', next: '', progress: 0 },
    streak: 0,
    totalMinutes: 0,
    purchasedCount: 0,
    favoriteCount: 0,
    downloadCount: 0,
    postCount: 0,
    grid: [] as any[]
  },

  onShow() {
    const tabBar = (this as any).getTabBar && (this as any).getTabBar()
    if (tabBar) tabBar.setActive(4)
    this.refresh()
  },

  refresh() {
    const s = getState()
    this.setData({
      nickname: s.nickname,
      vip: s.vip,
      vipPlan: s.vipPlan,
      levelInfo: level(),
      streak: currentStreak(),
      totalMinutes: s.totalMinutes,
      purchasedCount: s.purchases.length,
      favoriteCount: s.favorites.length + s.bookmarks.length,
      downloadCount: s.downloads.length,
      postCount: s.myPosts.length
    })
  },

  /** 登录占位：接入 wx.getUserProfile + 云函数 login 换取 openid */
  editNickname() {
    const self = this
    wx.showModal({
      title: '修改昵称',
      editable: true,
      placeholderText: this.data.nickname,
      success(res: any) {
        if (res.confirm && res.content) {
          setState({ nickname: res.content.trim() })
          self.refresh()
        }
      }
    })
  },

  goVip() { wx.navigateTo({ url: '/pages/vip/index' }) },
  goSettings() { wx.navigateTo({ url: '/pages/settings/index' }) },
  goCheckin() { wx.navigateTo({ url: '/pages/checkin/index' }) },
  goTree() { wx.navigateTo({ url: '/pages/tree/index' }) },
  goReflection() { wx.navigateTo({ url: '/pages/reflection/index' }) },
  goCoach() { wx.navigateTo({ url: '/pages/coach/index' }) },
  goCards() { wx.navigateTo({ url: '/pages/cards/index' }) },

  showPurchased() {
    const s = getState()
    const names = courses.filter(c => s.purchases.indexOf(c.id) >= 0).map(c => c.title)
    wx.showModal({
      title: '已购课程',
      content: names.length ? names.join('\n') : '还没有已购课程',
      showCancel: false
    })
  },

  showFavorites() {
    const s = getState()
    const names = meditations.filter(m => s.favorites.indexOf(m.id) >= 0).map(m => m.title)
    wx.showModal({
      title: '我的收藏',
      content: names.length ? names.join('\n') : '还没有收藏内容',
      showCancel: false
    })
  },

  showDownloads() {
    const s = getState()
    const names = meditations.filter(m => s.downloads.indexOf(m.id) >= 0).map(m => m.title)
    wx.showModal({
      title: '下载管理',
      content: names.length ? `${names.join('\n')}\n\n（演示模式，接入云存储后管理本地缓存）` : '还没有下载内容',
      showCancel: false
    })
  },

  goMyPosts() {
    wx.switchTab({ url: '/pages/community/index' })
  }
})
