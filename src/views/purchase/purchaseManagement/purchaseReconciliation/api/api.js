import request from '@/api/request'
//P01:分页条件查询采购对账列表
export function pageQuery(data){
  return request({
    url:'orders/v1/purchaseVerify/pageQuery',
    method:'post',
    data
  })
}
//P14:查询采购对账-待对账标签页数据量统计
export function getTagTotal(data){
  return request({
    url:'orders/v1/purchaseVerify/getTagTotal',
    method:'post',
    data
  })
}
//P02:批量生成申请对账预览信息
export function batchGenerateApplyInfo(data){
  return request({
    url:'orders/v1/purchaseVerify/batchGenerateApplyInfo',
    method:'post',
    data
  })
}
//P05:导出定制化SKU信息
export function exportCustomized(data){
  return request({
    url:'orders/v1/purchaseVerify/exportCustomized',
    method:'post',
    data
  })
}
//P03:批量生成对账单草稿
export function batchSaveVerify(data){
  return request({
    url:'orders/v1/purchaseVerify/batchSaveVerify',
    method:'post',
    data
  })
}
//C5.待入库列表(吴伟)
export function purchaseStayWarehouses(data){
  return request({
    url:'orders/v1/ivt/purchase/purchaseStayWarehouses',
    method:'post',
    data
  })
}
//P16:采购对账列表-编辑备注)
export function editRemarks(data){
  return request({
    url:'orders/v1/purchaseVerify/editRemark',
    method:'post',
    data
  })
}
//P17:采购对账列表-删除备注
export function deleteRemarks(data){
  return request({
    url:'orders/v1/purchaseVerify/deleteRemark',
    method:'post',
    data
  })
}
//P15:采购对账-批量备注
export function batchRemark(data){
  return request({
    url:'orders/v1/purchaseVerify/batchRemark',
    method:'post',
    data
  })
}
//P15:查询导出模板
export function queryExpotInfos(data){
  return request({
    url:'orders/export/template/infos',
    method:'post',
    data
  })
}
//P18:获取导出选项列表
export function queryExportItems(data){
  return request({
    url:'orders/export/items',
    method:'post',
    data
  })
}
//P04:采购对账导出
export function submitExportList(data){
  return request({
    url:'orders/v1/purchaseVerify/export',
    method:'post',
    data
  })
}
//P05:获取所有有效备注类型信息
export function getRemarkTypes(data){
  return request({
    url:'orders/v1/ivt/remark/getRemarkTypes',
    method:'post',
    data
  })
}
 // P19:根据对账明细id和备注类型id查询备注信息
export function queryPurchaseVerifyRemarkList(data){
  return request({
    url:'orders/v1/purchaseVerify/queryPurchaseVerifyRemarkList',
    method:'post',
    data
  })
}
//P20:根据采购对账备注id查询备注信息(编辑回显)
export function queryPurchaseVerifyRemarkDetail(data){
  return request({
    url:'orders/v1/purchaseVerify/queryPurchaseVerifyRemarkDetail',
    method:'post',
    data
  })
}
//C14.待入库导出
export function warehousesExport(data){
  return request({
    url:'orders/v1/ivt/purchase/warehousesExport',
    method:'post',
    data
  })
}
//C11.编辑/保存备注
export function saveStayWarehousesRemark(data){
  return request({
    url:'orders/v1/ivt/purchase/saveStayWarehousesRemark',
    method:'post',
    data
  })
}
//C12.删除备注
export function deleteStayWarehousesRemark(data){
  return request({
    url:'orders/v1/ivt/purchase/deleteStayWarehousesRemark',
    method:'post',
    data
  })
}
//C13.根据订单和备注类型获取备注列表
export function getStayWarehousesRemarks(data){
  return request({
    url:'orders/v1/ivt/purchase/getStayWarehousesRemarks',
    method:'post',
    data
  })
}
//获取采购员列表
export function getPurchaseUsersWait(data){
  return request({
    url:'orders/v1/purchaseVerify/getPurchaseUsers',
    method:'post',
    data
  })
}