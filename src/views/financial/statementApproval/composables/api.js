import request from '@/api/request.js'

export function verifyCheckComplate(data) {
	// 完成对账
	return request({
		url: '/orders/v1/verifyCheck/complate',
		method: 'POST',
		data
	})
}

export function verifyCheckRefuse(data) {
	// 拒绝对账
	return request({
		url: '/orders/v1/verifyCheck/refuse',
		method: 'POST',
		data
	})
}

export function verifyCheckPageQuery(data) {
	// 列表查询
	return request({
		url: '/orders/v1/verifyCheck/pageQuery',
		method: 'POST',
		data
	})
}

export function verifyCheckGetDetail(data) {
	// 明细查询
	return request({
		url: '/orders/v1/verifyCheck/getDetail',
		method: 'POST',
		data
	})
}
export function verifyCheckExport(data) {
	// 导出
	return request({
		url: '/orders/v1/verifyCheck/export',
		method: 'POST',
		data
	})
}
export function verifyCheckUser(data) {
	// 查询审批人
	return request({
		url: '/orders/v1/verifyApply/checkUser',
		method: 'POST',
		data
	})
}
export function verifyApplyUser(data) {
	// 查询申请人
	return request({
		url: '/orders/v1/verifyApply/applyUser',
		method: 'POST',
		data
	})
}
