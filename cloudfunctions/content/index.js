/**
 * 云函数：content
 * CMS 占位——按集合名返回内容，前端 data/*.ts 的云端替换版。
 * 建议集合：courses / meditations / posts / quotes / cards / retreat
 *
 * 调用方式：
 *   wx.cloud.callFunction({ name: 'content', data: { collection: 'courses' } })
 */
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const ALLOWED = ['courses', 'meditations', 'posts', 'quotes', 'cards', 'retreat', 'badges']

exports.main = async (event) => {
  const { collection, limit = 50, skip = 0 } = event
  if (ALLOWED.indexOf(collection) < 0) {
    return { error: `collection not allowed: ${collection}` }
  }

  const db = cloud.database()
  try {
    const res = await db.collection(collection).skip(skip).limit(limit).get()
    return { data: res.data }
  } catch (e) {
    // 集合尚未创建时返回空数组，前端回退到本地 mock 数据
    return { data: [], notice: '云端集合未初始化，前端将使用本地数据' }
  }
}
