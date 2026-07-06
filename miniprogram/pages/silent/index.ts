/**
 * 静默模式（功能 7）：只有呼吸动画与计时的无干扰界面。
 * 呼吸节奏：4 秒吸气 · 4 秒呼气（CSS 动画 8s 循环）。
 */
import { completeSession } from '../../utils/store'

function fmt(sec: number): string {
  const m = `${Math.floor(sec / 60)}`.padStart(2, '0')
  const s = `${sec % 60}`.padStart(2, '0')
  return `${m}:${s}`
}

Page({
  data: {
    running: false,
    durations: [5, 10, 15, 20, 30],
    picked: 10,
    remain: 0,
    remainText: '10:00',
    phase: '准备',
    statusBar: 20
  },

  ticker: 0 as any,
  phaseTicker: 0 as any,

  onLoad() {
    const sys = wx.getSystemInfoSync()
    this.setData({ statusBar: sys.statusBarHeight || 20, remainText: fmt(this.data.picked * 60) })
  },

  onUnload() {
    this.stop(false)
  },

  pick(e: any) {
    if (this.data.running) return
    const v = Number(e.currentTarget.dataset.v)
    this.setData({ picked: v, remainText: fmt(v * 60) })
  },

  start() {
    if (this.data.running) {
      this.stop(true)
      return
    }
    const total = this.data.picked * 60
    this.setData({ running: true, remain: total, remainText: fmt(total), phase: '吸气' })
    wx.setKeepScreenOn({ keepScreenOn: true })

    // 呼吸相位提示：与 8 秒 CSS 动画同步
    let inhale = true
    this.phaseTicker = setInterval(() => {
      inhale = !inhale
      this.setData({ phase: inhale ? '吸气' : '呼气' })
    }, 4000)

    this.ticker = setInterval(() => {
      const remain = this.data.remain - 1
      if (remain <= 0) {
        this.finish()
        return
      }
      this.setData({ remain, remainText: fmt(remain) })
    }, 1000)
  },

  finish() {
    completeSession(this.data.picked)
    this.stop(false)
    wx.showToast({ title: '静坐完成，已计入打卡 🌿', icon: 'none', duration: 2500 })
  },

  stop(toast: boolean) {
    if (this.ticker) clearInterval(this.ticker)
    if (this.phaseTicker) clearInterval(this.phaseTicker)
    this.ticker = 0
    this.phaseTicker = 0
    wx.setKeepScreenOn({ keepScreenOn: false })
    this.setData({ running: false, phase: '准备', remainText: fmt(this.data.picked * 60) })
    if (toast) wx.showToast({ title: '已结束', icon: 'none' })
  },

  exit() {
    wx.navigateBack()
  }
})
