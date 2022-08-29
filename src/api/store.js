/*
 * @Descripttion:
 * @version:
 * @Author: 韦剑
 * @Date: 2021-07-17 10:30:33
 * @LastEditors: 江澎涛
 * @LastEditTime: 2021-08-21 11:55:30
 */
import request from '@/api/request.js'
import qs from 'qs'
const storeApi = {
	qrCode: '/orders/v1/purchase/qrCodes', // H01.采购入库-扫描物流单号/二维码
	// getQuality:'/orders/v1/check/page', //质检记录页面查询
	checkProductGoods: '/orders/v1/check/cust/info', //质检记录定制的弹框
	exportQuality: '/orders/v1/check/record/export', //质检记录导出
	qualityTexting: '/orders/v1/purchase/cust/quality/check', // H02.商品质检入库并分配库存
	getQuality: '/orders/v1/check/record/page', //质检记录页面查询
	getWareHouse: '/orders/v1/warehouse/page', //仓库页面查询
	unqualified: '/orders/v1/purchase/cust/page/unqualified', //H04.打印不合格标签
	printExpressSheet: '/orders/v1/wayBill/print', //打印面单
	printComplate: '/orders/v1/wayBill/printComplate', //打印完成
	printQrCode: '/orders/v1/purchase/cust/page/qrCode', //打印二维码
	instorage: '/orders/v1/purchase/goods/instorage', //H03.采购商品入库
	logisticsList: '/orders/v1/purchase/detail/package/logistics/list', //H07.根据采购明细获取可打单内的物流下拉框数据
	packageList: '/orders/v1/purchase/detail/print/package/list', //H06.根据采购明细获取可打单包裹列表
	getCome: '/orders/v1/storage/record/page', //出入记录页面的查询
	exportCome: '/orders/v1/storage/record/export', //出入记录页面导出
	comeDetails: '/orders/v1/storage/record/details', //出入记录详情页面
	comeRemark: '/orders/v1/storage/record/update', //出入记录的备注
	productGoods: '/orders/v1/storage/record/cust/info', //出入记录定制的弹框
	comePerson: '/orders/v1/storage/record/users', //出入记录页面的操作人接口
	defectiveCheck: '/orders/v1/purchase/cust/defective/check', //获取货架位
	getPrintMsg: '/orders/v1/storage/record/printMsg', //X01.获取打印入库商品标签信息
	getQrCode: '/orders/v1/storage/record/qrCode', //X02.打印二维码
	extraInstorage: '/orders/v1/purchase/extra/instorage', //Z312.多发入库
	gridProduct: '/orders/v1/purchase/getGridProduct', //获取货架位
	waitSignList: '/orders/v1/receiptManage/waitSignList', // 待签收列表
	waitSignListCount: '/orders/v1/receiptManage/waitSignListCount', //待签收总条数
	exportAll: '/orders/v1/receiptManage/exportAll', //导出代签收
	queryPurchaseTotal: '/orders/v1/receiptManage/queryPurchaseTotal', //查询待签收采购数量总计
	getSignOrderList: '/orders/v1/receiptManage/sign/getSignOrderList', //根据物流单号查询相关订单信息
	signOperation: '/orders/v1/receiptManage/sign/doSign', //签收操作
	getSignRecord: '/orders/v1/receiptManage/SignList', //查询签收记录
	exportSignRecord: '/orders/v1/receiptManage/export/fields', //导出签收记录
	SignBatchRemark: 'orders/v1/receiptManage/batchRemark', //签收记录批量备注
	queryPurchaseInfo: '/orders/v1/receiptManage/queryPurchaseInfo', //采购订单-待到货查询
	associatedSign: '/orders/v1/receiptManage/associatedSign', //采购单关联操作
	importInventoryData: '/orders/v1/ivt/orderPackage/importInventoryData', //导入（特殊入库）
	pageQueryList: '/orders/v1/stock/inventoryRecord/pageQuery', //获取特殊入库列表数据
	writeInventoryData: '/orders/v1/ivt/orderPackage/writeInventoryData',
	inStorageCheck: '/orders/v1/ivt/custom/in/storage/check', // 新增定制品入库 校验
	inStorageList: '/orders/v1/ivt/custom/in/storage' // 新增定制品入库 校验
}
// H01.采购入库-扫描物流单号/二维码
export function purchaseSearch(data) {
	return request({
		url: storeApi.qrCode,
		method: 'post',
		data: data
	})
}

// H02.商品质检入库并分配库存
export function qualityTexting(data) {
	return request({
		url: storeApi.qualityTexting,
		method: 'post',
		data: data
	})
}

// H04.打印不合格标签
export function unqualified(data) {
	return request({
		url: storeApi.unqualified,
		method: 'post',
		data: data
	})
}

// 打印面单
export function printExpressSheet(data) {
	return request({
		url: storeApi.printExpressSheet,
		method: 'post',
		data: data
	})
}

// 打印面单
export function printComplate(data) {
	return request({
		url: storeApi.printComplate,
		method: 'post',
		data: data
	})
}

// 打印二维码
export function printQrCode(data) {
	return request({
		url: storeApi.printQrCode,
		method: 'post',
		data: data
	})
}

// H03.采购商品入库
export function instorage(data) {
	return request({
		url: storeApi.instorage,
		method: 'post',
		data: data
	})
}

// H07.根据采购明细获取可打单内的物流下拉框数据
export function logisticsList(data) {
	return request({
		url: storeApi.logisticsList,
		method: 'post',
		data: data
	})
}

// H06.根据采购明细获取可打单包裹列表
export function packageList(data) {
	return request({
		url: storeApi.packageList,
		method: 'post',
		data: data
	})
}

// 质检记录页面查询 Author: 张志芳
export function getQuality(data) {
	return request({
		url: storeApi.getQuality,
		method: 'post',
		data: data
	})
}
//质检记录页面的导出Author: 张志芳
export function exportQuality(data) {
	return request({
		url: storeApi.exportQuality,
		method: 'post',
		data: data
	})
}
// 仓库管理页面查询 Author: 张志芳
export function getWareHouse(data) {
	return request({
		url: storeApi.getWareHouse,
		method: 'post',
		data: data
	})
}
// 出入记录页面查询 Author: 张志芳
export function getCome(data) {
	return request({
		url: storeApi.getCome,
		method: 'post',
		data: data
	})
}
// 出入记录页面导出 Author: 张志芳
export function exportCome(data) {
	return request({
		url: storeApi.exportCome,
		method: 'post',
		data: data
	})
}
// 出入记录页面详情 Author: 张志芳
export function comeDetails(data) {
	return request({
		url: storeApi.comeDetails,
		method: 'post',
		data: data
	})
}
// 出入记录备注Author: 张志芳
export function comeRemark(data) {
	return request({
		url: storeApi.comeRemark,
		method: 'post',
		data: data
	})
}
// 出入记录定制弹框Author: 张志芳
export function productGoods(data, type) {
	if (type == 0) {
		return request({
			url: storeApi.productGoods,
			method: 'post',
			data: data
		})
	} else {
		return request({
			url: storeApi.checkProductGoods,
			method: 'post',
			data: data
		})
	}
}
// 出入记录页面的操作人接口Author: 张志芳
export function comePerson(data) {
	return request({
		url: storeApi.comePerson,
		method: 'post',
		data: data
	})
}
// X01.获取打印入库商品标签信息Author: 张志芳
export function getPrintMsg(data) {
	return request({
		url: storeApi.getPrintMsg,
		method: 'post',
		data: data
	})
}
//X02.打印二维码Author: 张志芳
export function getQrCode(data) {
	return request({
		url: storeApi.getQrCode,
		method: 'post',
		data: data
	})
}
// 获取货架位
export function defectiveCheck(data) {
	return request({
		url: storeApi.defectiveCheck,
		method: 'post',
		data: data
	})
}

// Z312.多发入库
export function extraInstorage(data) {
	return request({
		url: storeApi.extraInstorage,
		method: 'post',
		data: data
	})
}

// Z312.获取货架位
export function gridProduct(data) {
	return request({
		url: storeApi.gridProduct,
		method: 'post',
		data: data
	})
}

// 待签收列表
export function waitSignList(data) {
	return request({
		url: storeApi.waitSignList,
		method: 'post',
		data: data
	})
}

// 待签收总条数
export function waitSignListCount(data) {
	return request({
		url: storeApi.waitSignListCount,
		method: 'post',
		data: data
	})
}
// 导出待签收
export function exportAll(data) {
	return request({
		url: storeApi.exportAll,
		method: 'post',
		data: data
	})
}
// 待签收采购数量总计
export function queryPurchaseTotal(data) {
	return request({
		url: storeApi.queryPurchaseTotal,
		method: 'post',
		data: data
	})
}
// 根据物流单号查询相关订单信息
export function getSignOrderList(data) {
	return request({
		url: storeApi.getSignOrderList,
		method: 'post',
		data: data
	})
}
//签收操作
export function signOperation(data) {
	return request({
		url: storeApi.signOperation,
		method: 'post',
		data: data
	})
}
//查询签收记录 Author:张志芳
export function getSignRecord(data) {
	return request({
		url: storeApi.getSignRecord,
		method: 'post',
		data: data
	})
}
//签收记录导出Author:张志芳
export function exportSignRecord(data) {
	return request({
		url: storeApi.exportSignRecord,
		method: 'post',
		data: data
	})
}
//采购订单-待到货查询Author:张志芳
export function queryPurchaseInfo(data) {
	return request({
		url: storeApi.queryPurchaseInfo,
		method: 'post',
		data: data
	})
}
//采购单关联操作Author:张志芳
export function associatedSign(data) {
	return request({
		url: storeApi.associatedSign,
		method: 'post',
		data: data
	})
}
//批量备注Author:张志芳
export function SignBatchRemark(data) {
	return request({
		url: storeApi.SignBatchRemark,
		method: 'post',
		data: data
	})
}
//导入Author:韦剑
export function importInventoryData(data) {
	return request({
		url: storeApi.importInventoryData,
		method: 'post',
		data: data
	})
}
//特殊入库列表Author:韦剑
export function pageQueryList(data) {
	return request({
		url: storeApi.pageQueryList,
		method: 'post',
		data: data
	})
}
writeInventoryData
//Author:韦剑
export function writeInventoryData(data) {
	return request({
		url: storeApi.writeInventoryData,
		method: 'post',
		data: data
	})
}

// 新增定制品入库 校验
export function inStorageCheck(data) {
	return request({
		url: storeApi.inStorageCheck,
		method: 'post',
		data
	})
}
// 新增定制品入库
export function inStorageList(data) {
	return request({
		url: storeApi.inStorageList,
		method: 'post',
		data
	})
}
