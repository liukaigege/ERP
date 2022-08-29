let timeType = [
  {
    label: '移入时间',
    value: 5
  },
  {
    label: '开发时间',
    value: 1
  }
]
let searchType = [
  { value: 1, label: '商品名' },
  { value: 2, label: '商品编码' },
  { value: 3, label: '商品SPU' },
  { value: 4, label: '商品SKU' },
  { value: 12, label: 'SKU ID' },
  { value: 5, label: '商品标签' },
  { value: 7, label: '维护人' },
  { value: 9, label: '采购报价人' },
  { value: 8, label: '物流报价人' },
  { value: 11, label: '采集链接' },
  // { value: 13, label: '开发部门' }
]
let categoryProps = {
  value: 'id',
  label: 'name',
  children: 'child',
  emitPath: false,
  checkStrictly: true
}
export {
  timeType,
  searchType,
  categoryProps
}