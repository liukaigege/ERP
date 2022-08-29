import request from '@/api/request.js'

// 批量报价信息
export function logisticsBatchInfo(data) {
    return request({
        url: '/goods/v1/goods/offer/logistics/batch/info',
        method: 'post',
        data
    })
}
// 批量报价
export function logisticsBatch(data) {
    return request({
        url: '/goods/v1/goods/offer/logistics/batch',
        method: 'post',
        data
    })
}
// 物流报价
export function logisticsUpdate(data) {
    return request({
        url: '/goods/v1/goods/offer/logistics/update',
        method: 'post',
        data
    })
}

// 物流报价信息
export function logisticsInfo(data) {
    return request({
        url: '/goods/v1/goods/offer/logistics/info',
        method: 'post',
        data
    })
}