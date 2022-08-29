import request from '@/api/request.js'
// D01:财务付款单审批列表
export function examineList(data) {
    return request({
        url: 'orders/v1/check/list',
        method: 'post',
        data
    })
}

// D02:财务付款单审批明细
export function queryDetail(data) {
    return request({
        url: 'orders/v1/check/checkDetail',
        method: 'post',
        data
    })
}


// D03:财务付款单审批完成付款
export function completetFn(data) {
    return request({
        url: 'orders/v1/check/complete',
        method: 'post',
        data
    })
}

// D04:财务付款单审批拒绝付款
export function refuseFn(data) {
    return request({
        url: 'orders/v1/check/refuse',
        method: 'post',
        data
    })
}

// S06:获取供应商，返回二级树状结构，根节点为供应商类型，子节点为该类型的供应商
export function supplierList(data) {
    return request({
        url: 'orders/v1/supplier/getTree',
        method: 'post',
        data
    })
}

// X06:采购付款申请采购员下拉列表
export function applyList(data) {
    return request({
        url: 'orders/v1/payment/buyer',
        method: 'post',
        data
    })
}

//  查询付款账户
export function listSupplierPaymentAccount(data) {
    return request({
        url: 'orders/v1/serach/listSupplierPaymentAccount',
        method: 'post',
        data
    })
}

//  查询订单信息
export function queryOrderInfo(data) {
	return request({
			url: 'orders/v1/ivt/purchase/purchaseOfOrders',
			method: 'post',
			data
	})
}

//  导出明细
export function exportDetail(data) {
	return request({
			url: 'orders/v1/paymentCheck/detailExport',
			method: 'post',
			data
	})
}
