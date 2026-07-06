/**
 * 设置：深色模式说明、语言、通知、反馈、关于、隐私
 */
import { getState, setState } from '../../utils/store'

Page({
  data: {
    notification: true,
    language: '简体中文'
  },

  onLoad() {
    const s: any = getState()
    if (typeof s.notification === 'boolean') this.setData({ notification: s.notification })
  },

  darkModeInfo() {
    wx.showModal({
      title: '深色模式',
      content: '应用已适配深色模式，跟随系统自动切换。\n\n在系统「设置 → 显示与亮度」中切换深浅色即可。',
      showCancel: false
    })
  },

  pickLanguage() {
    const self = this
    wx.showActionSheet({
      itemList: ['简体中文', 'English（即将上线）'],
      success(res: any) {
        if (res.tapIndex === 0) self.setData({ language: '简体中文' })
        else wx.showToast({ title: '英文版即将上线', icon: 'none' })
      }
    })
  },

  toggleNotification(e: any) {
    const on = e.detail.value
    setState({ notification: on } as any)
    this.setData({ notification: on })
    // 生产环境：wx.requestSubscribeMessage 订阅每日提醒模板消息
    wx.showToast({ title: on ? '已开启每日提醒' : '已关闭提醒', icon: 'none' })
  },

  feedback() {
    wx.showModal({
      title: '意见反馈',
      editable: true,
      placeholderText: '写下你的建议…',
      success(res: any) {
        if (res.confirm) wx.showToast({ title: '已收到，谢谢你', icon: 'success' })
      }
    })
  },

  about() {
    wx.showModal({
      title: '关于 · 应无所住',
      content: 'VIPASSANA v1.0.0\n\n内观 · 觉知 · 正念 · 自由\n\n愿你在觉知中，获得真正的自由。',
      showCancel: false
    })
  },

  privacy() {
    wx.showModal({
      title: '隐私政策',
      content: '当前版本所有练习数据仅保存在你的设备本地，不会上传。\n\n接入云开发后，将按《隐私保护指引》征得授权后同步数据。',
      showCancel: false
    })
  },

  clearData() {
    const self = this
    wx.showModal({
      title: '清除本地数据',
      content: '将清空打卡、日记、购买等所有本地记录，且无法恢复。确定吗？',
      confirmColor: '#C0392B',
      success(res: any) {
        if (res.confirm) {
          wx.clearStorageSync()
          wx.showToast({ title: '已清除', icon: 'success' })
          setTimeout(() => wx.reLaunch({ url: '/pages/home/index' }), 600)
        }
      }
    })
  }
})
