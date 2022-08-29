import { storage } from '@/utils/storage.js'
const purchaseSearch = {
  namespaced: true,
  state: {
    normalForm: storage.get('normalForm') || null,
    normalShelveForm: storage.get('normalShelveForm') || null,
		customForm: storage.get('customForm') || null,
    customShelveForm: storage.get('customShelveForm') || null,
		customRemarkForm: storage.get('customRemarkForm') || null,
		pageStatus:storage.get('pageStatus') || '0',
		tabStatus:storage.get('tabStatus') || 1
  },
  mutations: {
    setNormalForm(state, data) {
      state.normalForm = data
    },
    setNormalShelveForm(state, data) {
      state.normalShelveForm = data
    },
		setCustomForm(state, data) {
      state.customForm = data
    },
    setCustomShelveForm(state, data) {
      state.customShelveForm = data
    },
		setCustomRemarkForm(state, data) {
      state.customRemarkForm = data
    },
		setPageStatus(state, data) {
      state.pageStatus = data
    },
		setTabStatus(state, data) {
      state.tabStatus = data
    }
  },
  actions:{
    setNormalFormActions({ commit }, data) {
      commit('setNormalForm', data)
      storage.set('normalForm', data)
    },
    setNormalShelveFormActions({ commit }, data) {
      commit('setNormalShelveForm', data)
      storage.set('normalShelveForm', data)
    },
		setCustomFormActions({ commit }, data) {
      commit('setCustomForm', data)
      storage.set('customForm', data)
    },
    setCustomShelveFormActions({ commit }, data) {
      commit('setCustomShelveForm', data)
      storage.set('customShelveForm', data)
    },
		setCustomRemarkFormActions({ commit }, data) {
      commit('setCustomRemarkForm', data)
      storage.set('customRemarkForm', data)
    },
		setPageStatusActions({ commit }, data) {
      commit('setPageStatus', data)
      storage.set('pageStatus', data)
    },
		setTabStatusActions({ commit }, data) {
      commit('setTabStatus', data)
      storage.set('tabStatus', data)
    },
  }
}
export default purchaseSearch
