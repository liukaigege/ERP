import request from '@/api/request.js'

export function getInfringingDetail(data) {
    return request({
        url: 'goods/v1/tort/goods/detail',
        method: 'post',
        data: data
    })
}

export function examine(data) {
    return request({
        url: 'goods/v1/tort/examine',
        method: 'post',
        data: data
    })
}

export function getTortMsg(data) {
    return request({
        url: 'goods/v1/newProducts/getTortMsg',
        method: 'post',
        data: data
    })
}