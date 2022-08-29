import request from '@/api/request.js'
// C4.订单信息
export function purchaseOfOrders(data) {
	return request({
			url: 'orders/v1/purchase/suggest/order/list',
			method: 'post',
			data
	})
}

// 缺货采购-标记普货
export function tagged(data) {
	return request({
			url: 'orders/v1/tagged/add',
			method: 'post',
			data
	})
}

// 添加/修改采购计划 / 备货采购
export function addOrUpdate(data) {
	return request({
			url: 'orders/v1/purchase/plan/addOrUpdate',
			method: 'post',
			data
	})
}

// 渲染直购采购订单
export function direct(data) {
	return request({
		url: 'orders/v1/purchase/orders/render/direct',
		method: 'post',
		data
	})
}

// 缺货采购-今日标记-批量取消标记
export function cancelBatch(data) {
	return request({
		url: 'orders/v1/tagged/cancel/batch',
		method: 'post',
		data
	})
}
