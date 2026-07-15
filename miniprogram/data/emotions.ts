/**
 * 情绪 → 冥想推荐（AI 功能 3：情绪识别）
 * 推荐目标只指向当前在架的四条音频（m1 / m11 / m2 / m5）。
 */

export interface Emotion {
  id: string
  label: string
  emoji: string
  reply: string        // 教练式回应（不给建议，只陪伴与提问）
  meditationId: string // 推荐的冥想 id
}

export const emotions: Emotion[] = [
  { id: 'calm', label: '平静', emoji: '🌿', reply: '平静也值得被看见。它在身体的哪个部位最明显？', meditationId: 'm2' },
  { id: 'anxious', label: '焦虑', emoji: '🌀', reply: '焦虑来了。先不急着赶走它——它此刻在身体里是什么感觉？', meditationId: 'm1' },
  { id: 'low', label: '低落', emoji: '🌧', reply: '低落的日子，允许自己慢一点。此刻你最需要的是什么？', meditationId: 'm11' },
  { id: 'angry', label: '愤怒', emoji: '🔥', reply: '愤怒是很大的能量。如果它会说话，它想保护你什么？', meditationId: 'm11' },
  { id: 'tired', label: '疲惫', emoji: '🌙', reply: '辛苦了。今天可以不用努力，只是休息。', meditationId: 'm5' },
  { id: 'grateful', label: '感恩', emoji: '🌸', reply: '把这份感恩留在呼吸里，让它多停一会儿。', meditationId: 'm1' }
]
