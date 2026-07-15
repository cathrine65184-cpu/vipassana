/**
 * 冥想音频数据（CMS-ready）
 * 2026-07-15 起冥想库只保留四条真实音频（10 / 16 / 20 / 30 分钟），
 * 其余占位条目已下架（git 历史可找回）。
 * vip: true 的条目仅会员可听（播放器内做拦截）。
 * 包内为 32kbps HE-AAC 压缩版；高清母带在 /media-master，上线时迁云存储改 cloud:// fileID。
 */
import { img } from './images'

export interface Meditation {
  id: string
  title: string
  category: string
  minutes: number
  desc: string
  cover: string
  img: string
  audio?: string
  vip?: boolean
}

export const categories = ['呼吸', '疗愈', '睡眠']

export const meditations: Meditation[] = [
  { id: 'm1', title: '呼吸觉知练习', category: '呼吸', minutes: 10, desc: '回到一呼一吸，看念头来了又走。', cover: 'g-forest', img: img.meditation, audio: '/assets/audio/m1-breath.m4a' },
  { id: 'm11', title: '情绪观察 · 不迎不拒', category: '疗愈', minutes: 16, desc: '给情绪命名，看它生起、停留、消逝。', cover: 'g-dew', img: img.aerialGreen, audio: '/assets/audio/m11-emotion.m4a', vip: true },
  { id: 'm2', title: '观息法 · 安那般那', category: '呼吸', minutes: 20, desc: '内观入门的根基：只是观察鼻端的呼吸。', cover: 'g-moss', img: img.sunLeaves, audio: '/assets/audio/m2-awareness.m4a', vip: true },
  { id: 'm5', title: '无梦之息', category: '睡眠', minutes: 30, desc: '缓慢的引导与静默，陪你进入深睡。', cover: 'g-night', img: img.lake, audio: '/assets/audio/m5-dreamless.m4a', vip: true }
]

export function getMeditation(id: string): Meditation | undefined {
  return meditations.find(m => m.id === id)
}
