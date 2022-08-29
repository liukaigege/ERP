/*
 * @Descripttion:
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-14 17:06:41
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-22 19:53:36
 */
const orderManage = {
    namespaced: true, // 使用时必须加上模块名
    state: {
        tabType: 'pending',
        initTime: '', //加载的时间
        initPageClear: '', // 订单列表分页重置后刷新请求
        orderStatus: '1', // 订单类型
        changeLogistic: 'pending', //更换物流类型
        merageStatus: '0', //合并状态
        isChangeLogist: false, // 是否开启更换物流管理
        showDetail: false, // 打开详情
        detailQuery: null, // 详情页传参
    },
    mutations: {
        setTabTypeByMutations(state, tabType) {
            state.tabType = tabType
        },
        setOrderInitTimeByMutations(state) {
            state.initTime = new Date().getTime()
        },
        setOrderStatusByMutations(state, type) {
            state.orderStatus = type
        },
        setOrderinitPageClearByMutations(state, type) {
            state.initPageClear = new Date().getTime()
        },
        setChangeLogisticByMutations(state, type) {
            state.changeLogistic = type
        },
        setMerageStatuByMutations(state, type) {
            state.merageStatus = type
        },
        setIsChangeLogistByMutations(state, status) {
            state.isChangeLogist = status
        },
        setShowDetailByMutations(state, status) {
            state.showDetail = status
        },
        setDetailQueryByMutations(state, query) {
            state.detailQuery = query
        },
        clearStateByMutaions(state) {
					Object.assign(state,{
						tabType: 'pending',
						initTime: '', //加载的时间
						initPageClear: '', // 订单列表分页重置后刷新请求
						orderStatus: '1', // 订单类型
						changeLogistic: 'pending', //更换物流类型
						merageStatus: '0', //合并状态
						isChangeLogist: false, // 是否开启更换物流管理
						showDetail: false, // 打开详情
						detailQuery: null, // 详情页传参
					})
            // console.log(state,'state')
        }
    },
    actions: {
        setTabTypeByActions({ commit }, tabType) {
            commit('setTabTypeByMutations', tabType)
        },
        setOrderInitTimeByActions({ commit }) {
            commit('setOrderInitTimeByMutations')
        }, // 通过时间戳的监听从而刷新table
        setOrderinitPageClearByActions({ commit }) {
            commit('setOrderinitPageClearByMutations')
        }, // 通过时间戳的监听从而刷新table
        setOrderStatusByActions({ commit }, type) {
            commit('setOrderStatusByMutations', type)
        },
        setChangeLogisticByActions({ commit }, type) {
            commit('setChangeLogisticByMutations', type)
        },
        setMerageStatusByActions({ commit }, type) {
            commit('setMerageStatuByMutations', type)
        },
        setIsChangeLogistByActions({ commit }, status) {
            commit('setIsChangeLogistByMutations', status)
        },
        setShowDetailByActions({ commit }, status) {
            commit('setShowDetailByMutations', status)
        },
        setDetailQueryByActions({ commit }, query) {
            commit('setDetailQueryByMutations', query)
        },
        clearStateByActions({ commit }) {
            commit('clearStateByMutaions')
        }
    }
}

export default orderManage
