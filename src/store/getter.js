/*
 * @Descripttion: Vango ERP
 * @version: 1.0
 * @Author: 朱涛（梅溪）
 * @Date: 2021-07-06 12:01:33
 * @LastEditors: 韦剑
 * @LastEditTime: 2021-08-05 15:13:57
 */
//getters
const getters = {
    themeColor: state => state.com.themeColor, // 主题色
    sideBarWidth: state => state.menu.sideBarWidth, // margin-left
    routerHistory: state => state.com.routerHistory, // 路由的历史记录
    cachedViews: state => state.com.cachedViews, // 需要缓存的组件
    token: state => state.user.token, // 用户token
    orderTabType: state => state.orderManage.tabType, // 标准订单切换tab
    datasign: state => state.com.datasign, //oss信息
    uploadBarket: state => state.com.uploadBarket, // 阿里云
    userInfo: state => state.user.userInfo,
    routerList: state => state.user.routerList,
    initTimeStemab: state => state.orderManage.initTime,
    initPageClear: state => state.orderManage.initPageClear,
    orderType: state => state.orderManage.orderStatus, // 订单状态
    purchaseInfo: state => state.store.purchaseInfo, // 入库信息
    stage: state => state.store.stage, // 批次号入库的阶段
    changeLogisticType: state => state.orderManage.changeLogistic, //更换物流状态
    merageStatus: state => state.orderManage.merageStatus, // 合并订单状态
    isChangeLogist: state => state.orderManage.isChangeLogist, // 是否打开物流管理
    selectRowKeys: state => state.com.selectRowKeys, // tbale表格勾选的项
    showDetail: state => state.orderManage.showDetail, // 是否显示详情页
    detailQuery: state => state.orderManage.detailQuery, //详情页传参
    authPath: state => state.user.authPath,
    addGoodsInfo: state => state.goodsInfo.addGoodsInfo, // 新增组合商品
    copyGoodsInfo: state => state.goodsInfo.copyGoodsInfo, // 新增组合商品复制
		normalForm: state => state.purchaseSearch.normalForm,
		normalShelveForm: state => state.purchaseSearch.normalShelveForm,
		customForm: state => state.purchaseSearch.customForm,
		customShelveForm: state => state.purchaseSearch.customShelveForm,
		customRemarkForm: state => state.purchaseSearch.customRemarkForm,
		pageStatus: state => state.purchaseSearch.pageStatus,
		tabStatus: state => state.purchaseSearch.tabStatus,
}

export default getters
