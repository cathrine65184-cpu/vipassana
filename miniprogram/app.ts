/**
 * VIPASSANA · 应无所住
 * 应用入口：初始化云开发、本地存储与每日内容。
 */
import { ensureDefaults, getState, setState } from './utils/store'
import { dailySentence, todayKey } from './utils/ai'

App({
  globalData: {
    theme: 'light' as 'light' | 'dark'
  },

  onLaunch() {
    // ---- 云开发初始化（占位：填入你的环境 ID 后即可使用云函数/云数据库）----
    if (wx.cloud) {
      try {
        wx.cloud.init({
          // env: 'your-cloud-env-id',
          traceUser: true
        })
      } catch (e) {
        // 未开通云开发时静默降级为纯本地模式
      }
    }

    ensureDefaults()

    // 每日一句：每天清晨生成一条觉察句子（AI 占位，本地生成 + 云函数可替换）
    const state = getState()
    if (state.dailySentenceDate !== todayKey()) {
      setState({
        dailySentenceDate: todayKey(),
        dailySentence: dailySentence()
      })
    }

    // 跟随系统深浅色
    const sys = wx.getSystemInfoSync()
    this.globalData.theme = sys.theme === 'dark' ? 'dark' : 'light'
    if (wx.onThemeChange) {
      wx.onThemeChange((res: any) => {
        this.globalData.theme = res.theme
      })
    }
  }
})
