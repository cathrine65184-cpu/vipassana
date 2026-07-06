/**
 * 课程详情：介绍、导师、适合人群、章节、购买解锁
 */
import { getCourse } from '../../data/courses'
import { getState, setState } from '../../utils/store'
import { requestPayment } from '../../utils/pay'

const typeMeta: Record<string, { icon: string, label: string }> = {
  video: { icon: 'video-o', label: '视频' },
  audio: { icon: 'volume-o', label: '音频' },
  article: { icon: 'notes-o', label: '图文' },
  quiz: { icon: 'question-o', label: '测验' },
  practice: { icon: 'flag-o', label: '实修' }
}

Page({
  data: {
    course: null as any,
    chapters: [] as any[],
    unlocked: false,
    doneCount: 0,
    badgeEarned: false
  },

  onLoad(query: any) {
    const course = getCourse(query.id || 'foundation')
    if (!course) {
      wx.showToast({ title: '课程不存在', icon: 'none' })
      wx.navigateBack()
      return
    }
    wx.setNavigationBarTitle({ title: course.title })
    this.courseId = course.id
    this.setData({ course })
    this.refresh()
  },

  courseId: '',

  refresh() {
    const s = getState()
    const course = getCourse(this.courseId)!
    const done = s.courseProgress[course.id] || []
    const unlocked = s.purchases.indexOf(course.id) >= 0 || s.vip
    const chapters = course.chapters.map(ch => Object.assign({}, ch, {
      meta: typeMeta[ch.type],
      done: done.indexOf(ch.id) >= 0,
      locked: !unlocked && !ch.free
    }))
    this.setData({
      chapters,
      unlocked,
      doneCount: done.length,
      badgeEarned: done.length === course.chapters.length && course.chapters.length > 0
    })
  },

  /** 点击章节：免费或已购可学习并标记完成 */
  tapChapter(e: any) {
    const { id, locked, done } = e.currentTarget.dataset
    if (locked) {
      wx.showToast({ title: '购买后解锁本章节', icon: 'none' })
      return
    }
    const s = getState()
    const progress = Object.assign({}, s.courseProgress)
    const list = progress[this.courseId] || []
    if (done) {
      // 再次点击表示重新学习，不取消完成状态
      wx.showToast({ title: '开始复习本章节', icon: 'none' })
      return
    }
    progress[this.courseId] = list.concat(id)
    setState({ courseProgress: progress })
    this.refresh()
    if (this.data.badgeEarned) {
      wx.showToast({ title: `恭喜获得徽章「${this.data.course.badge}」`, icon: 'none', duration: 2500 })
    } else {
      wx.showToast({ title: '已完成本章节', icon: 'success' })
    }
  },

  buy() {
    const c = this.data.course
    requestPayment({ title: c.title, amount: c.price, unit: c.priceUnit.replace('元', '') })
      .then(() => {
        const s = getState()
        setState({ purchases: s.purchases.concat(c.id) })
        this.refresh()
        wx.showToast({ title: '已解锁，开始学习吧', icon: 'success' })
      })
      .catch(() => { /* 用户取消 */ })
  },

  onShareAppMessage() {
    const c = this.data.course
    return {
      title: `${c.title} · 应无所住`,
      path: `/pages/course-detail/index?id=${c.id}`,
      imageUrl: '/assets/share-cover.png'
    }
  }
})
