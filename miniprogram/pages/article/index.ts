/**
 * 图文阅读页：渲染 data/articles.ts 中的结构化文章
 */
import { getArticle } from '../../data/articles'
import { recoveryManualBlocks } from '../../data/recovery-manual'
import { getState, setState } from '../../utils/store'

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
    if (article.premiumCourseId) {
      const state = getState()
      const unlocked = state.vip || state.purchases.indexOf(article.premiumCourseId) >= 0
      if (!unlocked) {
        wx.showModal({
          title: '购买后阅读',
          content: '这篇康复手册需解锁「新手指南 · 康复手册」后阅读。',
          confirmText: '前往解锁',
          confirmColor: '#57663F',
          success: (res: any) => {
            if (res.confirm) wx.redirectTo({ url: `/pages/course-detail/index?id=${article.premiumCourseId}` })
            else wx.navigateBack()
          }
        })
        return
      }
      article.blocks = recoveryManualBlocks
      const progress = Object.assign({}, state.courseProgress)
      const done = progress[article.premiumCourseId] || []
      if (done.indexOf('gd2') < 0) {
        progress[article.premiumCourseId] = done.concat('gd2')
        setState({ courseProgress: progress })
      }
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
