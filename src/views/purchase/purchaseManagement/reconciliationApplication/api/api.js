import request from '@/api/request.js'
// P06:分页条件查询对账申请列表
export function queryApplicationList(data) {
	return request({
		url: '/orders/v1/purchaseVerifyApply/pageQuery',
		method: 'post',
		data
	})
}
// P07:采购对账申请各状态统计
export function queryGetTagTotal(data) {
	return request({
		url: '/orders/v1/purchaseVerifyApply/getTagTotal',
		method: 'post',
		data
	})
}
// P08:采购对账申请单批量删除
export function queryBatchDelete(data) {
	return request({
		url: '/orders/v1/purchaseVerifyApply/batchDelete',
		method: 'post',
		data
	})
}
// P09:采购对账申请单批量审核
export function queryBatchApprove(data) {
	return request({
		url: '/orders/v1/purchaseVerifyApply/batchApprove',
		method: 'post',
		data
	})
}
// P10:根据采购对账申请单id批量上传回执
export function queryBatchUploadReceipt(data) {
	return request({
		url: '/orders/v1/purchaseVerifyApply/batchUploadReceipt',
		method: 'post',
		data
	})
}
// P11:批量取消采购对账单申请
export function queryBatchCancelt(data) {
	return request({
		url: '/orders/v1/purchaseVerifyApply/batchCancel',
		method: 'post',
		data
	})
}
// P12:查看采购对账申请单详情
export function queryGetDetail(data) {
	return request({
		url: '/orders/v1/purchaseVerifyApply/getDetail',
		method: 'post',
		data
	})
}
// P13:对账申请单保存（保存并提交审批）
export function queryAccountSave (data) {
	return request({
		url: 'orders/v1/purchaseVerifyApply/save',
		method: 'post',
		data
	})
}
// P18:采购对账申请-查询申请人列表
export function queryPurchaseVerifyApplicant (data) {
	return request({
		url: 'orders/v1/purchaseVerifyApply/queryPurchaseVerifyApplicant',
		method: 'post',
		data
	})
}
//P15:查询导出模板
export function queryExpotInfos(data){
  return request({
    url:'orders/export/template/infos',
    method:'post',
    data
  })
}
//P18:获取导出选项列表
export function queryExportItems(data){
  return request({
    url:'orders/export/items',
    method:'post',
    data
  })
}
//P05:导出定制化SKU信息
export function exportCustomized(data){
  return request({
    url:'orders/v1/purchaseVerify/exportCustomized',
    method:'post',
    data
  })
}
//X07:对账单申请导出
export function exportList(data){
  return request({
    url:'orders/v1/verifyApply/export',
    method:'post',
    data
  })
}