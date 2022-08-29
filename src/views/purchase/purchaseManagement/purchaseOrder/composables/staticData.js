let timeType = [
	{
		label: '创建时间',
		value: 1
	},
	{
		label: '下单时间',
		value: 2
	},
	{
		label: '审批时间',
		value: 3
	},
	{
		label: '付款时间',
		value: 4
	},
	{
		label: '到货时间',
		value: 5
	}
]
let timeType2 = [
	{
		label: '创建时间',
		value: 1
	},
	{
		label: '下单时间',
		value: 2
	}
]
let timeType3 = [
	{
		label: '创建时间',
		value: 1
	},
	{
		label: '下单时间',
		value: 2
	},
	{
		label: '审批时间',
		value: 3
	},
	{
		label: '付款时间',
		value: 4
	}
]
let orderStatusOptions = [
	{
		label: '草稿',
		value: '0'
	},
	{
		label: '待审核',
		value: '1'
	},
	{
		label: '审批未通过',
		value: '2'
	},
	// {
	//   label: '待接单',
	//   value: '3'
	// },
	// {
	//   label: '拒绝接单',
	//   value: '4'
	// },
	{
		label: '待到货',
		value: '5, 6'
	},
	{
		label: '已完成',
		value: '7'
	},
	{
		label: '已取消',
		value: '8'
	}
]
let orderStatusOptions2 = [
	{
		label: '未通过',
		value: 0
	},
	{
		label: '已作废',
		value: 1
	}
]
let logisticsStatusOptions = [
	{
		label: '未发货',
		value: 1
	},
	{
		label: '已发货',
		value: 2
	}
]
let purchaseTypeOptions = [
	{
		label: '缺货采购',
		value: 1
	},
	{
		label: '备货采购',
		value: 2
	}
]
let purchaseTypeOptions2 = [
	{
		label: '缺货采购',
		value: 1
	},
	{
		label: '备货采购',
		value: 2
	},
	{
		label: '多发入库',
		value: 3
	}
]
let purchaseStatus = [
	{
		label: '待到货',
		value: '5'
	},
	{
		label: '部分到货',
		value: '6'
	}
]
let storageFlagOptions = [
	{
		label: '全部到货',
		value: 0
	},
	{
		label: '部分到货',
		value: 1
	}
]
let remainingArrivalOptions = [
	{
		label: '1天以内',
		value: 1
	},
	{
		label: '近3天',
		value: 2
	},
	{
		label: '近7天',
		value: 3
	},
	{
		label: '超过7天',
		value: 4
	}
]
let searchType = [
	{
		label: '采购单号',
		value: 1
	},
	{
		label: '商品SKU',
		value: 2
	},
	{
		label: '供应商',
		value: 3
	},
	{
		label: '商品名称',
		value: 4
	},
	{
		label: '商品编码',
		value: 5
	},
	{
		label: '平台订单号',
		value: 6
	},
	{
		label: '运单号',
		value: 7
	},
	{
		label: '标准订单号',
		value: 8
	},
	{
		label: '二维码ID',
		value: 9
	}
]
let searchType2 = [
	{
		label: '采购单号',
		value: 6
	},
	{
		label: '异常单号',
		value: 5
	},
	{
		label: '商品SKU',
		value: 1
	},
	{
		label: '供应商',
		value: 4
	},
	{
		label: '商品名称',
		value: 2
	},
	{
		label: '商品编码',
		value: 3
	}
]
let exceptionTypeOptions = [
	{
		label: '入库缺货',
		value: '1'
	},
	{
		label: '多收',
		value: '3'
	}
]
let defaultProps = {
	value: 'id',
	label: 'name',
	children: 'childs',
	expandTrigger: 'hover',
	checkStrictly: true
}
let defaultProps2 = {
	value: 'deptId',
	label: 'deptName',
	children: 'children',
	emitPath: false,
	checkStrictly: true
}
const accessoriesTypeOptions = [
	{
		value: '1',
		label: '未导入'
	},
	{
		value: '2',
		label: '部分导入'
	},
	{
		value: '3',
		label: '全部导入'
	}
]

const settlementTypeOptions = [
	{
		value: '4',
		label: '款到发货'
	},
	{
		value: '1',
		label: '预付'
	},
	{
		value: '3',
		label: '货到付款'
	},
	{
		value: '2,30',
		label: '账期30天'
	},
	{
		value: '2,45',
		label: '账期45天'
	},
	{
		value: '2,60',
		label: '账期60天'
	}
] // 结算方式枚举值

export {
	timeType,
	timeType2,
	timeType3,
	orderStatusOptions,
	orderStatusOptions2,
	logisticsStatusOptions,
	purchaseTypeOptions,
	purchaseTypeOptions2,
	purchaseStatus,
	remainingArrivalOptions,
	searchType,
	searchType2,
	exceptionTypeOptions,
	defaultProps,
	defaultProps2,
	storageFlagOptions,
	accessoriesTypeOptions,
	settlementTypeOptions
}
