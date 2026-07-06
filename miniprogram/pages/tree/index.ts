/**
 * 觉察之旅（功能 4）：以一棵树可视化成长。
 * 冥想与写日记积累成长值，长出叶子与花。
 */
import { getState, level } from '../../utils/store'

// 叶子与花的固定锚点（百分比坐标），按成长值依次点亮
const leafSlots = [
  { x: 38, y: 62 }, { x: 60, y: 58 }, { x: 30, y: 52 }, { x: 68, y: 48 },
  { x: 44, y: 44 }, { x: 56, y: 38 }, { x: 26, y: 40 }, { x: 72, y: 34 },
  { x: 36, y: 30 }, { x: 62, y: 26 }, { x: 48, y: 20 }, { x: 30, y: 22 },
  { x: 70, y: 18 }, { x: 42, y: 12 }, { x: 58, y: 10 }
]

Page({
  data: {
    points: 0,
    leaves: [] as any[],
    flowers: [] as any[],
    stage: '',
    levelName: '',
    sessionCount: 0,
    totalMinutes: 0,
    journalCount: 0,
    nextHint: ''
  },

  onShow() {
    const s = getState()
    const points = s.treePoints
    // 每 3 点成长值一片叶子；叶子满后每 8 点一朵花
    const leafCount = Math.min(leafSlots.length, Math.floor(points / 3))
    const flowerCount = Math.min(5, Math.floor(Math.max(0, points - leafSlots.length * 3) / 8))
    const leaves = leafSlots.slice(0, leafCount).map((p, i) => Object.assign({ id: i, delay: i * 0.06 }, p))
    const flowers = leafSlots.slice(0, flowerCount).map((p, i) => ({ id: `f${i}`, x: p.x + 4, y: p.y - 4, delay: i * 0.1 }))

    const stage =
      points === 0 ? '一颗种子，等待第一次呼吸' :
      points < 9 ? '嫩芽初生' :
      points < 24 ? '枝叶舒展' :
      points < 45 ? '绿意成荫' : '开花的树'

    const toNextLeaf = 3 - (points % 3)
    this.setData({
      points,
      leaves,
      flowers,
      stage,
      levelName: level().name,
      sessionCount: s.sessionCount,
      totalMinutes: s.totalMinutes,
      journalCount: s.journal.length,
      nextHint: leafCount >= leafSlots.length
        ? '叶已满冠，继续练习会开出花'
        : `再积累 ${toNextLeaf} 点成长值，长出下一片叶子`
    })
  },

  goMeditate() {
    wx.switchTab({ url: '/pages/meditation/index' })
  },

  goJournal() {
    wx.navigateTo({ url: '/pages/reflection/index' })
  }
})
