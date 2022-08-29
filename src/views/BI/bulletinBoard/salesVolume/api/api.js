import request from '@/api/request.js'

export function gmvStatistics(data){
  return request({
    url:'/orders/v1/bi/gmvStatistics',
    method:'POST',
    data
  })
}

export function movingPinStatistics(data){ // 动销
  return request({
    url:'/orders/v1/bi/movingPinStatistics',
    method:'POST',
    data
  })
}

export function gmvDetail(data){ // gmv明细
  return request({
    url:'/orders/v1/bi/gmvDetail',
    method:'POST',
    data
  })
}

export function passengerDetail(data){ // 客单价明细
  return request({
    url:'/orders/v1/bi/passengerDetail',
    method:'POST',
    data
  })
}

export function movingPinDetail(data){ // 动销明细
  return request({
    url:'/orders/v1/bi/movingPinDetail',
    method:'POST',
    data
  })
}

export function jointDetail(data){ // 连带明细
  return request({
    url:'/orders/v1/bi/jointDetail',
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