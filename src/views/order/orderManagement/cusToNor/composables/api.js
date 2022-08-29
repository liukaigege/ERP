import request from '@/api/request.js'
// C6.定制转普货
export function ordinaryToCustomized(data) {
    return request({
        url: 'orders/v1/ivt/purchase/ordinaryToCustomized',
        method: 'post',
        data
    })
}


export function getCustomValues(data) {
	return request({
			url: 'orders/v1/ivt/orderPackage/getCustomValues',
			method: 'post',
			data
	})
}

// C8.保存定制转普货/普货转定制
export function saveCustomizedAndOrdinary(data) {
	return request({
			url: 'orders/v1/ivt/purchase/saveCustomizedAndOrdinary',
			method: 'post',
			data
	})
}

// 设置规格值
export function updateCustomValues(data) {
	return request({
			url: 'orders/v1/ivt/orderPackage/updateCustomValues',
			method: 'post',
			data
	})
}
