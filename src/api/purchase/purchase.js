import request from '@/api/request.js'

export function getImportOrderListPage(data) {
	return request({
		url: 'orders/v1/purchase/listPage',
		method: 'post',
		data
	})
}

export function getSupplierList() {
	return request({
		url: 'orders/v1/purchase/supplier/list',
		method: 'post'
	})
}

export function uploadImportOrder(data) {
	return request({
		url: 'orders/v2/purchase/upload',
		method: 'post',
		data
	})
}

export function importOrder(data) {
	return request({
		url: 'orders/v2/purchase/import',
		method: 'post',
		data: data
	})
}

export function cancelImportOrder(data) {
	return request({
		url: 'orders/v1/purchase/del',
		method: 'post',
		data
	})
}

export function closeImportOrder(data) {
	return request({
		url: 'orders/v1/purchase/changeIsClose',
		method: 'post',
		data
	})
}

export function getImportOrderDetail(data) {
	return request({
		url: 'orders/v1/purchase/details',
		method: 'post',
		data
	})
}

export function exportImportOrderDetail(data) {
	return request({
		url: 'orders/v1/purchase/details/export',
		method: 'post',
		data
	})
}

export function downloadImportOrder(data) {
	return request({
		url: 'orders/v1/purchase/download',
		method: 'post',
		data
	})
}

export function getSupplierListPage(data) {
	return request({
		url: 'orders/v1/supplier/listPage',
		method: 'post',
		data
	})
}

export function addSupplier(data) {
	return request({
		url: 'orders/v1/supplier/save',
		method: 'post',
		data: data
	})
}

export function updateSupplier(data) {
	return request({
		url: 'orders/v1/supplier/update',
		method: 'post',
		data: data
	})
}

export function deleteSupplier(data) {
	return request({
		url: 'orders/v1/supplier/del',
		method: 'post',
		data
	})
}

export function batchAddTrackNumber(data) {
	return request({
		url: 'orders/v1/purchase/track/number/add',
		method: 'post',
		data
	})
}

export function supplierGetTree(data) {
	return request({
		url: 'orders/v1/supplier/getTree',
		method: 'get',
		data
	})
}

export function downloadQrCodePdf(data) {
	return request({
		url: 'orders/v1/purchase/qrcode/print',
		method: 'post',
		data
	})
}

// P1.采购订单列表
export function purchaseOrdersList(data) {
	return request({
		url: 'orders/v1/ivt/purchase/list',
		method: 'post',
		data
	})
}

// 获取备注列表
export function remarkTypes(data) {
	return request({
		url: 'orders/v1/ivt/remark/getRemarkTypes',
		method: 'post',
		data
	})
}

// 获取备注列表
export function purchaseUsers(data) {
	return request({
		url: 'orders/v1/ivt/purchase/getPurchaseUsers',
		method: 'post',
		data
	})
}

// P21.获取采购订单各状态统计
export function purchaseStatusNum(data) {
	return request({
		url: 'orders/v1/ivt/purchase/statusNum',
		method: 'post',
		data
	})
}

// P6.根据订单和备注类型获取备注列表
export function remarkDetail(data) {
	return request({
		url: 'orders/v1/ivt/purchase/getRemarks',
		method: 'post',
		data
	})
}

// P23.保存备注
export function saveRemark(data) {
	return request({
		url: 'orders/v1/ivt/purchase/saveRemark',
		method: 'post',
		data
	})
}

// P8.订单审核
export function purchaseExamine(data) {
	return request({
		url: 'orders/v1/ivt/purchase/examine',
		method: 'post',
		data
	})
}

// P9.订单作废
export function purchaseToVoid(data) {
	return request({
		url: 'orders/v1/ivt/purchase/toVoid',
		method: 'post',
		data
	})
}

// P22.1688下单
export function createOrderTo1688(data) {
	return request({
		url: 'orders/v1/ivt/purchase/createOrderTo1688',
		method: 'post',
		data
	})
}

// P14.订单取消/还原
export function purchaseCancelReduction(data) {
	return request({
		url: 'orders/v1/ivt/purchase/cancelReduction',
		method: 'post',
		data
	})
}

// P7.订单删除
export function purchaseDelete(data) {
	return request({
		url: 'orders/v1/ivt/purchase/delete',
		method: 'post',
		data
	})
}

// P7.订单删除
export function printPurchases(data) {
	return request({
		url: 'orders/v1/ivt/purchase/printPurchases',
		method: 'post',
		data
	})
}

// P3.商品明细
export function getPurchaseDetail(data) {
	return request({
		url: 'orders/v1/ivt/purchase/itemList',
		method: 'post',
		data
	})
}

// P19.修改平台订单号
export function updateThirdId(data) {
	return request({
		url: '/orders/v1/ivt/purchase/updateThirdId',
		method: 'post',
		data
	})
}

// P18.获取运单号信息
export function getLogisticses(data) {
	return request({
		url: '/orders/v1/ivt/purchase/getLogisticses',
		method: 'post',
		data
	})
}

// P12.获取所有物流方式
export function ivtLogisticses(data) {
	return request({
		url: '/orders/v1/ivt/purchase/ivtLogisticses',
		method: 'post',
		data
	})
}

// P13.保存运单号
export function saveLogisticses(data) {
	return request({
		url: '/orders/v1/ivt/purchase/saveLogisticses',
		method: 'post',
		data
	})
}

// U201.待到货-收货异常
export function exceptionList(data) {
	return request({
		url: '/orders/v1/purchase/exception/list',
		method: 'post',
		data
	})
}

// U203.查询用户
export function exceptionUser(data) {
	return request({
		url: '/orders/v1/purchase/exception/user',
		method: 'post',
		data
	})
}

// S15:同步采购订单：同步状态为待到货，并且所属供应商为1688的所有采购订单的物流信息
export function syncOrder(data) {
	return request({
		url: '/orders/v1/purchaseOrdersLogistics/sync',
		method: 'post',
		data
	})
}

// P2.导出订单
export function purchaseExport(data) {
	return request({
		url: '/orders/v1/ivt/purchase/export',
		method: 'post',
		data
	})
}

// P2.导出订单
export function purchaseOrderDetail(data) {
	return request({
		url: '/orders/v1/purchase/order/detail',
		method: 'post',
		data
	})
}

// 日志列表
export function sysLogList(data) {
	return request({
		url: '/logs/v1/sysLog/list',
		method: 'post',
		data
	})
}

// P27.采购订单备注信息
export function purchaseOrdersRemarks(data) {
	return request({
		url: '/orders/v1/ivt/purchase/purchaseOrdersRemarks',
		method: 'post',
		data
	})
}

// P26.备注详情
export function remarkDetails(data) {
	return request({
		url: '/orders/v1/ivt/purchase/remarkDetail',
		method: 'post',
		data
	})
}

// P25.删除备注
export function deleteRemark(data) {
	return request({
		url: '/orders/v1/ivt/purchase/deleteRemark',
		method: 'post',
		data
	})
}

// U202.待到货-收货异常-处理
export function exceptionProcess(data) {
	return request({
		url: '/orders/v1/purchase/exception/process',
		method: 'post',
		data
	})
}

// 导出订单后获取文件
export function basicProgress(data) {
	return request({
		url: '/basic/progress',
		method: 'post',
		data
	})
}

// Z30.采购订单/缺货采购 列表,跳转商品详情页校验
export function goodsCheck(data) {
	return request({
		url: '/goods/v1/goods/quotation/goods/check',
		method: 'post',
		data
	})
}

// 获取同步采购订单结果
export function getSyncResult(data) {
	return request({
		url: '/orders/v1/purchaseOrdersLogistics/getSyncResult',
		method: 'post',
		data
	})
}

export function purchaseProgress(data) {
	return request({
		url: '/orders/progress',
		method: 'post',
		data
	})
} // 进度条

// 查询对账申请列表
export function queryApplicationList(data) {
	return request({
		url: '/orders/v1/purchaseVerifyApply/pageQuery',
		method: 'post',
		data
	})
}

// 导出定制订单
export function exportCustomized(data) {
	return request({
		url: '/orders/v1/ivt/purchase/exportCustomized',
		method: 'post',
		data
	})
}
//修改配件信息表单页面
export function partsRelForm(data) {
	return request({
		url: 'orders/v1/ivt/purchase/partsRelForm',
		method: 'post',
		data
	})
}

// 修改配件信息保存
export function savePartsRel(data) {
	return request({
		url: 'orders/v1/ivt/purchase/savePartsRel',
		method: 'post',
		data
	})
}

//
export function queryPurchaseOrder(data) {
	return request({
		url: 'orders/v1/ivt/purchase/export/items',
		method: 'post',
		data
	})
}

// 采购订单  全部订单--导出
export function allPurchaseExport(data) {
	return request({
		url: 'orders/v2/ivt/purchase/export',
		method: 'post',
		data
	})
}

// 采购订单-待到货-导入配件金额
export function importAccessory(data) {
	return request({
		url: 'orders/v1/ivt/purchase/importParts',
		method: 'post',
		data
	})
}
