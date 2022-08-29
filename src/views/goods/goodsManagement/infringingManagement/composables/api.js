import request from '@/api/request.js'

export function userList(data) {
    return request({
        url: 'goods/v1/tort/userList',
        method: 'post',
        data: data
    })
}
// 侵权商品管理列表
export function tortList(data) {
    return request({
        url: 'goods/v1/tort/goods/list',
        method: 'post',
        data: data
    })
}