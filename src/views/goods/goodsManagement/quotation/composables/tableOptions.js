
let rule = {
  required: true,
  validator({ cellValue, row }) {
    if (row.lgtSwitch === 1) {
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
  align: "center",
  border: true,
  treeConfig: { children: 'skus', indent: 0, expandAll: true },
  showOverflow: 'tooltip',
  'scroll-y': { enabled: false },
  editConfig: {
    trigger: 'click', mode: 'cell', activeMethod({ row }) {
      return row.lgtSwitch === 1 && row.lgtStatch !== 1
    }
  }
}

function rowspanFreight({ row, $columnIndex }) {
  if (row.skus?.length) {
    if ($columnIndex == 0) {
      return { rowspan: 1, colspan: 15 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }

  }
}
function rowspanDeclare({ row, columnIndex }) {
  if (row.skus?.length) {
    if (columnIndex == 0) {
      return { rowspan: 1, colspan: 11 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }

  }
}
export const freightOptions = {
  editRules: freightRules,
  spanMethod: rowspanFreight,
  ...commonOpt
}

export const declareOptions = {
  editRules: declareRules,
  spanMethod: rowspanDeclare,
  ...commonOpt
}
