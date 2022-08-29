const batchOptions = [
  {
    model: 'purchaseWeight',
    label: '重量',
    company: 'g',
    min: 0.01,
    max: 9999.99,
    type: 'number'
  },
  {
    model: 'purchaseLength',
    label: '长',
    company: 'cm',
    min: 0.01,
    max: 999.99,
    type: 'number'

  },
  {
    model: 'purchaseWidth',
    label: '宽',
    company: 'cm',
    min: 0.01,
    max: 999.99,
    type: 'number'

  },
  {
    model: 'purchaseHeight',
    label: '高',
    company: 'cm',
    min: 0.01,
    max: 999.99,
    type: 'number'

  },
  {
    model: 'purchasePrice',
    label: '默认采购价',
    company: 'CNY',
    min: 0.01,
    max: 9999999.99,
    type: 'number'

  },
  {
    model: 'purchaseLink',
    label: '采购链接',
    type:'text',
    maxLength:300
  },
  {
    label: '报价备注',
    model: 'purchaseRemark',
    type:'text',
    maxLength:500
  }
]

function createRules(str, reg,required=true) {
  return {
    required: required,
    validator({ cellValue, row ,rule}) {
      if(!rule.required &&  [undefined,null,''].includes(cellValue)) return true
      if (!reg.test(cellValue) || cellValue <= 0) {
        return new Error(str)
      }
    }
  }
}

const tableOptions = {
  editConfig: { trigger: 'click', mode: 'cell' },
  align: 'center',
  columnConfig: { resizable: true },
  editRules: {
    nameCn:[{required:true,message:'请填写配件名称'}],
    purchasePrice: [createRules('必填项，0以上的数值，最大9999999.99', /^(?!0\d)\d{1,7}(\.\d{1,2})?$/)],
    purchaseLength: [createRules('0以上的数值，最大999.99', /^(?!0\d)\d{1,3}(\.\d{1,2})?$/,false)],
    purchaseWidth: [createRules('0以上的数值，最大999.99', /^(?!0\d)\d{1,3}(\.\d{1,2})?$/,false)],
    purchaseHeight: [createRules('0以上的数值，最大999.99', /^(?!0\d)\d{1,3}(\.\d{1,2})?$/,false)],
    purchaseWeight: [createRules('0以上的数值，最大9999.99', /^(?!0\d)\d{1,4}(\.\d{1,2})?$/,false)]
  }
}
export {
  batchOptions,
  tableOptions
}
