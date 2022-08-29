/*
 * @Descripttion:
 * @version:
 * @Author: 朱涛
 * @Date: 2021-08-02 10:33:23
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-02 10:52:17
 */


const logisticOptions = {

    pending: {

        button: [
            'remark', //备注
            'getAgain', //重新获取
            'logistics', //物流方式
            'all', // 批量操作
            'importOrder', //导出订单
            'importDXM', // 导出店小蜜
        ],
        switch: [
            'print'
        ],
        batch: [{
                value: 'moveToPrinted',
                label: '移入待打单',
            },
            {
                value: 'printType',
                label: '打单状态',
                children: [{
                        value: 'needPrint',
                        label: '要打单',
                    },
                    {
                        value: 'noPrint',
                        label: '不要打单',
                    }
                ]
            },
            {
                value: 'customsInfo',
                label: '批量修改报关信息',
            },
            {
                value: 'addressee',
                label: '批量修改收件人信息',
            },
            {
                value: 'cancelLogistics',
                label: '取消更换物流',
            },
        ],
        options: [
            'detail', //详情
            'remark', //备注
            'reacquire', //重新获取
            'applyWayNum', // 申请运单号
            'toPrinted', //移入待打单
            'cancelLog',//取消变更
        ],
    },

    waitPrint: {

        button: [
            'remark', //备注
            'print', //打印面单
            'pending', //打回待处理
			'deliverdAll',//批量发货
            'importOrder', //导出订单
            'importDXM', // 导出店小蜜
            'cancelLogistics',//取消更换物流
        ],
        switch: [
            'print'
        ],
        batch: [],
        options: [
            'detail', //详情
            'remark', //备注
            'printed', //打单
        ],
    },

    toBeDelivered: {
        button: [
            'remark', //备注
            'reissuePrinted', //补打单
            'waitPrint', //打回待打单
            'importOrder', //导出订单
            'importDXM', // 导出店小蜜
            'cancelLogistics',//取消更换物流
        ],
        switch: [
            'print'
        ],
        batch: [],
        options: [
            'detail', //详情
            'remark', //备注
            'reissuePrinted', //补打单
        ],
    },
    orderSuccess: {

        button: [
            'remark', //备注
        ],
        switch: [
            'print'
        ],
        batch: [],
        options: [
            'detail', //详情
            'remark', //备注
        ],
    }


}

export default logisticOptions
