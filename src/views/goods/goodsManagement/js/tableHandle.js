export default function (state, hooks) {
  // 全选 全不选
  function selectAll(value) {
    console.log(value)
    state.tableData.map(row => {
      row.checked = value
      selectRow(row)
    })
  }
  // 单选一行
  function selectRow(row) {
    console.log(row)
    if (row.checked) {
      if (state.selections.indexOf(row.id) === -1) {
        state.selections.push(row.id)
        state.selectRows.push(row)
      }
    } else {
      const index = state.selections.indexOf(row.id)
      state.selections.splice(index, 1)
      state.selectRows.splice(index, 1)
    }
    const length = state.tableData.length / 2
    state.selectedAll = state.selections.length === length
  }

  let handleSizeChange = (val) => {
    state.form.page.pageSize = val
    state.form.page.pageNo = 1
    hooks.searchEvent()
    console.log(`每页 ${val} 条`)
  }

  let handleCurrentChange = (val) => {
    state.form.page.pageNo = val
    hooks.searchEvent()
    console.log(`当前页: ${val}`)
  }
  return {
    selectAll,
    selectRow,
    handleSizeChange,
    handleCurrentChange
  }
}
