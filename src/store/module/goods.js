import { storage } from '@/utils/storage.js'
const goodsInfo = {
  namespaced: true,
  state: {
    addGoodsInfo: storage.get('addGoodsInfo') || [],
    copyGoodsInfo: storage.get('copyGoodsInfo') || {},
  },
  mutations: {
    setAddGoodsInfo(state, data) {
      state.addGoodsInfo = data
    },
    setCopyGoodsInfo(state, data) {
      state.copyGoodsInfo = data
    }
  },
  actions:{
    setAddGoodsInfoActions({ commit }, data) {
      commit('setAddGoodsInfo', data)
      storage.set('addGoodsInfo', data)
    },
    setCopyGoodsInfoActions({ commit }, data) {
      commit('setCopyGoodsInfo', data)
      storage.set('copyGoodsInfo', data)
    },
  }
}
export default goodsInfo
