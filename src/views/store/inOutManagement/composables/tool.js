import { deepCopy } from '@/utils/tool.js'
// 选择商品后合并商品
export function wareHouseAreaList(data) {
  // 
}

// 合并单元格方法/奇数项合并当前行展示
export function colspanMethod(row) {
  const { rowIndex, columnIndex } = row
  if (rowIndex % 2 == 0) {
    if (columnIndex === 0) {
      return { rowspan: 1, colspan: 4 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
}
// 将列表数据重新组装，为了符合表格格式，需要将数据复制一份，将[1,2]类型数组复制为[1,1,2,2]，奇数项合并当前行展示
export function copyList(arr) {
  let list = []
  arr.forEach(v => {
    v.active = false
    v.itemList.forEach(val => {
      val.str = ''
      val.detailList.forEach((item, i) => {
        val.str += `${i === 0 ? '' : ' '}【${item.gridName} ${item.areaName}】`
      })
    })
    v.arrow = 0
    list.push(deepCopy(v))
    v.arrow = 2
    list.push(deepCopy(v))
  })
  return list
}


// json字符串转为json
export function strToJson(str) {
  return JSON.parse(str)
}