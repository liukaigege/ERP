export function fmtSku(item, isQuoted) {  // 如果是待报价 则不过滤是否报价的，是已报价则过滤
  return item.skus.filter(sku => {
    if (isQuoted) {
      return sku.isAdd === 1 || !(sku.lgtSwitch === 0 && item.operateStatus !== 0)
    } else {
      return sku.lgtStatch === 1
    }
  }).sort((a, b) => b.isAdd - a.isAdd).map(sku => {
    return {
      ...sku,
      isQuoted,
      combineType: item.combineType, 
      goodsId: item.goodsId,
      speVal: sku.speValues.sort((a, b) => a.speId - b.speId).map(val => val.nameCn || val.nameEn).join('-') || '-',
      isElectric: sku.attr?.indexOf("含电") > -1,
      electricType: sku.attr?.indexOf("内电") > -1 ? "内电" : sku.attr?.indexOf("纯电") > -1 ? "纯电" : "",
      isLiquid: sku.attr?.indexOf("含非液体化妆品") > -1,
      isSpecial: sku.attr?.indexOf("特货(敏感货)") > -1,
      skuStatus: sku.skuSwitch === 0,
      purchaseLWH: [sku.purchaseLength, sku.purchaseWidth, sku.purchaseHeight].filter(v => v).join('*'),
      length: sku.length || sku.lgtSwitch === 0 ? sku.length : sku.purchaseLength,
      width: sku.width || sku.lgtSwitch === 0 ? sku.width : sku.purchaseWidth,
      height: sku.height || sku.lgtSwitch === 0 ? sku.height : sku.purchaseHeight,
      weight: sku.weight || sku.lgtSwitch === 0 ? sku.weight : sku.purchaseWeight
    }
  })
}