/**
 * 社区：瀑布流 + 搜索 + 话题标签 + 热度/最新/精华
 */
import { posts as seedPosts, hotTags } from '../../data/posts'
import { getState } from '../../utils/store'

Page({
  data: {
    loading: true,
    tabs: ['推荐', '最新', '精华', '我的圈子'],
    tab: 0,
    keyword: '',
    tag: '',
    hotTags,
    left: [] as any[],   // 瀑布流左列
    right: [] as any[]   // 瀑布流右列
  },

  onLoad() {
    this.refresh()
    setTimeout(() => this.setData({ loading: false }), 400)
  },

  onShow() {
    const tabBar = (this as any).getTabBar && (this as any).getTabBar()
    if (tabBar) tabBar.setActive(2)
    this.refresh()
  },

  onPullDownRefresh() {
    this.refresh()
    setTimeout(() => wx.stopPullDownRefresh(), 500)
  },

  /** 合并种子帖与用户发布的帖子，按当前筛选条件分列 */
  refresh() {
    const s = getState()
    const mine = s.myPosts.map(p => ({
      id: p.id, author: s.nickname, avatarBg: 'g-gold', time: p.time,
      title: p.title, excerpt: p.content.slice(0, 40), cover: p.cover,
      tags: p.tags, likes: 0, comments: [], mine: true
    }))
    let list: any[] = mine.concat(seedPosts as any[])

    const { tab, keyword, tag } = this.data
    if (tab === 1) { /* 最新：保持现有顺序（种子数据即按时间倒序） */ }
    if (tab === 2) list = list.filter(p => p.essence)
    if (tab === 3) list = list.filter(p => p.mine || s.following.indexOf(p.author) >= 0)
    if (tab === 0) list = list.slice().sort((a, b) => (b.likes || 0) - (a.likes || 0)) // 热度排序
    if (tag) list = list.filter(p => p.tags.indexOf(tag) >= 0)
    if (keyword) {
      const k = keyword.trim()
      list = list.filter(p => p.title.indexOf(k) >= 0 || p.excerpt.indexOf(k) >= 0 || p.author.indexOf(k) >= 0)
    }

    // 瀑布流：交替分配左右列
    const left: any[] = []
    const right: any[] = []
    list.forEach((p, i) => (i % 2 === 0 ? left : right).push(p))
    this.setData({ left, right })
  },

  onSearch(e: any) {
    this.setData({ keyword: e.detail.value })
    this.refresh()
  },

  switchTab(e: any) {
    this.setData({ tab: Number(e.currentTarget.dataset.index), tag: '' })
    this.refresh()
  },

  toggleTag(e: any) {
    const tag = e.currentTarget.dataset.tag
    this.setData({ tag: this.data.tag === tag ? '' : tag })
    this.refresh()
  },

  goDetail(e: any) {
    const { id, mine } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/post-detail/index?id=${id}${mine ? '&mine=1' : ''}` })
  },

  goCreate() {
    wx.navigateTo({ url: '/pages/post-create/index' })
  }
})
