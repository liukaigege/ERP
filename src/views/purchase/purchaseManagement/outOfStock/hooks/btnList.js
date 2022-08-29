const options = {
	// outStockShelve:btn:match
	outStockBtnOne: {
    remark: [
      {
        label: 'SKU备注',
        value: 'skuRemark',
        permission:'outStock:btn:remark'
      },
      {
        label: 'SPU备注',
        value: 'spuRemark',
        permission:'outStock:btn:remark'
      },
    ],
		button: {
			left: [
				// {
				// 	label: '备注',
				// 	fun: 'remark', //备注
				// 	permission:'outStock:btn:remark'
				// },
				{
					label: '生成采购单',
					fun: 'createPurOrder', //生成采购单
					permission:'outStock:btn:createPurOrder'
				},
				{
						label: '设置供应商',
						fun: 'supplier' ,//设置供应商
					permission:'outStock:btn:supplier'
				}
			],
			right: [
				{
					label: '手动刷新',
					fun: 'refresh' ,//手动刷新
					permission:'outStock:btn:refresh'
				},
				{
					label: '导出定制信息',
					fun: 'exportCustom', //导出定制信息
					permission:'outStock:btn:exportCustom'
				},
				{
					label: '导出建议',
					fun: 'exportPro', //导出建议
					permission:'outStock:btn:exportPro'
				}
			]
		},
		batch: [
			{
				value: 'addPurchasePlan',
				label: '加入采购计划',
				confirmTitle:'是否将勾选的商品加入采购计划?',
				permission:'outStock:btn:batch:addPurchasePlan'
			},
			{
				value: 'shelve',
				label: '移入搁置',
				permission:'outStock:btn:batch:shelve'
			}
		] //批量操作
	}, //缺货正常采购列表
	outStockBtnTwo: {
    remark: [
      {
        label: 'SKU备注',
        value: 'skuRemark',
        permission:'outStock:btn:remark'
      },
      {
        label: 'SPU备注',
        value: 'spuRemark',
        permission:'outStock:btn:remark'
      },
    ],
		button: {
			left: [
				// {
				// 	label: '备注',
				// 	fun: 'remark',//备注,
				// 	permission:'outStockShelve:btn:remark'
				// },
				{
					label: '批量还原',
					fun: 'reductionAll', //批量还原
					permission:'outStockShelve:btn:reductionAll'
				}
			],
			right: [

				{
					label: '导出建议',
					// label: '导出订单',
					fun: 'ExportOrder', //导出订单
					permission:'outStock:btn:exportPro'
				}
			]

		}
	}, // 缺货搁置列表
	stockPurchase: {
		button: {
			left: [
				{
					label: '删除',
					fun: 'deletes', //删除
					confirmTitle:'是否删除已勾选的商品?',
					permission:'stockPurchase:btn:deletes'
				},
				{
					label: '设置供应商',
					fun: 'supplier', //设置供应商
					permission:'stockPurchase:btn:supplier'
				},
				{
					label: '生成采购单',
					fun: 'createPurOrder',//生成采购
					permission:'stockPurchase:btn:createPurOrder'
				}
			],
			right: [
				{
					label: '添加商品',
					fun: 'addGoods', //添加商品
					permission:'stockPurchase:btn:addGoods'
				}
			]
		}
	} // 备货列表
}

export default options
