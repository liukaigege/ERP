import request from '@/api/request.js'
import { data } from 'jquery'

// 国贸未解决状态查询
export function tradestatesolve(data) {
  return request({
    url: '/goods/v1/goods/paypal/tradestatesolve',
    method: 'post',
    data
  })
}
export function tradestateunsolve(data) {
  return request({
    url: '/goods/v1/goods/paypal/tradestateunsolve',
    method: 'post',
    data
  })
}

// 获取Paypal
export function queryForPaypal() {
  return request({
    url: '/goods/v1/goods/paypal/queryForPaypal',
    method: 'get'
  })
}
// 国贸未解决同步纠纷
export function saveDispute() {
  return request({
    url: '/goods/v1/goods/paypal/saveDispute',
    method: 'post'
  })
}
// 国贸未解决/已解决导出
export function exportInfo(data) {
  return request({
    url: '/goods/v1/goods/paypal/export',
    method: 'post',
    data
  })
}


// 未解决总的条数
export function unsolvecount(data) {
  return request({
    url: '/goods/v1/goods/paypal/unsolvecount',
    method: 'post',
    data
  })
}