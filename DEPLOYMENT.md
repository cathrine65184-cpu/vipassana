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

`audio` 字段支持三种来源，播放器自动识别（`InnerAudioContext`，失败降级计时模式）：
1. **包内路径**（如 `/assets/audio/m1-breath.m4a`）——开发/演示期用，压缩至 32kbps HE-AAC；⚠️ 会占主包体积（正式发布主包限 2MB），仅适合临时验证，开发预览需开启 `bigPackageSizeSupport`
2. **云存储 fileID**（`cloud://...`）——推荐的正式方案：云开发控制台 → 存储 → 上传高清母带（`media-master/` 目录）→ 复制 fileID 填入
3. **https 直链**——自有 CDN，需在「开发设置 → 服务器域名」配置 downloadFile 合法域名

上线前请把包内音频迁移到云存储并删除 `miniprogram/assets/audio/` 下的大文件。

### 付费课程视频

课程母版约 638MB，不能放进小程序代码包或 GitHub：

1. 云开发 -> 存储，新建 `course-videos/` 目录。
2. 上传本地 `【禅师】强迫症的内观接纳之旅(含内观康复指导音频课程）/` 中的 14 个文件。
3. 把控制台返回的 `cloud://` fileID 填入 `miniprogram/data/course-media.ts` 对应的 `cloudFileId`。
4. 重新编译；购买后课程播放器会换取临时 URL 播放。

正式上线还必须把购买状态移到云数据库，并由支付回调写入已支付订单。当前演示支付不能作为生产授权依据。

## 五、微信支付

1. 开通微信支付商户号，与小程序关联，云开发控制台绑定
2. 完成 `cloudfunctions/pay/index.js` 中 `cloud.cloudPay.unifiedOrder` 的 TODO
3. 将 `miniprogram/utils/pay.ts` 的演示弹窗替换为：
   ```ts
   const { result } = await wx.cloud.callFunction({ name: 'pay', data: {...} })
   await wx.requestPayment(result.payment)
   ```

## 六、接入大模型（AI 功能）

`cloudfunctions/ai/index.js` 已接入 OpenAI-compatible Chat Completions API。目前“今日反思”会真实调用云函数，不再用本地关键词规则冒充 AI。

在云函数环境变量中配置：

- `AI_API_KEY`：必填，服务端 API Key
- `AI_BASE_URL`：可选，默认 `https://api.deepseek.com/chat/completions`
- `AI_MODEL`：可选，默认 `deepseek-chat`

然后右键 `cloudfunctions/ai` -> “上传并部署：云端安装依赖”。未配置密钥时，前端会明确提示服务未配置，并保留用户输入供重试。

在云函数配置中把执行超时从默认 3 秒调整为 **30 秒**，否则大模型尚未返回时函数可能已超时。

> API Key 绝不能放在 `miniprogram/` 前端目录。日记属于敏感内容，上线前还需补充隐私政策、数据留存/删除机制和危机提示。

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
