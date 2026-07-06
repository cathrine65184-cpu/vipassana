/**
 * 打卡记录：日历、周/月图表、成就徽章
 */
import { badges } from '../../data/badges'
import { getState, currentStreak, dateKey, weekProgress } from '../../utils/store'

Page({
  data: {
    year: 0,
    month: 0,        // 1-12
    monthLabel: '',
    cells: [] as any[],           // 日历格
    weekdays: ['一', '二', '三', '四', '五', '六', '日'],
    streak: 0,
    totalDays: 0,
    totalHours: 0,
    totalMinutesRemain: 0,
    week: [] as any[],
    monthBars: [] as any[],       // 近 6 个月打卡天数
    badges: [] as any[]
  },

  onLoad() {
    const now = new Date()
    this.setData({ year: now.getFullYear(), month: now.getMonth() + 1 })
    this.refresh()
  },

  refresh() {
    const s = getState()
    const streak = currentStreak()
    const checkSet: Record<string, boolean> = {}
    s.checkins.forEach(d => { checkSet[d] = true })

    // ---- 日历 ----
    const { year, month } = this.data
    const first = new Date(year, month - 1, 1)
    const daysInMonth = new Date(year, month, 0).getDate()
    const lead = (first.getDay() + 6) % 7 // 周一起
    const todayStr = dateKey()
    const cells: any[] = []
    for (let i = 0; i < lead; i++) cells.push({ key: `e${i}`, empty: true })
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${`${month}`.padStart(2, '0')}-${`${d}`.padStart(2, '0')}`
      cells.push({ key, day: d, done: !!checkSet[key], isToday: key === todayStr })
    }

    // ---- 近 6 个月柱状 ----
    const monthBars: any[] = []
    for (let i = 5; i >= 0; i--) {
      const m = new Date(year, month - 1 - i, 1)
      const prefix = `${m.getFullYear()}-${`${m.getMonth() + 1}`.padStart(2, '0')}`
      const count = s.checkins.filter(d => d.indexOf(prefix) === 0).length
      monthBars.push({
        label: `${m.getMonth() + 1}月`,
        count,
        height: Math.min(100, Math.round((count / 31) * 100))
      })
    }

    // ---- 徽章 ----
    const earned = badges.map(b => Object.assign({}, b, {
      unlocked: b.days === 0 ? s.sessionCount > 0 : streak >= b.days || s.checkins.length >= b.days
    }))

    this.setData({
      monthLabel: `${year} 年 ${month} 月`,
      cells,
      streak,
      totalDays: s.checkins.length,
      totalHours: Math.floor(s.totalMinutes / 60),
      totalMinutesRemain: s.totalMinutes % 60,
      week: weekProgress(),
      monthBars,
      badges: earned
    })
  },

  prevMonth() {
    let { year, month } = this.data
    month -= 1
    if (month === 0) { month = 12; year -= 1 }
    this.setData({ year, month })
    this.refresh()
  },

  nextMonth() {
    let { year, month } = this.data
    month += 1
    if (month === 13) { month = 1; year += 1 }
    this.setData({ year, month })
    this.refresh()
  }
})
