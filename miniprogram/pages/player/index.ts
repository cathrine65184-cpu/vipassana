/**
 * 冥想播放器。
 * meditation.audio 为空时以本地计时模拟播放（开发/演示模式）；
 * 配置真实音频链接后自动切换为 InnerAudioContext 播放。
 * 功能：播放/暂停、±15 秒、倍速、背景音、定时停止、循环、下载、收藏。
 */
import { getMeditation, meditations, Meditation } from '../../data/meditations'
import { getState, setState, completeSession } from '../../utils/store'

function fmt(sec: number): string {
  const m = `${Math.floor(sec / 60)}`.padStart(2, '0')
  const s = `${Math.floor(sec % 60)}`.padStart(2, '0')
  return `${m}:${s}`
}

Page({
  data: {
    med: null as any as Meditation,
    playing: false,
    current: 0,
    total: 0,
    currentText: '00:00',
    totalText: '00:00',
    percent: 0,
    speed: 1,
    speeds: [0.75, 1, 1.25, 1.5],
    loop: false,
    timerOptions: [0, 5, 10, 20, 30],
    sleepTimer: 0,
    bgSounds: ['无', '雨声', '森林', '溪流'],
    bgSound: '无',
    favorite: false,
    downloaded: false,
    showPanel: '' // 'speed' | 'timer' | 'bg' | ''
  },

  ticker: 0 as any,
  audio: null as any,
  elapsedSec: 0,       // 实际收听秒数（结算冥想时长用）
  sleepDeadline: 0,

  onLoad(query: any) {
    const med = getMeditation(query.id) || meditations[0]
    const s = getState()
    wx.setNavigationBarTitle({ title: med.title })
    const total = med.minutes * 60
    const start = s.lastPlayed === med.id ? Math.min(s.lastPlayedAt, total - 1) : 0
    this.setData({
      med,
      total,
      current: start,
      totalText: fmt(total),
      currentText: fmt(start),
      percent: total ? Math.round((start / total) * 100) : 0,
      favorite: s.favorites.indexOf(med.id) >= 0,
      downloaded: s.downloads.indexOf(med.id) >= 0
    })
    setState({ lastPlayed: med.id })
    wx.setKeepScreenOn({ keepScreenOn: true })

    // 有真实音频时使用 InnerAudioContext。
    // audio 字段支持三种来源：包内路径（/assets/audio/...）、https 链接、云存储 fileID（cloud://...）
    if (med.audio) {
      if (med.audio.indexOf('cloud://') === 0 && wx.cloud) {
        wx.cloud.getTempFileURL({ fileList: [med.audio] })
          .then((res: any) => {
            const url = res.fileList && res.fileList[0] && res.fileList[0].tempFileURL
            if (url) this.initAudio(url)
          })
          .catch(() => {
            wx.showToast({ title: '音频加载失败，转为计时模式', icon: 'none' })
          })
      } else {
        this.initAudio(med.audio)
      }
    }
  },

  /** 创建真实音频播放器 */
  initAudio(src: string) {
    this.audio = wx.createInnerAudioContext()
    this.audio.src = src
    this.audio.onTimeUpdate(() => this.syncFromAudio())
    this.audio.onEnded(() => this.onComplete())
    this.audio.onError(() => {
      // 音频源异常时降级为计时模拟，不阻塞练习
      if (this.audio) { this.audio.destroy(); this.audio = null }
      wx.showToast({ title: '音频加载失败，转为计时模式', icon: 'none' })
    })
    // 若加载到的真实时长与配置不一致，以真实时长为准
    this.audio.onCanplay(() => {
      const d = Math.round(this.audio && this.audio.duration)
      if (d && d > 0 && Math.abs(d - this.data.total) > 5) {
        this.setData({ total: d, totalText: this.fmtSec(d) })
      }
    })
    // 恢复上次进度
    if (this.data.current > 0) this.audio.seek(this.data.current)
  },

  fmtSec(sec: number): string {
    const m = `${Math.floor(sec / 60)}`.padStart(2, '0')
    const s = `${Math.floor(sec % 60)}`.padStart(2, '0')
    return `${m}:${s}`
  },

  onUnload() {
    this.stopTicker()
    if (this.audio) this.audio.destroy()
    wx.setKeepScreenOn({ keepScreenOn: false })
    setState({ lastPlayedAt: this.data.current })
  },

  /* ---------- 播放控制 ---------- */

  toggle() {
    if (this.data.playing) this.pause()
    else this.play()
  },

  play() {
    this.setData({ playing: true, showPanel: '' })
    if (this.audio) {
      this.audio.playbackRate = this.data.speed
      this.audio.play()
    }
    this.startTicker()
  },

  pause() {
    this.setData({ playing: false })
    if (this.audio) this.audio.pause()
    this.stopTicker()
  },

  startTicker() {
    this.stopTicker()
    this.ticker = setInterval(() => {
      this.elapsedSec += 1
      // 模拟播放：无真实音频时按倍速推进进度
      if (!this.audio) {
        const next = this.data.current + this.data.speed
        if (next >= this.data.total) {
          this.onComplete()
          return
        }
        this.applyProgress(next)
      }
      // 定时停止
      if (this.sleepDeadline && Date.now() >= this.sleepDeadline) {
        this.pause()
        this.sleepDeadline = 0
        this.setData({ sleepTimer: 0 })
        wx.showToast({ title: '定时结束，晚安', icon: 'none' })
      }
    }, 1000)
  },

  stopTicker() {
    if (this.ticker) clearInterval(this.ticker)
    this.ticker = 0
  },

  syncFromAudio() {
    this.applyProgress(this.audio.currentTime)
  },

  applyProgress(sec: number) {
    this.setData({
      current: sec,
      currentText: fmt(sec),
      percent: this.data.total ? Math.round((sec / this.data.total) * 100) : 0
    })
  },

  onComplete() {
    // 完成一次冥想：累计分钟 + 自动打卡 + 觉察之树成长
    const minutes = Math.max(1, Math.round(this.elapsedSec / 60)) || this.data.med.minutes
    completeSession(minutes)
    this.elapsedSec = 0
    if (this.data.loop) {
      this.applyProgress(0)
      if (this.audio) this.audio.seek(0)
      return
    }
    this.pause()
    this.applyProgress(0)
    setState({ lastPlayedAt: 0 })
    wx.showToast({ title: '本次冥想已完成，已自动打卡 🌿', icon: 'none', duration: 2500 })
  },

  seekBy(e: any) {
    const delta = Number(e.currentTarget.dataset.delta)
    const next = Math.max(0, Math.min(this.data.total - 1, this.data.current + delta))
    this.applyProgress(next)
    if (this.audio) this.audio.seek(next)
  },

  onSlider(e: any) {
    const next = (e.detail.value / 100) * this.data.total
    this.applyProgress(next)
    if (this.audio) this.audio.seek(next)
  },

  /* ---------- 面板 ---------- */

  openPanel(e: any) {
    const p = e.currentTarget.dataset.panel
    this.setData({ showPanel: this.data.showPanel === p ? '' : p })
  },

  pickSpeed(e: any) {
    const speed = Number(e.currentTarget.dataset.v)
    this.setData({ speed, showPanel: '' })
    if (this.audio) this.audio.playbackRate = speed
  },

  pickTimer(e: any) {
    const v = Number(e.currentTarget.dataset.v)
    this.sleepDeadline = v ? Date.now() + v * 60 * 1000 : 0
    this.setData({ sleepTimer: v, showPanel: '' })
    if (v) wx.showToast({ title: `${v} 分钟后停止`, icon: 'none' })
  },

  pickBg(e: any) {
    // 背景音占位：接入音频资源后混播白噪音
    this.setData({ bgSound: e.currentTarget.dataset.v, showPanel: '' })
  },

  toggleLoop() {
    this.setData({ loop: !this.data.loop })
    wx.showToast({ title: this.data.loop ? '单曲循环开启' : '循环已关闭', icon: 'none' })
  },

  toggleFavorite() {
    const s = getState()
    const id = this.data.med.id
    const favorite = !this.data.favorite
    setState({ favorites: favorite ? s.favorites.concat(id) : s.favorites.filter(x => x !== id) })
    this.setData({ favorite })
    wx.showToast({ title: favorite ? '已收藏' : '已取消收藏', icon: 'none' })
  },

  download() {
    if (this.data.downloaded) {
      wx.showToast({ title: '已在下载列表', icon: 'none' })
      return
    }
    // 下载占位：接入云存储后改为 wx.downloadFile 缓存到本地
    const s = getState()
    setState({ downloads: s.downloads.concat(this.data.med.id) })
    this.setData({ downloaded: true })
    wx.showToast({ title: '已加入下载（演示）', icon: 'success' })
  },

  onShareAppMessage() {
    return {
      title: `${this.data.med.title} · 应无所住`,
      path: `/pages/player/index?id=${this.data.med.id}`,
      imageUrl: '/assets/share-cover.png'
    }
  }
})
