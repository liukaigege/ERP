import request from '@/api/request.js'

// Z14.商品备注列表
export function logsList(data) {
    return request({
        url: 'logs/v1/sysLog/list',
        method: 'post',
        data: data
    })
}