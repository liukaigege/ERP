// 排序条件
const sortCondition = [
	{
		value: 'ppa.apply_time',
		label: '申请时间'
	},
	{
		value: 'ppc.create_time',
		label: '审核时间'
	},
	{
		value: 'ppa.total_pay_amount',
		label: '付款金额'
	},
  {
		value: 'third_submit_time',
		label: '1688下单时间'
	}
]
const waitSortCondition = [
	{
		value: 'ppa.apply_time',
		label: '申请时间'
	},
	{
		value: 'ppa.total_pay_amount',
		label: '付款金额'
	},
  {
		value: 'third_submit_time',
		label: '1688下单时间'
	}
]

const payStatusList = {
	0: '未申请',
	1: '申请中',
	2: '已付款'
}

const searchData = {
	status: 1, //状态 1 待审核 2已审核
	type: 1, //搜索类型 1采购单号 2供应商名称
	start_end: '',
	keyword: '', //搜索内容
	userId: null, //申请人ID
	supplierType: '', //供应商类型（1：合作、2：1688、3：淘宝、4：拼多多）
	supplierName: '', //供应商名称
	result: '', //审核结果 默认空为全部 1付款完成2拒绝付款
	sortName: 'ppa.apply_time', //排序名称 申请时间：ppa.apply_time  付款金额：ppa.total_pay_amount  审核时间：ppc.create_time
	sortType: 'asc', //排序类型 desc倒序 asc升序
	page: {
		pageNo: 1,
		pageSize: 10
	},
	timeType: 2, //时间类型 1 创建时间 2 申请时间 3 支付时间
	checkedList: [],
	settlementEnum: null
}
const searchDatad = {
	status: 2, //状态 1 待审核 2已审核
	type: 1, //搜索类型 1采购单号 2供应商名称
	start_end: '',
	start: '',
	end: '',
	keyword: '', //搜索内容
	userId: null, //申请人ID
	supplierType: '', //供应商类型（1：合作、2：1688、3：淘宝、4：拼多多）
	supplierName: '', //供应商名称
	result: '', //审核结果 默认空为全部 1.付款完成 0.拒绝付款(已打回)
	sortName: 'ppc.create_time', //排序名称 申请时间：ppa.apply_time  付款金额：ppa.total_pay_amount  审核时间：ppc.create_time
	sortType: 'desc', //排序类型 desc倒序 asc升序
	page: {
		pageNo: 1,
		pageSize: 10
	},
	timeType: 1, //时间类型 1 创建时间 2 申请时间 3 支付时间
	checkedList: [],
	settlementEnum: null
}
const defaultData = { value: 'ppa.apply_time', type: 'asc' }
const defaultDatad = { value: 'ppc.create_time', type: 'desc' }
// 审核结果
const resultList = [
	{
		id: 1,
		result: '付款完成'
	},
	{
		id: 2,
		result: '拒绝付款'
	}
]

const settlementData = {
	typeList: [
		{
			id: 1,
			label: '预付'
		},
		{
			id: 2,
			label: '账期'
		},
		{
			id: 3,
			label: '货到付款'
		},
		{
			id: 4,
			label: '款到发货'
		}
	],
	unitList: [
		{
			id: 1,
			label: '%'
		},
		{
			id: 2,
			label: '元'
		}
	]
}
// 结算方式 1预付 3货到付款 4款到发货 5账期（30天) 6账期（45天) 7账期（60天)
const settlementList = [
	{
		value: 1,
		label: '预付'
	},
	{
		value: 3,
		label: '货到付款'
	},
	{
		value: 4,
		label: '款到发货'
	},
	{
		value: 5,
		label: '账期（30天)'
	},
	{
		value: 6,
		label: '账期（45天)'
	},
	{
		value: 7,
		label: '账期（60天)'
	}
]

// 查询订单信息的form表单列表
const orderInfoForms = {
	searchType: 1, //搜索类型 1商品sku 2订单sku 3订单号 4二维码ID
	searchText: '', //检索框内容
	purchaseStatus: '', //入库状态 1：未入库 2：部分入库 3：全部入库（新）
	deliveryTimeStart_deliveryTimeEnd: '', //入库时间 开始（新）入库时间 结束（新）
	deliveryTimeStart: '',
	deliveryTimeEnd: '',
	payStatus: '', //付款状态 1未申请 2申请中 3已申请（新）
	deptId: '', //团队ID
	// paymentItemId:'',//付款明细ID
	// purchaseOrderItemId:'',//采购订单明细表ID
	// purchaseOrderNumber:'',//采购订单号
	page: {
		pageNo: 1,
		pageSize: 100
	}
}

export {
	sortCondition,
	waitSortCondition,
	searchData,
	searchDatad,
	resultList,
	defaultData,
	settlementData,
	defaultDatad,
	settlementList,
	orderInfoForms,
	payStatusList
}
