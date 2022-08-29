/*
 * @Descripttion:  存储一些json数据
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-27 11:03:55
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-24 23:17:38
 */

const orderOptions = {
	allOrder: {
		form: [
			'timeFrame', //时间范围
			'country', //国家
			'orderSource', //订单来源
			'department', //归属部门
			'logistics', //物流方式
			'packgeType', //包裹类型
			'payMethond', //支付方式
			'orderType', //订单类型
			'orderStatus', //订单状态
			'goodsAttr', //商品属性
			'orderPrice', //订单金额
			'goodsNum', //商品数量
			'searchText', //搜索内容
			'remark', //备注
			'sort', //排序
			'shelve',//是否搁置
			'refund',//是否退款
			'packgeForm',//包裹形式
		],
		tableTh: [
			{
				title: '商品信息',
				key: 'allGoodsDetail',
				width: '400px'
			},
			{
				title: '订单号',
				key: 'orderNum',
				width: '200px'
			},
			{
				title: '订单金额',
				key: 'amount',
				width: '186px'
			},

			{
				title: '收件人信息',
				key: 'addressee',
				width: '200px'
			},
			{
				title: '时间',
				key: 'time',
				width: '180px'
			},
			{
				title: '物流信息',
				key: 'logistics',
				width: '150px'
			},
			{
				title: '操作',
				key: 'options',
				width: '100px'
			}
		],
		spanColumns: ['logistics', 'options'],
		isSpanColumns: true,
		options: [
			'detail', //详情
			'remark' ,//备注
			'refund',// 退款
			'goHandle'// 去处理
		],
		switch: [],
		button: [
			'remark', //备注
			'shelve', //搁置
			'refund',//退款
			'importOrder', //导出订单
			'importDXM' // 导出店小蜜
		],
		batch: [] //批量操作
	}, //全部订单
	toBeReviewed: {
		form: [
			'timeFrame', //时间范围
			'country', //国家
			'orderSource', //订单来源
			'department', //归属部门
			// 'logistics', //物流方式
			'packgeType', //包裹类型
			'payMethond', //支付方式
			'orderType', //订单类型
			// 'orderStatus', //订单状态
			'goodsAttr', //商品属性
			'orderPrice', //订单金额
			'goodsNum', //商品数量
			'searchText', //搜索内容
			'remark', //备注
			'sort', //排序
			'forbidFlag', //处理状态
			'match', // 匹配状态
			'refund',//是否退款
			'packgeForm',//包裹形式
		],
		tableTh: [
			{
				title: '订单商品',
				key: 'orderGoods',
				width: '310px'
			},
			{
				title: '发货商品',
				key: 'sendGoods',
				width: '310px'
			},
			{
				title: '订单号',
				key: 'orderNum',
				width: '180px'
			},
			{
				title: '订单金额',
				key: 'amount',
				width: '186px'
			},

			{
				title: '收件人信息',
				key: 'addressee',
				width: '280px'
			},
			{
				title: '时间',
				key: 'time',
				width: '200px'
			},
			{
				title: '操作',
				key: 'options',
				width: '100px'
			}
		],
		spanColumns: ['options'],
		isSpanColumns: true,
		options: [
			'detail', //详情
			'remark', //备注
			'refund',// 退款
			'examine' // 审核
		],
		switch: [
			'forbidFlag' //禁止处理
		],
		button: [
			'remark', //备注
			'examine', //审核
			'all', // 批量操作
			'cusToNor',//定制品转普货
			'norToCus',//普货转定制
			'importOrder', //导出订单
			'importDXM' // 导出店小蜜
		],
		batch: [
			{
				value: 'refund',
				label: '退款',
				permission: 'orderManagement/refund'
			},
			{
				value: 'shelve',
				label: '移入搁置',
				permission: 'orderManagement/shelve'
			},
			{
				value: 'forbidFlag',
				label: '处理状态',
				permission: 'orderManagement/forbidFlag',
				children: [
					{
						value: 'forbidFlagTrue',
						label: '禁止处理'
					},
					{
						value: 'forbidFlagFalse',
						label: '正常处理'
					}
				]
			}
		] //批量操作
	}, // 待审核
	pending: {
		form: [
			'timeFrame', //时间范围
			'country', //国家
			'orderSource', //订单来源
			'department', //归属部门
			'logistics', //物流方式
			'packgeType', //包裹类型
			'payMethond', //支付方式
			'orderType', //订单类型
			// 'orderStatus', //订单状态
			'goodsAttr', //商品属性
			'orderPrice', //订单金额
			'goodsNum', //商品数量
			'priorityFlag', //库存分配
			'deductFlag', //库存状态
			'forbidFlag', //处理状态
			'searchText', //搜索内容
			'remark', //备注
			'sort', //排序
			'refund',//是否退款
			'packgeForm',//包裹形式
		],
		tableTh: [
			{
				title: '商品信息',
				key: 'goodsDetail',
				width: '300px'
			},

			{
				title: '订单号',
				key: 'orderNum',
				width: '200px'
			},
			{
				title: '订单金额',
				key: 'amount',
				width: '186px'
			},

			{
				title: '收件人信息',
				key: 'addressee',
				width: '200px'
			},
			{
				title: '时间',
				key: 'time',
				width: '180px'
			},
			{
				title: '物流信息',
				key: 'logistics',
				width: '150px'
			},
			{
				title: '操作',
				key: 'options',
				width: '100px'
			}
		],
		spanColumns: ['options'],
		isSpanColumns: true,
		options: [
			'detail', //详情
			'remark', //备注
			'splitOrder', //拆分订单
			'refund',// 退款
			'applyWayNum' // 申请运单号
		],
		switch: [
			'forbidFlag', //禁止处理
			'priorityFlag', //优先分配库存
			'deductFlag' //扣库存
		],
		button: [
			'remark', //备注
			'applyWayNum', //申请运单号
			'all', // 批量操作
			'cusToNor',//定制品转普货
			'norToCus',//普货转定制
			'selLogistics', //选择物流方式
			'importShipment', //导入发货
			'importOrder', //导出订单
			'importDXM' // 导出店小蜜
		],
		batch: [
			{
				value: 'refund',
				label: '退款',
				permission: 'orderManagement/refund'
			},
			{
				value: 'addGoods',
				label: '追加发货',
				permission: 'orderManagement/addGoodsBtn'
			},
			{
				value: 'shelve',
				label: '移入搁置',
				permission: 'orderManagement/shelve'
			},
			{
				value: 'priorityFlag',
				permission: 'orderManagement/priorityFlag',
				label: '分配库存',
				children: [
					{
						value: 'priorityFlagTrue',
						label: '优先分配库存'
					},
					{
						value: 'priorityFlagFalse',
						label: '正常分配库存'
					}
				]
			},
			{
				value: 'deductFlag',
				permission: 'orderManagement/deductFlag',
				label: '库存状态',
				children: [
					{
						value: 'deductFlagTrue',
						label: '扣库存'
					},
					{
						value: 'deductFlagFalse',
						label: '不扣库存'
					}
				]
			},
			{
				value: 'forbidFlag',
				label: '处理状态',
				permission: 'orderManagement/forbidFlag',
				children: [
					{
						value: 'forbidFlagTrue',
						label: '禁止处理'
					},
					{
						value: 'forbidFlagFalse',
						label: '正常处理'
					}
				]
			},
			{
				value: 'customsInfo',
				permission: 'batchCustomsInfo/index',
				label: '批量修改报关信息'
			},
			{
				value: 'addressee',
				permission: 'batchAddressee/index',
				label: '批量修改收件人信息'
			}
		] //批量操作
	}, // 待处理
	applying: {
		form: [
			'timeFrame', //时间范围
			'country', //国家
			'orderSource', //订单来源
			'department', //归属部门
			'logistics', //物流方式
			'packgeType', //包裹类型
			'payMethond', //支付方式
			'orderType', //订单类型
			// 'orderStatus', //订单状态
			'goodsAttr', //商品属性
			'orderPrice', //订单金额
			'goodsNum', //商品数量
			'priorityFlag', //库存分配
			'deductFlag', //库存状态
			'searchText', //搜索内容
			'remark', //备注
			'refund',//是否退款
			'sort', //排序
			'packgeForm',//包裹形式
		],
		tableTh: [
			{
				title: '商品信息',
				key: 'goodsDetail',
				width: '400px'
			},
			{
				title: '订单号',
				key: 'orderNum',
				width: '200px'
			},
			{
				title: '订单金额',
				key: 'amount',
				width: '186px'
			},

			{
				title: '收件人信息',
				key: 'addressee',
				width: '200px'
			},
			{
				title: '时间',
				key: 'time',
				width: '180px'
			},
			{
				title: '物流信息',
				key: 'logistics',
				width: '150px'
			},
			{
				title: '操作',
				key: 'options',
				width: '100px'
			}
		],
		spanColumns: ['options'],
		isSpanColumns: true,
		options: [
			'refund',// 退款
			'detail' //详情
		],
		switch: [
			'priorityFlag', //优先分配库存
			'deductFlag' //扣库存
		],
		button: [],
		batch: [] // 批量操作
	}, //申请中
	fail: {
		form: [
			'timeFrame', //时间范围
			'country', //国家
			'orderSource', //订单来源
			'department', //归属部门
			'logistics', //物流方式
			'packgeType', //包裹类型
			'payMethond', //支付方式
			'orderType', //订单类型
			// 'orderStatus', //订单状态
			'goodsAttr', //商品属性
			'orderPrice', //订单金额
			'goodsNum', //商品数量
			'priorityFlag', //库存分配
			'deductFlag', //库存状态
			'searchText', //搜索内容
			'remark', //备注
			'refund',//是否退款
			'sort', //排序
			'packgeForm',//包裹形式
		],
		tableTh: [
			{
				title: '商品信息',
				key: 'goodsDetail',
				width: '400px'
			},
			{
				title: '订单号',
				key: 'orderNum',
				width: '200px'
			},
			{
				title: '订单金额',
				key: 'amount',
				width: '186px'
			},

			{
				title: '收件人信息',
				key: 'addressee',
				width: '200px'
			},
			{
				title: '时间',
				key: 'time',
				width: '180px'
			},
			{
				title: '物流信息',
				key: 'logistics',
				width: '150px'
			},
			{
				title: '操作',
				key: 'options',
				width: '100px'
			}
		],
		spanColumns: ['options'],
		isSpanColumns: true,
		options: [
			'refund',// 退款
			'detail', //详情
			'remark',
			'reacquire' //重新获取
		],
		switch: [
			'priorityFlag', //优先分配库存
			'deductFlag' //扣库存
		],
		button: [
			'remark', //备注
			'getAgain', //重新获取
			'all', // 批量操作
			'logistics', //物流方式
			'importShipment', //导入发货
			'importOrder', //导出订单
			'importDXM' // 导出店小蜜
		],
		batch: [
			{
				value: 'refund',
				label: '退款',
				permission: 'orderManagement/refund'
			},
			{
				value: 'addGoods',
				label: '追加发货',
				permission: 'orderManagement/addGoodsBtn'
			},
			{
				value: 'pending',
				permission: 'orderManagement/goPending',
				label: '打回待处理'
			},
			{
				value: 'shelve',
				label: '移入搁置',
				permission: 'orderManagement/shelve'
			},
			{
				value: 'priorityFlag',
				permission: 'orderManagement/priorityFlag',
				label: '分配库存',
				children: [
					{
						value: 'priorityFlagTrue',
						label: '优先分配库存'
					},
					{
						value: 'priorityFlagFalse',
						label: '正常分配库存'
					}
				]
			},
			{
				value: 'deductFlag',
				permission: 'orderManagement/deductFlag',
				label: '库存状态',
				children: [
					{
						value: 'deductFlagTrue',
						label: '扣库存'
					},
					{
						value: 'deductFlagFalse',
						label: '不扣库存'
					}
				]
			},
			{
				value: 'customsInfo',
				permission: 'batchCustomsInfo/index',
				label: '批量修改报关信息'
			},
			{
				value: 'addressee',
				permission: 'batchAddressee/index',
				label: '批量修改收件人信息'
			}
		] //批量操作
	}, // 申请失败
	success: {
		form: [
			'timeFrame', //时间范围
			'country', //国家
			'orderSource', //订单来源
			'department', //归属部门
			'logistics', //物流方式
			'packgeType', //包裹类型
			'payMethond', //支付方式
			'orderType', //订单类型
			// 'orderStatus', //订单状态
			'goodsAttr', //商品属性
			'orderPrice', //订单金额
			'goodsNum', //商品数量
			'priorityFlag', //库存分配
			'deductFlag', //库存状态
			'searchText', //搜索内容
			'remark', //备注
			'refund',//是否退款
			'sort', //排序
			'packgeForm',//包裹形式
		],
		tableTh: [
			{
				title: '商品信息',
				key: 'goodsDetail',
				width: '400px'
			},
			{
				title: '订单号',
				key: 'orderNum',
				width: '200px'
			},
			{
				title: '订单金额',
				key: 'amount',
				width: '186px'
			},

			{
				title: '收件人信息',
				key: 'addressee',
				width: '200px'
			},
			{
				title: '时间',
				key: 'time',
				width: '180px'
			},
			{
				title: '物流信息',
				key: 'logistics',
				width: '150px'
			},
			{
				title: '操作',
				key: 'options',
				width: '100px'
			}
		],
		spanColumns: ['options'],
		isSpanColumns: true,
		options: [
			'detail', //详情
			'remark', //备注
			'refund',// 退款
			'toPrinted' //移入待打单
		],
		switch: [
			'priorityFlag', //优先分配库存
			'deductFlag' //扣库存
		],
		button: [
			'remark', //备注
			'toPlay', //移入待打单
			'all', // 批量操作
			'importOrder', //导出订单
			'importDXM' // 导出店小蜜
		],
		batch: [
			{
				value: 'refund',
				label: '退款',
				permission: 'orderManagement/refund'
			},
			{
				value: 'pending',
				permission: 'orderManagement/goPending',
				label: '打回待处理'
			},
			{
				value: 'shelve',
				label: '移入搁置',
				permission: 'orderManagement/shelve'
			},
			{
				value: 'priorityFlag',
				permission: 'orderManagement/priorityFlag',
				label: '分配库存',
				children: [
					{
						value: 'priorityFlagTrue',
						label: '优先分配库存'
					},
					{
						value: 'priorityFlagFalse',
						label: '正常分配库存'
					}
				]
			},
			{
				value: 'deductFlag',
				permission: 'orderManagement/deductFlag',
				label: '库存状态',
				children: [
					{
						value: 'deductFlagTrue',
						label: '扣库存'
					},
					{
						value: 'deductFlagFalse',
						label: '不扣库存'
					}
				]
			}
		] //批量操作
	}, // 申请成功
	inStock: {
		form: [
			'timeFrame', //时间范围
			'country', //国家
			'orderSource', //订单来源
			'department', //归属部门
			'logistics', //物流方式
			'packgeType', //包裹类型
			'payMethond', //支付方式
			'orderType', //订单类型
			// 'orderStatus', //订单状态
			'goodsAttr', //商品属性
			'orderPrice', //订单金额
			'goodsNum', //商品数量
			'priorityFlag', //库存分配
			'deductFlag', //库存状态
			'searchText', //搜索内容
			'remark', //备注
			'refund',//是否退款
			'sort', //排序
			'packgeForm',//包裹形式
		],
		tableTh: [
			{
				title: '商品信息',
				key: 'goodsDetail',
				width: '400px'
			},
			{
				title: '订单号',
				key: 'orderNum',
				width: '200px'
			},
			{
				title: '订单金额',
				key: 'amount',
				width: '186px'
			},

			{
				title: '收件人信息',
				key: 'addressee',
				width: '200px'
			},
			{
				title: '时间',
				key: 'time',
				width: '180px'
			},
			{
				title: '物流信息',
				key: 'logistics',
				width: '150px'
			},
			{
				title: '操作',
				key: 'options',
				width: '100px'
			}
		],
		spanColumns: ['options'],
		isSpanColumns: true,
		options: [
			'detail', //详情
			'remark', //备注
			'refund',// 退款
			'printed' //打单
		],
		switch: [
			'priorityFlag', //优先分配库存
			'deductFlag' //扣库存
		],
		button: [
			'remark', //备注
			'print', //打面单
			'all', // 批量操作
			'refreshInv', // 刷新库存
			'importOrder', //导出订单
			'importDXM' // 导出店小蜜
		],
		batch: [
			{
				value: 'refund',
				label: '退款',
				permission: 'orderManagement/refund'
			},
			{
				value: 'pending',
				permission: 'orderManagement/goPending',
				label: '打回待处理'
			},
			{
				value: 'shelve',
				label: '移入搁置',
				permission: 'orderManagement/shelve'
			},
			{
				value: 'priorityFlag',
				permission: 'orderManagement/priorityFlag',
				label: '分配库存',
				children: [
					{
						value: 'priorityFlagTrue',
						label: '优先分配库存'
					},
					{
						value: 'priorityFlagFalse',
						label: '正常分配库存'
					}
				]
			},
			{
				value: 'deductFlag',
				permission: 'orderManagement/deductFlag',
				label: '库存状态',
				children: [
					{
						value: 'deductFlagTrue',
						label: '扣库存'
					},
					{
						value: 'deductFlagFalse',
						label: '不扣库存'
					}
				]
			}
		] //批量操作
	}, //有货
	outStock: {
		form: [
			'timeFrame', //时间范围
			'country', //国家
			'orderSource', //订单来源
			'department', //归属部门
			'logistics', //物流方式
			'packgeType', //包裹类型
			'payMethond', //支付方式
			'orderType', //订单类型
			// 'orderStatus', //订单状态
			'goodsAttr', //商品属性
			'orderPrice', //订单金额
			'goodsNum', //商品数量
			'priorityFlag', //库存分配
			'deductFlag', //库存状态
			'searchText', //搜索内容
			'remark', //备注
			'purchaseStatus',// 采购状态
			'refund',//是否退款
			'sort', //排序
			'packgeForm',//包裹形式
		],
		tableTh: [
			{
				title: '商品信息',
				key: 'goodsDetail',
				width: '400px'
			},
			{
				title: '订单号',
				key: 'orderNum',
				width: '200px'
			},
			{
				title: '订单金额',
				key: 'amount',
				width: '186px'
			},

			{
				title: '收件人信息',
				key: 'addressee',
				width: '200px'
			},
			{
				title: '时间',
				key: 'time',
				width: '180px'
			},
			{
				title: '物流信息',
				key: 'logistics',
				width: '150px'
			},
			{
				title: '操作',
				key: 'options',
				width: '100px'
			}
		],
		spanColumns: ['options'],
		isSpanColumns: true,
		options: [
			'detail', //详情
			'remark', //备注
			'refund',// 退款
			'reissueGift' //补发赠品
		],
		switch: [
			'priorityFlag', //优先分配库存
			'deductFlag' //扣库存
		],
		button: [
			'remark', //备注
			'all', // 批量操作
			'refreshInv', // 刷新库存
			'importOrder', //导出订单
			'importDXM' // 导出店小蜜
			// 'reissueGift',//补发包裹
		],
		batch: [
			{
				value: 'refund',
				label: '退款',
				permission: 'orderManagement/refund'
			},
			{
				value: 'pending',
				permission: 'orderManagement/goPending',
				label: '打回待处理'
			},
			{
				value: 'shelve',
				label: '移入搁置',
				permission: 'orderManagement/shelve'
			},
			{
				value: 'priorityFlag',
				permission: 'orderManagement/priorityFlag',
				label: '分配库存',
				children: [
					{
						value: 'priorityFlagTrue',
						label: '优先分配库存'
					},
					{
						value: 'priorityFlagFalse',
						label: '正常分配库存'
					}
				]
			},
			{
				value: 'deductFlag',
				permission: 'orderManagement/deductFlag',
				label: '库存状态',
				children: [
					{
						value: 'deductFlagTrue',
						label: '扣库存'
					},
					{
						value: 'deductFlagFalse',
						label: '不扣库存'
					}
				]
			}
		] //批量操作
	}, //缺货
	toBeDelivered: {
		form: [
			'timeFrame', //时间范围
			'country', //国家
			'orderSource', //订单来源
			'department', //归属部门
			'logistics', //物流方式
			'packgeType', //包裹类型
			'payMethond', //支付方式
			'orderType', //订单类型
			// 'orderStatus', //订单状态
			'goodsAttr', //商品属性
			'orderPrice', //订单金额
			'goodsNum', //商品数量
			'priorityFlag', //库存分配
			'deductFlag', //库存状态
			'searchText', //搜索内容
			'remark', //备注
			'refund',//是否退款
			'sort', //排序
			'packgeForm',//包裹形式
		],
		tableTh: [
			{
				title: '商品信息',
				key: 'goodsDetail',
				width: '400px'
			},
			{
				title: '订单号',
				key: 'orderNum',
				width: '200px'
			},
			{
				title: '订单金额',
				key: 'amount',
				width: '186px'
			},

			{
				title: '收件人信息',
				key: 'addressee',
				width: '200px'
			},
			{
				title: '时间',
				key: 'time',
				width: '180px'
			},
			{
				title: '物流信息',
				key: 'logistics',
				width: '150px'
			},
			{
				title: '操作',
				key: 'options',
				width: '100px'
			}
		],
		spanColumns: ['options'],
		isSpanColumns: true,
		options: [
			'detail', //详情
			'remark', //备注
			'refund',// 退款
			'reissuePrinted' //补打单
		],
		switch: [
			'priorityFlag', //优先分配库存
			'deductFlag' //扣库存
		],
		button: [
			'remark', //备注
			'all', // 批量操作
			'reissuePrinted', // 补打单
			'importOrder', //导出订单
			'importDXM' // 导出店小蜜
		],
		batch: [
			{
				value: 'refund',
				label: '退款',
				permission: 'orderManagement/refund'
			},
			{
				value: 'waitPrint',
				label: '打回待打单',
				permission: 'orderManagement/goPending'
			},
			{
				value: 'shelve',
				label: '移入搁置',
				permission: 'orderManagement/shelve'
			}
		] //批量操作
	}, //待发货
	byTransportation: {
		form: [
			'timeFrame', //时间范围
			'country', //国家
			'orderSource', //订单来源
			'department', //归属部门
			'logistics', //物流方式
			'packgeType', //包裹类型
			'payMethond', //支付方式
			'orderType', //订单类型
			// 'orderStatus', //订单状态
			'goodsAttr', //商品属性
			'orderPrice', //订单金额
			'goodsNum', //商品数量
			'priorityFlag', //库存分配
			'deductFlag', //库存状态
			'searchText', //搜索内容
			'remark', //备注
			'refund',//是否退款
			'sort', //排序
			'packgeForm',//包裹形式
			'goodAttribute',//商品类型
		],
		tableTh: [
			{
				title: '商品信息',
				key: 'goodsDetail',
				width: '400px'
			},
			{
				title: '订单号',
				key: 'orderNum',
				width: '200px'
			},
			{
				title: '订单金额',
				key: 'amount',
				width: '186px'
			},

			{
				title: '收件人信息',
				key: 'addressee',
				width: '200px'
			},
			{
				title: '时间',
				key: 'time',
				width: '180px'
			},
			{
				title: '物流信息',
				key: 'logistics',
				width: '150px'
			},
			{
				title: '操作',
				key: 'options',
				width: '100px'
			}
		],
		spanColumns: ['logistics', 'options'],
		isSpanColumns: true,
		options: [
			'detail', //详情
			'remark', //备注
			'refund',// 退款
			'reissuePackage' //补发包裹
		],
		switch: [
			'priorityFlag', //优先分配库存
			'deductFlag' //扣库存
		],
		button: [
			'remark', //备注
			'all', // 批量操作
			'logistics', // 更换物流
			'logisticsMan', // 更换物流管理
			'importLogistics', // 导入更换物流
			'importOrder', //导出订单
			'importDXM' // 导出店小蜜
		],
		batch: [
			{
				value: 'refund',
				label: '退款',
				permission: 'orderManagement/refund'
			},
			{
				value: 'customsInfo',
				permission: 'batchCustomsInfo/index',
				label: '批量修改报关信息'
			},
			{
				value: 'addressee',
				permission: 'batchAddressee/index',
				label: '批量修改收件人信息'
			}
		] //批量操作
	}, //已发货
	toBePaid: {
		form: [
			'timeFrame', //时间范围
			'country', //国家
			'orderSource', //订单来源
			'department', //归属部门
			// 'logistics', //物流方式
			'packgeType', //包裹类型
			'payMethond', //支付方式
			// 'orderType', //订单类型
			'paymentStatus', //订单支付状态
			// 'orderStatus', //订单状态
			'goodsAttr', //商品属性
			'orderPrice', //订单金额
			'goodsNum', //商品数量
			'searchText', //搜索内容
			'remark', //备注
			// 'refund',//是否退款
			'sort' ,//排序
		],
		tableTh: [
			{
				title: '商品信息',
				key: 'toBePaidGoodsDetail',
				width: '400px'
			},
			{
				title: '订单号',
				key: 'orderNum',
				width: '200px'
			},
			{
				title: '订单金额',
				key: 'amount',
				width: '186px'
			},

			{
				title: '收件人信息',
				key: 'addressee',
				width: '200px'
			},
			{
				title: '时间',
				key: 'time',
				width: '180px'
			},
			{
				title: '操作',
				key: 'options',
				width: '100px'
			}
		],
		spanColumns: ['options'],
		isSpanColumns: true,
		options: [
			'detail', //详情
			'changePayType', //变更支付状态
		],
		switch: [],
		button: [
			'changePayType', // 变更支付状态
			'importOrder', //导出订单
			'importDXM' // 导出店小蜜
		],
		batch: []
	}, //未付款
	refunded:{
		form: [
			'timeFrame', //时间范围
			'country', //国家
			'orderSource', //订单来源
			'department', //归属部门
			'logistics', //物流方式
			'packgeType', //包裹类型
			'payMethond', //支付方式
			'orderType', //订单类型
			// 'paymentStatus', //订单支付状态
			// 'orderStatus', //订单状态
			'goodsAttr', //商品属性
			'orderPrice', //订单金额
			'goodsNum', //商品数量
			'searchText', //搜索内容
			'remark', //备注
			// 'refund',//是否退款
			'sort' ,//排序
			'packgeForm',//包裹形式
		],
		tableTh: [
			{
				title: '商品信息',
				key: 'toBePaidGoodsDetail',
				width: '400px'
			},
			{
				title: '订单号',
				key: 'orderNum',
				width: '200px'
			},
			{
				title: '订单金额',
				key: 'amount',
				width: '200px'
			},

			{
				title: '收件人信息',
				key: 'addressee',
				width: '200px'
			},
			{
				title: '时间',
				key: 'time',
				width: '180px'
			},
			{
				title: '物流信息',
				key: 'logistics',
				width: '150px'
			},
			{
				title: '退款金额',
				key: 'refundedMoney',
				width: '150px'
			},
			{
				title: '操作',
				key: 'options',
				width: '100px'
			}
		],
		spanColumns: ['options'],
		isSpanColumns: true,
		options: [
			'detail', //详情
			'refund',// 退款
			'remark', //备注
		],
		switch: [],
		button: [
			'importOrder', //导出订单
			'refund',// 退款
			'remark', //备注
		],
		batch: []
	},// 已退款
	shelve: {
		form: [
			'timeFrame', //时间范围
			'country', //国家
			'orderSource', //订单来源
			'department', //归属部门
			'logistics', //物流方式
			'packgeType', //包裹类型
			'payMethond', //支付方式
			'orderType', //订单类型
			'orderStatus', //订单状态
			'goodsAttr', //商品属性
			'orderPrice', //订单金额
			'goodsNum', //商品数量
			'priorityFlag', //库存分配
			'deductFlag', //库存状态
			'searchText', //搜索内容
			'remark', //备注
			'refund',//是否退款
			'sort', //排序
			'packgeForm',//包裹形式
		],
		tableTh: [
			{
				title: '商品信息',
				key: 'allGoodsDetail',
				width: '400px'
			},
			{
				title: '订单号',
				key: 'orderNum',
				width: '200px'
			},
			{
				title: '订单金额',
				key: 'amount',
				width: '186px'
			},

			{
				title: '收件人信息',
				key: 'addressee',
				width: '200px'
			},
			{
				title: '时间',
				key: 'time',
				width: '180px'
			},
			{
				title: '物流信息',
				key: 'logistics',
				width: '150px'
			},
			{
				title: '操作',
				key: 'options',
				width: '100px'
			}
		],
		spanColumns: ['options'],
		isSpanColumns: true,
		options: [
			'detail', //详情
			'remark', //备注
			'reduction', //还原
			'refund',//退款
		],
		switch: [
			'priorityFlag', //优先分配库存
			'deductFlag' //扣库存
		],
		button: [
			'remark', //备注
			'reduction', //还原
			'importOrder', //导出订单
			'refund',// 退款
			'importDXM' // 导出店小蜜
		],
		batch: []
	} // 已搁置
}

export default orderOptions
