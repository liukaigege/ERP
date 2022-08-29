import request from '@/api/request.js'
// 仓库及分区展示
export function wareHouseAreaList(data) {
    return request({
        url: 'orders/v1/wareHouseArea/list',
        method: 'post',
        data
    })
}

// Z301.新建/编辑手动出/入库单
export function addOrUpdate(data) {
    return request({
        url: 'orders/v1/ivt/storage/form/addOrUpdate',
        method: 'post',
        data
    })
}

// Z302.手动出/入库列表
export function getOrderList(data) {
    return request({
        url: 'orders/v1/ivt/storage/form/list',
        method: 'post',
        data
    })
}

// Z303.手动出库选择商品列表
export function getList(data) {
    return request({
        url: 'orders/v1/ivt/storage/form/out/sku/list',
        method: 'post',
        data
    })
}

// Z304.手动出入库 备注修改
export function editRemark(data) {
    return request({
        url: 'orders/v1/ivt/storage/form/remark/edit',
        method: 'post',
        data
    })
}

// Z305.手动出入库 删除数据
export function deleteList(data) {
    return request({
        url: 'orders/v1/ivt/storage/form/del',
        method: 'post',
        data
    })
}

// Z306.扫描录入出入库数据
export function scanQuery(data) {
    return request({
        url: 'orders/v1/ivt/storage/form/qrScan',
        method: 'post',
        data
    })
}

// Z307.手动入库-批量确认入库B
export function confirmBatch(data) {
    return request({
        url: 'orders/v1/ivt/storage/form/confirm/storage/batch',
        method: 'post',
        data
    })
}

// Z309.手动出库-批量确认出库
export function confirmOutBatch(data) {
    return request({
        url: 'orders/v1/ivt/storage/form/confirm/delivery/batch',
        method: 'post',
        data
    })
}

// Z310.手动出入库获取数据详情
export function queryDetail(data) {
    return request({
        url: 'orders/v1/ivt/storage/form/detail',
        method: 'post',
        data
    })
}

// H05.打印二维码
export function printEqCode(data) {
    return request({
        url: 'orders/v1/purchase/cust/page/qrCode',
        method: 'post',
        data
    })
}