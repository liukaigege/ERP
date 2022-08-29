const editRules = {
	price: [
		{ required: true, message: '请输入单价', trigger: 'blur' },
		{
			validator({ cellValue, row }) {
				if (
					toFixedNum(cellValue) >
					Number(row.purchasePrice * 1 + 3).toFixed(2) * 1
				)
					return new Error(`单价不能超过采购报价3元`)
			}
		}
	],
	purchaseQuantity: [
		{ required: true, message: '请输入数量', trigger: 'blur' },
		{
			validator({ cellValue, row }) {
				if (row.type == 1 && cellValue > row.count)
					return new Error(`采购数量不能高于建议采购数量`)
			}
		}
	]
}
const batchApplyRules = {
	applyAmount: [
		{
			validator({ cellValue, row }) {
				if (row.isChecked && row.id) {
					if (cellValue !== 0 && !cellValue)
						return new Error(
							row.customization == 1 ? '请选择订单商品' : '请输入申请金额'
						)
					if (row.customization == 1) {
						if (toFixedNum(cellValue) > toFixedNum(row.remainAmount))
							return new Error('不能大于剩余可申请金额')
					} else {
						if (toFixedNum(cellValue) != toFixedNum(row.remainAmount))
							return new Error('必须等于剩余可申请金额')
					}
				}
			}
		}
	]
}
const applyRules = {
	applyAmount: [
		{
			validator({ cellValue, row }) {
				if (row.isChecked) {
					if (cellValue !== 0 && !cellValue)
						return new Error(
							row.customization == 1 ? '请选择订单商品' : '请输入申请金额'
						)
					if (row.customization == 1) {
						if (toFixedNum(cellValue) > toFixedNum(row.remainAmount))
							return new Error('不能大于剩余可申请金额')
					} else {
						if (toFixedNum(cellValue) != toFixedNum(row.remainAmount))
							return new Error('必须等于剩余可申请金额')
					}
				}
			}
		}
	]
}
const comOptions = {
	'scroll-y': { gt: 50 }
	// align: "center",
	// 'show-overflow': 'tooltip'
}

// 格式化小数
const toFixedNum = value => {
	return (value * 1).toFixed(2) * 1
}

export const batchTableOption = {
	...comOptions,
	editConfig: { trigger: 'click', mode: 'cell', showIcon: false },
	editRules: batchApplyRules,
	treeConfig: { children: 'detail', indent: 0, expandAll: true },
	rowConfig: { height: 55 },
	'max-height': 600,
	checkboxConfig: {
		checkField: 'isChecked'
	},
	spanMethod: ({ row, columnIndex }) => {
		if (row.detail) {
			if (columnIndex == 0) return { rowspan: 1, colspan: 1 }
			else if (columnIndex == 2) return { rowspan: 1, colspan: 11 }
			else return { rowspan: 0, colspan: 0 }
		}
		if (row.info) {
			if (columnIndex == 2) return { rowspan: 1, colspan: 12 }
			else return { rowspan: 0, colspan: 0 }
		}
		return { rowspan: 1, colspan: 1 }
	}
}
export const rules = {
	settlementValue: { required: true, message: '请输入', trigger: 'blur' },
	settlementUnit: { required: true, message: '请选择', trigger: 'change' },
	toDeptId: { required: true, message: '请选择', trigger: 'change' },
	settlementType: { required: true, message: '请选择', trigger: 'change' }
}
export const topRules = {
	address: { required: true, message: '请选择收货地址', trigger: 'change' },
	accountId: { required: true, message: '请选择', trigger: 'change' }
}
export const applyTableOption = {
	...comOptions,
	editConfig: { trigger: 'click', mode: 'cell', showIcon: false },
	editRules: applyRules,
	'scroll-y': { gt: -1 },
	checkboxConfig: {
		checkField: 'isChecked'
	}
}

export const editTableOption = {
	...comOptions,
	editRules: editRules,
	'scroll-y': { gt: -1 },
	rowConfig: {
		height: 150
	},
	editConfig: {
		trigger: 'click',
		mode: 'cell'
	},
	checkboxConfig: {
		checkField: 'isChecked'
	}
}

export const applyForm = {
	inline: true,
	'inline-message': true
}
