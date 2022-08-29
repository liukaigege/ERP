import request from '@/api/request.js'
// D02:查询账户列表
export function queryList(data) {
    return request({
        url: 'goods/v1/goods/paypal/account/queryForAccount',
        method: 'post',
        data
    })
}

// 账号管理-新增或编辑账号
export function editAccount(data) {
    return request({
        url: 'goods/v1/goods/paypal/account/editAccount',
        method: 'post',
        data
    })
}

// 账号管理-修改手续费
export function editFee(data) {
    return request({
        url: 'goods/v1/goods/paypal/account/editFee',
        method: 'post',
        data
    })
}

// 账号管理-导出报告
export function exportReport(data) {
    return request({
        url: 'goods/v1/goods/paypal/account/exportReport',
        method: 'post',
        data
    })
}

// 账号管理-导出交易金额
export function exportTrade(data) {
    return request({
        url: 'goods/v1/goods/paypal/account/exportTrade',
        method: 'post',
        data
    })
}

// 账号管理-账号授权
export function authAccount(data) {
    return request({
        url: 'goods/v1/goods/paypal/account/authAccount',
        method: 'post',
        data
    })
}

// 账号管理-账号删除
export function delAccount(data) {
    return request({
        url: 'goods/v1/goods/paypal/account/delAccount',
        method: 'post',
        data
    })
}