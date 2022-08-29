const searchTypeList = [
	{
		value: 1,
		label: '商品编码'
	},
	{
		value: 2,
		label: '商品SKU'
	},
	{
		value: 3,
		label: '商品SKU ID'
	},
	{
		value: 4,
		label: '商品名称'
	},
	{
		value: 5,
		label: '货架位编号'
	}
]

// 盘点中表格-搜索内容枚举值
const searchTypeOptions = [
	// { label: '商品编码', value: 0 },
	{ label: '商品SKU', value: 1 },
	{ label: '商品SKU ID', value: 2 },
	{ label: '商品名称', value: 3 },
	{ label: '货架位编号', value: 4 }
]

const searchForm = {
	page: {
		pageNo: 1,
		pageSize: 100
	},
	goodsType: 1, //商品类型（1普通、2定制）
	searchType: 1, //检索：1商品编码 2商品sku 3商品sku id 4商品名称 5货架位编号
	searchText: null, //
	categoryIds: null //品类ID
}

const categoryProps = {
	value: 'id',
	label: 'name',
	children: 'child',
	multiple: true,
	emitPath: false
}

// 盘点中表格-盘点结果表格表头数据
const inventoryingTableColumns = [
	{ prop: 'nameCn', label: '商品信息', width: 320 },
	{ prop: 'sku', label: '商品SKU/商品SKU ID', width: 270 },
	{ prop: 'createTime', label: '添加时间', width: 100 },
	{ prop: 'shelfSpace', label: '货架位', width: 180 },
	{ prop: 'inventoryNum', label: '库存量', width: 100 },
	{ prop: 'nowInventoryNum', label: '实际盘点数', width: 100 },
	{ prop: 'differenceNum', label: '盘点误差', width: 105 },
	{ prop: 'remark', label: '盘点备注' }
]

// 待盘点编辑表格表头
const toInventoriedColumns = [
	{ prop: 'nameCn', label: '商品信息', minWidth: 320 },
	{ prop: 'sku', label: '商品SKU/商品SKU ID', minWidth: 300 },
	{ prop: 'createTime', label: '添加时间', width: 100 },
	{ prop: 'shelfSpace', label: '货架位', width: 300 },
	{ prop: 'inventoryNum', label: '库存量', width: 100 }
]

// 未通过盘点表格-盘点结果表格表头数据
const unInventoryingTableColumns = [
	{ prop: 'nameCn', label: '商品信息', width: 320 },
	{ prop: 'sku', label: '商品SKU/商品SKU ID', width: 270 },
	{ prop: 'createTime', label: '添加时间', width: 100 },
	{ prop: 'shelfSpace', label: '货架位', width: 180 },
	{ prop: 'inventoryNum', label: '库存量', width: 100 },
	{ prop: 'nowInventoryNum', label: '实际盘点数', width: 100 },
	{ prop: 'differenceNum', label: '盘点误差', width: 100 },
	{ prop: 'remark', label: '盘点备注', minWidth: 190 },
	{ prop: 'auditRemark', label: '审批备注', minWidth: 190 }
]

const tableTypeTabelColumns = [
	{
		tableType: 0,
		columns: toInventoriedColumns,
		navTitle: '盘点详情'
	},
	{
		tableType: 1,
		columns: inventoryingTableColumns,
		navTitle: '盘点详情'
	},
	{
		tableType: 2,
		columns: unInventoryingTableColumns,
		navTitle: '盘点详情'
	},
	{
		tableType: 3,
		columns: unInventoryingTableColumns,
		navTitle: '盘点详情'
	},
	{
		tableType: 4,
		columns: unInventoryingTableColumns,
		navTitle: '盘点详情'
	}
] // tab页对应表格表头数据

// 盘点中表格-盘点状态枚举值
const inventoryStatusOptions = [
	// { label: '全部', value: '' },
	{ label: '未盘点', value: 1 },
	{ label: '已盘点', value: 2 }
]

// 盘点中表格-盘点状态枚举值
const inventoryResultOptions = [
	// { label: '全部', value: '' },
	{ label: '盘盈', value: 1 },
	{ label: '盘平', value: 2 },
	{ label: '盘亏', value: 3 }
]

// 盘盈入库数据
const inventoryInStoreData = {
	form: {
		warehouseId: 1, // 入库仓库 默认万众智谷仓库
		areaId: 1, // 入库分区 默认拣货区
		operateType: 1, // 入库类型 默认盘盈入库
		result: null,
		page: {
			pageNo: 1,
			pageSize: 100
		}
	}
}
// 盘亏出库数据
const inventoryOutStoreData = {
	form: {
		warehouseId: 1, // 入库仓库 默认万众智谷仓库
		areaId: 1, // 入库分区 默认拣货区
		operateType: 2, // 入库类型 默认盘盈入库，显示盘点编号
		result: null,
		page: {
			pageNo: 1,
			pageSize: 100
		}
	}
}

export {
	searchTypeList,
	searchForm,
	categoryProps,
	inventoryingTableColumns,
	toInventoriedColumns,
	searchTypeOptions,
	inventoryStatusOptions,
	inventoryInStoreData,
	inventoryOutStoreData,
	unInventoryingTableColumns,
	inventoryResultOptions,
	tableTypeTabelColumns
}
