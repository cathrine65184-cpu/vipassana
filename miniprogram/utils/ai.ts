/**
 * AI 能力层（本地规则实现，接口形状与云函数 `ai` 一致）。
 * 上线时将各函数替换为 wx.cloud.callFunction({ name: 'ai', data: { action, payload } })，
 * 云函数内再调用大模型 API，前端零改动。
 */

import { quotes } from '../data/quotes'

export function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

/** 以日期为种子的伪随机，保证同一天所有人看到同一句 */
function seeded(seed: number, mod: number): number {
  const x = Math.sin(seed) * 10000
  return Math.floor((x - Math.floor(x)) * mod)
}

/* ---------- 功能 5：每日一句 ---------- */

const morningLines = [
  '今天，允许一切如其所是。',
  '慢慢呼吸，你已经在路上了。',
  '不必抵达哪里，此刻就是全部。',
  '把今天当作第一次看见世界。',
  '念头会来，也会走。你只是天空。',
  '今天练习：对自己温柔一点。',
  '万事发生，皆可觉察。',
  '少一分对抗，多一分看见。',
  '你不必解决所有问题，先安住十分钟。',
  '让心像水，遇圆则圆，遇方则方。'
]

export function dailySentence(): string {
  const d = new Date()
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
  return morningLines[seeded(seed, morningLines.length)]
}

/** 今日禅语（首页引用卡） */
export function dailyQuote() {
  const d = new Date()
  const seed = d.getFullYear() * 373 + (d.getMonth() + 1) * 31 + d.getDate()
  return quotes[seeded(seed, quotes.length)]
}

/* ---------- 功能 1：AI 觉察日记小结 ---------- */

const emotionLexicon: { key: string, words: string[] }[] = [
  { key: '焦虑', words: ['焦虑', '担心', '紧张', '害怕', '恐惧', '不安', '慌'] },
  { key: '低落', words: ['难过', '低落', '沮丧', '失落', '想哭', '悲伤', '委屈'] },
  { key: '愤怒', words: ['生气', '愤怒', '烦躁', '火大', '不爽', '讨厌'] },
  { key: '疲惫', words: ['累', '疲惫', '疲倦', '撑不住', '没力气', '倦'] },
  { key: '平静', words: ['平静', '安心', '放松', '舒服', '轻松', '安稳'] },
  { key: '喜悦', words: ['开心', '喜悦', '快乐', '感恩', '幸福', '满足'] },
  { key: '执着', words: ['放不下', '纠结', '反复', '控制不住', '忍不住', '一直想'] }
]

export interface ReflectionResult {
  emotions: string[]
  summary: string
}

export function reflect(text: string): ReflectionResult {
  const found: string[] = []
  emotionLexicon.forEach(e => {
    if (e.words.some(w => text.indexOf(w) >= 0)) found.push(e.key)
  })
  if (found.length === 0) found.push('平静')

  const parts: string[] = []
  parts.push(`今天的文字里，「${found.join('、')}」出现得最多。`)
  if (found.indexOf('执着') >= 0) {
    parts.push('注意到你提到了一些反复出现、难以放下的念头——它们不需要被立刻解决，先被看见就好。')
  }
  if (found.indexOf('焦虑') >= 0 || found.indexOf('恐惧') >= 0) {
    parts.push('焦虑常常指向未来。写下它的这一刻，你其实已经回到了现在。')
  }
  if (found.indexOf('平静') >= 0 || found.indexOf('喜悦') >= 0) {
    parts.push('也请记住此刻的安稳感觉——它是练习慢慢积累的果实。')
  }
  parts.push('觉察本身，就是改变的开始。')
  return { emotions: found, summary: parts.join(' ') }
}

/* ---------- 功能 2：AI 正念教练（只提问，不建议） ---------- */

const coachOpeners = [
  '我在。想聊聊此刻的你吗？',
  '欢迎回来。今天的心，是什么天气？'
]

const coachQuestions = [
  '如果给此刻的感受一个名字，你会叫它什么？',
  '这个感觉在身体的哪个位置最明显？',
  '它是一直都在，还是来了又走？',
  '当你只是看着它、不推开也不抓住，会发生什么？',
  '这个念头背后，你猜它想保护你什么？',
  '如果最好的朋友遇到同样的事，你会怎么陪 ta？',
  '此刻，你和这个感受之间，有多少距离？',
  '深呼吸三次之后，它的大小变了吗？',
  '今天有没有哪个瞬间，你其实是平静的？',
  '如果什么都不用做，你想先休息一会儿吗？'
]

const coachMirrors = [
  '嗯，我听到了。',
  '谢谢你愿意说出来。',
  '这听起来不容易。',
  '慢慢说，不着急。'
]

let questionCursor = -1

export function coachReply(userText: string): string {
  if (!userText) return coachOpeners[seeded(Date.now(), coachOpeners.length)]
  const mirror = coachMirrors[seeded(userText.length + Date.now(), coachMirrors.length)]
  questionCursor = (questionCursor + 1) % coachQuestions.length
  return `${mirror} ${coachQuestions[questionCursor]}`
}

export const coachDisclaimer = 'AI 陪伴不构成医疗建议。如处于危机中，请联系专业帮助。'
