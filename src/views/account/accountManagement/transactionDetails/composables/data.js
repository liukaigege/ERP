const form = {
    searchType: 1, //搜索类型
    searchContent: '', //搜索内容
    start_end: [], //交易开始日期
    eventType: '' //事件类型
}
const page = {
    pageNo: 1,
    pageSize: 100
}

const eventTypeList = [{
    value: 'T0006',
    label: '快速结账付款'
}, {
    value: 'T0114',
    label: '争议费'
}, {
    value: 'T1106',
    label: '付款撤销'
}, {
    value: 'T1107',
    label: '付款退款'
}, {
    value: 'T1110',
    label: '冻结余额以调查争议'
}, {
    value: 'T1111',
    label: '取消冻结以解决争议'
}, {
    value: 'T1201',
    label: '退单'
}, {
    value: 'T1202',
    label: '退单撤销'
}, {
    value: 'T2102',
    label: '普通冻结放款'
}, {
    value: 'T2103',
    label: '留存准备金'
}, {
    value: 'T2104',
    label: '准备金放款 '
}, {
    value: 'T0400',
    label: '普通提现'
}, {
    value: 'T0113',
    label: '合作伙伴费用'
}, {
    value: 'T1108',
    label: '费用撤销'
}, {
    value: 'T2101',
    label: '普通冻结'
}, {
    value: 'T0000',
    label: '普通付款'
}, {
    value: 'T1116',
    label: '即时付款审查（IPR）撤销'
}, {
    value: 'T2107',
    label: '付款冻结'
}, {
    value: 'T2108',
    label: '放款'
}, {
    value: 'T0011',
    label: '移动支付'
}, {
    value: 'T2105',
    label: '付款审查冻结'
}, {
    value: 'T2106',
    label: '付款审查放款'
}]
export { form, page, eventTypeList }