// 供应商管理接口
import request from '@/api/request.js'

// 供应商管理列表接口
export function getSupplierList(data) {
  return request({
    url: 'orders/v1/supplier/pageQuery',
    method: 'post',
    data
  })
}

// 根据供应商id查询供应商详情
export function getSupplier(data) {
  return request({
    url: 'orders/v1/supplier/detail',
    method: 'post',
    data
  })
}

// 根据供应商id删除供应商
export function del(data) {
  return request({
    url: 'orders/v1/supplier/delete',
    method: 'post',
    data
  })
}

// 新增供应商
export function add(data) {
  return request({
    url: 'orders/v1/supplier/add',
    method: 'post',
    data
  })
}

// 编辑供应商
export function edit(data) {
  return request({
    url: 'orders/v1/supplier/edit',
    method: 'post',
    data
  })
}

// 查询所有创建过供应商的账号姓名
export function getCreateBy() {
  return request({
    url: 'orders/v1/supplier/getSupplierCreateBy',
    method: 'post'
  })
}

// 根据店铺主页查询第三方平台供应商信息
export function getThirdSupplier(data) {
  return request({
    url: 'orders/v1/supplier/getThirdSupplier',
    method: 'post',
    data
  })
}