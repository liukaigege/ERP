import { sourceData, tortReason } from '@/assets/js/staticData'


const paginationData = {
    paginationArr: [10, 20, 30, 40, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
    style: 'text-align: right;margin:0;'
}
// 审核结果 1待审核2未侵权 3侵权不可用 4侵权可用
const tortResult = [{ label: '全部', value: '' }, { label: '未侵权', value: 2 }, { label: '侵权不可用', value: 3 }, { label: '侵权可用', value: 4 }]
const searchData = {
    searchType: 1, //搜索内容选择
    searchText: null, //搜索内容文字
    categoryId: null, //商品品类
    source: null, //商品来源(二级)
    mode: null,//商品来源(一级)
    sourceChecked: [],
    sourceData, //商品来源数据
    tortReason, //侵权原因
    reason: null, //侵权原因选择
    tortResult, //侵权审核结果
    status: null, //侵权审核结果选择
    timeType: null,//1 申请时间 2 审核时间
    applyBy: null,
    examineBy: null,//审核人
    searchTime: null,
    skuType: 0,
}



export {
    paginationData,
    searchData
}
