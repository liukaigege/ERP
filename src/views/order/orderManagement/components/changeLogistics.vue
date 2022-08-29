<!--
 * @Descripttion:
 * @version:
 * @Author: 朱涛
 * @Date: 2021-08-02 09:47:19
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-22 21:49:43
-->

<template>
	<div class="header">
		<el-row class="div">
			<el-col :span="22">
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="待处理" name="-1"></el-tab-pane>
					<el-tab-pane label="待打单" name="-2"></el-tab-pane>
					<el-tab-pane label="待发货" name="-3"></el-tab-pane>
					<el-tab-pane label="已交运成功" name="-4"></el-tab-pane>
				</el-tabs>
			</el-col>

			<el-col :span="2" class="div right" @click="backSend">
				<el-button type="text">返回已发货</el-button>
			</el-col>
		</el-row>
	</div>

	<div class="btnList">
		<div class="btnLeft">
			<el-button

				type="primary"
				@click="clickBtn('remark')"
				v-if="isShow('remark')"
				v-permission="'orderManagement/remark'"
				>备注</el-button
			>
			<el-button

				@click="clickBtn('selLogistics')"
				type="primary"
				v-if="isShow('logistics')"
				v-permission="'orderManagement/logistics'"
				>更换物流</el-button
			>

			<el-button

				@click="clickBtn('applyNum2')"
				type="primary"
				v-if="isShow('getAgain')"
				v-permission="'orderManagement/getAgain'"
				>重新获取</el-button
			>

			<el-button

				type="primary"
				v-if="isShow('print')"
				@click="clickBtn('print')"
				v-permission="'orderManagement/print'"
				>打印面单</el-button
			>
			<el-button

				type="primary"
				v-if="isShow('pending')"
				v-permission="'orderManagement/logistic/pending'"
				@click="clickBtn('goPend')"
				>打回待处理</el-button
			>
			<el-button

				type="primary"
				v-if="isShow('deliverdAll')"
				v-permission="'orderManagement/logistic/deliverdAll'"
				@click="clickBtn('deliverdAll')"
				>批量发货</el-button
			>

			<el-button

				type="primary"
				v-if="isShow('waitPrint')"
				@click="clickBtn('goPrinted')"
				v-permission="'orderManagement/logistic/waitPrint'"
				>打回待打单
			</el-button>

			<!-- <el-button

				type="primary"
				v-if="isShow('reissuePrinted')"
				@click="clickBtn('print')"
				v-permission="'orderManagement/reissuePrinted'"
				>补打单
			</el-button> -->
      <el-button	type="primary" v-if="isShow('reissuePrinted')" @click="clickBtn('reissuePrinted')" v-permission="'orderManagement/reissuePrinted'">补打单</el-button>

			<el-dropdown
				style="margin: 0 10px"
				v-if="isShow('all') && showAboutPermission('orderManagement/all')"
				@visible-change="visibleDropDown"
			>
				<el-button  type="primary">
					批量操作<i class="el-icon-arrow-down el-icon--right"></i>
				</el-button>
				<template #dropdown>
					<el-dropdown-menu>
						<div style="padding: 10px 10px">
							<el-cascader-panel
								ref="batchRef"
								v-model="batchVal"
								:props="{
									expandTrigger: 'hover'
								}"
								:multiple="true"

								:options="batch"
								@change="getBatch"
							>
							</el-cascader-panel>
						</div>
					</el-dropdown-menu>
				</template>
			</el-dropdown>

			<!-- <el-button type="primary" @></el-button> -->
			<el-button type="primary" 	v-if="isShow('cancelLogistics')"	@click="clickBtn('cancelLogistics')">取消更换物流</el-button>

		</div>

		<div class="btnRight">
			<el-button

				type="primary"
				v-if="isShow('importOrder')"
				@click="exportOrder"
				v-permission="'orderManagement/exportOrder'"
				>导出订单</el-button
			>
			<el-button

				type="primary"
				v-if="isShow('importDXM')"
				v-permission="'orderManagement/exportDXM'"
				>导出店小秘订单</el-button
			>
		</div>
		<ExportOrder
			:showExportOrder="showExportOrder"
			v-if="showExportOrder"
			@closeExportOrderView="closeExportOrderView"
			:jsonStr="jsonStr"
			:packageIdList="packageIdList"
		/>
	</div>
</template>

<script>
import {
	reactive,
	toRefs,
	inject,
	getCurrentInstance,
	computed,
	ref
} from 'vue'
import { useStore } from 'vuex'
import btnFunList from '@/views/order/orderManagement/util/btnFunList.js'
import changeLogistic from '@/views/order/orderManagement/util/changeLogistic.js'
import ExportOrder from '@/views/order/orderManagement/components/exportOrder.vue'
import { authPath } from '@/utils/hooks.js'
import { deepCopy } from '../../../../utils/tool'
export default {
	components: { ExportOrder },
	setup() {
		const { proxy } = getCurrentInstance()
		const store = useStore()
		const formOptions = inject('formOptions')
		// 获取的formOptions 组件
		const orderTable = inject('orderTable')
		// 获取的orderTable 组件
		const btnFunction = btnFunList(orderTable, formOptions)
		const data = reactive({
			showExportOrder: false,
			activeName: '-1',
			batchVal: ''
		})

		const batch = computed(() => {
			const { changeLogisticType } = store.getters
			return changeLogistic[changeLogisticType].batch
		})

		const jsonStr = computed(() => {
			return JSON.stringify(formOptions.value.getForm())
		})

		const packageIdList = computed(() => {
			if (orderTable.value.selectRows.length > 0) {
				return orderTable.value.selectRows.join(',')
			} else {
				return ''
			}
		})

		const batchRef = ref()

		const handleClick = e => {
			const { paneName } = e
			let type
			switch (Number(paneName)) {
				case -1:
					type = 'pending'
					break
				case -2:
					type = 'waitPrint'
					break
				case -3:
					type = 'toBeDelivered'
					break
				case -4:
					type = 'orderSuccess'
					break
			}
			store.dispatch('orderManage/setChangeLogisticByActions', type)
			formOptions.value.form.orderStatus = Number(paneName)
			formOptions.value.init(1)
		}

		const isSelected = () => {
			if (orderTable.value.selectRows.length == 0) {
				proxy.$message.error({
					message: '请勾选包裹'
				})
				return false
			}
			return true
		}
		// 校验是否勾选订单

		const isShow = types => {
			const { changeLogisticType } = store.getters
			const list = changeLogistic[changeLogisticType].button
			if (list.indexOf(types) !== -1) {
				return true
			} else {
				return false
			}
		} // 是否显示按钮

		const clickBtn = val => {
			if (val) {
				let orderType = store.getters.orderType
				if (!isSelected()) return
				const packageIds = orderTable.value.selectRows.join(',')
				btnFunction[val](packageIds, orderType, 1)
			}
		}

		const getBatch = val => {
			if (val === null) return
			if (!isSelected()) return
			const packageIds = orderTable.value.selectRows.join(',')
			if (val[1]) {
				btnFunction[val[1]](packageIds, orderTable.value.tableData)
			} else {
				btnFunction[val[0]](packageIds, orderTable.value.tableData)
			}
		}
		const visibleDropDown = val => {
			if (!val) {
				batchRef.value.clearCheckedNodes()
				data.batchVal = ''
			}
		}

		const backSend = val => {
			store.dispatch('orderManage/setChangeLogisticByActions', 'pending')
			store.dispatch('orderManage/setIsChangeLogistByActions', false)
			formOptions.value.form.orderStatus = 8
			formOptions.value.init(1)
		}

		//点击导出订单按钮
		const exportOrder = () => {
			data.showExportOrder = true
		}

		//关闭导出订单弹框
		const closeExportOrderView = res => {
			data.showExportOrder = res
		}

		const showAboutPermission = val => {
			return authPath(val) || false
		}

		return {
			...toRefs(data),
			handleClick,
			clickBtn,
			isShow,
			getBatch,
			batch,
			batchRef,
			visibleDropDown,
			backSend,
			exportOrder,
			closeExportOrderView,
			jsonStr,
			packageIdList,
			showAboutPermission
		}
	}
}
</script>

<style lang="scss" scoped>
.div {
	display: flex;
	align-items: center;
	justify-content: center;
}
.btnList {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	.btnLeft {
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}
	.btnRight {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
}
</style>
