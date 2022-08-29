export const settlement = [
	{
		label: '账期（30天）',
		value: '30'
	},
	{
		label: '账期（45天）',
		value: '45'
	},
	{
		label: '账期（60天）',
		value: '60'
	}
]
export const cascaderProps = {
	label: 'name',
	children: 'childs',
	value: 'id',
	multiple: true,
}
export const sortOptions = [{
	value: 'a.application_time',
	label: '申请时间'
},
{
	value: 'a.audit_time',
	label: '审核时间'
},
{
	value: 'a.total_amount',
	label: '对账金额'
},
]

export const detailRow = [
	[
		{ span: 5, isKey: false, value: '平台' },
		{ span: 7, isKey: true, value: 'partnerTypeName' },
		{ span: 5, isKey: false, value: '对账单号' },
		{ span: 7, isKey: true, value: 'serialNumber' },
	],
	[
		{ span: 5, isKey: false, value: '供应商名称' },
		{ span: 7, isKey: true, value: 'supplierName' },
		{ span: 5, isKey: false, value: '结算方式' },
		{ span: 7, isKey: true, value: 'settlementValue' },
	],
	[
		{ span: 5, isKey: false, value: '采购单数' },
		{ span: 7, isKey: true, value: 'purchaseQuantity' },
		{ span: 5, isKey: false, value: 'SKU种类' },
		{ span: 7, isKey: true, value: 'skuQuantity' },
	],
	[
		{ span: 5, isKey: false, value: '入库商品总数' },
		{ span: 7, isKey: true, value: 'goodsQuantity' },
		{ span: 5, isKey: false, value: '对账总金额' },
		{ span: 7, isKey: true, value: 'totalAmount' },
	],
	[
		{ span: 5, isKey: false, value: '入库单号' },
		{ span: 7, isKey: true, value: 'putInStorageNoList' },
		// { span: 5, isKey: false, value: '' },
		// { span: 7, isKey: true, value: '' },
	],

]
