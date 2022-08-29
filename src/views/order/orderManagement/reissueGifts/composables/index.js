import request from '@/api/request.js'
export function setData(data) {
    return request({
        url: 'orders/v1/ivt/orderPackage/saveReissueGift',
        method: 'post',
        data: data
    })
}