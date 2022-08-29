<!--
 * @Descripttion:
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-14 15:33:36
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-26 09:50:57
-->
<template>
	<div class="tabbox">
		<el-affix :offset="100" class="affix">
			<div class="tabHeader">
				<div class="tab_left">
					<el-button
						:disabled="btnDsiabled"
						:type="active === 'allOrder' ? 'primary' : 'default'"
						@click="changetab('allOrder', '')"
					>
						全部订单
					</el-button>

					<el-button
						:disabled="btnDsiabled"
						:type="active === 'toBeReviewed' ? 'primary' : 'default'"
						@click="changetab('toBeReviewed', 0)"
					>
						待审核
						<p>
							(
							<span
								:class="
									active === 'toBeReviewed' ? 'active-num' : 'noactive-num'
								"
								>{{ showNum(0) }}</span
							>
							)
						</p>
					</el-button>
					<el-button
						:disabled="btnDsiabled"
						:type="active === 'pending' ? 'primary' : 'default'"
						@click="changetab('pending', 1)"
					>
						待处理
						<p>
							(
							<span
								:class="active === 'pending' ? 'active-num' : 'noactive-num'"
								>{{ showNum(1) }}</span
							>
							)
						</p>
					</el-button>

					<div class="tab_left_box">
						<p class="title">运单号申请</p>
						<div class="left_box_btn">
							<el-button
								:disabled="btnDsiabled"

								:type="active === 'applying' ? 'primary' : 'text'"
								@click="changetab('applying', 2)"
							>
								申请中 (<span
									:class="active === 'applying' ? 'active-num' : 'noactive-num'"
									>{{ showNum(2) }}</span
								>)
							</el-button>
							<el-button
								:disabled="btnDsiabled"

								:type="active === 'fail' ? 'primary' : 'text'"
								@click="changetab('fail', 3)"
							>
								申请失败 (<span
									:class="active === 'fail' ? 'active-num' : 'noactive-num'"
									>{{ showNum(3) }}</span
								>)
							</el-button>
							<el-button
								:disabled="btnDsiabled"

								:type="active === 'success' ? 'primary' : 'text'"
								@click="changetab('success', 4)"
							>
								申请成功 (<span
									:class="active === 'success' ? 'active-num' : 'noactive-num'"
									>{{ showNum(4) }}</span
								>)
							</el-button>
						</div>
					</div>

					<div class="tab_left_box">
						<p class="title">待打单</p>
						<div class="left_box_btn">
							<el-button
								:disabled="btnDsiabled"

								:type="active === 'inStock' ? 'primary' : 'text'"
								@click="changetab('inStock', 5)"
							>
								有货 (<span
									:class="active === 'inStock' ? 'active-num' : 'noactive-num'"
									>{{ showNum(5) }}</span
								>)
							</el-button>
							<el-button
								:disabled="btnDsiabled"

								:type="active === 'outStock' ? 'primary' : 'text'"
								@click="changetab('outStock', 6)"
							>
								缺货 (<span
									:class="active === 'outStock' ? 'active-num' : 'noactive-num'"
									>{{ showNum(6) }}</span
								>)
							</el-button>
						</div>
					</div>

					<el-button
						:disabled="btnDsiabled"
						:type="active === 'toBeDelivered' ? 'primary' : 'default'"
						@click="changetab('toBeDelivered', 7)"
					>
						待发货
						<p>
							(
							<span
								:class="
									active === 'toBeDelivered' ? 'active-num' : 'noactive-num'
								"
								>{{ showNum(7) }}</span
							>
							)
						</p>
					</el-button>
					<el-button
						:disabled="btnDsiabled"
						:type="active === 'byTransportation' ? 'primary' : 'default'"
						@click="changetab('byTransportation', 8)"
					>
						已发货
					</el-button>

					<el-button
						:disabled="btnDsiabled"
						:type="active === 'toBePaid' ? 'primary' : 'default'"
						@click="changetab('toBePaid', 9)"
					>
						未付款
					</el-button>

					<el-button :disabled="btnDsiabled"
						:type="active === 'refunded' ? 'primary' : 'default'"
						@click="changetab('refunded', 10)"
					> 已退款 </el-button>

					<el-button
						:disabled="btnDsiabled"
						:type="active === 'shelve' ? 'primary' : 'default'"
						@click="changetab('shelve', 11)"
					>
						已搁置
					</el-button>
				</div>
				<div class="tab_right">
					<el-button
						:disabled="btnDsiabled"
						type="primary"
						@click="ifShowSyncOrder = !ifShowSyncOrder"
						v-permission="'orderManagement/asyncOrder'"
						>同步订单</el-button
					>
				</div>
				<i
					:class="isShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
					@click="showTab"
				></i>
			</div>
		</el-affix>
		<SyncOrder v-if="ifShowSyncOrder" @closeEvent="closeEvent" />
	</div>
</template>

<script>
import {
	reactive,
	toRefs,
	onMounted,
	inject,
	nextTick,
	watch,
	computed
} from 'vue'
import { useStore } from 'vuex'
import $ from 'jquery'
import SyncOrder from './components/syncOrder.vue'
import { statusNum } from '@/api/order/orderManagement.js'
import moment from 'moment'
import {useRoute} from 'vue-router'
export default {
	setup() {
		const route = useRoute()
		const formOptions = inject('formOptions')
		// 获取的formOptions 组件
		const orderTable = inject('orderTable')
		// 获取的orderTable 组件
		const data = reactive({

			isShow: true,
			btnDsiabled: false,
			ifShowSyncOrder: false,
			numList: []
		})
		const store = useStore()
		const showTab = () => {
			data.isShow = !data.isShow
			if (data.isShow) {
				$('.tab_left').slideDown()
				$('.tab_right').slideDown()
			} else {
				$('.tab_left').slideUp()
				$('.tab_right').slideUp()
			}
		}

		// 	active: 'pending',
		const active = computed(() => {
			return  store.getters.orderTabType
		})

		const changetab = (active, types) => {
			data.btnDsiabled = true
			//打开所有按钮的不可点击
			const meargeLogistWhiteList = ['toBeReviewed', 'allOrder', 'toBePaid']
			// if (data.active === active) return
			store.dispatch('orderManage/setTabTypeByActions', active)
			store.dispatch('orderManage/setOrderStatusByActions', types)
			store.dispatch('orderManage/setChangeLogisticByActions', '')
			store.dispatch('orderManage/setMerageStatusByActions', '0')
			store.dispatch('orderManage/setIsChangeLogistByActions', false)
			//	data.active = active
			formOptions.value.selectedLength = 0
			formOptions.value.checked = false
			orderTable.value.selectRows = []

			orderTable.value.meargeStatus = false
			orderTable.value.activeName = '0'
			orderTable.value.isRowSpanLogis = false // 是否开启合并物流
			//关闭合并
			formOptions.value.resert(false)
			if (types == 11) {
				formOptions.value.form.orderStatus = ''
				formOptions.value.form.layFlag = 1
			} else {
				formOptions.value.form.orderStatus = types
				formOptions.value.form.layFlag = ''
			}
			if (meargeLogistWhiteList.indexOf(active) !== -1) {
				orderTable.value.meargeStatus = false
				orderTable.value.activeName = '0'
				orderTable.value.isRowSpanLogis = false // 是否开启合并物流
			} else {
				orderTable.value.isRowSpanLogis = true
			}
			if (active == 'byTransportation') {
				store.dispatch('orderManage/setChangeLogisticByActions', 'pending')
			}
			if(types === 10){
				formOptions.value.form.sortType = 'desc'
				formOptions.value.form.sortName = 'o.last_refund_time'
				// 退款页面
			}else{
				formOptions.value.form.sortType = 'asc'
				formOptions.value.form.sortName = 'o.create_time'
			}


			formOptions.value
				.init(1, true)
				.then(res => {
					data.btnDsiabled = false
				})
				.catch(err => {
					data.btnDsiabled = false
				})
		}

		let closeEvent = () => {
			data.ifShowSyncOrder = !data.ifShowSyncOrder
		}

		const getStatusNum = (isTest = false) => {
			let  whiteList = ['allOrder','toBeReviewed','pending','applying','fail','success','inStock','outStock','toBeDelivered']
			if(!whiteList.includes(active.value) && isTest) return
			statusNum().then(res => {
				if (res.code == 200) {
					data.numList = res.data
				}
			})
		} // 获取统计数

		const showNum = status => {
			if (data.numList.length > 0 && (status || status === 0)) {
				let num = 0
				let allNum = 0
				data.numList.map(v => {
					if (v.packageStatus == status) num = v.statusNum
					allNum += v.statusNum
				})
				if (status == 'all') num = allNum
				return num
			} else {
				return 0
			}
		}
		const sideBarWidth = computed(() => store.state.menu.sideBarWidth)
		onMounted(() => {
			getStatusNum()
		})
		return {
			...toRefs(data),
			showTab,
			changetab,
			closeEvent,
			showNum,
			getStatusNum,
			active,
			sideBarWidth
		}
	},
	components: {
		SyncOrder
	}
}
</script>

<style lang="scss" scoped>
.affix {
	min-height: 10px !important ;
}
.tabHeader {
	background: white;
	padding: 15px 15px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: relative;
	width: calc(97vw - v-bind(sideBarWidth));

	i {
		font-size: 20px;
		color: rgba(24, 144, 255, 1);
		margin-left: 16px;
		position: absolute;
		right: 1%;
	}
}
.tab_left {
	display: flex;
	align-items: center;

	p {
		margin-top: 7px;
	}
	:deep(.el-button) {
		height: 80px;
		margin: 0 8px;
	}
}
.tab_right {
	margin-right: 2%;
	:deep(.el-button) {
		height: 80px;
	}
}

.tab_left_box {
	margin: 0 16px;
	height: auto;
	border: 1px solid #dcdfe6;
	color: #606266;
	border-radius: 3px;
	font-size: 12px;
	padding: 7px 15px;
	.title {
		font-size: 14px;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #606266;
		text-align: center;
	}
	.left_box_btn {
		margin-top: 5px;
		:deep(.el-button) {
			border: none;
			padding: 0 3px;
			height: 20px;
		}
		:deep(.el-button--text) {
			color: #606266;
		}
	}
}
.active-num {
	font-weight: 700;
	color: #fff;
}
.noactive-num {
	font-weight: 700;
	color: red;
}
</style>
