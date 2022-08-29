import request from '@/api/request.js'

// 退款详情页
export function getRefundDetail(data) {
    return request({
        url: 'orders/v1/ivt/order/refund/select/getRefundDetail',
        method: 'post',
        data
    })
}

// 责任方查询
export function listRefundDuty(data) {
	return request({
			url: 'orders/v1/ivt/order/refund/select/listRefundDuty',
			method: 'post',
			data
	})
}

// 退款原因
export function getIvtRefundReasons(data) {
	return request({
			url: 'orders/v1/ivt/orderPackage/getIvtRefundReasons',
			method: 'post',
			data
	})
}

// 查询列表数据
export function queryList(data) {
	return request({
			url: 'orders/v1/ivt/order/refund/select/listPage',
			method: 'post',
			data
	})
}

// 导出数据
export function exportList(data) {
	return request({
			url: 'orders/v1/ivt/order/refund/select/export',
			method: 'post',
			data
	})
}

