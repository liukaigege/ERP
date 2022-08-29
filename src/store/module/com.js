/*
 * @Descripttion: Vango ERP
 * @version: 1.0
 * @Author: 朱涛（梅溪）
 * @Date: 2021-07-06 12:01:33
 * @LastEditors: 韦剑
 * @LastEditTime: 2021-08-06 12:00:32
 */
// 共用vuex
import { storage } from '@/utils/storage.js'
const com = {
  namespaced: true, // 使用时必须加上模块名
  state: {
    router: [],
    routerHistory: [],
    cachedViews: [],
    themeColor: '#545c64', // 主题色
    refresh: true,
    pageScrollTopConfig: {},
    uploadBarket: import.meta.env.VITE_PROJECT_ENV === 'production' ? 'https://vango-erp-prod.oss-cn-beijing.aliyuncs.com/' : 'https://vango-erp-test.oss-cn-hangzhou.aliyuncs.com/',
    datasign: {
      region: import.meta.env.VITE_PROJECT_ENV === 'production' ? 'oss-cn-beijing' : 'oss-cn-hangzhou',
      accessKeyId: 'Jy6PO9aZI82pJzYh',
      accessKeySecret: 'pqhJx2AJineLcJpguU1SPImdB7ZLuv',
      bucket: import.meta.env.VITE_PROJECT_ENV === 'production' ? 'vango-erp-prod' : 'vango-erp-test'
    },
    selectRowKeys: [] // tbale表格勾选的项
  },
  mutations: {
    SET_THEMECOLOR_MUTATIONS(state, themeColor) {
      state.themeColor = themeColor
    },
    SET_ROUTERHISTORY_MUTATIONS(state, routerHistory) {
      state.routerHistory = routerHistory
      state.cachedViews = []
    },
    SET_REFRESH_MUTATIONS(state, refresh) {
      state.refresh = refresh
    },
    setSelectRowKeysMutations(state, data) {
      state.selectRowKeys = data
      // storage.set('ERP_selectRowKeys', data)
    },
    removeSelectRowKeysMutations(state) {
      state.selectRowKeys = []
      // storage.remove('ERP_selectRowKeys')
    },
    delRouterHistory(state, route) {
      let cachedViews = [...state.cachedViews]
      cachedViews = state.cachedViews.filter(item => item != route.name)
      let children = route.children
      children.forEach(child => {
        cachedViews = state.cachedViews.filter(item => item != child.name)
      })
      state.cachedViews = cachedViews

      let index = state.routerHistory.findIndex(item => item.name == route.name)
      state.routerHistory.splice(index, 1)

    },
    // 除去页面缓存
    delHistory(state,name) {
      state.cachedViews = state.cachedViews.filter(item => item != name)
    },
    // 添加缓存
    addCache(state,name) {
      if(!state.cachedViews.includes(name)) state.cachedViews.push(name)
    },
    addRouterHistory(state, route) {
      state.cachedViews.push(route.name)
      state.routerHistory.push(route)
    },
    addHistoryChild(state, { to, allRouter }) {
      let item = state.routerHistory.find(item => item.meta.subRoutes.includes(to.path))
      // children 是用来面包屑点击跳转的
      if (item) item.children = [{ ...to }]  // 已经存在父页面tab
      else { // 不存在父页面tab
        let parentRouter = allRouter.find(item => item.meta.subNameRoutes?.includes(to.name))
        if (parentRouter) {
          parentRouter.children = [{ ...to }]
          state.routerHistory.push(parentRouter)
          state.cachedViews.push(parentRouter.name);
        }
      }
      state.cachedViews.push(to.name);
    },
    changeRouteIndex(state, index) {
      state.routerHistory.push(state.routerHistory[index])
      state.routerHistory.splice(index, 1)
    },
    changeHistoryChild(state, { from, to }) {
      let fromItem = state.routerHistory.find(item => item.meta?.subRoutes?.includes(from.path))
      let toItem = state.routerHistory.find(item => item.meta?.subRoutes?.includes(to.path))
      // 子页面来自同一个主菜单
      if (fromItem?.name === toItem?.name) {
        // 返回
        if (state.cachedViews.includes(to.name)) {
          state.cachedViews = state.cachedViews.filter(item => item != from.name)
          fromItem.children = fromItem.children.filter(item => item.name != from.name)
        } else { // 递增
          state.cachedViews.push(to.name);
          fromItem.children.push({ ...to })
        }
      }
    },
    delHistoryChild(state, route) {
      // 清除route子页面所有缓存
      state.cachedViews = state.cachedViews.filter(item => !route.meta.subNameRoutes.includes(item))
      let item = state.routerHistory.find(item => item.name == route.name)
      if (item) item.children = []
    },
    deleteCachedView(state, { index }) {
      state.cachedViews.splice(index, 1)
    },
    addCachedView(state, { index, name }) {
      state.cachedViews.splice(index, 0, name)
    },
    setScrollTop(state, { scrollTop, from, to }) {
      if (state.cachedViews.includes(from.name)) state.pageScrollTopConfig[from.name] = scrollTop // 更新
      else delete state.pageScrollTopConfig[from.name]  // 删除
      setTimeout(() => {
        if (state.cachedViews.includes(to.name)) {
          document.documentElement.scrollTop = state.pageScrollTopConfig[to.name]
        }
      },400)
    }
  },
  actions: {
    SET_THEMECOLOR_ACTIONS({ commit }, themeColor) {
      commit('SET_THEMECOLOR_MUTATIONS', themeColor)
    },
    setRouterHistory({ commit }, routerHistory) {
      commit('SET_ROUTERHISTORY_MUTATIONS', routerHistory)
    },
    setRefreshByActions({ commit }, refresh) {
      commit('SET_REFRESH_MUTATIONS', refresh)
    },
    setSelectRowKeysActions({ commit }, data) {
      commit('setSelectRowKeysMutations', data)
    },
    removeSelectRowKeysActions({ commit }) {
      commit('removeSelectRowKeysMutations')
    }

  }
}

export default com
