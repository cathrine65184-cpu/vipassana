/**
 * 课程数据（CMS-ready）
 * 内容来源：课程 PDF（百度云全课程 / 1V1 咨询 / 3V1 团导咨询）。
 * 注：月度直播课程已按需求下架（2026-07），如需恢复可从 git 历史找回。
 * 后续可替换为云数据库 collection: courses。
 */
import { img } from './images'

export interface Chapter {
  id: string
  title: string
  /** video 视频 | audio 音频 | article 图文 | quiz 测验 | practice 实修作业 */
  type: 'video' | 'audio' | 'article' | 'quiz' | 'practice'
  duration: string
  free?: boolean
}

export interface Course {
  id: string
  order: string
  title: string
  subtitle: string
  desc: string
  cover: string          // 渐变底色 class（图片加载失败时兜底）
  img: string            // 封面照片 URL
  difficulty: string
  price: number
  priceUnit: string
  priceNote?: string
  teachers: string[]
  audience: string[]
  includes: string[]
  highlights: string[]
  chapters: Chapter[]
  badge: string          // 完课徽章名
}

export const courses: Course[] = [
  {
    id: 'foundation',
    order: '01',
    title: '内观基础 · 全课程录播',
    subtitle: '8 年走出强迫焦虑的经验，一次讲透',
    desc: '约 3 小时的系统录播课，从内观的起源与原理讲到日常练习方法，永久更新。适合自学能力强、希望先建立完整认知地图的小伙伴。',
    cover: 'g-moss',
    img: img.forestRoad,
    difficulty: '入门',
    price: 399,
    priceUnit: '元',
    priceNote: '永久更新',
    teachers: ['Drake'],
    audience: ['轻度强迫焦虑、刚进入急性发作期', '对禅宗内观有了解', '业余时间较多、悟性较高的小伙伴'],
    includes: ['约 3 小时高清录播', '课程讲义', '永久回看与更新'],
    highlights: ['起源与原理', '身体觉知', '呼吸练习', '基础打坐'],
    badge: '内观初心',
    // 真实章节目录（2026-07 内容稿）：约 3 小时高清录播，共 12 讲
    chapters: [
      { id: 'f1', title: '你一定可以走出来', type: 'video', duration: '约 6 分钟', free: true },
      { id: 'f2', title: '强迫症的本质是什么', type: 'video', duration: '约 7 分钟' },
      { id: 'f3', title: '强迫症的根源疗愈之道', type: 'video', duration: '约 8 分钟' },
      { id: 'f4', title: '何为安那般那念', type: 'video', duration: '约 5 分钟' },
      { id: 'f5', title: '平等心的重要性', type: 'video', duration: '约 3 分钟' },
      { id: 'f6', title: '带你做内观', type: 'video', duration: '约 20 分钟' },
      { id: 'f7', title: '就是如此', type: 'video', duration: '约 9 分钟' },
      { id: 'f8', title: '就是如此融入生活深化练习', type: 'video', duration: '约 10 分钟' },
      { id: 'f9', title: '什么才是好的状态', type: 'video', duration: '约 6 分钟' },
      { id: 'f10', title: '陈老师实战康复经验分享（上）', type: 'video', duration: '约 20 分钟' },
      { id: 'f11', title: '陈老师实战康复经验分享（中）', type: 'video', duration: '约 30 分钟' },
      { id: 'f12', title: '陈老师实战康复经验分享（下）', type: 'video', duration: '约 30 分钟' }
    ]
  },
  {
    id: 'one2one',
    order: '02',
    title: '1V1 导师咨询',
    subtitle: 'Drake 导师单独指导 60 分钟',
    desc: '推荐首次沟通的小伙伴：建立第一次了解和思维评估，明确当下卡点与练习路径。像一次安静的对坐，只谈你自己。',
    cover: 'g-dawn',
    img: img.sunLeaves,
    difficulty: '个性化',
    price: 500,
    priceUnit: '元/小时',
    teachers: ['Drake'],
    audience: ['首次沟通的小伙伴', '希望获得一对一思维评估', '想明确个人练习路径'],
    includes: ['60 分钟一对一语音', '思维评估', '个性化练习建议'],
    highlights: ['首次评估', '卡点梳理', '路径规划', '专属指导'],
    badge: '照见自己',
    chapters: [
      { id: 'o1', title: '预约与准备：写下你此刻的困扰', type: 'article', duration: '10 分钟', free: true },
      { id: 'o2', title: '正式咨询：60 分钟一对一', type: 'audio', duration: '60 分钟' },
      { id: 'o3', title: '咨询后实修：导师定制作业', type: 'practice', duration: '7 天' }
    ]
  },
  {
    id: 'group',
    order: '03',
    title: '3V1 团队核心导师指导',
    subtitle: '三位导师全方位共同陪伴',
    desc: 'Drake 老师负责概念知识灌输，陈老师负责日常实战训练，瑞老师负责增强信念感。每周 1 次 90 分钟语音（至少 2 位导师），专属微信陪伴群，日常 12 小时 3 位导师实时文字答疑（康复重点）。2 个月学员额外赠送 720 小时"防复发"保护期。',
    cover: 'g-forest',
    img: img.meditation,
    difficulty: '深度陪伴',
    price: 2699,
    priceUnit: '元/月',
    priceNote: '4999 元 / 2 个月 · 每位导师每小时语音不到 200',
    teachers: ['Drake（概念知识）', '陈老师（日常实战训练）', '瑞老师（增强信念感）'],
    audience: ['中重度强迫焦虑', '急性期想快速好起来', '2 年以上强迫焦虑', '对正念内观有基础了解', '康复后想继续提升幸福感', '学习欲望、学习能力较强的小伙伴'],
    includes: ['每周 1 次 90 分钟语音（至少 2 位导师）', '专属微信陪伴群', '日常 12 小时实时文字答疑', '百度云 3 小时内观课程录播（价值 399）', '15000 字康复手册（价值 88）', '2 个月学员赠 720 小时防复发保护期'],
    highlights: ['接纳与执着', '慈悲与疗愈', '静默与洞见', '融入日常生活'],
    badge: '自由之道',
    chapters: [
      { id: 'g1', title: '入组评估：三位导师共同了解你', type: 'audio', duration: '90 分钟', free: true },
      { id: 'g2', title: '概念课：接纳、执着与恐惧的运作', type: 'video', duration: '60 分钟' },
      { id: 'g3', title: '实战训练：日常场景中的觉察落地', type: 'practice', duration: '每日' },
      { id: 'g4', title: '信念感：康复故事与自我慈悲', type: 'audio', duration: '45 分钟' },
      { id: 'g5', title: '康复手册：15000 字系统阅读', type: 'article', duration: '90 分钟' },
      { id: 'g6', title: '阶段测验：洞见与整合', type: 'quiz', duration: '20 分钟' },
      { id: 'g7', title: '防复发：720 小时保护期实修', type: 'practice', duration: '30 天' }
    ]
  },
  {
    id: 'guide',
    order: '04',
    title: '新手指南 · 康复手册',
    subtitle: '强迫症正念终极康复指南（约 15000 字）',
    desc: '一份系统整合内观与正念的康复路径手册，约 15000 字深度长文。解锁后进入内部讨论群，由老师带领指导阅读与实践，不让你一个人摸索。',
    cover: 'g-mist',
    img: img.sunbeam,
    difficulty: '入门',
    price: 88.88,
    priceUnit: '元',
    priceNote: '含内部讨论群指导',
    teachers: ['导师团队'],
    audience: ['刚接触内观正念的新手', '想系统了解康复路径', '希望有社群陪伴与指导'],
    includes: ['约 15000 字康复手册', '进入内部讨论群', '老师带领指导'],
    highlights: ['新手入门', '康复地图', '社群陪伴', '深度阅读'],
    badge: '初心手册',
    chapters: [
      { id: 'gd1', title: '手册导读：如何使用这份指南', type: 'article', duration: '10 分钟', free: true },
      { id: 'gd2', title: '康复手册 · 全文阅读（约 15000 字）', type: 'article', duration: '约 90 分钟' },
      { id: 'gd3', title: '加入内部讨论群，跟随老师实践', type: 'practice', duration: '长期' }
    ]
  }
]

export function getCourse(id: string): Course | undefined {
  return courses.find(c => c.id === id)
}
