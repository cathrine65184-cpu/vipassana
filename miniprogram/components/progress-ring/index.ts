/**
 * 进度环组件（Canvas 2D）
 * 用于打卡进度 / 冥想等级等场景。
 */
Component({
  properties: {
    /** 0 ~ 1 */
    progress: { type: Number, value: 0, observer: 'draw' },
    size: { type: Number, value: 160 },       // rpx
    stroke: { type: Number, value: 12 },      // rpx
    color: { type: String, value: '#B99A5B' },
    track: { type: String, value: 'rgba(32,50,40,0.08)' }
  },

  data: { px: 80 },

  lifetimes: {
    ready(this: any) {
      this.draw()
    }
  },

  methods: {
    draw(this: any) {
      const query = this.createSelectorQuery()
      query.select('#ring').fields({ node: true, size: true }).exec((res: any[]) => {
        if (!res || !res[0]) return
        const canvas = res[0].node
        const width = res[0].width
        const height = res[0].height
        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = width * dpr
        canvas.height = height * dpr
        const ctx = canvas.getContext('2d')
        ctx.scale(dpr, dpr)
        ctx.clearRect(0, 0, width, height)

        const cx = width / 2
        const cy = height / 2
        const lw = (this.data.stroke / 750) * wx.getSystemInfoSync().windowWidth
        const r = Math.min(cx, cy) - lw / 2 - 1

        // 轨道
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = this.data.track
        ctx.lineWidth = lw
        ctx.stroke()

        // 进度
        const p = Math.max(0, Math.min(1, this.data.progress))
        if (p > 0) {
          ctx.beginPath()
          ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p)
          ctx.strokeStyle = this.data.color
          ctx.lineWidth = lw
          ctx.lineCap = 'round'
          ctx.stroke()
        }
      })
    }
  }
})
