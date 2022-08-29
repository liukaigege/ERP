// 待报价 采购报价 物流报价 接口集合

import request from '@/api/request.js'

// 查询待报价-采购报价/物流报价列表信息
export function getQuoteList(data) {
    return request({
        url: 'goods/v1/goods/list',
        method: 'post',
        data
    })
}

// 查询带权限的品类列表信息
export function getCategoryTree() {
    return request({
        url: 'goods/v1/category/auth/tree',
        method: 'post'
    })
}

// 获取待报价列表数字
export function quoteListNums(data) {
    return request({
        url: 'goods/v1/goods/list/num',
        method: 'post',
        data
    })
}

// 采购报价批量报价查询
export function purchaseBatchInfo(data) {
    return request({
        url: 'goods/v1/goods/offer/purchase/batch/info',
        method: 'post',
        data
    })
}

// 采购报价批量报价
export function purchaseBatchUpdate(data) {
    return request({
        url: 'goods/v1/goods/offer/purchase/batch',
        method: 'post',
        data
    })
}

// 拒绝报价
export function rejectQuote(data) {
    return request({
        url: 'goods/v1/goods/offer/reject',
        method: 'post',
        data
    })
}

// 批量打回报价接口
export function rejectQuoteBatch(data) {
    return request({
        url: 'goods/v1/goods/back/batch',
        method: 'post',
        data
    })
}

// 采购报价信息查询
export function getPurchaseInfo(data) {
    return request({
        url: 'goods/v1/goods/offer/purchase/info',
        method: 'post',
        data
    })
}

// 采购报价 保存采购报价接口
export function quotePurchase(data) {
    return request({
        url: 'goods/v1/goods/offer/purchase/update',
        method: 'post',
        data
    })
}

// 采购报价 合并商品
export function combineQuotationGoods(data) {
    return request({
        url: 'goods/v1/quotation/merge',
        method: 'post',
        data
    })
}

// 采购报价-合并商品-商品库列表
export function getGoodsList(data) {
    return request({
        url: 'goods/v1/merge/goods/list',
        method: 'post',
        data
    })
}

// 获取货源渠道列表
export function getPathOptions() {
    return request({
        url: 'goods/v1/channel/page',
        method: 'post',
        data: {
            page: {
                pageNo: 1,
                pageSize: 1000
            }
        }
    })
}

// 获取商品配对关系
export function getSkuPairs(data) {
    return request({
        url: 'orders/v1/ivt/sku/getSkuMatchList',
        method: 'post',
        data
    })
}

// 修改商品配对关系
export function modifySkuPairs(data) {
    return request({
        url: 'orders/v1/ivt/sku/delSkuMatchList',
        method: 'post',
        data
    })
}

// 校验商品状态
export function validateGoodsStatus(data) {
  return request({
    url: 'goods/v1/goods/status/validate',
    method: 'post',
    data
  })
}

// 获取备注类型
export function remarkTypes(data) {
  return request({
    url: 'orders/v1/ivt/remark/getRemarkTypes',
    method: 'post',
    data
  })
}

// 根据备注类型ID获取备注详情列表
export function getRemarkDetail(data) {
  return request({
      url: 'goods/v1/goods/remark/detail',
      method: 'post',
      data: data
  })
}

// 采购报价导出商品
export function purchaseExport(data) {
  return request({
    url: 'goods/v1/offer/purchase/export',
    method: 'post',
    data
  })
}

// 采购报价导出表格
export function purchaseImport(data) {
  return request({
    url: 'goods/v1/offer/purchase/import',
    method: 'post',
    data
  })
}

// 物流报价导出商品
export function logisticsExport(data) {
  return request({
    url: 'goods/v1/offer/logistics/export',
    method: 'post',
    data
  })
}

// 物流报价导出表格
export function logisticsImport(data) {
  return request({
    url: 'goods/v1/offer/logistics/import',
    method: 'post',
    data
  })
}

// 查询关联商品弹窗关联商品信息
export function getRelationGoods(data) {
  return request({
    url: 'goods/v1/goods/combination/sku/relation',
    method: 'post',
    data
  })
}

// 关联商品 商品列表获取接口
export function combinationSinglePage(data) {
  return request({
    url: 'goods/v1/goods/combination/single/page',
    method: 'post',
    data
  })
}

// 关联商品 更新关联关系
export function updateRelations(data) {
  return request({
    url: 'goods/v1/goods/combination/relation/update',
    method: 'post',
    data
  })
}

// 根据品类id查询当前品类所属的品类树集合
export function getCategoryTreeById(data) {
  return request({
    url: 'goods/v1/category/getCategoryTreeById',
    method: 'post',
    data
  })
}

// 保存更改品类
export function saveChangeCategory(data) {
  return request({
    url: 'goods/v1/goods/category/validate',
    method: 'post',
    data
  })
}

export function customUpdate(data){
  return request({
    url:"goods/v1/goods/custom/update",
    method: 'post',
    data
  })
}