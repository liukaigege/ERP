import request from '@/api/request.js'
// 查询订单列表
export function queryTsn(data) {
    return request({
        url: 'goods/v1/goods/paypal/account/queryTsn',
        method: 'post',
        data
    })
}