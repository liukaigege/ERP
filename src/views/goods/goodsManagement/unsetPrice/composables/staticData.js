let timeType = [
  {
    label: '开发时间',
    value: 1
  }
]
let timeType2 = [
  {
    label: '开发时间',
    value: 1
  },
  {
    label: '申请时间',
    value: 2
  },
  {
    label: '打回时间',
    value: 6
  }
]
let searchType = [
  { value: 1, label: '商品名' },
  { value: 2, label: '商品编码' },
  { value: 5, label: '商品标签' },
  { value: 6, label: '开发人' }
]
let refuseType = [
  { value: 1, label: '采购打回' },
  { value: 2, label: '物流打回' }
]
let sortInfo = ['开放时间', '价格升序', '价格降序']

let categoryProps = {
  value: 'id',
  label: 'name',
  children: 'child',
  emitPath: false,
  checkStrictly: true
}

export { timeType, timeType2, searchType, refuseType, sortInfo, categoryProps }
