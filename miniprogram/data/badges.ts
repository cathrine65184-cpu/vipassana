/**
 * 成就徽章（游戏化）
 */

export interface Badge {
  id: string
  name: string
  desc: string
  icon: string       // van-icon 名称
  days: number       // 连续打卡天数门槛；0 表示特殊徽章
}

export const badges: Badge[] = [
  { id: 'b-first', name: '初见', desc: '完成第一次冥想', icon: 'flower-o', days: 0 },
  { id: 'b-7', name: '七日之约', desc: '连续打卡 7 天', icon: 'fire-o', days: 7 },
  { id: 'b-30', name: '一月安住', desc: '连续打卡 30 天', icon: 'medal-o', days: 30 },
  { id: 'b-100', name: '百日筑基', desc: '连续打卡 100 天', icon: 'gem-o', days: 100 },
  { id: 'b-365', name: '一年之树', desc: '连续打卡 365 天', icon: 'gift-o', days: 365 }
]
