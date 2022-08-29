//订单详情专用  Author: 王新国
import request from '@/api/request.js'

const orderApi = {
    packageOrderDetails: 'orders/v1/ivt/orderPackage/packageOrderDetails',//获取订单详情
    getCountries: 'orders/v1/orders/country/countryCode',//获取国家列表country
    savePackageDetails: 'orders/v1/ivt/orderPackage/savePackageDetails',//保存订单详情
    savePackageRemark: 'orders/v1/ivt/orderPackage/savePackageRemark',//保存备注信息
    getRemarkNames: 'orders/v1/ivt/remark/getRemarkTypes',//获取备注类型数据
    deletePackageRemark: 'orders/v1/ivt/orderPackage/deletePackageRemark',//删除备注信息
    dissolutionGoods: 'orders/v1/ivt/orderPackage/relieveGoodsBases',//确认解除商品匹配关系
		updatePackageGoodsBatch: 'orders/v1/ivt/orderPackage/updatePackageGoodsBatch',// 批量变更发货商品
}

// 批量变更发货商品
export function updatePackageGoodsBatch(data) {
	return request({
			url: orderApi.updatePackageGoodsBatch,
			method: 'post',
			data: data
	})
}

// 获取订单详情
export function packageOrderDetails(data) {
    return request({
        url: orderApi.packageOrderDetails,
        method: 'post',
        data: data
    })
}

// 获取国家列表country
export function getCountries(data) {
    return request({
        url: orderApi.getCountries,
        method: 'post',
        data: data
    })
}

// 保存订单详情
export function savePackageDetails(data) {
    return request({
        url: orderApi.savePackageDetails,
        method: 'post',
        data: data
    })
}

// 保存备注信息
export function savePackageRemark(data) {
    return request({
        url: orderApi.savePackageRemark,
        method: 'post',
        data: data
    })
}

// 获取备注类型数据
export function getRemarkNames(data) {
    return request({
        url: orderApi.getRemarkNames,
        method: 'post',
        data: data
    })
}

// 删除备注信息
export function deletePackageRemark(data) {
    return request({
        url: orderApi.deletePackageRemark,
        method: 'post',
        data: data
    })
}

// 确认解除商品匹配关系
export function dissolutionGoods(data) {
    return request({
        url: orderApi.dissolutionGoods,
        method: 'post',
        data: data
    })
}
