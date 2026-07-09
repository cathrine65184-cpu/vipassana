/**
 * 图文阅读页：渲染 data/articles.ts 中的结构化文章
 */
import { getArticle } from '../../data/articles'

Page({
  data: {
    article: null as any
  },

  onLoad(query: any) {
    const article = getArticle(query.id)
    if (!article) {
      wx.showToast({ title: '文章不存在', icon: 'none' })
      wx.navigateBack()
      return
    }
    wx.setNavigationBarTitle({ title: article.title })
    this.setData({ article })
  },

  onShareAppMessage() {
    const a = this.data.article
    return {
      title: `${a.title} · 应无所住`,
      path: `/pages/article/index?id=${a.id}`,
      imageUrl: '/assets/share-cover.png'
    }
  }
})
