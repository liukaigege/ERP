import request from '@/api/request.js'

export function exceptionList(data){ // 列表
  return request({
    url:'orders/v1/inout/exception/list',
    method:'post',
    data
  })
}

export function exceptionProcess(data){ // 处理
  return request({
    url:'orders/v1/inout/exception/process',
    method:'post',
    data
  })
}

export function exceptionDetail(data){ // 详情
  return request({
    url:'orders/v1/inout/exception/detail',
    method:'post',
    data
  })
}

// P12.获取所有物流方式
export function ivtLogisticses (data) {
  return request({
    url: '/orders/v1/ivt/purchase/ivtLogisticses',
    method: 'post',
    data
  })
}

export function execption(data){
  return request({
    url: '/orders/v1/execption/export',
    method: 'post',
    data
  })
}