// 采购管理- 采购订单
import request from '@/api/request.js'

// 订单编辑详情
export function orderEditDetail(data) {
  return request({
    url: 'orders/v1/ivt/purchase/form',
    method: 'post',
    data
  })
}
// 订单编辑保存
export function ordersUpdate(data) {
  return request({
    url: 'orders/v1/ivt/purchase/update',
    method: 'post',
    data
  })
}

// 订单申请付款详细（多条 查询
export function moreDetail(data) {
  return request({
    url: 'orders/v1/payment/moreDetail',
    method: 'post',
    data
  })
}

// 订单申请付款详细（多条）保存
export function moreDetailSave(data) {
  return request({
    url: 'orders/v1/payment/moreDetailSave',
    method: 'post',
    data
  })
}

//根据账号id查询下有效的收货地址信息

export function selectAddressByAccountId(data) {
  return request({
    url: 'orders/v1/platformAddress/selectAddressByAccountId',
    method: 'post',
    data
  })
}

// 同步收货地址信息
export function syncAddress(data) {
  return request({
    url: 'orders/v1/platformAddress/sync',
    method: 'post',
    data
  })
}

//  获取异常单号详情

export function exceptionInfo(data) {
  return request({
    url: 'orders/v1/purchase/exception/orders',
    method: 'post',
    data
  })
}

// 更换供应商时获取配对信息
export function getPairInfo(data) {
  return request({
    url: 'orders/v1/ivt/purchase/getPairInfo',
    method: 'post',
    data
  })
}

// 再次购买
export function placeAnOrder(data) {
  return request({
    url: 'orders/v1/ivt/purchase/placeAnOrder',
    method: 'post',
    data
  })
}
// 订单信息
export function purchaseOfOrders(data) {
  return request({
    url: 'orders/v1/ivt/purchase/purchaseOfOrders',
    method: 'post',
    data
  })
}
// C15.删除定制采购订单的订单详情关联表
export function deleteItemRels(data) {
  return request({
    url: 'orders/v1/ivt/purchase/deleteItemRels',
    method: 'post',
    data
  })
}
// 关闭采购商品
export function closePurchaseItemOrderRel(data) {
  return request({
    url: 'orders/v1/ivt/purchase/closePurchaseItemOrderRel',
    method: 'post',
    data
  })
}
// 保存关闭采购商品
export function saveClosePurchaseItemOrderRel(data) {
  return request({
    url: 'orders/v1/ivt/purchase/saveClosePurchaseItemOrderRel',
    method: 'post',
    data
  })
}