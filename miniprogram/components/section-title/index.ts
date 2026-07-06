/**
 * 区块标题：左侧标题 + 可选"更多"入口。
 */
Component({
  properties: {
    title: { type: String, value: '' },
    sub: { type: String, value: '' },
    more: { type: String, value: '' },     // 更多文案，空则不显示
    url: { type: String, value: '' }
  },
  methods: {
    onMore(this: any) {
      if (this.data.url) wx.navigateTo({ url: this.data.url })
      this.triggerEvent('more')
    }
  }
})
