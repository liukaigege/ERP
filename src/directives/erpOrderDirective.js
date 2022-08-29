/*
 * @Descripttion: 
 * @version: 
 * @Author: 朱涛
 * @Date: 2021-07-29 18:14:00
 * @LastEditors: 江澎涛
 * @LastEditTime: 2021-08-13 17:36:23
 */

import store from '@/store/index.js'
import orderOptions from '@/views/order/orderManagement/util/options.js'
export const options = (el, binding) => {
    const { value, arg } = binding
    //arg : 比对的key字段  value 判断值
    const { orderTabType } = store.getters
    const list = orderOptions[orderTabType][arg]
    if (list.indexOf(value) == -1) {
        el.style.display = 'none'
    }
}

