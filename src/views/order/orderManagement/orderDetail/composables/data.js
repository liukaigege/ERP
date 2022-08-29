// 包裹状态： 0待审核、1待处理、2申请中、3申请失败、 4申请成功、5待打单有货、6带打单缺货、7待发货、8已发货、9未付款、-1更换物流待处理、-2更换待打单、-3更换待发货、-4更换交运成功
// 订单状态
const statusList = [{
    value: 0,
    label: '待审核'
}, {
    value: 1,
    label: '待处理'
}, {
    value: 2,
    label: '申请中'
}, {
    value: 3,
    label: '申请失败'
}, {
    value: 4,
    label: '申请成功'
}, {
    value: 5,
    label: '待打单有货'
}, {
    value: 6,
    label: '带打单缺货'
}, {
    value: 7,
    label: '待发货'
}, {
    value: 8,
    label: '已发货'
}, {
    value: 9,
    label: '未付款'
}, {
    value: -1,
    label: '更换物流待处理'
}, {
    value: -2,
    label: '更换待打单'
}, {
    value: -3,
    label: '更换待发货'
}, {
    value: -4,
    label: '更换交运成功'
}]

//修改支付方式，支付方式选择中级联选择器配置
const payProps = {
    expandTrigger: 'hover',
    value: 'paymentType',
    label: 'paymentType',
    children: 'paymentMethods'
}

// 客户信息校验配置
const customerRules = {
    firstName: [
        { required: true, message: '请输入客户姓', trigger: 'blur' }
    ],
    lastName: [
        { required: true, message: '请输入客户名', trigger: 'blur' }
    ],
    countryEn: [{ required: true, message: '请选择国家', trigger: 'blur' }],
    phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
    postcode: [{ required: true, message: '请输入邮编', trigger: 'blur' }],
    street1: [{ required: true, message: '请输入地址', trigger: 'blur' }]
}

export {
    statusList,
    payProps,
    customerRules
}