/**
 * 智慧卡片（功能 6）：左右滑动的正念卡片
 */
import { wisdomCards } from '../../data/cards'

Page({
  data: {
    cards: wisdomCards,
    current: 0
  },

  onSwiper(e: any) {
    this.setData({ current: e.detail.current })
  },

  save() {
    // 生成分享图占位：可用 canvas 绘制卡片后 wx.saveImageToPhotosAlbum
    wx.showToast({ title: '已收藏这句话（演示）', icon: 'success' })
  },

  onShareAppMessage() {
    const card = this.data.cards[this.data.current]
    return {
      title: card.text.replace(/\n/g, ''),
      path: '/pages/cards/index',
      imageUrl: '/assets/share-cover.png'
    }
  }
})
