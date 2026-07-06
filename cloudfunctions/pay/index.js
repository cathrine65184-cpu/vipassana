/**
 * 云函数：pay
 * 微信支付占位——统一下单并返回 wx.requestPayment 所需参数。
 * 前置条件：开通微信支付商户号，并在云开发控制台关联。
 */
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const { body, outTradeNo, totalFee } = event

  // TODO: 生产环境使用 cloudPay 统一下单：
  // const res = await cloud.cloudPay.unifiedOrder({
  //   body,                          // 商品描述，如「应无所住 · 年度会员」
  //   outTradeNo,                    // 商户订单号
  //   spbillCreateIp: '127.0.0.1',
  //   subMchId: '你的商户号',
  //   totalFee,                      // 单位：分
  //   envId: '你的云环境ID',
  //   functionName: 'payCallback'    // 支付回调云函数
  // })
  // return res

  return {
    demo: true,
    message: '演示环境：请接入商户号后启用真实支付',
    openid: OPENID,
    order: { body, outTradeNo, totalFee }
  }
}
