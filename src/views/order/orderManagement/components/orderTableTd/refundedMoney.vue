<!--
 * @Descripttion: 订单金额
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 15:22:30
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-20 10:22:50
-->

<template>
	<div  class="orderAmount">
		<div style="text-align: center" v-if="showTag(parent)"><span class="amountType" >{{item.currency}} </span> <span class="price">{{item.refundPrice}} </span>
		</div>
		<div v-else style="text-align: center"> - </div>

	</div>
</template>

<script>
import { computed, inject, onMounted } from 'vue'
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
		const orderTabType = computed(()=>store.getters.orderTabType)
		const getPay = val =>{
			val = Number(val)
			switch (val){
				case 0:
					return ''
					break;
				case 1:
					return 'paypal'
					break;
				case 2:
					return 'credit card'
					break;
				case 3:
					return ' location'
			}
		}

		const showTag = (item) =>{
			const {mergeFlag} = parent.value
			if(mergeFlag === -1) return  false // 拆分的子包裹不显示
			return  true
		}
		onMounted(()=>{
		})
		return {
			item,
			getPay,
			orderTabType,
			parent,
			showTag
		}
	}
}
</script>
<style lang="scss" scoped>
.orderAmount{
	text-align: left;
	padding: 0px 10px;
	.amountType{
		font-size: 12px;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.65);

	}
	.price{
		font-size: 12px;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.65);
		margin: 0 5px;
	}
	.pay,.quel{
		font-size: 12px;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.65);
		margin-top: 5px;
	}
}
</style>
