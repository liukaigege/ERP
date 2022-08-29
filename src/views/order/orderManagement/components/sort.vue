<!--
 * @Descripttion:
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 09:27:23
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-23 15:43:52
-->

<template>
	<div class="sortContainer">
		<div class="sortBox" v-if="showMearge">
			<el-form :inline="true" :model="form" class="demo-form-inline">
				<el-form-item label="排序:">
					<!-- <el-button type="text" @click="sort('replace_time')">
            更换物流时间
            <i :class="generateClass('replace_time')" />
          </el-button> -->
					<el-button
						type="text"
						v-for="(item, index) in sortList"
						:key="index"
						@click="sort(item.value)"
						:class="generateClass(item.value) ? '' :'unSelectActive'"
					>
						{{ item.label }}
						<i :class="generateClass(item.value)" />
					</el-button>

					<!-- <el-button type="text" @click="sort('pi.create_time')">
            搁置时间
            <i :class="generateClass('pi.create_time')" />
          </el-button> -->
				</el-form-item>
			</el-form>
		</div>

		<btnList v-if="!isShowLogistic && showMearge" />
		<changeLogistics v-if="isShowLogistic" />
		<!-- 更换物流管理-->
	</div>
</template>

<script>
import {
	reactive,
	toRefs,
	onMounted,
	computed,
	inject,
	getCurrentInstance,
	watch
} from 'vue'
import { useStore } from 'vuex'
import btnList from '@/views/order/orderManagement/components/btnList.vue'
import changeLogistics from '@/views/order/orderManagement/components/changeLogistics.vue'
import { updateExamine } from '@/api/order/orderManagement.js'

export default {
	components: { btnList, changeLogistics },
	setup(props, context) {
		const { proxy } = getCurrentInstance()
		const store = useStore()
		const data = reactive({
			form: {},
			sortType: 'asc',
			sortName: 'o.create_time'
		})

		const isShowLogistic = computed(() => {
			const { isChangeLogist, orderType } = store.getters
			if (orderType === 8 && isChangeLogist) return true
			return false
		}) //

		const showMearge = computed(() => {
			const { merageStatus, orderType } = store.getters
			if (merageStatus !== '0' && orderType == 1) return false
			return true
		})

		const orderType = computed(() => {
			return store.getters.orderType
		})

		const orderTable = inject('orderTable')
		// 获取的orderTable 组件
		const formOptions = inject('formOptions')
		// 获取的formOptions 组件
		const generateClass = sortName => {
			if (sortName === data.sortName) {
				if (data.sortType === 'asc') {
					return 'el-icon-caret-top'
				} else {
					return 'el-icon-caret-bottom'
				}
			} else {
				return ''
			}
		}

		const sort = sortName => {
			data.sortName = sortName
			if (data.sortType === 'asc') {
				data.sortType = 'desc'
			} else if (data.sortType === 'desc') {
				data.sortType = 'asc'
			}

			formOptions.value.form.sortName = sortName
			formOptions.value.form.sortType = data.sortType
			formOptions.value.init(1)
		}

		// 打开弹窗

		const sortList = computed(() => {
			let list = [
				{
					label: '下单时间',
					value: 'o.create_time'
				},
				{
					label: '付款时间',
					value: 'o.payment_time'
				},
				{
					label: '发货时间',
					value: 'p.delivery_time'
				},
				{
					label: '订单金额',
					value: 'o.total_price'
				},
				{
					label:'搁置时间',
					value: 'p.shelve_time'
				},
				{
					label:'退款时间',
					value: 'o.last_refund_time'
				},
				{
					label:'退款金额',
					value: 'o.refund_price'
				}
			]
			let sort = [list[0], list[1], list[3]]
			const {
				orderStatus,
				orderTabType,
				isChangeLogist,
				changeLogisticType
			} = store.getters
			let switchListAll = ['allOrder', 'byTransportation']
			let switchList = [
				'toBeReviewed',
				'pending',
				'applying',
				'fail',
				'success',
				'inStock',
				'outStock',
				'toBePaid',
				'shelve',
				'toBeDelivered'
			]
			let changeLogistList = ['pending', 'waitPrint', 'toBeDelivered']
			// if (switchList.indexOf(orderTabType) !== -1) {
			// 	sort = [list[0], list[1], list[3]]
			// }
			// if (switchListAll.indexOf(orderTabType) !== -1) {
			// 	sort.push(list[4])
			// }
      if (orderTabType === 'allOrder') {
        sort.push(list[4])
      }

      if (orderTabType === 'byTransportation') {
        sort.push(list[2])
      }

			if(orderTabType === 'shelve'){
				sort = [list[0], list[1], list[3], list[4]]
			}
			if(orderTabType === 'refunded'){
				sort = [list[5], list[6], list[0], list[1]]
				data.sortType= 'desc'
				data.sortName='o.last_refund_time'
			}
      if (orderTabType === 'toBeDelivered') {
        sort = [list[0], list[1], list[3]]
        sort.push({
          label:'打单时间',
					value: 'pl.print_time'
        })
      }
			if (isChangeLogist) {
				if (changeLogistList.indexOf(changeLogisticType) !== -1) {
					sort = [list[0], list[1], list[3]]
				}
				if (changeLogisticType == 'orderSuccess') {
					sort = [list[0], list[1], list[3],list[4]]
				}
			}
			return sort
		})

		onMounted(() => {})
		return {
			...toRefs(data),
			generateClass,
			sort,
			isShowLogistic,
			showMearge,
			orderType,
			sortList
		}
	}
}
</script>

<style lang="scss" scoped>
.sortContainer {
	.sortBox {
		display: flex;
		align-items: center;
	}
	.btnList {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
}
.el-form-item {
	margin-bottom: 0 !important;
}
.unSelectActive{
	color: #909399;
}
</style>
