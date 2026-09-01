/** 付费课程视频播放器：购买校验 -> 云存储临时 URL -> 播放完成记进度。 */
import { getCourse } from '../../data/courses'
import { getCourseMedia } from '../../data/course-media'
import { getState, setState } from '../../utils/store'

Page({
  data: {
    title: '',
    duration: '',
    src: '',
    loading: true,
    unavailable: false,
    errorText: ''
  },

  courseId: '',
  chapterId: '',

  onLoad(query: any) {
    this.courseId = query.courseId || ''
    this.chapterId = query.chapterId || ''
    const course = getCourse(this.courseId)
    const chapter = course && course.chapters.find(ch => ch.id === this.chapterId)
    const media = getCourseMedia(query.resourceKey || '')
    const state = getState()
    const unlocked = !!course && (state.vip || state.purchases.indexOf(course.id) >= 0)

    if (!course || !chapter || !media || !unlocked) {
      wx.showToast({ title: unlocked ? '视频不存在' : '购买后解锁视频', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 700)
      return
    }

    wx.setNavigationBarTitle({ title: chapter.title })
    this.setData({ title: chapter.title, duration: media.duration })

    if (!media.cloudFileId) {
      this.setData({
        loading: false,
        unavailable: true,
        errorText: '视频母版已导入资源清单，等待上传至云存储后即可播放。'
      })
      return
    }

    this.resolveSource(media.cloudFileId)
  },

  resolveSource(fileId: string) {
    if (fileId.indexOf('cloud://') !== 0) {
      this.setData({ src: fileId, loading: false })
      return
    }
    wx.cloud.getTempFileURL({
      fileList: [fileId],
      success: (res: any) => {
        const item = res.fileList && res.fileList[0]
        if (item && item.tempFileURL) this.setData({ src: item.tempFileURL, loading: false })
        else this.showMediaError('暂时无法获取视频，请稍后重试')
      },
      fail: () => this.showMediaError('网络开小差了，请稍后重试')
    })
  },

  showMediaError(message: string) {
    this.setData({ loading: false, unavailable: true, errorText: message })
  },

  onVideoError() {
    this.showMediaError('视频加载失败，请检查网络后重试')
  },

  onEnded() {
    const state = getState()
    const progress = Object.assign({}, state.courseProgress)
    const done = progress[this.courseId] || []
    if (done.indexOf(this.chapterId) < 0) {
      progress[this.courseId] = done.concat(this.chapterId)
      setState({ courseProgress: progress })
    }
    wx.showToast({ title: '本节已完成', icon: 'success' })
  },

  retry() {
    wx.redirectTo({
      url: `/pages/course-player/index?courseId=${this.courseId}&chapterId=${this.chapterId}&resourceKey=${this.chapterId}`
    })
  }
})
