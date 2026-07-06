/**
 * 智慧卡片（AI 功能 6：可滑动的正念卡片）
 */

export interface WisdomCard {
  id: string
  text: string
  from: string
  cover: string
}

export const wisdomCards: WisdomCard[] = [
  { id: 'w1', text: '念头不是事实，\n它只是天空中的一朵云。', from: '觉察练习', cover: 'g-mist' },
  { id: 'w2', text: '你不需要变得更好，\n你需要看得更清。', from: '内观', cover: 'g-forest' },
  { id: 'w3', text: '呼吸是随身携带的家。', from: '一行禅师', cover: 'g-moss' },
  { id: 'w4', text: '感受生起时，\n只说：哦，你来了。', from: '平等心', cover: 'g-dew' },
  { id: 'w5', text: '不确定，\n是生活的原貌，不是故障。', from: '接纳', cover: 'g-stream' },
  { id: 'w6', text: '慢一点，\n世界不会因此塌掉。', from: '慢生活', cover: 'g-dawn' },
  { id: 'w7', text: '此刻的不舒服，\n和"我要受苦"是两回事。', from: '内观智慧', cover: 'g-stone' },
  { id: 'w8', text: '安静下来，\n答案常常自己浮上来。', from: '静默', cover: 'g-night' },
  { id: 'w9', text: '每一次走神后的回来，\n都是一次觉醒。', from: '禅修', cover: 'g-moss' },
  { id: 'w10', text: '善待自己，\n像善待一位老朋友。', from: '自我慈悲', cover: 'g-dawn' }
]
