import request from '@/api/request.js'
import { data } from 'jquery'

// 批量删除
export function deleteOrder(data) {
  return request({
    url: '/orders/v1/order/blackManager/delete',
    method: 'post',
    data
  })
}
// 新增或修改 
export function addOrUpdate(data) {
  return request({
    url: '/orders/v1/order/blackManager/addOrUpdate',
    method: 'post',
    data
  })
}
//查询
export function listPage(data) {
  return request({
    url: '/orders/v1/order/blackManager/listPage',
    method: 'post',
    data
  })
}