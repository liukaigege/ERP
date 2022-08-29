
import request from '@/api/request.js'

// P15.采购入库列表
export function purchaseWarehouses(data) {
  return request({
    url: '/orders/v1/ivt/purchase/purchaseWarehouses',
    method: 'post',
    data
  })
}

//
export function purchaseWarehousesDetail(data) {
  return request({
    url: '/orders/v1/ivt/purchase/purchaseWarehousesDetail',
    method: 'post',
    data
  })
}