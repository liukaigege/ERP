const searchData = {
	timeType: 1,//时间类型1 付款时间 2退款时间
	queryTimeStart: '',//查询时间开始
	queryTimeEnd: '',//查询时间结束
	queryTimeStart_queryTimeEnd: '',//
	reasonId: '',//退款原因
	refundDuty: '',//责任方
	serachType: 1,//搜索类型 1操作人· 2平台sku 3订单号 4交易号 5退款账号
	serachValue: '',//搜索值
	refundState:'',//状态 0成功 1失败
	page: {
		pageNo: 1,
		pageSize: 100
	}
}
const defaultData = {
	timeTypeList: [{
		label: '付款时间',
		id: 1
	}, {
		label: '退款时间',
		id: 2
	}],
	serachTypeList: [{
		label: '操作人',
		id: 1
	}, {
		label: '平台sku',
		id: 2
	}, {
		label: '订单号',
		id: 3
	}, {
		label: '交易号',
		id: 4
	}, {
		label: '退款账号',
		id: 5
	}],
	statusData:[{
		label: '成功',
		id: 0
	}, {
		label: '失败',
		id: 1
	}]
}

export { searchData, defaultData }
