import request from '@/api/request.js'

// X01: 采购付款申请列表
export function list(data) {
  return request({
    url: '/orders/v1/payment/list',
    method: 'post',
    data
  })
}

// X02: 采购付款申请编辑 / 详情
export function detailInfo(data) {
  return request({
    url: '/orders/v1/payment/detail',
    method: 'post',
    data
  })
}

// X03: 采购付款申请编辑保存 / 提交审核
export function submitInfo(data) {
  return request({
    url: '/orders/v1/payment/submit',
    method: 'post',
    data
  })
}

//X04:采购付款申请草稿提交审核/未通过重新提交
export function reSubmit(data) {
  return request({
    url: '/orders/v1/payment/reSubmit',
    method: 'post',
    data
  })
}

// X05:采购付款申请删除
export function remove(data) {
  return request({
    url: '/orders/v1/payment/remove',
    method: 'post',
    data
  })
}

// X06: 采购付款申请采购员下拉列表
export function buyer(data) {
  return request({
    url: '/orders/v1/payment/buyer',
    method: 'post',
    data
  })
}
// : 采购付款申请采购员下拉列表（新接口）
export function purchaseUser(data) {
  return request({
    url: '/orders/v1/payment/purchaseUser',
    method: 'post',
    data
  })
}
// X08:导出付款申请信息
export function exportInfo(data) {
  return request({
    url: '/orders/v1/payment/export',
    method: 'post',
    data
  })
}

//X10:订单申请付款详细（多条）
export function moreDetail(data) {
  return request({
    url: '/orders/v1/payment/moreDetail',
    method: 'post',
    data
  })
}


// X11.订单申请付款详细（多条）保存
export function moreDetailSave(data) {
  return request({
    url: '/orders/v1/payment/moreDetailSave',
    method: 'post',
    data
  })
}

// X12.查询付款申请状态数量
export function statusCount() {
  return request({
    url: '/orders/v1/payment/statusCount',
    method: 'post',
  })
}

///api/orders/v1/payment/cancel
// X13: 采购付款申请申请中取消
export function paymentCancel(data) {
  return request({
    url: '/orders/v1/payment/cancel',
    method: 'post',
    data
  })
}

export function getCreateByList(data) {
  return request({
    url: '/orders/v1/payment/createByList',
    method: 'post',
    data
  })
}
