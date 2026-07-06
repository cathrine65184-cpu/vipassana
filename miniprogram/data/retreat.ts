/**
 * 禅修营模式（AI 功能 8）：模拟十日内观禅修营的结构化日程
 */

export interface RetreatDay {
  day: number
  theme: string
  focus: string
}

export const retreatSchedule = [
  { time: '04:30', item: '起床钟' },
  { time: '05:00 - 06:30', item: '晨间静坐（观息）' },
  { time: '06:30 - 08:00', item: '早餐 · 休息（保持禁语）' },
  { time: '08:00 - 11:00', item: '集体共修' },
  { time: '11:00 - 13:00', item: '午餐 · 步行冥想' },
  { time: '13:00 - 17:00', item: '下午静坐（身体扫描）' },
  { time: '17:00 - 18:00', item: '茶点 · 休息' },
  { time: '18:00 - 19:00', item: '傍晚共修' },
  { time: '19:00 - 20:30', item: '开示（法的讲座）' },
  { time: '21:00', item: '休息' }
]

export const retreatDays: RetreatDay[] = [
  { day: 1, theme: '安顿', focus: '放下外缘，把注意力收回到鼻端的呼吸。' },
  { day: 2, theme: '观息', focus: '持续观察自然的呼吸，不控制，不评判。' },
  { day: 3, theme: '锐化', focus: '把觉知缩小到鼻下人中的一小片区域。' },
  { day: 4, theme: '内观日', focus: '开始身体扫描：从头顶到脚趾，逐寸观察感受。' },
  { day: 5, theme: '平等心', focus: '对愉悦不贪爱，对不适不嗔恨。' },
  { day: 6, theme: '无常', focus: '看见一切感受的生起与灭去。' },
  { day: 7, theme: '流动', focus: '让觉知如水般流经全身，不停留。' },
  { day: 8, theme: '深入', focus: '穿透粗重的感受，触及细微的振动。' },
  { day: 9, theme: '整合', focus: '在行住坐卧中保持不间断的觉知。' },
  { day: 10, theme: '慈悲', focus: '出关：将练习的功德分享给一切众生。' }
]
