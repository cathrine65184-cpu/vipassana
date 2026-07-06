/**
 * 发帖：标题 + 正文 + 话题标签 + 封面色（图片上传占位）
 */
import { hotTags } from '../../data/posts'
import { getState, setState } from '../../utils/store'

const coverOptions = ['g-forest', 'g-moss', 'g-dew', 'g-dawn', 'g-mist', 'g-stream']

Page({
  data: {
    title: '',
    content: '',
    tags: hotTags,
    selected: [] as string[],
    covers: coverOptions,
    cover: 'g-moss'
  },

  onTitle(e: any) { this.setData({ title: e.detail.value }) },
  onContent(e: any) { this.setData({ content: e.detail.value }) },

  toggleTag(e: any) {
    const tag = e.currentTarget.dataset.tag
    const selected = this.data.selected.slice()
    const idx = selected.indexOf(tag)
    if (idx >= 0) selected.splice(idx, 1)
    else if (selected.length < 3) selected.push(tag)
    else { wx.showToast({ title: '最多选 3 个话题', icon: 'none' }); return }
    this.setData({ selected })
  },

  pickCover(e: any) {
    this.setData({ cover: e.currentTarget.dataset.cover })
  },

  chooseImage() {
    // 图片上传占位：接入云存储后改为 wx.chooseMedia + wx.cloud.uploadFile
    wx.showToast({ title: '接入云存储后支持上传图片', icon: 'none' })
  },

  publish() {
    const { title, content, selected, cover } = this.data
    if (!title.trim()) { wx.showToast({ title: '写个标题吧', icon: 'none' }); return }
    if (!content.trim()) { wx.showToast({ title: '正文不能为空', icon: 'none' }); return }
    const s = getState()
    setState({
      myPosts: [{
        id: `mine-${Date.now()}`,
        title: title.trim(),
        content: content.trim(),
        tags: selected,
        cover,
        time: '刚刚'
      }].concat(s.myPosts)
    })
    wx.showToast({ title: '已发布', icon: 'success' })
    setTimeout(() => wx.navigateBack(), 600)
  }
})
