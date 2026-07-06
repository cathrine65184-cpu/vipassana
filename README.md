# VIPASSANA · 应无所住

> 内观 · 觉知 · 正念 · 自由
> *it is what it is*

一款以内观（Vipassana）哲学为核心的微信小程序：不止是冥想 App，而是一位终身觉察伴侣。
设计语言：极简 · MUJI · Apple HIG · 禅意 · 自然 · 慢生活。

## ✨ 功能总览

| 模块 | 内容 |
|---|---|
| 🏠 首页 | 品牌 Hero（呼吸动画 Logo）、四大支柱卡（内观/觉知/正念/自由）、今日禅语、今日冥想、打卡进度环 + 周进度 |
| 📖 课程 | 四条学习路径（源于真实课程 PDF）：内观基础录播 ¥399 / 月度直播 ¥399/期 / 1V1 咨询 ¥500/时 / 3V1 团导 ¥2699/月；章节（视频/音频/图文/测验/实修）、试学、进度、完课徽章、支付解锁 |
| 🌿 社区 | 瀑布流、搜索、话题标签、推荐（热度）/最新/精华/我的圈子、发帖、点赞、收藏、关注、评论 |
| 🎧 冥想 | 8 大分类 12 条音频、播放器（±15s / 倍速 / 定时 / 循环 / 背景音 / 下载 / 收藏）、情绪识别推荐、每日打卡、日历、周/月图表、成就徽章（7/30/100/365 天） |
| 👤 我的 | 头像昵称、冥想等级、VIP 订阅（月/年/终身）、已购课程、收藏、下载、我的帖子、设置（深色/语言/通知/反馈/关于/隐私） |

### 🤖 AI 特色功能（8 项）

1. **AI 觉察日记** `pages/reflection` — 写日记，AI 总结情绪模式
2. **AI 正念教练** `pages/coach` — 只提问、不建议的对话陪伴
3. **情绪识别** 冥想页 — 选情绪 → 推荐冥想
4. **觉察之旅** `pages/tree` — 练习成长为一棵会开花的树
5. **每日一句** 首页 Hero — 每天清晨生成一句觉察句
6. **智慧卡片** `pages/cards` — 可滑动的正念卡片
7. **静默模式** `pages/silent` — 只有呼吸动画与计时
8. **禅修营模式** `pages/retreat` — 十日内观日程 + 禁语提醒（离线可用）

> AI 功能当前由 `miniprogram/utils/ai.ts` 本地规则实现，接口形状与云函数 `cloudfunctions/ai` 一致；
> 接入大模型后前端零改动。

## 🚀 快速开始

1. 安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 「导入项目」→ 选择本目录 → AppID 选「测试号」即可
3. 直接编译运行 ✅

无需任何构建步骤：
- TypeScript 由开发者工具编译（已配置 `useCompilerPlugins`）
- Vant Weapp 已预构建到 `miniprogram/miniprogram_npm/`（如需重新构建：工具 → 构建 npm）
- 所有数据本地 Mock，无需后端

## 🗂 目录结构

```
vipassana/
├── project.config.json        # 开发者工具配置（TS 编译、云函数根目录）
├── tsconfig.json
├── miniprogram/
│   ├── app.{ts,json,wxss}     # 入口 / 路由 / 设计系统（深色模式适配）
│   ├── theme.json             # 导航栏深浅色变量
│   ├── assets/                # Logo（白/绿）、分享封面
│   ├── custom-tab-bar/        # 悬浮圆角 TabBar
│   ├── components/            # progress-ring / empty-state / section-title
│   ├── data/                  # ★ CMS-ready Mock 数据（courses/meditations/posts/quotes/cards/badges/emotions/retreat）
│   ├── utils/                 # store（本地状态）/ ai（AI 层）/ pay（支付占位）
│   └── pages/                 # 18 个页面
└── cloudfunctions/            # 云函数占位：login / pay / ai / content
```

## 🎨 设计系统

- **色板**：深林绿 `#203228` · 暖米白 `#F7F4EE` · 柔金 `#B99A5B` · 白
- **深色模式**：`darkmode: true` + `theme.json` + WXSS `prefers-color-scheme`，跟随系统
- **排版**：中文标题使用宋体系衬线（`display` class），正文苹方；大量留白
- **组件**：圆角卡片、柔和阴影、骨架屏、空状态、页面淡入、微交互（按压缩放、呼吸动画）

## 🔌 接入后端（CMS-ready）

所有内容数据集中在 `miniprogram/data/*.ts`，结构即云数据库文档结构：

| 本地文件 | 云集合 | 替换方式 |
|---|---|---|
| data/courses.ts | courses | `wx.cloud.callFunction({ name: 'content', data: { collection: 'courses' } })` |
| data/meditations.ts | meditations | 同上；`audio` 字段填云存储 fileID 即可真实播放 |
| data/posts.ts | posts | 同上 |
| data/quotes.ts / cards.ts / retreat.ts | quotes / cards / retreat | 同上 |

用户状态（打卡、购买、收藏、日记…）集中在 `utils/store.ts`，同样按文档结构设计。

## 💳 支付 / 登录

- `utils/pay.ts`：演示模式弹窗模拟支付；生产接 `cloudfunctions/pay`（cloudPay 统一下单）+ `wx.requestPayment`
- `cloudfunctions/login`：返回 openid，接 `wx.getUserProfile` 完善资料

详见 [DEPLOYMENT.md](DEPLOYMENT.md)。

## 📄 License

MIT
