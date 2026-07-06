/**
 * 帖子详情：正文、点赞、收藏、关注、评论
 */
import { posts } from '../../data/posts'
import { getState, setState } from '../../utils/store'

Page({
  data: {
    post: null as any,
    liked: false,
    bookmarked: false,
    following: false,
    likes: 0,
    comments: [] as any[],
    input: ''
  },

  onLoad(query: any) {
    let post: any = posts.find(p => p.id === query.id)
    if (!post && query.mine) {
      const s = getState()
      const mine = s.myPosts.find(p => p.id === query.id)
      if (mine) {
        post = {
          id: mine.id, author: s.nickname, avatarBg: 'g-gold', time: mine.time,
          title: mine.title, content: mine.content.split('\n').filter(Boolean),
          cover: mine.cover, tags: mine.tags, likes: 0, comments: []
        }
      }
    }
    if (!post) {
      wx.showToast({ title: '帖子不存在', icon: 'none' })
      wx.navigateBack()
      return
    }
    const s = getState()
    this.setData({
      post,
      likes: post.likes,
      comments: post.comments.slice(),
      liked: s.liked.indexOf(post.id) >= 0,
      bookmarked: s.bookmarks.indexOf(post.id) >= 0,
      following: s.following.indexOf(post.author) >= 0
    })
  },

  toggleLike() {
    const s = getState()
    const id = this.data.post.id
    const liked = !this.data.liked
    setState({ liked: liked ? s.liked.concat(id) : s.liked.filter(x => x !== id) })
    this.setData({ liked, likes: this.data.likes + (liked ? 1 : -1) })
  },

  toggleBookmark() {
    const s = getState()
    const id = this.data.post.id
    const bookmarked = !this.data.bookmarked
    setState({ bookmarks: bookmarked ? s.bookmarks.concat(id) : s.bookmarks.filter(x => x !== id) })
    this.setData({ bookmarked })
    wx.showToast({ title: bookmarked ? '已收藏' : '已取消收藏', icon: 'none' })
  },

  toggleFollow() {
    const s = getState()
    const author = this.data.post.author
    const following = !this.data.following
    setState({ following: following ? s.following.concat(author) : s.following.filter(x => x !== author) })
    this.setData({ following })
  },

  onInput(e: any) {
    this.setData({ input: e.detail.value })
  },

  sendComment() {
    const text = this.data.input.trim()
    if (!text) return
    const s = getState()
    this.setData({
      comments: this.data.comments.concat({
        id: `local-${Date.now()}`,
        author: s.nickname,
        content: text,
        time: '刚刚'
      }),
      input: ''
    })
  },

  onShareAppMessage() {
    return {
      title: this.data.post.title,
      path: `/pages/post-detail/index?id=${this.data.post.id}`,
      imageUrl: '/assets/share-cover.png'
    }
  }
})
