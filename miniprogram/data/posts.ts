/**
 * 社区帖子种子数据（CMS-ready，可替换为云数据库 collection: posts）
 */

export interface Comment {
  id: string
  author: string
  content: string
  time: string
}

export interface Post {
  id: string
  author: string
  avatarBg: string
  time: string
  title: string
  excerpt: string
  content: string[]
  cover?: string
  tags: string[]
  likes: number
  comments: Comment[]
  /** essence: 精华帖 */
  essence?: boolean
}

export const hotTags = ['#晨间冥想', '#觉察', '#内观', '#禅修营', '#正念', '#冥想日记', '#今日反思']

export const posts: Post[] = [
  {
    id: 'p1',
    author: '清风',
    avatarBg: 'g-moss',
    time: '2小时前',
    title: '觉知呼吸，觉知此刻',
    excerpt: '当我真正开始关注呼吸，才发现自己有太多的念头和情绪…',
    content: [
      '当我真正开始关注呼吸，才发现自己有太多的念头和情绪。它们像潮水一样，一波接一波。',
      '导师说：不用赶走它们，只要看见。看见的那一刻，我和念头之间就有了一点点空间。',
      '今天坐了 20 分钟，腿麻了三次，心跑了无数次。但每一次拉回来，都算数。'
    ],
    cover: 'g-forest',
    tags: ['#觉察', '#晨间冥想'],
    likes: 23,
    essence: true,
    comments: [
      { id: 'c1', author: '云淡风轻', content: '「每一次拉回来，都算数」这句太治愈了。', time: '1小时前' },
      { id: 'c2', author: '山月', content: '同款腿麻，哈哈。坚持！', time: '40分钟前' }
    ]
  },
  {
    id: 'p2',
    author: '云淡风轻',
    avatarBg: 'g-dew',
    time: '昨天',
    title: '在日常中练习正念',
    excerpt: '刷牙、走路、吃饭…每一个小事都是练习正念的机会。',
    content: [
      '刷牙、走路、吃饭…每一个小事都是练习正念的机会。',
      '今天吃饭的时候试着放下手机，只是吃饭。米饭原来是有甜味的，这是我三十年来第一次认真尝到。',
      '正念不在坐垫上，在生活里。'
    ],
    cover: 'g-dawn',
    tags: ['#正念', '#冥想日记'],
    likes: 18,
    comments: [
      { id: 'c3', author: '清风', content: '吃饭冥想真的被低估了。', time: '20小时前' }
    ]
  },
  {
    id: 'p3',
    author: '静水深流',
    avatarBg: 'g-stone',
    time: '2天前',
    title: '放下执着，轻松前行',
    excerpt: '很多时候，我们的痛苦来自于对结果的执着。学会放下，才能更轻松。',
    content: [
      '很多时候，我们的痛苦来自于对结果的执着。学会放下，才能更轻松。',
      '强迫焦虑最狡猾的地方，是让你以为"再确认一次"就安全了。可安全感从来不在下一次确认里。',
      '这两年的练习教会我：不确定也可以活，而且活得挺好。'
    ],
    cover: 'g-mist',
    tags: ['#内观', '#今日反思'],
    likes: 31,
    essence: true,
    comments: [
      { id: 'c4', author: '拾光', content: '「安全感从来不在下一次确认里」，泪目。', time: '1天前' },
      { id: 'c5', author: '一叶', content: '感谢分享，正在急性期，看到很安心。', time: '1天前' },
      { id: 'c6', author: '清风', content: '抱抱楼上，会好起来的。', time: '20小时前' }
    ]
  },
  {
    id: 'p4',
    author: '山月',
    avatarBg: 'g-night',
    time: '3天前',
    title: '禅修营十日记（上）',
    excerpt: '十天禁语，四点半起床。第一天我几乎想逃跑，第三天开始不一样了…',
    content: [
      '十天禁语，四点半起床。第一天我几乎想逃跑，第三天开始不一样了。',
      '没有手机的日子，时间变得很长，长到可以听见自己心跳的间隙。',
      '第七天下午的一坐，眼泪毫无理由地流下来。不是难过，像是某种很旧的东西被放掉了。'
    ],
    cover: 'g-moss',
    tags: ['#禅修营', '#内观'],
    likes: 47,
    essence: true,
    comments: [
      { id: 'c7', author: '静水深流', content: '等你的下篇！', time: '2天前' }
    ]
  },
  {
    id: 'p5',
    author: '拾光',
    avatarBg: 'g-stream',
    time: '4天前',
    title: '今天的冥想日记：焦虑来访',
    excerpt: '焦虑今天又来敲门了。这次我没有开门跟它吵架，只是隔着门看着它。',
    content: [
      '焦虑今天又来敲门了。这次我没有开门跟它吵架，只是隔着门看着它。',
      '它敲了一会儿，就走了。原来它要的不是进来，是我的注意力。'
    ],
    tags: ['#冥想日记', '#觉察'],
    likes: 12,
    comments: []
  },
  {
    id: 'p6',
    author: '一叶',
    avatarBg: 'g-dawn',
    time: '5天前',
    title: '给刚开始练习的你的三句话',
    excerpt: '一、不要追求"空"。二、酸麻胀痛都是老师。三、下座之后才是真正的练习。',
    content: [
      '一、不要追求"空"。空不是目标，是副产品。追它，它就跑。',
      '二、酸麻胀痛都是老师。它们教你看见"不舒服"和"受苦"是两回事。',
      '三、下座之后才是真正的练习。坐垫上的三十分钟，是为了剩下的二十三个半小时。'
    ],
    tags: ['#正念', '#觉察'],
    likes: 56,
    essence: true,
    comments: [
      { id: 'c8', author: '云淡风轻', content: '第三句收藏了。', time: '4天前' }
    ]
  }
]
