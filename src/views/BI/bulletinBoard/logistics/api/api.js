import request from '@/api/request.js'
export function getBiAllLogistics(data){ // 物流商列表
  return request({
    url:'/orders/v1/bi/logistics/getBiAllLogistics',
    method:'POST',
    data
  })
}

export function queryNotSignedTrackSummary(data){ // 进程跟踪
  return request({
    url:'/orders/v1/bi/logistics/queryNotSignedTrackSummary',
    method:'POST',
    data
  })
}

export function queryNodeStatusSummary(data){ // 异常环节
  return request({
    url:'/orders/v1/bi/logistics/queryNodeStatusSummary',
    method:'POST',
    data
  })
}

export function querySignInRateSummary(data){ // 签收率
  return request({
    url:'/orders/v1/bi/logistics/querySignInRateSummary',
    method:'POST',
    data
  })
}

export function exprotNodeStatusSummary(data){ // 异常环节
  return request({
    url:'/orders/v1/bi/logistics/exprotNodeStatusSummary',
    method:'POST',
    data
  })
}

export function exprotNotSignedTrackSummary(data){ // 进程跟踪
  return request({
    url:'/orders/v1/bi/logistics/exprotNotSignedTrackSummary',
    method:'POST',
    data
  })
}

export function exprotSignInRateSummary(data){ // 签收率
  return request({
    url:'/orders/v1/bi/logistics/exprotSignInRateSummary',
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
export function getTrackStatus(data) { // 物流状态
  return request({
      url: 'orders/v1/bi/logistics/getTrackStatus',
      method: 'POST',
      data
  })
}

export function getItems(data) { // 导出字段
  return request({
      url: 'orders/v1/bi/export/getItems',
      method: 'POST',
      data
  })
}