let colspanMethod = ({ rowIndex, columnIndex }) => {
  if (rowIndex % 2 === 0) {
    if (columnIndex === 0) {
      return { rowspan: 1, colspan: 10 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
}
export default {
  spanMethod: colspanMethod,
  border: true,
  autoResize: true,
  keepSource: true,
  align: 'center',
  highlightHoverRow: true,
  tableData: []
}
