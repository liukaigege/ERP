import request from '@/api/request.js'
//***************************仓储部分
//仓储--T+0打单率
export function getBillingRate(data) {
    return request({
        url: 'bi/storage/print_rate/',
        method: 'POST',
        data,
    })
}
//仓储--T+0发货率
export function getDeliveryRate(data) {
    return request({
        url: 'bi/storage/delivery_rate/',
        method: 'POST',
        data,
    })
}
//仓储--打单发货明细表
export function deliveryDetails(data) {
    return request({
        url: 'bi/storage/deliver_rate_detail/',
        method: 'POST',
        data,
    })
}
//仓储--导出打单发货数据明细
export function exportDeliveryDetails(data) {
    return request({
        url: 'orders/v1/bi/storage/print/delivery/detail',
        method: 'POST',
        data,
    })
}
//仓储--剩余发货数据明细表
export function surplusDelivery(data) {
    return request({
        url: 'bi/storage/print_rate_detail/',
        method: 'POST',
        data,
    })
}
//仓储--导出剩余发货数据明细表
export function exportSurplusDelivery(data) {
    return request({
        url: 'orders/v1/bi/storage/surplus/delivery/detail',
        method: 'POST',
        data,
    })
}
// 查询进度条
export function progress(data) { 
    return request({
        url: 'basic/progress',
        method: 'POST',
        data
    })
  }
