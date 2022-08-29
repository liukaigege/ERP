/*
 * @Descripttion:  //按钮是否开启disabled 的方法
 * @version:
 * @Author: 朱涛
 * @Date: 2021-08-05 11:54:06
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-25 21:02:45
 */

import store from '@/store/index.js'
import {patternFn} from '@/utils/tool.js'
export default function optionsDisabled() {

  const isDect = (parent) => {
    if (parent.forbidFlag === 1) return true
    return false
  } // 禁止处理开启

  const matching = (scope, parent, orderType) => {
    if (isDect(parent) && orderType == '0') return true
    return false
  } //匹配

  const examine = (scope, parent, orderType) => {
    let bole = false
    if (isDect(parent)) return true
    if (parent.packageStatus !== 0) return true
    // if (scope.packageGoods && scope.packageGoods.length > 0) return false
    scope.packageSkus?.forEach(item => {
      if (item.packageGoods && item.packageGoods.length == 0) {
        bole = true
      }
      if (!item.packageGoods) bole = true
    })

    return bole
  } //审核

  const custom = (scope, parent, orderType) => {

    if (isDect(parent)) return true
    return false
  } //定制


  const priorityFlag = (scope, parent, orderType) => {

    const whiteList = [7, 8, 9, 11]
    if (isDect(parent)) return true
    if (whiteList.indexOf(orderType) !== -1) return true
    return false
  } //优先分配库存

  const deductFlag = (scope, parent, orderType) => {
    const whiteList = [7, 8, 9, 11]
    if (isDect(parent)) return true
    if (whiteList.indexOf(orderType) !== -1) return true
    return false
  } //扣库存

  const applyOrderNum = (scope, parent, orderType) => {
    if (isDect(parent)) return true
    if (!parent.logistics) return true

    return false
  } //申请运单号

  const applyAgain = (scope, parent, orderType) => {
    if (isDect(parent)) return true
    if (!parent.logistics) return true
    return false
  } // 重新获取

  const splitOrder = (scope, parent, orderType) => {
    if (isDect(parent)) return true
    if (parent.reissueFlag == 1) return true
    if (parent.type == 1 || parent.type == 3 || parent.type == 2) return true
    if (parent.mergeFlag == -1 || parent.mergeFlag == 1) return true // 拆分出来的子包裹 和合并过的包裹
    let data = parent.packageRels[0].packageSkus ? parent.packageRels[0].packageSkus : []
    let bole = false
    if (data.length == 0) return bole = true
    if (data[0].quantity == 1 && data.length == 1) return bole = true
    // 单品单数
    return bole
  } // 拆分订单


  const printed = (scope, parent, orderType) => {
    if (isDect(parent)) return true
    const { orderTabType, isChangeLogist } = store.getters
    if (isChangeLogist && parent.printFlag == 1) return false
    return false
  } // 打单

  const reissuePrinted = (scope, parent, orderType) => {
    if (isDect(parent)) return true
    const { orderTabType, isChangeLogist } = store.getters
    if (parent.trackType == 1) return true // 手工运单不允许补打单
    if (isChangeLogist && parent.printFlag == 1) return false

    return false

  } // 补打单


  const printFlag = (scope, parent, orderType) => {
    const { changeLogisticType, isChangeLogist } = store.getters
    let logistWhite = ['waitPrint', 'toBeDelivered', 'orderSuccess']
    if (isChangeLogist && logistWhite.indexOf(changeLogisticType) !== -1) return true
    return false
  } // 已交运设置打单


	const refund = (scope,parent,orderType)=>{
		const {paymentType,paymentMethod,type} = scope
		const {lplApplyStatus,packageRels,packageStatus} = parent
		if(paymentType!=='1' && !patternFn(paymentMethod,'email')) return true  // 如果不是paypal 且支付方式不是邮箱则置灰
		if(type === 1) return  true // 手动订单置灰
		// if( (payPrice && refundPrice) &&  (payPrice-refundPrice <= 0)) return true // 剩余金额等于0 置灰
		// if(surplusPrice !== null && Number(surplusPrice) <= 0) return true // 订单剩余金额等于0 置灰
		let bole = packageRels.every(v=>{
			return v.surplusPrice !== null && Number(v.surplusPrice) <= 0
		})// 所有订单剩余金额等于0 置灰

		if(bole) return  true
		if([-1,-2,-3].find(v=>v === packageStatus)) return  true
		// 产品把已交运成功的-4状态去除
		if (isDect(parent)) return true

		if(lplApplyStatus === 2) return  true

 		const whiteList = [9,10]
		const { orderTabType } = store.getters
		if (orderTabType === 'allOrder' && whiteList.indexOf(orderType) !== -1) return true
		return false
	} // 退款按钮

  return {
    examine,
    isDect,
    matching,
    custom,
    applyOrderNum,
    priorityFlag,
    deductFlag,
    splitOrder,
    printed,
    reissuePrinted,
    printFlag,
    applyAgain,
		refund
  }

}
