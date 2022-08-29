import request from '@/api/request.js'
export function getGoods(data) {
    return request({
        url: 'goods/v1/ivt/orderPackage/goodsBases',
        method: 'post',
        data: data
    })
}

export function getOrderInfo(data) {
    return request({
        url: 'orders/v1/ivt/orderPackage/reissueGift',
        method: 'post',
        data: data
    })
}