export const caseReason = [
  '物品未收到',
  '描述不符',
  '未经授权',
  '退费未得到处理',
  '取消重复计费',
  '金额错误',
  '汇款问题',
  '其他',
]
export const caseType = [
  {
    value: 'OPEN',
    label: '争议是公开的',
  },
  {
    value: 'WAITING_FOR_BUYER_RESPONSE',
    label: '正在等待买家的回复',
  },
  {
    value: 'WAITING_FOR_SELLER_RESPONSE',
    label: '正在等待卖家的回复',
  },
  {
    value: 'UNDER_REVIEW',
    label: 'PayPal正在审查',
  },
  {
    value: 'RESOLVED',
    label: '事件已结束',
  }, {
    value: 'OTHER',
    label: '其他',
  }
]
export const result = [{
  label: '争议以对客户有利的方式解决',
  value: 'RESOLVED_BUYER_FAVOUR'
}, {
  label: '争端以有利于商家的方式解决',
  value: 'RESOLVED_SELLER_FAVOUR'
}, {
  label: 'PayPal 为商家或客户提供了保护，案件得到解决',
  value: 'RESOLVED_WITH_PAYOUT'
}, {
  label: '客户取消了争议',
  value: 'CANCELED_BY_BUYER'
}, {
  label: '贝宝接受了争议',
  value: 'ACCEPTED'
}, {
  label: '贝宝否认了这一争议',
  value: 'DENIED'
}, {
  label: '为同一个交易 ID 创建了一个争议，之前的争议在没有任何决定的情况下被关闭',
  value: 'NONE'
},]

//时间选择器只能选择180天内的时间
export function disabledDate(time) {
  let nowTimeStamp = new Date().getTime()
  let MaxTimeStamp = 180 * 24 * 3600 * 1000
  let differenceTimeStamp = nowTimeStamp - MaxTimeStamp
  return time.getTime() > Date.now() || time.getTime() < differenceTimeStamp
}