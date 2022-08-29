const searchData = {
  page: {
    pageNo: 1,
    pageSize: 10
  },
  search: null,
  searchType: 1,
  warehouseId: 1,
  operateType: 1,//操作类型（1手动入库、2报损出库、3退货出库、4手动出库）
  createTimeBegin_createTimeEnd: null,
  combineType: 1,
	skuTypeFlag: 3
}
const operateTypeList = {
  // 入库类型
  inType: [{
    id: 1,
    type: '手动入库'
  }],
  // 出库类型
  outeType: [{
    id: 4,
    type: '手动出库'
  }, {
    id: 2,
    type: '报损出库'
  }, {
    id: 3,
    type: '退货出库'
  }]
}
// 搜索类型 1 商品名称  2商品SKU 3出库单号
const searchTypeList = {
  inType: [{
    id: 1,
    type: '商品名称'
  }, {
    id: 4,
    type: 'SKU ID'
  }, {
    id: 2,
    type: '商品SKU'
  }, {
    id: 3,
    type: '入库单号'
  }],
  outeType: [{
    id: 1,
    type: '商品名称'
  }, {
    id: 4,
    type: 'SKU ID'
  }, {
    id: 2,
    type: '商品SKU'
  }, {
    id: 3,
    type: '出库单号'
  }],
}
const editRules = {
  price: [{
    required: true,
    validator({ cellValue, row }) {
      if (row.price == 0|| (row.price && !/^(?!0\d)\d{1,7}(\.\d{1,2})?$/.test(cellValue))) {
        return new Error('必填项，0以上的数值，最大9999999.99')
      }
    }
  }]
}
export { searchData, operateTypeList, searchTypeList, editRules }
