// staticData.js
// 商品来源
export const sourceData = [
	{
		value: 3,
		label: '表格导入'
	},
	{
		value: 1,
		label: '独立站采集',
		children: [
			{
				value: 'shopify',
				label: 'shopify'
			},
			{
				value: 'shoplazza',
				label: 'shoplazza'
			}
		]
	},
	{
		value: 4,
		label: '复制'
	},
	{
		value: 0,
		label: '平台采集',
		children: [
			{
				value: '1688',
				label: '1688'
			},
			{
				value: 'aliexpress',
				label: 'aliexpress'
			},
			{
				value: 'amazon',
				label: 'amazon'
			},
			{
				value: 'etsy',
				label: 'etsy'
			},
			{
				value: 'shein',
				label: 'shein'
			},
			{
				value: 'wayfair',
				label: 'wayfair'
			},
			{
				value: '1688',
				label: '1688'
			}
		]
	},
	{
		value: 2,
		label: '手动添加'
	}
]

// 商品列表状态
export const statusList = [
	{
		value: 0,
		label: '未激活',
		children: [
			{
				value: '相似商品',
				label: '相似商品'
			},
			{
				value: '侵权商品',
				label: '1688'
			},
			{
				value: '来源重复',
				label: '亚马逊'
			},

		]
	},
	{
		value: 1,
		label: '激活失败',
		children: [
			{
				value: 'sku编码不全',
				label: 'sku编码不全'
			},
			{
				value: '侵权待审',
				label: '侵权待审'
			}
		]
	},

]



// 侵权原因
export const tortReason = [{ name: '全部', id: '' }, { name: '图片侵权', id: 2 }, { name: '文字侵权', id: 1 }, { name: '图文侵权', id: 3 }]
// 侵权审核结果
export const tortResult = ['全部', '侵权可用', '侵权不可用', '未侵权']
// 查看权限选择
export const authTypeOptions = [
	{
		value: 2,
		label: '所有人'
	},
	{
		value: 1,
		label: '仅部门可见'
	},
	{
		value: 3,
		label: '部门及以下'
	},
	{
		value: 0,
		label: '仅维护人可见'
	}
]

export const authTypeOptionsBK = [
	{
		value: 2,
		label: '所有人'
	},
	{
		value: 1,
		label: '仅部门可见'
	},
	{
		value: 3,
		label: '部门及以下'
	},
	{
		value: 0,
		label: '仅自己可见'
	}
]
// 侵权筛选选择
export const tortStatusOptions = [
	{
		value: 2,
		label: '侵权可用'
	},
	{
		value: 1,
		label: '未侵权'
	}
]
// 商品类型选择
export const skuTypeOptions = [
	{
		value: 1,
		label: '普通商品'
	},
	{
		value: 2,
		label: '定制商品'
	}
]
export const enableCustomOptions = [
	{
		value: 0,
		label: '普通商品'
	},
	{
		value: 1,
		label: '定制商品'
	}
]
// electronic: null, // 含电
//     electronicType: null, // 内电 / 纯电
//     noLiquid: null, // 非液体化妆品
//     liquid: null, // 液体
//     paste: null, // 膏体
//     plant: null, // 植物
//     special: null, // 特货
//     magnet: null, // 带磁
//     powder: null // 含粉末

export const goodsAttrOptions = [
	{
		value: '含电',
		label: '含电'
	},
	{
		value: '含非液体化妆品',
		label: '含非液体化妆品'
	},
	{
		value: '液体',
		label: '液体'
	},
	{
		value: '膏体',
		label: '膏体'
	},
	{
		value: '植物',
		label: '植物'
	},
	{
		value: '特货（敏感货）',
		label: '特货（敏感货）'
	},
	{
		value: '带磁',
		label: '带磁'
	},
	{
		value: '含粉末',
		label: '含粉末'
	},
	{
		value: '木质',
		label: '木质'
	}
]

//仓库列表
export const warehouseList = [
	{
		warehouseName: '万众智谷仓库',
		warehouseId: 1
	}
]

export const codeOptions = {
	1: [
		{ value: 'S', label: 'S' },
		{ value: 'M', label: 'M' },
		{ value: 'L', label: 'L' },
		{ value: 'XL', label: 'XL' },
		{ value: '2XL', label: '2XL' },
		{ value: '3XL', label: '3XL' },
		{ value: '4XL', label: '4XL' },
		{ value: '5XL', label: '5XL' },
	],
	2: [
		{ value: 35, label: '35' },
		{ value: 36, label: '36' },
		{ value: 37, label: '37' },
		{ value: 38, label: '38' },
		{ value: 39, label: '39' },
		{ value: 40, label: '40' },
		{ value: 41, label: '41' },
		{ value: 42, label: '42' },
		{ value: 43, label: '43' },
		{ value: 44, label: '44' },
		{ value: 45, label: '45' },
		{ value: 46, label: '46' },
		{ value: 47, label: '47' },
		{ value: 48, label: '48' },
		{ value: 49, label: '49' },
		{ value: 50, label: '50' },
	]
}

export const goodsStatus = [
	{
		label: '未激活',
		value: 0,
		children: [
			{
				label: '未激活',
				value: -2
			},
			{
				label: 'SKU编码不全',
				value: 1
			},
			{
				label: '侵权待审',
				value: 4
			}
		]
	},
	{
		label: '激活失败',
		value: -1,
		children: [
			{
				label: '相似商品',
				value: 3
			},
			{
				label: '侵权商品',
				value: -1
			},
			{
				label: '来源重复',
				value: 2
			}
		]
	}
]

// 采购-采购管理-供应商管理-合作供应商类型
export const supplierTypeOptions = [
	{
		value: 3,
		label: 'CMT'
	},
	{
		value: 2,
		label: 'FOB'
	},
	{
		value: 1,
		label: 'ODM'
	}

]

// 采购-采购管理-供应商管理-合作供应商-结算方式
// 预付、账期（30天)、账期（45天)、账期（60天)、货到付款、款到发货
export const supplierPayTypeOptions = [
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

export const supplierSearchTypeOptions = [
	{
		value: 1,
		label: '供应商名称'
	},
	{
		value: 2,
		label: '供应商电话'
	},
	{
		value: 4,
		label: '供应商编码'
	}
]

export const supplierSearchTypeOptions2 = [
	{
		value: 1,
		label: '供应商名称'
	},
	{
		value: 3,
		label: '店铺主页'
	},
	{
		value: 4,
		label: '供应商编码'
	}
]

export const supplierPartnerTypes = [
	{
		value: 1,
		label: '合作供应商',
		key: 'cooperation'
	},
	{
		value: 2,
		label: '1688',
		key: '1688'
	},
	{
		value: 3,
		label: '淘宝',
		key: 'tb'
	},
	{
		value: 4,
		label: '拼多多',
		key: 'pdd'
	}
]
//结算方式 1 2账期 3货到付款 4款到发货
export const settlementTypeList = [
	{
		typeName: '预付',
		value: 1
	},
	{
		typeName: '账期',
		value: 2
	},
	{
		typeName: '货到付款',
		value: 3
	},
	{
		typeName: '款到发货',
		value: 4
	}
]
// 采购类型
export const purchaseTypeList = [
	{
		typeName: '缺货采购',
		value: 1
	},
	{
		typeName: '备货采购',
		value: 2
	},
	{
		typeName: '多发入库',
		value: 3
	},
]

// 搁置原因
export const shelveReson = {
	default: '取消订单：正在联系',
	list: [
		{
			label: '取消订单：正在联系',
			id: 1
		},
		{
			label: '取消订单：确认退款',
			id: 2
		},
		{
			label: '待确认：地址/电话/邮编',
			id: 3
		},
		{
			label: '待确认：大额订单',
			id: 4
		},
		{
			label: '待确认：是否同意换货',
			id: 5
		},
		{
			label: '海外仓等特殊渠道发货',
			id: 6
		},
		{
			label: '其他公司代发订单',
			id: 7
		},
		{
			label: '补偿申请：正在协商',
			id: 8
		},
		{
			label: '订单已拒付',
			id: 9
		},
		{
			label: '不通邮待退款',
			id: 10
		},
		{
			label: '采购不到待退款',
			id: 11
		},
		{
			label: '其他',
			id: 12
		}
	]
}

// skuType => 商品SKU类型 1.单规格 2.多规格 3.定制
export const goodsTypeList = [{
  value:1,
  label:'单规格'
},{
  value:2,
  label:'多规格'
},{
  value:3,
  label:'定制'
}]
