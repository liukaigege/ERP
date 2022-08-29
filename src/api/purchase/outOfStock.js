// 采购管理- 缺货采购
import request from '@/api/request.js'

// 查询缺货采购列表
export function list(data) {
	return request({
		url: 'orders/v1/purchase/suggest/list',
		method: 'post',
		data
	})
}

export function addOrUpdate(data) {
	return request({
		url: 'orders/v1/purchase/plan/addOrUpdate',
		method: 'post',
		data
	})
} // 添加采购计划

export function addRemark(data) {
	return request({
		url: 'orders/v1/purchase/suggest/remark/addOrUpdate',
		method: 'post',
		data
	})
} // 新增编辑备注信息

export function modify(data) {
	return request({
		url: 'orders/v1/purchase/suggest/supplier/modify',
		method: 'post',
		data
	})
} // 更新采购建议 / 备货建议 供应商


export function planList(data) {
	return request({
		url: 'orders/v1/purchase/plan/list',
		method: 'post',
		data
	})
} // 采购计划列表

export function customPlanList(data) {
	return request({
		url: 'orders/v1/purchase/plan/list/customization',
		method: 'post',
		data
	})
} // 采购计划列表(定制品)


export function getTree(data) {
	return request({
		url: 'orders/v1/supplier/getTree',
		method: 'get',
		data
	})
} // 获取供应商


export function createPur(data) {
	return request({
		url: 'orders/v1/supplier/getTree',
		method: 'post',
		data
	})
} // 生成采购单

export function setShelve(data) {
	return request({
		url: 'orders/v1/purchase/suggest/status/modify',
		method: 'post',
		data
	})
} // 设置搁置

export function exportOrder(data) {
	return request({
		url: 'orders/v1/purchase/suggest/export',
		method: 'post',
		data
	})
} // 导出采购建议


export function refresh(data) {
	return request({
		url: 'orders/v1/purchase/stock/refresh',
		method: 'post',
		data
	})
} // 刷新缺货采购

export function direct(data) {
	return request({
		url: 'orders/v1/purchase/orders/render/direct',
		method: 'post',
		data
	})
} // 渲染直购采购订单


export function renderCat(data) {
	return request({
		url: 'orders/v1/purchase/orders/render/cart',
		method: 'post',
		data
	})
} // 渲染购物车采购订单

export function getPurchaseUsers(data) {
	return request({
		url: 'orders/v1/ivt/purchase/getPurchaseUsers',
		method: 'post',
		data
	})
} // 获取采购员列表

export function queryAccountList(data) {
	return request({
		url: 'orders/v1/supplier/account/queryAccountList',
		method: 'post',
		data
	})
} // 查询平台授权账号


export function submitCar(data) {
	return request({
		url: 'orders/v1/purchase/orders/submit/cart',
		method: 'post',
		data
	})
} // 提交购物车采购订单（从采购计划（包含备货采购）中提交采购订单）


export function submitDirect(data) {
	return request({
		url: 'orders/v1/purchase/orders/submit/direct',
		method: 'post',
		data
	})
} // 提交直购采购订单（从采购建议直接提交采购订单）


export function platformAddress(data) {
	return request({
		url: 'orders/v1/platformAddress/sync',
		method: 'post',
		data
	})
} // S13:同步收货地址信息

export function getExternalGoods(data) {
	return request({
		url: 'orders/v1/ivt/purchase/getExternalGoods',
		method: 'post',
		data
	})
} // 获取1688商品（用于编辑订单中的更换商品

export function getExternalGoodsNew(data) {
	return request({
		url: 'orders/v1/ivt/purchase/getExternalGoods/new',
		method: 'post',
		data
	})
} // 获取1688商品（用于编辑订单中的更换商品

export function deletePlan(data) {
	return request({
		url: 'orders/v1/purchase/plan/delete',
		method: 'post',
		data
	})
} //删除采购计划 / 备货采购

export function pairModify(data) {
	return request({
		url: 'orders/v1/purchase/suggest/pair/modify',
		method: 'post',
		data
	})
} //修改采购建议配对信息


export function pairModifyPlan(data) {
	return request({
		url: 'orders/v1/purchase/plan/pair/modify',
		method: 'post',
		data
	})
} //修改采购计划配对信息

export function deleteRemark(data) {
	return request({
		url: 'orders/v1/purchase/suggest/remark/delete',
		method: 'post',
		data
	})
} //删除采购建议备注

export function taggedList(data) {
	return request({
		url: 'orders/v1/tagged/list',
		method: 'post',
		data
	})
} //query today marks list

export function purchasePartsList(data) {
	return request({
		url: 'orders/v1/purchase/orders/parts/list',
		method: 'post',
		data
	})
} //query 查询订单配件信息

export function purchaseAddOrUpdate(data) {
	return request({
		url: 'orders/v1/purchase/orders/parts/addOrUpdate',
		method: 'post',
		data
	})
} //query 查询订单配件信息

export function exportInfos(data) {
	return request({
		url: 'orders/export/template/infos',
		method: 'post',
		data
	})
} //query 查询导出模板

export function exportItems(data) {
	return request({
		url: 'orders/export/items',
		method: 'post',
		data
	})
} //query Q11.获取导出订单选项列表


export function exportCustomized(data) {
	return request({
		url: 'orders/v1/purchase/suggest/customized/export',
		method: 'post',
		data
	})
} //query Q11.获取导出订单选项列表
