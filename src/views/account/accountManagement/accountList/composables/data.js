// 查询列表数据
const queryData = {
    page: {
        pageNo: 1,
        pageSize: 10
    },
    name: '',//搜索内容
    status: null,//statusaccountStatus(0 未status 1已status)
    accountStatus: null,//账号accountStatus (0正常 -1永久封禁 1限制收款)
}
//
const operationDataDefault = {
    id: null,
    name: '',
    // account: '',
    fee: '',
    platform: 1,
		accountList:[
			{
					"value": "",
					"isAdd": true,
					"tempId": Math.random()
			}
	]
}

const exportTypeList = [{
    id: '全部',
    name: '全部'
}, {
    id: '未解决',
    name: '未解决'
}, {
    id: 'OPEN',
    name: '争议是公开的'
}, {
    id: 'WAITING_FOR_BUYER_RESPONSE',
    name: '正在等待买家的回复'
}, {
    id: 'WAITING_FOR_SELLER_RESPONSE',
    name: '正在等待卖家的回复'
}, {
    id: 'UNDER_REVIEW',
    name: 'PayPal正在审查'
}, {
    id: 'RESOLVED',
    name: '事件已结束'
}, {
    id: 'OTHER',
    name: '其他'
}]

export {
    queryData, operationDataDefault, exportTypeList
}
