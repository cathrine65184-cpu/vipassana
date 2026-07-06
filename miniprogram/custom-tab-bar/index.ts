/**
 * 自定义 TabBar：悬浮圆角胶囊，呼应设计稿。
 */
Component({
  data: {
    active: 0,
    list: [
      { path: '/pages/home/index', icon: 'wap-home-o', iconActive: 'wap-home', text: '首页' },
      { path: '/pages/courses/index', icon: 'bookmark-o', iconActive: 'bookmark', text: '课程' },
      { path: '/pages/community/index', icon: 'smile-comment-o', iconActive: 'smile-comment', text: '社区' },
      { path: '/pages/meditation/index', icon: 'volume-o', iconActive: 'volume', text: '冥想' },
      { path: '/pages/profile/index', icon: 'contact', iconActive: 'contact', text: '我的' }
    ]
  },

  methods: {
    onTap(this: any, e: any) {
      const idx = Number(e.currentTarget.dataset.index)
      const item = this.data.list[idx]
      if (idx === this.data.active) return
      wx.switchTab({ url: item.path })
    },

    /** 每个 tab 页 onShow 时调用，保持高亮同步 */
    setActive(this: any, idx: number) {
      if (this.data.active !== idx) this.setData({ active: idx })
    }
  }
})
