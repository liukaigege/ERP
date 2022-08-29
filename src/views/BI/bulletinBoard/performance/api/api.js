import request from '@/api/request.js'
export function queryDeliveryRate(data){ // t+6
  return request({
    url:'/orders/v1/bi/honourAnAgreement/queryDeliveryRate',
    method:'POST',
    data
  })
}
export function queryCorrectDistributeRate(data){ // t+14
  return request({
    url:'/orders/v1/bi/honourAnAgreement/queryCorrectDistributeRate',
    method:'POST',
    data
  })
}
export function queryHonourAnAgreementRate(data){ // t+20
  return request({
    url:'/orders/v1/bi/honourAnAgreement/queryHonourAnAgreementRate',
    method:'POST',
    data
  })
}

export function exportDeliveryDetail(data){ // 发货导出
  return request({
    url:'/orders/v1/bi/honourAnAgreement/exportDeliveryDetail',
    method:'POST',
    data
  })
}

export function exportCorrectDistributeDetail(data){ // 妥投导出
  return request({
    url:'/orders/v1/bi/honourAnAgreement/exportCorrectDistributeDetail',
    method:'POST',
    data
  })
}

export function exportHonourAnAgreementDetail(data){ // 履约导出
  return request({
    url:'/orders/v1/bi/honourAnAgreement/exportHonourAnAgreementDetail',
    method:'POST',
    data
  })
}

export function progress(data) { // 查询进度条
  return request({
      url: 'basic/progress',
      method: 'POST',
      data
  })
}