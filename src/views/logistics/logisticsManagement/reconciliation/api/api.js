import request from '@/api/request.js'

export function pageQuery(data){
  return request({
    url:'/orders/v1/logistics/logisticsReconciliation/pageQuery',
    method:'POST',
    data
  })
}

export function logisedit(data){ // 编辑物流对账
  return request({
    url:'/orders/v1/logistics/logisticsReconciliation/edit',
    method:'POST',
    data
  })
}
export function getTagTotal(data){ // 查询数量
  return request({
    url:'/orders/v1/logistics/logisticsReconciliation/getTagTotal',
    method:'POST',
    data
  })
}
export function batchApprove(data){ // 批量审核
  return request({
    url:'/orders/v1/logistics/logisticsReconciliation/batchApprove',
    method:'POST',
    data
  })
}

export function batchRemark(data){ // 批量备注
  return request({
    url:'/orders/v1/logistics/logisticsReconciliation/batchRemark',
    method:'POST',
    data
  })
}


export function logisExport(data){ // 导出
  return request({
    url:'/orders/v1/logistics/logisticsReconciliation/export',
    method:'POST',
    data
  })
}

export function logisImport(data){ // 导入
  return request({
    url:'/orders/v1/logistics/logisticsReconciliation/import',
    method:'POST',
    data
  })
}

export function deleteItem(data){ // 移除子包裹
  return request({
    url:'/orders/v1/logistics/logisticsReconciliation/delete',
    method:'POST',
    data
  })
}

export function importFile(data){ // L011.物流对账已审核导入修改
  return request({
    url:'/orders/v1/logistics/logisticsReconciliation/importUpdate',
    method:'POST',
    data
  })
}