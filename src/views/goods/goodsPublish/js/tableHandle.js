import { deepCopy } from '@/utils/tool.js'
export default function (state, hooks) {
  // 单选
  const handleCheckedChange = (value, item) => {
    if (value) {
      state.selectGoodsId.push(item.id)
    } else {
      state.selectGoodsId.splice(state.selectGoodsId.indexOf(item.id), 1)
    }
    state.checkedList =
      state.selectGoodsId.length === state.checkOptions.length
    state.isIndeterminate =
      state.selectGoodsId.length > 0 &&
      state.selectGoodsId.length < state.checkOptions.length
  }
  // 全选/不选
  let handleCheckAllChange = val => {
    state.dataList.forEach((item, index) => {
      if (index % 2 == 0) {
        item.isChecked = val
      }
    })
    state.selectGoodsId = val ? deepCopy(state.checkOptions) : []
    state.isIndeterminate = false
    state.checkedList = val
    state.ischeck = val
  }
  // 分页
  const handleSizeChange = val => {
    state.size = val
    state.current = 1
    hooks.init()
  }
  const handleCurrentChange = val => {
    state.current = val
    hooks.init()
  }
  function colspanMethod({ rowIndex, columnIndex }) {
    if (rowIndex % 2 === 0) {
      if (columnIndex === 0) {
        return { rowspan: 1, colspan: 9 }
      } else {
        return { rowspan: 0, colspan: 0 }
      }
    }
  }
  // 偶数行添加下拉
  const expandVisibleMethod = ({ rowIndex, row }) => {
    if (rowIndex % 2 == '0' || !row.publishShops) {
      return false
    }
    return true
  }
  return {
    handleCheckedChange,
    handleCheckAllChange,
    handleSizeChange,
    handleCurrentChange,
    colspanMethod,
    expandVisibleMethod
  }
}
