// 供应商管理-平台授权接口
import request from '@/api/request.js'

// 获取平台授权账号列表
export function getAccountList() {
  return request({
    url: 'orders/v1/supplier/account/queryAccountList',
    method: 'post'
  })
}

// 根据id获取平台授权账号详情
export function getAccountInfo(data) {
  return request({
    url: 'orders/v1/supplier/account/getAccountInfoById',
    method: 'post',
    data
  })
}

// 添加平台授权账号
export function add(data) {
  return request({
    url: 'orders/v1/supplier/account/saveAccount',
    method: 'post',
    data
  })
}

// 删除平台授权账号
export function del(data) {
  return request({
    url: 'orders/v1/supplier/account/deleteAccountById',
    method: 'post',
    data
  })
}

// 修改平台授权账号
export function edit(data) {
  return request({
    url: 'orders/v1/supplier/account/editAccount',
    method: 'post',
    data
  })
}
