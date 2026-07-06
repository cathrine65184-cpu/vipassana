/**
 * 云函数：login
 * 登录占位——返回用户 openid，前端据此建立/查询用户档案。
 * 部署：在微信开发者工具中右键本目录 →「上传并部署：云端安装依赖」。
 */
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async () => {
  const { OPENID, APPID, UNIONID } = cloud.getWXContext()

  // TODO: 在 users 集合中 upsert 用户档案
  // const db = cloud.database()
  // await db.collection('users').where({ openid: OPENID }).get() ...

  return {
    openid: OPENID,
    appid: APPID,
    unionid: UNIONID
  }
}
