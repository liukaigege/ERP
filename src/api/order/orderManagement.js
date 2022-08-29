/*
 * @Descripttion:
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-19 09:16:52
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-24 17:09:49
 */

import request from '@/api/request.js'

const orderApi = {
    getSourceDomains: 'orders/v1/ivt/search/sourceDomains', // S4.获取订单来源数据
    getOrderSource: 'orders/v1/ivt/search/sourceDomains', // 获取订单来源数据
    remarkTypeNames: 'orders/v1/ivt/remark/getNames', //获取备注类型数据
    countryCode: 'orders/v1/orders/country/countryCode', //获取国家数据
    orderList: 'orders/v1/ivt/search/info', //标准订单
    updateExamine: 'orders/v1/ivt/orderPackage/updateExamine', //审核包裹
    applyNum: 'orders/v1/apply/applyNum', //申请运单号
    selectLogisticsSingle: 'orders/v1/apply/selectLogisticsSingle', //选择物流方式（单个）
    selectLogisticsMany: 'orders/v1/apply/selectLogisticsMany', //选择物流方式（批量）
    standard: 'orders/synch/standard', //Q01.同步订单
    syncLog: 'orders/synch/log', //Q02.查询同步订单任务日志
    goodsBases: 'goods/v1/ivt/orderPackage/goodsBases', //.获取选择商品列表
    saveGoodsBases: 'orders/v1/ivt/orderPackage/saveGoodsBases', //保存匹配商品
    matchAddPackageGoods: 'orders/v1/ivt/orderPackage/matchAddPackageGoods', //解除订单后再次保存匹配商品
    delivery: 'orders/import/delivery', //导入发货
    runDelivery: 'orders/import/delivery/run', // 执行导入发货
    returnWaitPrint: 'orders/v1/ivt/orderPackage/returnWaitPrint', //打回待打单
    addPrint: '/orders/stock/match/add', //移入待打单
    printed: 'orders/v1/wayBill/print', //打单
    getMergeFlagCnt: 'orders/v1/ivt/orderPackage/getMergeFlagCnt', //待处理下的可合并、已合并、已拆分统计
    statusNum: 'orders/v1/ivt/search/statusNum', //订单各状态统计
    returnHandle: 'orders/v1/ivt/orderPackage/returnHandle', //打回待处理
    updateForbidFlag: 'orders/v1/ivt/orderPackage/updateForbidFlag', //禁止处理打开
    cancelForbidFlag: 'orders/v1/ivt/orderPackage/cancelForbidFlag', //禁止处理关闭
    updateDeductFlag: 'orders/v1/ivt/orderPackage/updateDeductFlag', //扣库存打开
    cancelDeductFlag: 'orders/v1/ivt/orderPackage/cancelDeductFlag', //扣库存关闭
    layFlag: 'orders/v1/ivt/orderPackage/layFlag', //移入搁置
    outLay: 'orders/v1/ivt/orderPackage/outLay', //移出搁置
    channelWithManual: 'logistics/v1/logistics/channelWithManual', //物流服务列表
    saveRemark: 'orders/v1/package/remark/save', //添加备注
    cancelPriorityFlag: 'orders/v1/ivt/orderPackage/cancelPriorityFlag', //关闭优先分配库存
    updatePriorityFlag: 'orders/v1/ivt/orderPackage/updatePriorityFlag', //优先分配库存
    printComplate: 'orders/v1/wayBill/printComplate', //打印完成
    match: 'orders/stock/match', //匹配库存
    receiveInfobatch: 'orders/v1/goods/receive/info/batch', //H09.批量修改收件人信息-获取收件人信息
    receiveSavebatch: 'orders/v1/goods/receive/save/batch', //H11.批量保存收件人信息
    customInfobatch: 'orders/v1/goods/custom/info/batch', //H08.批量修改报关信息--获取商品报关信息
    customSavebatch: 'orders/v1/goods/custom/save/batch', //H09.批量保存信息
    mergeOrders: 'orders/v1/ivt/orderPackage/mergeOrders', //合并订单
    cancelMergeOrders: 'orders/v1/ivt/orderPackage/cancelMergeOrders', //取消合并
    splitPackages: 'orders/v1/ivt/orderPackage/splitPackages', //拆分订单
    getCustomValues: 'orders/v1/ivt/orderPackage/getCustomValues', //定制信息
    cancelSplitPackages: 'orders/v1/ivt/orderPackage/cancelSplitPackages', //取消拆分订单
    paymethods: 'orders/v1/ivt/search/paymethods', // 获取支付方式
    paymentStatus: 'orders/v1/ivt/orderPackage/paymentStatus', // S18.变更支付状态
    batchPaymentStatus: 'orders/v1/ivt/orderPackage/batchPaymentStatus', // S35.批量变更支付状态（导入）
    batchChangePayStatus: 'orders/v1/ivt/orderPackage/batchChangePayStatus', // S36.批量变更支付状态（导入）--保存
    updateCustomValues: 'orders/v1/ivt/orderPackage/updateCustomValues', //修改定制信息
    goPrint: 'orders/v1/apply/goPrint', //已交运批量打回待打单
    goPending: 'orders/v1/apply/goPending', //已交运批量打回待处理
    isPrint: 'orders/v1/apply/isPrint', //已交运打单按钮
    moveToPrint: 'orders/v1/apply/moveToPrint', //已交运移入待打单
    deliveredSelectLogisticsMany: 'orders/v1/apply/deliveredSelectLogisticsMany', //已交运更换物流(多条)
    deliveredSelectLogisticsSingle: 'orders/v1/apply/deliveredSelectLogisticsSingle', //已交运更换物流（已发货、更换物流管理待处理）（单条）
    logisticsTrackInfo: 'orders/v1/package/logistics/track/info', //物流轨迹
    printComplateDeliverys: 'orders/v1/wayBill/printComplateDeliverys', //已交运打单
    getRemarkTypes: 'orders/v1/ivt/remark/getRemarkTypes', // S38.获取所有有效备注类型信息
    packageRemarks: 'orders/v1/ivt/orderPackage/packageRemarks', //S37.根据包裹id和包裹类型获取备注信息
    checkTrackNumber: 'orders/v1/apply/checkTrackNumber', //校验运单号是否已存在
    deliveredApplyNum: 'orders/v1/apply/deliveredApplyNum', // 已交运申请运单号
    deliveredUpload: 'orders/v1/apply/deliveredUpload', //上传已交运导入更换物流
    deliveredImport: 'orders/v1/apply/deliveredImport', //导入更换物流
    dianxiaomi: 'orders/export/dianxiaomi', // 导出店小蜜\
    orderPackageLogistics: 'orders/v1/ivt/orderPackage/orderPackageLogistics', // 追溯物流信息
    createOrder: 'orders/v1/ivt/orderPackage/addManualOrder', // 新建手工订单,\
    addDeliver:'orders/v1/ivt/orderPackage/addDeliver',//G13.批量追加发货商品
    contentBySku:'goods/v1/goods/remark/contentBySku',//获取备注详情
		deliveryBatch:'orders/v1/package/delivery/logistics/delivery/batch',//已交运待打单批量发货
		relieveGoodsBases:'orders/v1/ivt/orderPackage/relieveGoodsBases',//解除匹配关系
    batchRemark:'orders/v1/purchase/goods/remark/add/batch',//批量增加spu备注
    batchEditRemark:'orders/v1/purchase/goods/remark/update',//批量修改spu备注
    
}


export function addDeliver(data) {
    return request({
        url: orderApi.addDeliver,
        method: 'post',
        data: data
    })
}


export function relieveGoodsBases(data) {
	return request({
		url: orderApi.relieveGoodsBases,
		method: 'post',
		data: data
	})
} //解除匹配关系

export function deliveryBatch(data) {
	return request({
		url: orderApi.deliveryBatch,
		method: 'post',
		data: data
	})
}


export function getSourceDomains(data) {
    return request({
        url: orderApi.getSourceDomains,
        method: 'post',
        data: data
    })
}

export function getOrderSource(data) {
    return request({
        url: orderApi.getOrderSource,
        method: 'post',
        data: data
    })
}

export function remarkTypeNames(data) {
    return request({
        url: orderApi.remarkTypeNames,
        method: 'post',
        data: data
    })
}


export function countryCode(data) {
    return request({
        url: orderApi.countryCode,
        method: 'post',
        data: data
    })
}

export function orderList(data) {
    return request({
        url: orderApi.orderList,
        method: 'post',
        data: data
    })
}


export function updateExamine(data) {
    return request({
        url: orderApi.updateExamine,
        method: 'post',
        data: data
    })
}

export function getWayBillNum(data) {
    return request({
        url: orderApi.applyNum,
        method: 'post',
        data: data
    })
}

export function selectLogisticsSingle(data) {
    return request({
        url: orderApi.selectLogisticsSingle,
        method: 'post',
        data: data
    })
}

export function standard(data) {
    return request({
        url: orderApi.standard,
        method: 'post',
        data: data
    })
}

export function goodsBases(data) {
    return request({
        url: orderApi.goodsBases,
        method: 'post',
        data: data
    })
}

export function syncLog(data) {
    return request({
        url: orderApi.syncLog,
        method: 'post',
        data: data
    })
}

export function saveGoodsBases(data) {
    return request({
        url: orderApi.saveGoodsBases,
        method: 'post',
        data: data
    })
}

export function matchAddPackageGoods(data) {
    return request({
        url: orderApi.matchAddPackageGoods,
        method: 'post',
        data: data
    })
}

export function delivery(data) {
    return request({
        url: orderApi.delivery,
        method: 'post',
        data: data
    })
}

export function returnWaitPrint(data) {
    return request({
        url: orderApi.returnWaitPrint,
        method: 'post',
        data: data
    })
}


export function addPrint(data) {
    return request({
        url: orderApi.addPrint,
        method: 'post',
        data: data
    })
}

export function printed(data) {
    return request({
        url: orderApi.printed,
        method: 'post',
        data: data
    })
}

export function getMergeFlagCnt(data) {
    return request({
        url: orderApi.getMergeFlagCnt,
        method: 'post',
        data: data
    })
}

export function statusNum(data) {
    return request({
        url: orderApi.statusNum,
        method: 'post',
        data: data
    })
}

export function returnHandle(data) {
    return request({
        url: orderApi.returnHandle,
        method: 'post',
        data: data
    })
}

export function layFlag(data) {
    return request({
        url: orderApi.layFlag,
        method: 'post',
        data: data
    })
}

export function outLay(data) {
    return request({
        url: orderApi.outLay,
        method: 'post',
        data: data
    })
}

export function updateDeductFlag(data) {
    return request({
        url: orderApi.updateDeductFlag,
        method: 'post',
        data: data
    })
}

export function cancelDeductFlag(data) {
    return request({
        url: orderApi.cancelDeductFlag,
        method: 'post',
        data: data
    })
}

export function updateForbidFlag(data) {
    return request({
        url: orderApi.updateForbidFlag,
        method: 'post',
        data: data
    })
}

export function cancelForbidFlag(data) {
    return request({
        url: orderApi.cancelForbidFlag,
        method: 'post',
        data: data
    })
}

export function channelWithManual(data) {
    return request({
        url: orderApi.channelWithManual,
        method: 'post',
        data: data
    })
}

export function saveRemark(data) {
    return request({
        url: orderApi.saveRemark,
        method: 'post',
        data: data
    })
}

export function updatePriorityFlag(data) {
    return request({
        url: orderApi.updatePriorityFlag,
        method: 'post',
        data: data
    })
}

export function cancelPriorityFlag(data) {
    return request({
        url: orderApi.cancelPriorityFlag,
        method: 'post',
        data: data
    })
}

export function printComplate(data) {
    return request({
        url: orderApi.printComplate,
        method: 'post',
        data: data
    })
}

export function match(data) {
    return request({
        url: orderApi.match,
        method: 'post',
        data: data
    })
}

export function selectLogisticsMany(data) {
    return request({
        url: orderApi.selectLogisticsMany,
        method: 'post',
        data: data
    })
}

export function receiveInfobatch(data) {
    console.log(data)
    return request({
        url: orderApi.receiveInfobatch,
        method: 'post',
        data
    })
}

export function receiveSavebatch(data) {
    return request({
        url: orderApi.receiveSavebatch,
        method: 'post',
        data: data
    })
}

export function customInfobatch(data) {
    return request({
        url: orderApi.customInfobatch,
        method: 'post',
        data
    })
}

export function customSavebatch(data) {
    return request({
        url: orderApi.customSavebatch,
        method: 'post',
        data: data
    })
}

export function runDelivery(data) {
    return request({
        url: orderApi.runDelivery,
        method: 'post',
        data: data
    })
}

export function mergeOrders(data) {
    return request({
        url: orderApi.mergeOrders,
        method: 'post',
        data: data
    })
}

export function cancelMergeOrders(data) {
    return request({
        url: orderApi.cancelMergeOrders,
        method: 'post',
        data: data
    })
}

export function splitPackages(data) {
    return request({
        url: orderApi.splitPackages,
        method: 'post',
        data: data
    })
}

export function getCustomValues(data) {
    return request({
        url: orderApi.getCustomValues,
        method: 'post',
        data: data
    })
}

export function cancelSplitPackages(data) {
    return request({
        url: orderApi.cancelSplitPackages,
        method: 'post',
        data: data
    })
}

export function paymethods(data) {
    return request({
        url: orderApi.paymethods,
        method: 'post',
        data: data
    })
}

export function paymentStatus(data) {
    return request({
        url: orderApi.paymentStatus,
        method: 'post',
        data: data
    })
}

export function batchPaymentStatus(data) {
    return request({
        url: orderApi.batchPaymentStatus,
        method: 'post',
        data: data
    })
}

export function batchChangePayStatus(data) {
    return request({
        url: orderApi.batchChangePayStatus,
        method: 'post',
        data: data
    })
}

export function updateCustomValues(data) {
    return request({
        url: orderApi.updateCustomValues,
        method: 'post',
        data: data
    })
}
export function goPrint(data) {
    return request({
        url: orderApi.goPrint,
        method: 'post',
        data: data
    })
}

export function goPending(data) {
    return request({
        url: orderApi.goPending,
        method: 'post',
        data: data
    })
}

export function isPrint(data) {
    return request({
        url: orderApi.isPrint,
        method: 'post',
        data: data
    })
}


export function moveToPrint(data) {
    return request({
        url: orderApi.moveToPrint,
        method: 'post',
        data: data
    })
}

export function deliveredSelectLogisticsMany(data) {
    return request({
        url: orderApi.deliveredSelectLogisticsMany,
        method: 'post',
        data: data
    })
}

export function deliveredSelectLogisticsSingle(data) {
    return request({
        url: orderApi.deliveredSelectLogisticsSingle,
        method: 'post',
        data: data
    })
}

export function printComplateDeliverys(data) {
    return request({
        url: orderApi.printComplateDeliverys,
        method: 'post',
        data: data
    })
}

export function logisticsTrackInfo(data) {
    return request({
        url: orderApi.logisticsTrackInfo,
        method: 'post',
        data: data
    })
}

export function getRemarkTypes(data) {
    return request({
        url: orderApi.getRemarkTypes,
        method: 'post',
        data: data
    })
}

export function packageRemarks(data) {
    return request({
        url: orderApi.packageRemarks,
        method: 'post',
        data: data
    })
}

export function checkTrackNumber(data) {
    return request({
        url: orderApi.checkTrackNumber,
        method: 'post',
        data: data
    })
}

export function deliveredApplyNum(data) {
    return request({
        url: orderApi.deliveredApplyNum,
        method: 'post',
        data: data
    })
}

export function deliveredUpload(data) {
    return request({
        url: orderApi.deliveredUpload,
        method: 'post',
        data: data
    })
}


export function deliveredImport(data) {
    return request({
        url: orderApi.deliveredImport,
        method: 'post',
        data: data
    })
}

export function dianxiaomi(data) {
    return request({
        url: orderApi.dianxiaomi,
        method: 'post',
        data: data
    })
}

export function orderPackageLogistics(data) {
    return request({
        url: orderApi.orderPackageLogistics,
        method: 'post',
        data: data
    })
}

export function createOrderApi(data) {
    return request({
        url: orderApi.createOrder,
        method: 'post',
        data
    })
}


export function contentBySku(data) {
    return request({
        url: orderApi.contentBySku,
        method: 'post',
        data
    })
}

export function matchingList(data) {
    return request({
        url: 'goods/v1/ivt/orderPackage/refuse/goods/list',
        method: 'post',
        data
    })
}

export function batchRemark(data) {
  return request({
    url: orderApi.batchRemark,
    method: 'post',
    data
  })
}

export function getRemarkList(data) {
  return request({
    url: 'orders/v1/purchase/goods/remark/list',
    method: 'post',
    data
  })
}

export function delRemark(data) {
  return request({
    url: 'orders/v1/purchase/goods/remark/del',
    method: 'post',
    data
  })
}

export function batchEditRemark(data) {
  return request({
    url: orderApi.batchEditRemark,
    method: 'post',
    data
  })
}

export function orderRefund(data) {
  return request({
    url: 'orders/v1/ivt/orderPackage/returnRefund',
    method: 'post',
    data
  })
}
export function cancelChange(data) { // 取消更换物流
  return request({
    url: 'orders/v1/apply/cancelChange',
    method: 'post',
    data
  })
}
export function getIvtRefundReasons(data) { // 获取退款原因
  return request({
    url: 'orders/v1/ivt/orderPackage/getIvtRefundReasons',
    method: 'post',
    data
  })
}

export function orderPayData(data) { // 获取剩余金额
  return request({
    url: 'orders/v1/ivt/orderPackage/getOrderPayData',
    method: 'post',
    data
  })
}
export function importManualOrders(data) { //导入手工订单
  return request({
    url: 'orders/v1/ivt/orderPackage/importManualOrders',
    method: 'post',
    data
  })
}
