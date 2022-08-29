//首页
import request from '@/api/request.js'

export function getOrder() { // 订单模块
    return request({
        url: 'orders/v1/homePage/order/detail',
        method: 'post'
    })
}
export function getPurchase() { // 采购模块
    return request({
        url: 'orders/v1/homePage/purchase/detail',
        method: 'post'
    })
}
export function getSupplierManagement() { // 供应商模块
    return request({
        url: 'orders/v1/homepage/supplier/count',
        method: 'post'
    })
}
export function getshop() { // 店铺模块
    return request({
        url: 'goods/v1/homepage/shopQuery',
        method: 'post'
    })
}
export function getLogistics() { // 物流对账
    return request({
        url: 'orders/v1/homePage/logistics/logisticsReconciliation/pageQuery',
        method: 'post'
    })
}
export function getFinance(){ // 财务审核
    return request({
        url: 'orders/v1/homepage/finance/querypage',
        method: 'post'
    })
}
//仓储

export function getOutStock(){ //1.1出库数量统计
    return request({
        url: 'orders/v1/homePage/wareHouse/outStockCount',
        method: 'post'
    })
}
export function getInStock(){ //1.2入库数量统计
    return request({
        url: 'orders/v1/homePage/wareHouse/inStockCount',
        method: 'post'
    })
}
export function getLogisticsSign(){  //1.3采购单签收
    return request({
        url: 'orders/v1/homePage/wareHouse/signCount',
        method: 'post'
    })
}
export function getArrivalCount(){ //1.4到货数量预测
    return request({
        url: 'orders/v1/homePage/wareHouse/arrivalCount',
        method: 'post'
    })
}
//选品
export function getSelectGoods(){ 
    return request({
        url: 'goods/v1/homePage/good/goodCount',
        method: 'post'
    })
}
//选品(已搁置)
export function getSelectGoodsShelved(){ 
  return request({
      url: 'goods/v1/homePage/good/goodLayedCount',
      method: 'post'
  })
}
//在仓库存
export function getWarehouseStock(data){ 
    return request({
        url: 'orders/v1/homePage/wareHouse/stock',
        method: 'post',
        data
    })
}
//商品管理
export function getGoodManage(data){ 
  return request({
      url: 'orders/v1/homePage/goodManage/outOfCount',
      method: 'post',
      data
  })
}