<!--
 * @Descripttion: 时间
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 15:22:30
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-23 14:34:35
-->

<template>
	<div class="date" v-if='item'>
		<p v-if="isShowP(0)">下单：{{item.createTime ? item.createTime :'-'}}</p>
		<p v-if="isShowP(1)">付款：{{item.paymentTime ? item.paymentTime : '-'}}</p>
		<p v-if="isShowP(2)">打单：{{item.printTime ? item.printTime : '-'}}</p>
		<p v-if="isShowP(3)">发货：{{item.deliveryTime ? item.deliveryTime : '-'}}</p>
		<p v-if="isShowP(3)">揽件：{{item.collectTime ? item.collectTime : '-'}}</p>
		<p v-if="isShowP(3)">妥投：{{item.deliverTime ? item.deliverTime : '-'}}</p>
		<p v-if="isShowP(4)">搁置：{{item.shelveTime ? item.shelveTime : '-'}}</p>
		<p v-if="isShowP(5) || showTag(item)">退款：{{item.lastRefundTime ? item.lastRefundTime : '-'}}</p>
	</div>
</template>

<script>
import {computed,onMounted} from 'vue'
import {useStore} from 'vuex'
export default {
	props:{
		scope:{
			type:Object,
			default:null
		}
	},
	setup(props){
		const store = useStore()
		const item  = computed(()=>props.scope.row)
		const parent = computed(() => props.scope.parentRow)

		const showTag = (item) =>{
			const {mergeFlag} = parent.value
			if(mergeFlag === -1) return  false // 拆分的子包裹不显示
			if(item.refundPrice > 0) return  true // 退款金额大于0 显示
		}

		function isShowP(val){
			let list = [0,1,2,3,4,5]
			let end = []
			const {orderTabType,isChangeLogist,changeLogisticType} = store.getters
			let switchList = ['toBeReviewed','pending','applying','fail',
				'success','inStock','outStock'
			]
			let switchListAll = ['allOrder','byTransportation','shelve']
			let changeLogistList = ['pending','waitPrint']
			if(switchList.indexOf(orderTabType) !== -1){
				end = [list[0],list[1] ]
			}

			if(orderTabType == 'toBeDelivered'){
				end = [ list[0],list[1],list[2] ]
			} // 待发货
			if(orderTabType == 'toBePaid'){
				end = [ list[0],list[1]]
			} // 未付款

			if(switchListAll.indexOf(orderTabType) !== -1){
				end = [ list[0],list[1],list[2],list[3]]
			}

			if(orderTabType == 'shelve'){
				end.push(list[4])
			} // 未付款

			if(orderTabType == 'refunded'){
				end = [ list[0],list[1],list[5]]
			} // 未付款


			if(isChangeLogist){
				if(changeLogistList.indexOf(changeLogisticType) !== -1){
					end = [ list[0],list[1] ]
				}
				if(changeLogisticType == 'toBeDelivered'){
					end = [ list[0],list[1],list[2] ]
				}
				if(changeLogisticType == 'orderSuccess'){
					end = list
				}
			}

			if(end.indexOf(val) !== -1) return true
			return false


		}

		onMounted(()=>{

		})
		return {
			item,
			isShowP,
			showTag
		}
	}
}
</script>
<style lang="scss" scoped>
.date {
	text-align: left;
	padding: 0px 10px;
	p {
		font-size: 12px;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.65);
		margin-top: 5px;
	}
}
</style>
