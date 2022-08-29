// exportOrder.js
import request from '@/api/request.js'

const exportApi = {
    exportItemsList:'orders/export/items',//获取导出订单选项列表
    checkExportTemplate:'orders/export/template/infos',//查询导出模板列表(不带分页)
    exportOrder:'orders/standard/export',//通用导出订单
    checkProgress:'basic/progress',// 查询进度条信息
}

// 获取导出订单选项列表 Author: 王新国
export function exportItemsList(data) {
    return request({
        url: exportApi.exportItemsList,
        method: 'post',
        data: data
    })
}

//查询导出模板列表(不带分页) Author: 王新国
export function checkExportTemplate(data) {
    return request({
        url: exportApi.checkExportTemplate,
        method: 'post',
        data: data
    })
}

// 通用导出订单
export function exportOrderFn(data) {
    return request({
        url: exportApi.exportOrder,
        method: 'post',
        data: data
    })
}

// 查询进度条信息
export function checkProgress(data) {
    return request({
        url: exportApi.checkProgress,
        method: 'post',
        data: data
    })
}