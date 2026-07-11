/**
 * 冥想音频数据（CMS-ready）
 * ⚠️ audio 字段目前全部留空 = 占位状态：播放器以本地计时方式模拟播放；
 *    后期把各分类的真实音频上传到云存储 / CDN 后，填入 fileID 或 https 链接即自动真实播放。
 * img 为封面照片（开发期 Unsplash 直链，加载失败时回落到 cover 渐变底色）。
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

export const categories = ['呼吸', '身体扫描', '睡眠', '疗愈', '晨间', '减压', '专注', '行走', '饮食']

export const meditations: Meditation[] = [
  // m1 已挂真实音频（包内 32kbps HE-AAC，10 分钟；高清母带在 /media-master，上线时传云存储后改成 cloud:// fileID）
  { id: 'm1', title: '呼吸觉知练习', category: '呼吸', minutes: 10, desc: '回到一呼一吸，看念头来了又走。', cover: 'g-forest', img: img.meditation, audio: '/assets/audio/m1-breath.m4a' },
  // m2 已挂真实音频（20:13，包内 32kbps HE-AAC；母带在 /media-master）
  { id: 'm2', title: '观息法 · 安那般那', category: '呼吸', minutes: 20, desc: '内观入门的根基：只是观察鼻端的呼吸。', cover: 'g-moss', img: img.sunLeaves, audio: '/assets/audio/m2-awareness.m4a' },
  { id: 'm3', title: '全身扫描 · 由头至足', category: '身体扫描', minutes: 25, desc: '带着平等心，逐寸感受身体的感受。', cover: 'g-dew', img: img.foggyHills },
  { id: 'm4', title: '睡前放松 · 入眠扫描', category: '睡眠', minutes: 18, desc: '把一天放下，让身体先睡着。', cover: 'g-night', img: img.lake },
  { id: 'm5', title: '深睡引导 · 无梦之息', category: '睡眠', minutes: 30, desc: '缓慢的引导与静默，陪你进入深睡。', cover: 'g-night', img: img.pines, vip: true },
  { id: 'm6', title: '疗愈内在小孩', category: '疗愈', minutes: 22, desc: '以慈悲心回望，接住曾经的自己。', cover: 'g-dawn', img: img.flowers, vip: true },
  { id: 'm7', title: '晨间唤醒 · 第一缕觉知', category: '晨间', minutes: 8, desc: '睁眼后的八分钟，为一天定下基调。', cover: 'g-mist', img: img.sunbeam },
  { id: 'm8', title: '考前 / 会前减压', category: '减压', minutes: 12, desc: '紧张不是敌人，是能量。看见它。', cover: 'g-stream', img: img.waterfall },
  { id: 'm9', title: '专注力 · 一境性练习', category: '专注', minutes: 15, desc: '把心安放在一个对象上，温柔地拉回。', cover: 'g-stone', img: img.treesUp },
  { id: 'm10', title: '行走冥想 · 步步安住', category: '行走', minutes: 20, desc: '抬脚、移动、落下。走路本身就是道场。', cover: 'g-moss', img: img.forestRoad },
  // m11 已挂真实音频（16:00，包内 32kbps HE-AAC；母带在 /media-master）
  { id: 'm11', title: '情绪观察 · 不迎不拒', category: '疗愈', minutes: 16, desc: '给情绪命名，看它生起、停留、消逝。', cover: 'g-dew', img: img.aerialGreen, audio: '/assets/audio/m11-emotion.m4a' },
  { id: 'm12', title: '深呼吸 · 4-7-8 平静法', category: '减压', minutes: 6, desc: '吸气四拍，停留七拍，呼气八拍。', cover: 'g-stream', img: img.sunsetField },
  // 饮食冥想：内容方向待共创（一行禅师「吃饭就是吃饭」/ 葡萄干练习等），先以占位音频挂载
  { id: 'm13', title: '饮食冥想 · 吃饭就是吃饭', category: '饮食', minutes: 12, desc: '一口一口，尝到食物本来的味道。（内容共创中）', cover: 'g-dawn', img: img.tea }
]

export function getMeditation(id: string): Meditation | undefined {
  return meditations.find(m => m.id === id)
}
