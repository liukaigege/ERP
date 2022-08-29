import request from '@/api/request.js'

export function getExchangeRataListPage (data) {
  return request({
    url: 'orders/v1/currency/rate/listPage',
    method: 'post',
    data
  })
}

export function getExchangeHistory (data) {
  return request({
    url: 'orders/v1/currency/rate/history',
    method: 'post',
    data
  })
}

export function verifyCheckComplate(data){ // 完成对账
  return request({
    url:'/orders/v1/verifyCheck/complate',
    method:'POST',
    data
  })
}

export function verifyCheckRefuse(data){ // 拒绝对账
  return request({
    url:'/orders/v1/verifyCheck/refuse',
    method:'POST',
    data
  })
}

export function verifyCheckPageQuery(data){ // 列表查询
  return request({
    url:'/orders/v1/verifyCheck/pageQuery',
    method:'POST',
    data
  })
}

export function verifyCheckGetDetail(data){ // 明细查询
  return request({
    url:'/orders/v1/verifyCheck/getDetail',
    method:'POST',
    data
  })
}
export function verifyCheckExport(data){ // 导出
  return request({
    url:'/orders/v1/verifyCheck/export',
    method:'POST',
    data
  })
}
export function paymentCheckExport(data){ // 导出
  return request({
    url:'/orders/v1/paymentCheck/export',
    method:'POST',
    data
  })
}
