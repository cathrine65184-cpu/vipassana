/**
 * 本地状态仓库（storage 持久化）。
 * 结构刻意与云数据库文档保持一致，接入后端时把读写替换为云调用即可。
 */

const KEY = 'vipassana_state'

export interface JournalEntry {
  id: string
  date: string
  text: string
  summary: string     // AI 觉察小结
  emotions: string[]  // 识别出的情绪模式
}

export interface UserPost {
  id: string
  title: string
  content: string
  tags: string[]
  cover: string
  time: string
}

export interface AppState {
  nickname: string
  vip: boolean
  vipPlan: string
  purchases: string[]           // 已购课程 id
  favorites: string[]           // 收藏的冥想 id
  bookmarks: string[]           // 收藏的帖子 id
  downloads: string[]           // 已下载冥想 id
  liked: string[]               // 点过赞的帖子 id
  following: string[]           // 关注的作者
  checkins: string[]            // 打卡日期 'YYYY-MM-DD'
  totalMinutes: number          // 累计冥想分钟
  sessionCount: number          // 累计冥想次数
  lastPlayed: string            // 上次播放的冥想 id
  lastPlayedAt: number          // 上次播放进度（秒）
  journal: JournalEntry[]       // 觉察日记
  myPosts: UserPost[]           // 我发布的帖子
  treePoints: number            // 觉察之树成长值
  dailySentence: string
  dailySentenceDate: string
  courseProgress: Record<string, string[]>  // courseId -> 已完成章节 id
  retreatDay: number            // 禅修营进行到第几天，0 = 未开始
  retreatStartDate: string
}

const defaults: AppState = {
  nickname: '静心的旅人',
  vip: false,
  vipPlan: '',
  purchases: [],
  favorites: [],
  bookmarks: [],
  downloads: [],
  liked: [],
  following: [],
  checkins: [],
  totalMinutes: 0,
  sessionCount: 0,
  lastPlayed: 'm1',
  lastPlayedAt: 0,
  journal: [],
  myPosts: [],
  treePoints: 0,
  dailySentence: '',
  dailySentenceDate: '',
  courseProgress: {},
  retreatDay: 0,
  retreatStartDate: ''
}

export function ensureDefaults(): void {
  const cur = wx.getStorageSync(KEY)
  if (!cur) wx.setStorageSync(KEY, defaults)
}

export function getState(): AppState {
  return Object.assign({}, defaults, wx.getStorageSync(KEY) || {})
}

export function setState(patch: Partial<AppState>): AppState {
  const next = Object.assign(getState(), patch)
  wx.setStorageSync(KEY, next)
  return next
}

/* ---------- 日期工具 ---------- */

export function dateKey(d: Date = new Date()): string {
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/** 今天是否已打卡 */
export function checkedToday(): boolean {
  return getState().checkins.indexOf(dateKey()) >= 0
}

/** 打卡；返回最新连续天数 */
export function checkinToday(): number {
  const s = getState()
  const today = dateKey()
  if (s.checkins.indexOf(today) < 0) {
    setState({ checkins: s.checkins.concat(today) })
  }
  return currentStreak()
}

/** 当前连续打卡天数（从今天或昨天往回数） */
export function currentStreak(): number {
  const set: Record<string, boolean> = {}
  getState().checkins.forEach(d => { set[d] = true })
  let streak = 0
  const cursor = new Date()
  // 今天没打卡时从昨天起算，避免凌晨清零的挫败感
  if (!set[dateKey(cursor)]) cursor.setDate(cursor.getDate() - 1)
  while (set[dateKey(cursor)]) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

/** 最近 7 天每天的打卡状态（周一为一周起点） */
export function weekProgress(): { label: string, done: boolean, isToday: boolean }[] {
  const labels = ['一', '二', '三', '四', '五', '六', '日']
  const set: Record<string, boolean> = {}
  getState().checkins.forEach(d => { set[d] = true })
  const today = new Date()
  const dow = (today.getDay() + 6) % 7 // 周一 = 0
  const res: { label: string, done: boolean, isToday: boolean }[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - dow + i)
    res.push({ label: labels[i], done: !!set[dateKey(d)], isToday: i === dow })
  }
  return res
}

/** 完成一次冥想：累计时长、打卡、长觉察之树 */
export function completeSession(minutes: number): void {
  const s = getState()
  setState({
    totalMinutes: s.totalMinutes + minutes,
    sessionCount: s.sessionCount + 1,
    treePoints: s.treePoints + Math.max(1, Math.round(minutes / 5))
  })
  checkinToday()
}

/** 冥想等级：由累计分钟数换算 */
export function level(): { name: string, next: string, progress: number } {
  const m = getState().totalMinutes
  const tiers = [
    { at: 0, name: '初学者' },
    { at: 60, name: '觉察者' },
    { at: 300, name: '安住者' },
    { at: 1000, name: '行者' },
    { at: 3000, name: '自在' }
  ]
  let idx = 0
  for (let i = 0; i < tiers.length; i++) if (m >= tiers[i].at) idx = i
  const cur = tiers[idx]
  const nxt = tiers[idx + 1]
  return {
    name: cur.name,
    next: nxt ? `距「${nxt.name}」还需 ${nxt.at - m} 分钟` : '已抵达最高等级',
    progress: nxt ? Math.min(1, (m - cur.at) / (nxt.at - cur.at)) : 1
  }
}
