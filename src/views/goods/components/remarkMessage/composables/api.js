import request from '@/api/request.js'

// Z14.商品备注列表
export function remarkList(data) {
    return request({
        url: 'goods/v1/goods/remark/list',
        method: 'post',
        data: data
    })
}

//Z15.编辑商品备注
export function addRemark(data) {
    return request({
        url: 'goods/v1/goods/remark/update',
        method: 'post',
        data: data
    })
}

// Z25.添加备注
export function batchAddRemark(data) {
    return request({
        url: 'goods/v1/goods/remark/add',
        method: 'post',
        data: data
    })
}

// Z23.删除商品备注
export function delRemark(data) {
    return request({
        url: 'goods/v1/goods/remark/del',
        method: 'post',
        data: data
    })
}