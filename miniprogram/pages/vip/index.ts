/**
 * VIP 订阅页：权益 + 三档定价
 */
import { getState, setState } from '../../utils/store'
import { requestPayment } from '../../utils/pay'

const plans = [
  { id: 'monthly', name: '月度会员', price: 38, unit: '/月', note: '随时取消', hot: false },
  { id: 'yearly', name: '年度会员', price: 298, unit: '/年', note: '折合 ¥24.8/月', hot: true },
  { id: 'lifetime', name: '终身会员', price: 648, unit: '/终身', note: '一次购买，终身安住', hot: false }
]

const benefits = [
  { icon: 'volume-o', title: '无限冥想', desc: '全部冥想音频不限次聆听' },
  { icon: 'friends-o', title: '专属社区', desc: '会员圈子，深度交流' }
]

Page({
  data: { plans, benefits, picked: 'yearly', vip: false, vipPlan: '' },

  onShow() {
    const s = getState()
    this.setData({ vip: s.vip, vipPlan: s.vipPlan })
  },

  pick(e: any) {
    this.setData({ picked: e.currentTarget.dataset.id })
  },

  subscribe() {
    const plan = plans.find(p => p.id === this.data.picked)!
    requestPayment({ title: `应无所住 · ${plan.name}`, amount: plan.price })
      .then(() => {
        setState({ vip: true, vipPlan: plan.name })
        this.setData({ vip: true, vipPlan: plan.name })
        wx.showToast({ title: '欢迎加入，愿你安住', icon: 'success' })
      })
      .catch(() => { /* 用户取消 */ })
  }
})
