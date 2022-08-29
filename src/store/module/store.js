/*
 * @Descripttion:
 * @version:
 * @Author: 韦剑
 * @Date: 2021-07-27 20:19:56
 * @LastEditors: 韦剑
 * @LastEditTime: 2021-07-30 19:08:17
 */
import { storage } from '@/utils/storage.js'
let store = {
  namespaced: true,
  state: {
    purchaseInfo:  storage.get('ERP_purchaseInfo') || '',
    stage: storage.get('ERP_stage') || '',
  },
  mutations: {
    setPurchaseInfo(state, data) {
      state.purchaseInfo = data
      storage.set('ERP_purchaseInfo', data)
    },
    removePurchaseInfo(state) {
      state.purchaseInfo = ''
      storage.remove('ERP_purchaseInfo')
    },
    setStage(state, data) {
      state.stage = data
      storage.set('ERP_stage', data)
    },
    removeStage(state) {
      state.stage = ''
      storage.remove('ERP_stage')
    }
  },
  actions: {
    setPurchaseInfoActions({ commit }, data) {
      commit('setPurchaseInfo', data)
    },
    removePurchaseInfoActions({ commit }) {
      commit('removePurchaseInfo')
    },
    setStageActions({ commit }, data) {
      commit('setStage', data)
    },
    removeStageActions({ commit }) {
      commit('removeStage')
    }
  }
}
export default store
