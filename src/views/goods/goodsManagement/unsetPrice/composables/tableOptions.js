let colspanMethod = ({ rowIndex, columnIndex }) => {
  if (rowIndex % 2 === 0) {
      if (columnIndex === 0) {
          return { rowspan: 1, colspan: 7 }
      } else {
          return { rowspan: 0, colspan: 0 }
      }
  }
}
let colspanMethod2 = ({ rowIndex, columnIndex }) => {
  if (rowIndex % 2 === 0) {
      if (columnIndex === 0) {
          return { rowspan: 1, colspan: 9 }
      } else {
          return { rowspan: 0, colspan: 0 }
      }
  }
}
export default {
  border: true,
  autoResize: true, 
  keepSource: true,
  align: "center",
  highlightHoverRow: true
}