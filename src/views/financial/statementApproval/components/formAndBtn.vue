<template>
	<div>
		<div class="head">
			<el-tabs v-model="form.checkStatus" tab-position="top" @tab-click="tabClick">
				<el-tab-pane label="待审核" :name="0"></el-tab-pane>
				<el-tab-pane label="已审核" :name="1"></el-tab-pane>
			</el-tabs>
		</div>
		<div class="form-and-btn-container">
			<el-form :model="form" ref="formRef" :inline="true">
				<el-form-item :label="form.timeType == 0?'申请时间：':''">
					<el-select v-model="form.dateType" v-if="form.timeType == 1" style="width:320">
						<el-option label="创建时间" :value="0" />
						<el-option label="申请时间" :value="1" />
					</el-select>
					<el-date-picker v-model="form.startTime_endTime" type="daterange" unlink-panels range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" />
				</el-form-item>
				<el-form-item label="搜索内容:">
					<div class="flex">
						<div>
							<el-select v-model="form.searchType">
								<el-option label="对账单号" :value="1" />
							</el-select>
						</div>
						<el-input v-model="form.searchText" placeholder="多个对账单号用逗号隔开" clearable style="240px"></el-input>
					</div>
				</el-form-item>
				<el-form-item label="结算方式:">
					<el-select v-model="form.settlementType">
						<el-option v-for="item in settlement" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="供应商:">
					<el-cascader :options="supplierList" v-model="form.supplier" @change="cascaderChange" clearable filterable collapse-tags :props="cascaderProps" style="width:400px">
					</el-cascader>
				</el-form-item>
				<div class="flex space-bt">
					<div>
						<el-form-item label="申请人:">
							<el-select v-model="form.applyUserIds" clearable filterable multiple collapse-tags collapse-tags-tooltip style="width:240px">
								<el-option v-for="item in applySelectList" :key="item.fullName" :label="item.fullName" :value="item.userId" />
							</el-select>
						</el-form-item>
						<el-form-item label="审核结果:" v-if="form.checkStatus == 1">
							<el-select v-model="form.findings" clearable filterable>
								<el-option label="已通过" :value="1" />
								<el-option label="已打回" :value="0" />
							</el-select>
						</el-form-item>
						<el-form-item label="审批人:" v-if="form.checkStatus == 1">
						</el-form-item>
					</div>
					<div>
						<el-button type="primary" @click="search">查询</el-button>
						<el-button>重置</el-button>
					</div>
				</div>
			</el-form>
		</div>
		<div class="no-bgc">
			<erpSort :options="filterSort" :defaultSort="{value:1,type:'desc'}" @sort="sort" />
			<div class="btn">
				<div class="flex space-bt">
					<div v-if="form.checkStatus==1">
						<el-button type="primary" size="default" @click="print">打印</el-button>
					</div>
					<div v-else>
						<el-button type="primary" size="default" @click="completeReconciliation">完成对账</el-button>
						<el-button type="primary" size="default" @click="rejectReconciliation">拒绝对账</el-button>
					</div>
					<div>
						<el-button type="primary" @click="openExport">导出</el-button>
					</div>
				</div>
			</div>
			<exportDialog v-if="showExport" @close="showExport = false" />
		</div>
	</div>

</template>

<script>
	import { inject, toRefs, onMounted, computed, ref } from 'vue'
	import {
		settlement,
		cascaderProps,
		sortOptions
	} from '../composables/options.js'
	import { getTree } from '@/api/purchase/outOfStock.js'
	import erpSort from '@/components/erpSort/index.vue'
	import { applyList } from '@/views/financial/paymentApproval/composables/api.js'
	import exportDialog from './export.vue'
	import { verifyCheckPageQuery } from '@/api/financial'
	export default {
		components: { erpSort, exportDialog },
		setup() {
			const state = inject('state')
			let applySelectList = ref(null)
			onMounted(() => {
				getTree().then(res => {
					state.supplierList = res.data
				})
				applyList().then(res => {
					applySelectList.value = res.data
				})
				search()
			})

			const filterSort = computed(() => { // 待审核没有审核时间的排序
				console.log(state.form.checkStatus);
				return state.form.checkStatus == 0 ? sortOptions.filter(item => item.value != 2) : sortOptions
			})
			function tabClick() {
				state.loading = true
				setTimeout(() => {
					state.loading = false
				}, 1000)
			}
			function cascaderChange(select) { // 处理供应商
				// 清空选中的供应商
				state.form.partnerTypeList = []
				state.form.supplierIdList = []
				// 存储不同的供应商id
				let obj = {
					1: [],
					2: [],
					3: [],
					4: []
				}
				select.forEach(el => obj[el[0]].push(el[1]))
				state.supplierList.forEach(item => {
					// 如果供应商类别下面的所有供应商被选中
					if (obj[item.id].length == item.childs.length) state.form.partnerTypeList.push(item.id)
					// 否则
					else state.form.supplierIdList.push(...obj[item.id])
				})
			}

			function sort(value, sortType) {
				state.form.sort = value
				state.form.sortType = sortType
			}

			function search() {
				verifyCheckPageQuery(state.form).then(res => {
					console.log(res.data);
				})
			}

			function completeReconciliation() { // 完成对账

			}

			function rejectReconciliation() { // 拒绝对账

			}

			function print() { // 打印

			}

			let showExport = ref(false)
			function openExport() {
				showExport.value = true
			}
			return {
				...toRefs(state),
				tabClick,
				settlement,
				cascaderProps,
				filterSort,
				cascaderChange,
				sort,
				applySelectList,
				search,
				completeReconciliation,
				rejectReconciliation,
				print,
				openExport,
				showExport
			}
		}
	}
</script>

<style lang="scss" scoped>
	.form-and-btn-container {
		padding: 0 12px;
		background-color: #fff;
	}

	.flex {
		display: flex;
	}
	.head {
		background-color: #fff;
	}
	.space-bt {
		justify-content: space-between;
	}

	::v-deep(.el-select) {
		width: 150px;
	}

	.no-bgc {
		padding: 8px 0;
	}
	::v-deep(.el-tag__content) {
		max-width: 200px;
	}
</style>
