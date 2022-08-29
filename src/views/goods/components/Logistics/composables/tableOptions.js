
let rule = {
  required: true,
  validator({ cellValue, row }) {
    if (row.lgtSwitch === 1 && (row.lgtStatch !== 1 || !row.isQuoted)) {  // 报价开关开启 和 非已报价 
      if (cellValue !== 0 && !cellValue) return new Error('请输入')
    }
  }
}

let freightRules = {
  freightUsa: [rule]
}
let declareRules = {
  nameEn: [rule],
  nameCn: [rule],
  weight: [rule],
  price: [rule]
}
const commonOpt = {
  ref: 'tableRef',
  align: "center",
  border: true,
  showOverflow: 'tooltip',
  'scroll-y': { gt: 30 }
}

export const freightOptions = {
  editRules: freightRules,
  maxHeight: '400px',
  ...commonOpt
}

export const declareOptions = {
  editRules: declareRules,
  maxHeight: '400px',
  'row-config': { height: 116 },
  ...commonOpt
}
