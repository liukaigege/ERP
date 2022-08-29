let timeTypeOptions = [
  {
    label: '开发时间',
    value: 1
  },
  {
    label: '申请时间',
    value: 2
  },
  {
    label: '采购报价时间',
    value: 3
  },
  {
    label: '物流报价时间',
    value: 4
  },
  {
    label: '采购首次报价',
    value: 7
  },
  {
    label: '物流首次报价',
    value: 8
  }
]
let goodsCategory = [
  {
    label: '平台采集-1688',
    value: 1
  },
  {
    label: '独立站采集-店匠',
    value: 2
  }
]
let searchType = [
  { value: 1, label: '商品名' },
  { value: 2, label: '商品编码' },
  { value: 3, label: '商品SPU' },
  { value: 12, label: 'SKU ID' },
  { value: 4, label: '商品SKU' },
  { value: 5, label: '商品标签' },
  { value: 7, label: '维护人' },
	{ value: 14, label: '开发人' },
  { value: 9, label: '采购报价人' },
  { value: 8, label: '物流报价人' },
  { value: 11, label: '采集链接' },
  // { value: 13, label: '开发部门' }
]
let combinationOptions = [
  {
    label: '已关联',
    value: 1
  },
  {
    label: '未关联',
    value: 0
  }
]
let categoryProps = {
  value: 'id',
  label: 'name',
  children: 'child',
  emitPath: false,
  checkStrictly: true
}
export { timeTypeOptions, goodsCategory, searchType, categoryProps, combinationOptions }
