/*
 * @Descripttion: Vango ERP
 * @version: 1.0
 * @Author: 朱涛（梅溪）
 * @Date: 2021-07-06 12:01:33
 * @LastEditors: 韦剑
 * @LastEditTime: 2021-07-27 20:28:11
 */
import { createStore } from 'vuex'
import getters from './getter.js'
import user from './module/user.js'
import menu from './module/menu'
import com from '@/store/module/com'
import store from '@/store/module/store'
import orderManage from './module/order/orderManagement.js'
import goodsInfo from './module/goods'
import purchaseSearch from './module/purchase'

export default createStore({
  state: {},
  getters,
  modules: {
    user,
    com,
    menu,
    orderManage,
		store,
    purchaseSearch,
		goodsInfo
  }
})
