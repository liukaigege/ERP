/*
 * @Descripttion: 
 * @version: 
 * @Author: 江澎涛
 * @Date: 2021-07-27 09:42:03
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-26 14:01:04
 */
import request from '@/api/request.js'

const orderApi = {
    exoprtOrderList: 'orders/export/info', //导出每日订单
    exportDown: 'orders/export/down', // 下载订单
    exportRename: 'orders/export/rename', // 重命名
    progress: 'basic/progress', //查询进度条

    exportTemplateList: 'orders/export/template/list', // 导出模板列表
    exportAdd: 'orders/export/template/add', // 添加导出模板
    exportItem: 'orders/export/items', // 导出订单选项
    exportEdit: 'orders/export/template/update', // 修改
    exportDel: 'orders/export/template/del', // 删除

    interceptors: 'orders/v1/package/intercept/interceptors', // 拦截员
    interceptScanners: 'orders/v1/package/intercept/scanners', // 扫描员
    interceptCancel: 'orders/v1/package/intercept/cancel', // 取消
    interceptSave: 'orders/v1/package/intercept/save', // 拦截新增
    interceptListPage: 'orders/v1/package/intercept/listPage', // 列表查询

    getDelivery: 'orders/v1/package/delivery/listPage', //查询发货记录列表 autor:张志芳
    updateRemarks: '/orders/v1/package/delivery/update', //U31.更新发货备注 autor:张志芳
    exportFields: '/orders/v1/package/delivery/export/fields', //U42.导出字段 autor:张志芳
    exportDelivery: '/orders/v1/package/delivery/export', //U30.发货记录导出
    getRceivers: '/orders/v1/package/delivery/receivers', //收货员列表
    getPrintUser:'/orders/v1/package/delivery/listPrintUser',//打单员列表
    

    typeList: 'orders/v1/remark/type/listPage', //备注类型查询列表
    typeAdd: 'orders/v1/remark/type/save', // 添加
    typeStatus: 'orders/v1/remark/type/enabled', // 更新状态
    typeEdit: 'orders/v1/remark/type/update', // 编辑
    typeDel: 'orders/v1/remark/type/del', //删除
    infoDXM: 'orders/import/dxm/info', // 店小蜜数据信息
    deliveryDXM: 'orders/import/dxm/delivery', //导入店小秘发货
    runDXM: 'orders/import/dxm/delivery/run', //执行导入店小秘发货
    batchDel: 'orders/import/batchDel', //Q33.批量删除店小秘发货数据

}

export function infoDXM(data) { // 店小蜜数据信息
    return request({
        url: orderApi.infoDXM,
        method: 'post',
        data: data
    })
}

export function batchDel(data) { // 店小蜜数据信息
    return request({
        url: orderApi.batchDel,
        method: 'post',
        data: data
    })
}



export function deliveryDXM(data) { // 导入店小秘发货
    return request({
        url: orderApi.deliveryDXM,
        method: 'post',
        data: data
    })
}

export function runDXM(data) { // 执行导入店小秘发货
    return request({
        url: orderApi.runDXM,
        method: 'post',
        data: data
    })
}


export function progress(data) { // 查询进度条
    return request({
        url: orderApi.progress,
        method: 'post',
        data: data
    })
}

export function exoprtOrderList(data) { // 获取导出订单列表
    return request({
        url: orderApi.exoprtOrderList,
        method: 'post',
        data: data
    })
}

export function exportDown(data) { // 下载订单
    return request({
        url: orderApi.exportDown,
        method: 'post',
        data: data
    })
}

export function exportRename(data) { // 重命名
    return request({
        url: orderApi.exportRename,
        method: 'post',
        data: data
    })
}

// =======   导出模板 =======

export function exportTemplateList(data) { // 导出模板列表
    return request({
        url: orderApi.exportTemplateList,
        method: 'post',
        data: data
    })
}

export function exportAdd(data) { // 添加导出模板
    return request({
        url: orderApi.exportAdd,
        method: 'post',
        data: data
    })
}

export function exportItem(data) { // 导出订单选项
    return request({
        url: orderApi.exportItem,
        method: 'post',
        data: data
    })
}

export function exportEdit(data) { // 修改模板
    return request({
        url: orderApi.exportEdit,
        method: 'post',
        data: data
    })
}

export function exportDel(data) { // 删除模板
    return request({
        url: orderApi.exportDel,
        method: 'post',
        data: data
    })
}

// =======   拦截发货  =======

export function interceptors(data) { // 拦截员
    return request({
        url: orderApi.interceptors,
        method: 'post',
        data: data
    })
}

export function interceptScanners(data) { // 扫描员
    return request({
        url: orderApi.interceptScanners,
        method: 'post',
        data: data
    })
}

export function interceptCancel(data) { // 取消拦截
    return request({
        url: orderApi.interceptCancel,
        method: 'post',
        data: data
    })
}

export function interceptSave(data) { // 拦截新增
    return request({
        url: orderApi.interceptSave,
        method: 'post',
        data: data
    })
}

export function interceptListPage(data) { // 列表查询
    return request({
        url: orderApi.interceptListPage,
        method: 'post',
        data: data
    })
}

// =======   发货记录：张志芳 =======
export function getDelivery(data) { // 列表查询
    return request({
        url: orderApi.getDelivery,
        method: 'post',
        data: data
    })
}
export function updateRemarks(data) { // U31.更新发货备注
    return request({
        url: orderApi.updateRemarks,
        method: 'post',
        data: data
    })
}
export function exportFields(data) { // U42.导出字段
    return request({
        url: orderApi.exportFields,
        method: 'post',
        data: data
    })
}
export function exportDelivery(data) { //U30.发货记录导出
    return request({
        url: orderApi.exportDelivery,
        method: 'post',
        data: data
    })
}
export function getRceivers(data) { //发货人列表
    return request({
        url: orderApi.getRceivers,
        method: 'post',
        data: data
    })
}
export function getPrintUser(data) { //发货人列表
  return request({
      url: orderApi.getPrintUser,
      method: 'post',
      data: data
  })
}
// ========= 备注类型 ========

export function typeList(data) { // 备注类型查询列表
    return request({
        url: orderApi.typeList,
        method: 'post',
        data: data
    })
}

export function typeAdd(data) { // 添加
    return request({
        url: orderApi.typeAdd,
        method: 'post',
        data: data
    })
}

export function typeStatus(data) { // 状态
    return request({
        url: orderApi.typeStatus,
        method: 'post',
        data: data
    })
}

export function typeEdit(data) { // 修改
    return request({
        url: orderApi.typeEdit,
        method: 'post',
        data: data
    })
}

export function typeDel(data) { // 删除
    return request({
        url: orderApi.typeDel,
        method: 'post',
        data: data
    })
}