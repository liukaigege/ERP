<template>
  <div class="headApplication">
    <!-- 头部 -->
    <AffixTab>
      <template v-slot:tabSlot>
        <el-button :type="combineType==0?'primary':'default'" class="btn" @click="tabSelectEvent(0)">
          <div>草稿</div>
          <div class="num">
            (<span :class="combineType==0 ? 'active-num':'noactive-num'">{{topStatus.draftCount?topStatus.draftCount:0}}</span>)
          </div>
        </el-button>
        <!-- 审核 -->
        <div class="tab_left_box">
          <p class="title">审核</p>
          <div class="btn">
            <el-button :type="combineType==1?'primary':'default'" @click="tabSelectEvent(1)">
              申请中(<span :class="combineType==1? 'active-num':'noactive-num'">{{topStatus.inApplicationCount?topStatus.inApplicationCount:0}}</span>)
            </el-button>
            <el-button :type="combineType==2?'primary':'default'" @click="tabSelectEvent(2)">
              未通过(<span :class="combineType==2? 'active-num':'noactive-num'">{{topStatus.failCount?topStatus.failCount:0}}</span>)
            </el-button>
          </div>
        </div>
        <!-- 已完成 -->
        <el-button :type="combineType==3?'primary':'default'" class="btn" @click="tabSelectEvent(3)">
          <div style="margin:0">已完成</div>
        </el-button>
      </template>
    </AffixTab>
    <!-- form表单-->
    <div class="formClass">
      <el-form :model="form" :inline="true" ref="formRef" @keydown.enter='search'>
        <el-form-item :label="combineType===0?'创建时间:':''">
          <el-select v-if="combineType!=0" v-model="form.timeType" style="width:100px;margin:0 16px 0 0">
            <el-option value="1" label="创建时间"></el-option>
            <el-option value="2" label="申请时间"></el-option>
          </el-select>
          <el-date-picker v-model="form.startTime_endTime" type="daterange" unlink-panels style="width: 350px;" range-separator="→" value-format="YYYY-MM-DD" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="搜索内容:">
          <el-select style="width:130px" v-model="form.searchType" placeholder="全部" clearable>
            <el-option label="入库单号" value="1"></el-option>
            <el-option label="对账单号" value="2"></el-option>
          </el-select>
          <el-input v-model="form.searchText" style="width:318px;margin-left:16px" clearable placeholder="请输入要检索的内容用逗号或空格隔开"></el-input>
        </el-form-item>
        <el-form-item label="结算方式:">
          <el-select v-model="form.settlementList" placeholder="全部" clearable @change="changeSettle">
            <el-option label="账期（30天）" value="2,30"></el-option>
            <el-option label="账期（45天）" value="2,45"></el-option>
            <el-option label="账期（60天）" value="2,60"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商:">
          <el-cascader filterable placeholder="请选择" v-model="form.supplier" collapse-tags :options="supplierOptions" @change="handlePartnerTypeChange" :props="defaultPartnerProps" clearable style="width: 300px"></el-cascader>
        </el-form-item>
        <el-form-item label="申请人:">
          <el-cascader ref="applySelectCascader" placeholder="全部" v-model="form.applyUserIds" collapse-tags :options="applySelectList" @change="handleApplySelectChange" :props="defaultApplyProps" clearable style="width: 222px"></el-cascader>
        </el-form-item>
        <el-form-item label="付款状态:" v-if="combineType==3">
          <el-select style="width:130px" v-model="form.paymentStatus" placeholder="全部" clearable>
            <el-option label="已付款" value="1"></el-option>
            <el-option label="部分付款" value="2"></el-option>
            <el-option label="未付款" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="mt-16">
      <ErpSort :options="sortList" :defaultSort="defaultSort" @sort="sortFn" />
    </div>
    <div class="buttonClass">
      <div>
        <el-button type="primary" v-permission="'reconciliationApplication_batchCancel:btn'" v-if="combineType==1" @click="batchCancel">取消</el-button>
        <el-button type="primary" v-permission="'reconciliationApplication_batchAudit:btn'" v-if="combineType==0|| combineType==2" @click="batchSumitApprove">提交审核</el-button>
        <!-- <el-button type="primary" v-if="combineType==0|| combineType==2">打印</el-button> -->
        <el-button type="primary" v-permission="'reconciliationApplication_batchDelete:btn'" v-if="combineType==0|| combineType==2" @click="batchDelete">删除</el-button>
      </div>
      <div>
        <el-button type="primary" @click="exportList" v-permission="'reconciliationApplication_export:btn'">导出</el-button>
      </div>
    </div>
    <!-- 表格部分 -->
    <!-- 草稿 -->
    <AdoptTable ref="tableRefAdopt" v-if="combineType===0" @updateList="updateList" @selecDataList="multipleSelection" :checkType="combineType" :tabelData="tabelData" @deleteInit="deleteInit" @batchApprove='sigleApprove' />
    <!-- 申请中 -->
    <Application v-if="combineType===1" :tabelData="tabelData" @selecDataList="multipleSelection" @cancelList="cancelList" />
    <!-- 未通过表格 -->
    <FailTable ref="tableRefFail" v-if="combineType===2" :tabelData="tabelData" @selecDataList="multipleSelection" :checkType="combineType" @deleteInit="deleteInit" @batchApprove='sigleApprove' @updateList="updateList" />
    <!-- 已完成 -->
    <Completed v-if="combineType===3" :tabelData="tabelData" @selecDataList="multipleSelection" />
    <!-- 分页器 -->
    <div class="flex-pagination page-fixed">
      <div style="position: relative;">
        已选<span style="color: #1890ff">{{selectCount.length}}</span>条
      </div>
      <div>
        <el-pagination style="" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.pageNo" :page-sizes="paginationArr" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationTotal">
        </el-pagination>
      </div>
    </div>
    <!-- 导出 -->
    <ExportOrder v-if="dialogExport" :formData="form" :combineType="combineType" :selectList="selectCount" />
  </div>
</template>
<script>
	import ExportOrder from './components/exportOrder'
	import AffixTab from '@/components/affixTab/index.vue'
	import ErpSort from '@/components/erpSort/index.vue'
	import { supplierGetTree } from '@/api/purchase/purchase'
	import { queryApplicationList, queryGetTagTotal, queryBatchDelete, queryBatchCancelt, queryPurchaseVerifyApplicant, queryBatchApprove } from './api/api'
	import { ElMessage, ElMessageBox, switchProps } from "element-plus"
	import { onMounted, provide, reactive, toRefs, ref, computed, onActivated } from 'vue'
	import AdoptTable from './components/adoptTable'
	import FailTable from './components/failTable'
	import Application from './components/application'
	import Completed from './components/completed'
	import { deepCopy } from 'tool'
	export default {
		name: 'reconciliationApplication',
		components: {
			AffixTab,
			ErpSort,
			AdoptTable,
			FailTable,
			Application,
			Completed,
			ExportOrder
		},
		setup() {
			const formRef = ref(null)
			const tableRefFail = ref(null)
			const applySelectCascader = ref(null)
			const tableRefAdopt = ref(null)
			const defaultPartnerProps = {
				expandTrigger: 'hover',
				value: 'id',
				label: 'name',
				children: 'childs',
				multiple: true
			}
			const defaultApplyProps = {
				value: 'userId',
				label: 'fullName',
				children: 'childs',
				multiple: true
			}

			const sortList1 = [{ label: '创建时间', value: 1 }, { label: '对账金额', value: 2 }]
			const sortList2 = [{ label: '创建时间', value: 1 }, { label: '申请时间', value: 3 }, { label: '对账金额', value: 2 }]
			const sortList3 = [{ label: '创建时间', value: 1 }, { label: '申请时间', value: 3 }, { label: '完成时间', value: 4 }, { label: '对账金额', value: 2 }]
			const defaultSort1 = { value: 1, type: 'asc' }
			const defaultSort2 = { value: 4, type: 'desc' }
			const state = reactive({
				tableRef: null,
				combineType: 0,
				dialogExport: false,
				topStatus: {},//顶部状态值
				form: {
					supplier: [],
					timeType: '1',
					startTime_endTime: [],
					searchType: '1',
					paymentStatus: '',
					partnerTypeList: [],
					supplierIdList: [],
					applyUserIds: [],
					searchText: '',
					settlementType: '',
					settlementList: '',
					settlementValue: '',// 结算数据
					settlementUnit: '',// 结算单位
					sort: 'asc',
					sortType: 1,
					status: 0
				},
				statusType: 0,
				tabelData: [],//接口请求列表数据
				supplierOptions: [],
				applySelectList: [],
				selectCount: [],//表格的多选数据
				page: {
					pageSize: 10, //分页
					pageNo: 1 //分页
				},
				paginationTotal: 0, //分页总数据条数
				paginationArr: [10, 20, 30, 40, 100,300] //分页每页选择条数默认数据
			})
			let copyForm = deepCopy(state.form)
			onActivated(() => {
				searchApplicationList()
				queryStaus()
			})
			onMounted(() => {
				searchApplicationList()
				queryStaus()
				getSupplierGetTree()// 获取供应商数据
				// getApplySelectList()// 获取申请人数据
				queryVerifyApplicant()
			})
			//申请人列表
			function queryVerifyApplicant() {
				queryPurchaseVerifyApplicant({ tabFlag: state.combineType }).then(res => {
					state.applySelectList = res.data
				})
			}
			const tabSelectEvent = (val) => {
				changeCombineType(val)
				formRef.value.resetFields()
				state.form = deepCopy(copyForm)
				state.page.pageSize = 10
				state.page.pageNo = 1
				state.selectCount = []
				searchApplicationList()
				queryStaus()
				queryVerifyApplicant()
			}
			//查询对账申请列表
			const searchApplicationList = () => {
				state.form.page = state.page
				let param = {
					status: state.statusType
				}
				Object.assign(state.form, param)
				queryApplicationList(state.form).then(res => {
					state.tabelData = res.data.dataList
					state.paginationTotal = res.data.page.totalCount
					// console.log(state.tabelData,'state.tabelData');
				})
			}
			//获取不同状态
			function queryStaus() {
				queryGetTagTotal().then((res => {
					state.topStatus = res.data
				}))
			}

			// 获取供应商列表
			const getSupplierGetTree = () => {
				supplierGetTree().then(res => {
					if (res.code == 200) {
						state.supplierOptions = res.data
					} else {
						ElMessage.error(res.message)
					}
				})
			}
			const reset = () => {
				formRef.value.resetFields()
				state.form = deepCopy(copyForm)
				searchApplicationList()
			}

			const sortList = computed(() => {
				switch (state.combineType) {
					case 0:
						return sortList1
					case 1:
					case 2:
						return sortList2
					case 3:
						return sortList3
				}
			})
			const defaultSort = computed(() => {
				switch (state.combineType) {
					case 0:
					case 1:
					case 2:
						return defaultSort1
					case 3:
						return defaultSort2
				}
			})
			const changeCombineType = num => {
				console.log(num, 'num')
				state.combineType = num
				state.statusType = num
				if (num == 3) {
					copyForm.sort = 'desc'
					copyForm.sortType = 4
				} else {
					copyForm.sort = 'asc'
					copyForm.sortType = 1
				}
				// searchApplicationList()
			}

			const sortFn = (val, type) => {
				state.form.sortType = val
				state.form.sort = type
				searchApplicationList()

			}
			//返回的方法
			// 1.表格的选择数据
			const multipleSelection = (data) => {
				state.selectCount = data
				// console.log(data, 'data')
			}

			const closeDialog = val => {
				state.dialogExport = false
			}
			//草稿和未通过删除
			function deleteInit(id) {
				queryBatchDelete({ ids: [id] }).then(res => {
					ElMessage.success('操作成功')
					searchApplicationList()
					queryStaus()
				})
			}
			//申请中取消
			function cancelList(id) {
				queryBatchCancelt({ ids: [id] }).then(res => {
					searchApplicationList()
					queryStaus()
				})
			}
			//草稿和未通过单个审核
			function sigleApprove(id, type) {
				let params = {
					ids: [id],
					status: type
				}
				queryBatchApprove(params).then(res => {
					ElMessage.success('操作成功')
					searchApplicationList()
					queryStaus()
				})
			}
			//导出
			provide('closeDialog', closeDialog)
			//分页
			const handleSizeChange = val => {
				state.page.pageSize = val
				state.page.pageNo = 1
				searchApplicationList()
			}
			const handleCurrentChange = val => {
				state.page.pageNo = val
				searchApplicationList()
			}
			//供应商处理
			const handlePartnerTypeChange = val => {
				state.form.partnerTypeList = []
				state.form.supplierIdList = []
				// 存储不同的供应商id
				let obj = {
					1: [],
					2: [],
					3: [],
					4: []
				}
				val.forEach(el => obj[el[0]].push(el[1]))
				state.supplierOptions.forEach(item => {
					if (obj[item.id].length == item.childs.length) {
						state.form.partnerTypeList.push(item.id)
					} else {
						state.form.supplierIdList.push(...obj[item.id])
					}
				})
				console.log(state.form.partnerTypeList, state.form.supplierIdList, 'val')
			}
			const handleApplySelectChange = val => {
				const checkedNode = applySelectCascader.value.$refs.panel.getCheckedNodes(true)
				const checkedValue = checkedNode.map(item => item.value)
				state.form.applyUserIds = checkedValue
			}
			//导出
			const exportList = () => {
				state.dialogExport = true
			}
			//处理结算方式
			function changeSettle(val) {
				state.form.settlementType = val.split(',')[0]
				state.form.settlementValue = val.split(',')[1]
			}
			//批量删除
			function batchDelete() {
				if (!state.selectCount.length) return ElMessage.error('请选择列表数据')
				ElMessageBox.confirm('确认删除对账单数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					queryBatchDelete({ ids: state.selectCount }).then(res => {
						ElMessage.success('操作成功')
						searchApplicationList()
						queryStaus()
					})
				})
			}
			//批量取消
			function batchCancel() {
				if (!state.selectCount.length) return ElMessage.error('请选择列表数据')
				ElMessageBox.confirm('确认取消对账单数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					queryBatchCancelt({ ids: state.selectCount }).then(res => {
						ElMessage.success('操作成功')
						searchApplicationList()
						queryStaus()
						state.selectCount = []
					})
				})
			}
			//批量审核
			function batchSumitApprove() {
				if (!state.selectCount.length) return ElMessage.error('请选择列表数据')
				let params = {
					ids: state.selectCount,
					status: state.form.status == 0 ? 1 : 2
				}
				queryBatchApprove(params).then(res => {
					ElMessage.success('操作成功')
					if (state.combineType == 2) {
						// tableRefFail.value.indeterminate=false
					}
					//提交审核置空选择的
					searchApplicationList()
					queryStaus()
					state.selectCount = []

				})
			}
			//查询
			function search() {
				searchApplicationList()
			}
			// 子页面刷新方法
			function updateList() {
				ElMessage.success('操作成功')
				searchApplicationList()
				queryStaus()
			}
			return {
				...toRefs(state),
				defaultPartnerProps,
				defaultApplyProps,
				sortList1,
				sortList2,
				sortList3,
				sortList,
				defaultSort,
				applySelectCascader,
				sortFn,
				tabSelectEvent,
				multipleSelection,
				handleSizeChange,
				handleCurrentChange,
				exportList,
				searchApplicationList,
				reset,
				handlePartnerTypeChange,
				handleApplySelectChange,
				changeSettle,
				deleteInit,
				batchDelete,
				cancelList,
				batchCancel,
				search,
				sigleApprove,
				batchSumitApprove,
				formRef,
				updateList,
				tableRefFail,
				tableRefAdopt

			}
		}

	}
</script>

<style lang="scss" scoped>
.headApplication {
	.formClass {
		background: #fff;
		padding: 24px;
		margin-top: 24px;
	}
	::v-deep(.el-cascader__search-input) {
		margin-left: 10px;
	}
	.tableClass {
		background: #fff;
		padding: 24px;
		margin-top: 24px;
	}
	.buttonClass {
		display: flex;
		justify-content: space-between;
		margin: 16px 0;
	}
	.tab_left_box {
		margin: 0 16px;
		height: 80px;
		border: 1px solid #dcdfe6;
		color: #606266;
		border-radius: 3px;
		padding: 7px 15px;
		.title {
			font-size: 14px;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #606266;
			margin-top: 7px;
			text-align: center;
		}
		.btn {
			margin-top: 7px;
			height: 14px;
			:deep(.el-button) {
				border: none;
				display: inline-block;
				min-height: 24px;
				padding: 0;
			}
			:deep(.el-button--text) {
				color: #606266;
			}
		}
	}
	.active-num {
		color: #fff;
		font-size: 12px;
	}
	.noactive-num {
		font-size: 12px;
		color: red;
	}
	.btn {
		height: 80px;
		font-size: 14px;
		font-family: PingFangSC-Medium, PingFang SC;
		.num {
			height: 12px;
			margin-top: 10px;
		}
	}
}
</style>
