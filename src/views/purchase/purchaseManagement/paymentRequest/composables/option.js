const comOptions = {
  'max-height': 400,
  'scroll-y': { gt: 50 },
  align: "center",
  ref: "xTable"
}

const applyRules = {
  applyAmount: [
    {
      required: true,
      validator({ cellValue, row }) {
        if (row.checked) {
          if (cellValue !== 0 && !cellValue) return new Error('请输入申请金额')
					if(row.customization == 0){
						if (cellValue != (row.remainAmount * 1).toFixed(2) * 1) return new Error('必须等于剩余可申请金额')
					}else{
						if (cellValue > (row.remainAmount * 1).toFixed(2) * 1) return new Error('不能大于剩余可申请金额')
					}
        }
      }
    }
  ],
}

export const applyTableOption = {
  ...comOptions,

  editRules: applyRules,
}

