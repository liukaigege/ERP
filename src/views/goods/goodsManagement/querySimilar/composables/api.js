import request from '@/api/request.js'

export function similarList(data) {
    return request({
        url: 'goods/v1/goods/similar/list',
        method: 'post',
        data: data
    })
}