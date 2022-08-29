import request from '@/api/request.js'
//********采购部分******* */
  //采购首页 T+0下单率
  export function getPurchaseRate(data){
    return request({
      url:'bi/storage/purchase_rate/',
      method:'POST',
      data,
    })
  }
  //采购T+0下单数据明细表
  export function purchaseDetail(data){
    return request({
      url:'bi/storage/purchase_detail/',
      method:'POST',
      data,
    })
  }
  //导出采购T+0下单数据明细表
  export function exportPurchaseDetail(data){
    return request({
      url:'orders/v1/bi/purchaseDetail',
      method:'POST',
      data,
    })
  }
// 查询进度条
export function progress(data) { 
    return request({
        url: 'basic/progress',
        method: 'POST',
        data
    })
  }