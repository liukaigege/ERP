import request from '@/api/request.js'

const orderApi = {
    packageDeliveryList:'orders/v1/packageDelivery/list',// 发货记录列表
    packageDeliverySave:'orders/v1/packageDelivery/save',//录入发货记录
    packageDeliveryClear:'orders/v1/packageDelivery/exceptionClear',//清除异常包裹
    packageDeliverySubmit:'orders/v1/packageDelivery/submit',//提交发货
    packageDeliveryDel:'orders/v1/packageDelivery/del',//删除包裹
    packageDeliveryImport:'orders/import/scan/delivery',//导入扫描发货
    packageDeliveryImportSubmit:'orders/import/scan/delivery/submit',//提交导入数据
    packageDeliveryCount:'orders/v1/packageDelivery/getCount',//查询总包裹数和异常包裹数
    checkProgress:'basic/progress',//Q90.查询进度条信息
    exportErrorData:'orders/v1/package/delivery/exception/data/export',//导出扫描发货异常包裹
}

// 发货记录列表 Author: 王新国
export function packageDeliveryList(data) {
    return request({
        url: orderApi.packageDeliveryList,
        method: 'post',
        data: data
    })
}

// 录入发货记录 Author: 王新国
export function packageDeliverySave(data) {
    return request({
        url: orderApi.packageDeliverySave,
        method: 'post',
        data: data
    })
}

// 清除异常包裹 Author: 王新国
export function packageDeliveryClear(data) {
    return request({
        url: orderApi.packageDeliveryClear,
        method: 'post',
        data: data
    })
}

// 提交发货 Author: 王新国
export function packageDeliverySubmit(data) {
    return request({
        url: orderApi.packageDeliverySubmit,
        method: 'post',
        data: data
    })
}

// 删除包裹 Author: 王新国 
export function packageDeliveryDel(data) {
    return request({
        url: orderApi.packageDeliveryDel,
        method: 'post',
        data: data
    })
}

// 导入扫描发货 Author: 王新国
export function packageDeliveryImport(data) {
    return request({
        url: orderApi.packageDeliveryImport,
        method: 'post',
        data: data
    })
}

// 提交导入数据 Author: 王新国
export function packageDeliveryImportSubmit(data) {
    return request({
        url: orderApi.packageDeliveryImportSubmit,
        method: 'post',
        data: data
    })
}

// 查询总包裹数和异常包裹数 Author: 王新国
export function packageDeliveryCount(data) {
    return request({
        url: orderApi.packageDeliveryCount,
        method: 'post',
        data: data
    })
}

// Q90.查询进度条信息 Author: 王新国
export function checkProgress(data) {
    return request({
        url: orderApi.checkProgress,
        method: 'post',
        data: data
    })
}

// Q90.导出扫描发货异常包裹 Author: 王新国
export function exportErrorData(data) {
    return request({
        url: orderApi.exportErrorData,
        method: 'post',
        data: data
    })
}