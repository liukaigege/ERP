import request from '@/api/request.js'
// C7.普货转定制
export function customizedToOrdinary(data) {
    return request({
        url: 'orders/v1/ivt/purchase/customizedToOrdinary',
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
