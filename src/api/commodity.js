import request from './request.js'

export function exportList() {
  return request({
    url: 'orders/v1/goods/manage/export/fields',
    method: 'post'
  })
}
export function exportText(data) {
  return request({
    url: 'orders/v1/goods/manage/export',
    method: 'post',
    data
  })
}
export function manageList(data) {
  return request({
    url: 'orders/v1/goods/manage/list',
    method: 'post',
    data
  })
}

export function userUpdate(data) {
  return request({
    url: 'orders/v1/goods/purchase/user/update',
    method: 'post',
    data
  })
}

export function manageInfo(data) {
  return request({
    url: 'orders/v1/goods/manage/info',
    method: 'post',
    data
  })
}

// Z14.商品备注列表
export function remarkList(data) {
  return request({
    url: 'goods/v1/goods/remark/list',
    method: 'post',
    data: data
  })
}

// Z14.商品添加备注
export function remarkAdd(data) {
  return request({
    url: 'goods/v1/goods/remark/add',
    method: 'post',
    data: data
  })
}
// Z14.商品删除备注
export function remarkDel(data) {
  return request({
    url: 'goods/v1/goods/remark/del',
    method: 'post',
    data: data
  })
}

// Z14.商品编辑备注
export function remarkUpdate(data) {
  return request({
    url: 'goods/v1/goods/remark/update',
    method: 'post',
    data: data
  })
}

export function supplierInfo(data) {
  return request({
    url: 'orders/v1/goods/manage/supplier/info',
    method: 'post',
    data: data
  })
}
export function supplierUpdate(data) {
  return request({
    url: 'orders/v1/goods/manage/supplier/update',
    method: 'post',
    data: data
  })
}

export function supShop(data) {
  return request({
    url: "orders/v1/ivt/purchase/getExternalGoods",
    method: 'post',
    data,
  })
}

export function stockInfo(data) { // 库存信息
  return request({
    url: "orders/v1/goods/manage/stock/info",
    method: 'post',
    data,
  })
}

export function supplierDefault(data) { // 设置默认供应商
  return request({
    url: "orders/v1/goods/manage/supplier/default",
    method: 'post',
    data,
  })
}


export function supplierRemove(data) { // 移除供应商
  return request({
    url: "orders/v1/goods/manage/supplier/remove",
    method: 'post',
    data,
  })
}
export function pairRemove(data) { // 配对
  return request({
    url: "orders/v1/goods/manage/supplier/pair/remove",
    method: 'post',
    data,
  })
}