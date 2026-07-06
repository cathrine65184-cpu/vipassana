/**
 * 支付占位模块。
 * 真实流程：云函数 `pay` 调用 cloudPay.unifiedOrder 生成支付参数 → wx.requestPayment。
 * 当前为演示模式：弹出确认框模拟支付成功。
 */

export function requestPayment(opts: { title: string, amount: number, unit?: string }): Promise<void> {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '确认支付（演示）',
      content: `${opts.title}\n¥${opts.amount}${opts.unit || ''}\n\n接入微信支付后此处将调起真实收银台`,
      confirmText: '模拟支付',
      confirmColor: '#B99A5B',
      success(res: any) {
        if (res.confirm) {
          // TODO 生产环境：
          // const { result } = await wx.cloud.callFunction({ name: 'pay', data: {...} })
          // wx.requestPayment(result.payment)
          wx.showLoading({ title: '支付中' })
          setTimeout(() => {
            wx.hideLoading()
            resolve()
          }, 600)
        } else {
          reject(new Error('cancel'))
        }
      },
      fail: () => reject(new Error('fail'))
    })
  })
}
