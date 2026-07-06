# 部署指南 · VIPASSANA 应无所住

## 一、本地运行（0 配置）

1. 微信开发者工具 → 导入项目 → 选择本目录
2. AppID：没有正式 AppID 时选「测试号」
3. 编译即可预览全部功能（数据为本地 Mock）

> Vant Weapp 已预构建至 `miniprogram/miniprogram_npm/`。
> 若删除后需重建：`cd miniprogram && npm install`，然后工具菜单 → 「构建 npm」。

## 二、注册正式小程序

1. [mp.weixin.qq.com](https://mp.weixin.qq.com) 注册小程序，取得 AppID
2. 将 `project.config.json` 中 `appid` 替换为你的 AppID
3. 类目建议：教育 > 在线教育 / 生活服务 > 心理咨询（含知识付费需相应资质）

## 三、开通云开发

1. 开发者工具 → 「云开发」→ 开通，记下环境 ID
2. `miniprogram/app.ts` 中取消注释并填入：
   ```ts
   wx.cloud.init({ env: 'your-cloud-env-id', traceUser: true })
   ```
3. 部署云函数：右键 `cloudfunctions/` 下每个目录 → 「上传并部署：云端安装依赖」
   - `login` 登录（openid）
   - `pay` 支付（需商户号）
   - `ai` AI 能力路由（接大模型 API）
   - `content` 内容 CMS
4. 创建数据库集合并导入数据：
   `courses` `meditations` `posts` `quotes` `cards` `retreat` `badges` `users` `checkins` `journal`
   （初始数据可直接复制 `miniprogram/data/*.ts` 中的数组，转 JSON 导入）

## 四、音频资源

1. 冥想音频上传到云存储（或自有 CDN，需在「开发设置 → 服务器域名」配置 downloadFile 合法域名）
2. 将 fileID / URL 填入 `meditations` 集合（本地开发填 `data/meditations.ts` 的 `audio` 字段）
3. 播放器检测到 `audio` 非空时自动切换为真实播放（`InnerAudioContext`）

## 五、微信支付

1. 开通微信支付商户号，与小程序关联，云开发控制台绑定
2. 完成 `cloudfunctions/pay/index.js` 中 `cloud.cloudPay.unifiedOrder` 的 TODO
3. 将 `miniprogram/utils/pay.ts` 的演示弹窗替换为：
   ```ts
   const { result } = await wx.cloud.callFunction({ name: 'pay', data: {...} })
   await wx.requestPayment(result.payment)
   ```

## 六、接入大模型（AI 功能）

`cloudfunctions/ai/index.js` 按 action 路由：

| action | 功能 | 提示词要点 |
|---|---|---|
| `coach` | 正念教练 | 永不给建议，只用开放式提问引导觉察 |
| `reflect` | 日记小结 | 输出 `{ emotions: string[], summary: string }` |
| `dailySentence` | 每日一句 | 配合云开发「定时触发器」每天清晨生成 |

前端只需把 `utils/ai.ts` 各函数替换为对应云函数调用，页面零改动。
> 注意：大模型 API 地址需加入云函数出网白名单；内容需符合平台审核规范。

## 七、订阅消息（每日提醒 / 禁语提醒）

1. mp 后台 → 订阅消息 → 申请模板（如「每日冥想提醒」）
2. 设置页开关处调用 `wx.requestSubscribeMessage`
3. 云函数定时触发器每日推送

## 八、发布

1. 开发者工具 → 上传代码 → mp 后台提交审核
2. 检查清单：
   - [ ] 替换正式 AppID
   - [ ] 云环境 ID 已配置
   - [ ] `urlCheck` 恢复为 true（`project.config.json`）
   - [ ] 隐私协议已在后台配置（涉及用户发布内容/昵称）
   - [ ] 支付资质与类目齐全

## GitHub

```bash
git remote add origin git@github.com:<you>/vipassana.git
git push -u origin main
```
