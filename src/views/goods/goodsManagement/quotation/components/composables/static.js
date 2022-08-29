export const timeTypeOptions = [
  { value: 1, label: '开发时间' },
  { value: 2, label: '申请时间' }
]

export const searchTypeOptions = [
  { value: 1, label: '商品名' },
  { value: 2, label: '商品编码' },
  { value: 5, label: '商品标签' },
  { value: 6, label: '开发人' },
  { value: 10, label: '申请人' },
  { value: 13, label: '开发部门' }
]

export const searchTypeOptions2 = [
  { value: 1, label: '商品名' },
  { value: 2, label: '商品编码' },
  { value: 5, label: '商品标签' },
  { value: 6, label: '开发人' },
  { value: 10, label: '申请人' },
  { value: 9, label: '采购报价人' }
]

export const statusOptions = [
  { value: 2, label: '待采购报价' },
  { value: 4, label: '待物流报价' },
  { value: 6, label: '已报价' },
]

export const statusTransfer = {
  // 0待激活 -1激活失败 1未报价 2待采购报价 3采购打回 4待物流报价 5物流打回 6已报价
  0: '待激活',
  '-1': '激活失败',
  1: '未报价',
  2: '待采购报价',
  3: '采购打回',
  4: '待物流报价',
  5: '物流打回',
  6: '已报价'
}

// 报价开关打开时校验必填项 定制品校验必填项

function createRules(str, reg,required = true) {
  return {
    required: required,
    validator({ cellValue, row,column,rule }) {
      if(!rule.required &&  [undefined,null,''].includes(cellValue)) return true
      if(row.puhSwitch === 0) return true
      if(!cellValue) return new Error(str)
      if(column.field == 'nameCn') return true
      // row.puhSwitch === undefined 定制品
      // (row.isSetPriceDetail || row.puhStatch !== 1) 待报价里面报过价的数据不需要校验 已报价里面报过价的数据编辑后需要校验
      if (row.puhSwitch === 1  && (row.isSetPriceDetail || row.puhStatch !== 1) && (!reg.test(cellValue) || cellValue <= 0)) {
        return new Error(str)
      }
    }
  }
}

export const editRules = {
  weight: [createRules('必填项，0以上的数值，最大99999.99', /^(?!0\d)\d{1,5}(\.\d{1,2})?$/)],
  length: [createRules('必填项，0以上的数值，最大999.99', /^(?!0\d)\d{0,3}(\.\d{1,2})?$/)],
  width: [createRules('必填项，0以上的数值，最大999.99', /^(?!0\d)\d{0,3}(\.\d{1,2})?$/)],
  height: [createRules('必填项，0以上的数值，最大999.99', /^(?!0\d)\d{0,3}(\.\d{1,2})?$/)],
  price: [createRules('必填项，0以上的数值，最大9999999.99', /^(?!0\d)\d{1,7}(\.\d{1,2})?$/)],
  name:[createRules('必填项')],
  purchaseWeight: [createRules('0以上的数值，最大99999.99', /^(?!0\d)\d{1,5}(\.\d{1,2})?$/,false)],
  purchaseLength: [createRules('0以上的数值，最大999.99', /^(?!0\d)\d{0,3}(\.\d{1,2})?$/,false)],
  purchaseWidth: [createRules('0以上的数值，最大999.99', /^(?!0\d)\d{0,3}(\.\d{1,2})?$/,false)],
  purchaseHeight: [createRules('0以上的数值，最大999.99', /^(?!0\d)\d{0,3}(\.\d{1,2})?$/,false)],
  purchasePrice: [createRules('必填项，0以上的数值，最大9999999.99', /^(?!0\d)\d{1,7}(\.\d{1,2})?$/)],
  nameCn:[{required:true,message:'请填写配件名称'}],
  purchaseRemark: [{
    validator({ cellValue, row }) {
      if (row.puhSwitch === 0 && !cellValue) {
        return new Error('报价开关未开启，请填写备注')
      }
    }
  }]
}

export const editConfig = {
  trigger: 'click',
  mode: 'cell',
  activeMethod({ row, column }) {
    if (column.property === 'purchaseRemark') {
      return true
    }
    return row.puhSwitch === 1 && row.puhStatch !== 1
  }
}
