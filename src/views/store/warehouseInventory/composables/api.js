import request from '@/api/request.js'
// P2.创建盘点任务
export function createInfoApi(data) {
	return request({
		url: 'orders/v1/ivt/inventory/createInfo',
		method: 'post',
		data
	})
}
// D01:盘点结果查询列表
export function queryInventoryResultList(data) {
	return request({
		url: 'orders/v1/inventory/resultList',
		method: 'post',
		data
	})
}

// P1.列表 张志芳
export function getInventoryList(data) {
	return request({
		url: 'orders/v1/ivt/inventory/info',
		method: 'post',
		data
	})
}
// D01:批量填充盘平数
export function paddingInventoryList(data) {
	return request({
		url: 'orders/v1/inventory/complete',
		method: 'post',
		data
	})
}
// P7.删除盘点任务 张志芳
export function deleteInfo(data) {
	return request({
		url: 'orders/v1/ivt/inventory/deleteInfo',
		method: 'post',
		data
	})
}
// P3.开启任务 张志芳
export function startInfo(data) {
	return request({
		url: 'orders/v1/ivt/inventory/startInfo',
		method: 'post',
		data
	})
}
// P6.打印盘点单 张志芳
export function printInfo(data) {
	return request({
		url: 'orders/v1/ivt/inventory/printInfo',
		method: 'post',
		data
	})
}
// D05:盘点基本操作
export function getCountingOperation(data) {
	return request({
		url: 'orders/v1/inventory/cancel',
		method: 'post',
		data
	})
}
// P8.获取盘点商品
export function getGoodsBases(data) {
	return request({
		url: 'orders/v1/ivt/inventory/getGoodsBases',
		method: 'post',
		data
	})
}
// D04:盘点结果保存
export function saveInventoryResult(data) {
	return request({
		url: 'orders/v1/inventory/save',
		method: 'post',
		data
	})
}
// D02:导入盘点数据
export function importInventoryList(data) {
	return request({
		url: 'orders/v1/inventory/import',
		method: 'post',
		data
	})
}
// D02:导入盘点数据
export function exportInventoryList(data) {
	return request({
		url: 'orders/v1/inventory/export',
		method: 'post',
		data
	})
}
// P5.明细删除商品
export function deleteDetailList(data) {
	return request({
		url: 'orders/v1/ivt/inventory/deleteDetail',
		method: 'post',
		data
	})
}
// P4.明细添加商品
export function addGoodsApi(data) {
	return request({
		url: 'orders/v1/ivt/inventory/insertDetail',
		method: 'post',
		data
	})
}
// IC02:批量填充入库单价
export function batchFillPriceApi(data) {
	return request({
		url: 'orders/v1/inventoryCheck/batchFillPrice',
		method: 'post',
		data
	})
}
// IC01:盘盈入库/盘亏出库
export function putInOrTakeOutStorageApi(data) {
	return request({
		url: 'orders/v1/inventoryCheck/putInOrTakeOutStorage',
		method: 'post',
		data
	})
}
//IC03:获取异步出入库结果
export function getAsynchResultApi(data) {
	return request({
		url: 'orders/v1/inventoryCheck/getAsynchResult',
		method: 'post',
		data
	})
}
//手动刷新 张志芳
export function updateStock(data) {
	return request({
		url: 'orders/v1/ivt/inventory/updateStock',
		method: 'post',
		data
	})
}

// 查询盘盈入库和盘亏出库是否置灰
export function getButtonStatus(data) {
	return request({
		url: 'orders/v1/inventory/isHandler',
		method: 'post',
		data
	})
}

