<template>
	<div class="headSignRecord">
		<div class="headContet">
			<el-form :model="form" :inline="true" @keydown.enter='searchHandler'>
				<el-form-item label="仓库名称:">
					<el-select v-model="form.warehouseId">
						<el-option label="万众智谷仓库" :value="1"></el-option>
					</el-select>
					<!-- 线 -->
				</el-form-item>
				<div class="line"></div>
				<el-form-item label="搜索内容:">
					<el-select v-model="form.searchType" style="width:120px">
						<el-option label="运单号" :value="1"></el-option>
						<el-option label="采购单号" :value="2"></el-option>
						<el-option label="签收人" :value="3"></el-option>
						<el-option label="采购员" :value="4"></el-option>
						<el-option label="收件人" :value="5"></el-option>
					</el-select>
					<el-input v-model="form.searchCopy" style="width:280px;margin-left:1px" clearable placeholder="请输入搜索内容多条可用空格隔开"></el-input>
				</el-form-item>
				<el-form-item label="关联采购单:">
					<el-select v-model="form.associatedType" style="width:120px" clearable>
						<el-option label="已关联" :value="0"></el-option>
						<el-option label="未关联" :value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="入库状态:">
					<el-select v-model="form.warehouseState" style="width:120px" clearable>
						<el-option label="已入库" :value="1"></el-option>
						<el-option label="未入库" :value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="采购单类型:">
					<el-select v-model="form.purchaseType" style="width:120px" clearable>
						<el-option label="ERP采购单" :value="1"></el-option>
						<el-option label="其他采购单" :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="签收时间:">
					<el-date-picker v-model="form.signTimeStart_signTimeEnd" type="daterange" class="date-item" unlink-panels style="width: 224px;" range-separator="→" value-format="YYYY-MM-DD" start-placeholder="开始日期" end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" style="margin-left: 10px" @click="searchHandler">查询</el-button>
					<el-button @click="reset">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!-- 导出 -->
		<div class="buttonClass">
			<el-button type="primary" @click="remark" v-permission="'batch_remark:btn'">备注</el-button>
			<el-button type="primary" @click="exportList">导出</el-button>
			<!-- <el-button type="primary" @click="test">测试</el-button> -->
		</div>
		<!-- 表格部分 -->
		<div class="pageClass">
			<el-table :data="tableData" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center" />
				<el-table-column label="签收时间" prop="signTime" width="110" align="center"></el-table-column>
				<el-table-column label="签收人" prop="neceiver" align="center"></el-table-column>
				<el-table-column label="运单号" prop="trackNum" align="center" width="180">
					<template #default="scope">
						<div>{{scope.row.name?scope.row.name:'-'}}</div>
						<el-tooltip placement="top">
							<template #content>
								<a v-copy="scope.row.trackNum" style="">复制</a>
							</template>
							<div class="skuFonts" :title="scope.row.trackNum">
								{{scope.row.trackNum}}
							</div>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column label="采购单号" prop="purchaseOrderNumber" width="180" align="center">
					<template #default="scope">
						<div v-if="!scope.row.purchaseOrderNumber" style="color:#409eff;cursor: pointer;" @click="test(scope.row)">未关联</div>
						<div>{{scope.row.purchaseOrderNumber}}</div>
					</template>
				</el-table-column>
				<el-table-column label="采购员" prop="purchaseName" align="center"></el-table-column>
				<el-table-column label="收件人" prop="consignee" align="center"></el-table-column>
				<el-table-column label="预估箱数" prop="planBox" align="center" width="120"></el-table-column>
				<el-table-column label="收货箱数" prop="alreadyBox" align="center" width="120"></el-table-column>
				<el-table-column label="包装状态" prop="packState" align="center">
					<template #default="scope">
						<div v-for="item in status" :key="item.id">
							<p v-if="item.id==scope.row.packState">{{item.value}}</p>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="包装重量(kg)" prop="boxWeight" width="150" align="center"></el-table-column>
				<el-table-column label="入库状态" prop="warehouseState" align="center">
					<template #default="scope">
						<div v-if="scope.row.warehouseState==2"></div>
						<div v-else :style="{'color':scope.row.warehouseState?'':'red'}">{{scope.row.warehouseState?'已入库':'未入库'}}</div>
					</template>
				</el-table-column>
				<el-table-column label="备注" prop="remark">
					<template #default="scope">
						<div class="remarkClass" :title="scope.row.remark">{{scope.row.remark}}</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 分页器 -->
		<div class="flex-pagination page-fixed">
			<div>
				已选<span style="color: #1890ff">{{selectGoodsId?selectGoodsId.length:0}}</span>条
			</div>
			<div>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount">
				</el-pagination>
			</div>
		</div>
		<!-- 导出弹框 -->
		<el-dialog title="导出记录" v-model="exportMsg" width="500px" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeDialogExport">
			<el-radio v-model="command" label="0">导出当前勾选</el-radio>
			<el-radio v-model="command" label="1">导出当前查询</el-radio>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="closeDialogExport">取 消</el-button>
					<el-button type="primary" @click="handleCommand">确 定</el-button>
				</span>
			</template>
		</el-dialog>
		<!-- 导出订单弹框 -->
		<progressDialog v-if="showProgress" :progress="percent" @closeEvent="showProgress=false" />
		<SelectPurase v-if="showSelectPurase" @closeSelectPurase="closeSelectPurase" :rows="rows" />
    <!-- 备注弹框 -->
		<el-dialog title="备注" width="500px" v-model="dialogRemark" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeRemark">
			<div class="headRemark">
				<el-input type="textarea" v-model="remarks" style="width:400px" placeholder="请输入备注的内容" show-word-limit maxlength="150" />
			</div>
			<!-- 底部 -->
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="closeRemark">取 消</el-button>
					<el-button type="primary" @click="submit">确 定</el-button>
				</span>
			</template>
		</el-dialog>

	</div>
</template>

<script>
	import { reactive, toRefs } from 'vue'
	import SelectPurase from './components/selectPurase.vue'
	import progressDialog from './components/progress.vue'
	import { getuuid } from '@/utils/tool.js'
	import { erpElTable } from 'hooks'
	import {
		getSignRecord,//列表
    SignBatchRemark,//批量备注
		exportSignRecord//导出
	} from '@/api/store.js'
	import { ElMessage } from 'element-plus'
	export default {
		components: {
			progressDialog,
			SelectPurase
		},
		name: 'signRecord',
		setup() {
			const state = reactive({
				createTime: [],
				rows: {},//带过去的参数
				dialogRemark: false,
				form: {
					warehouseId: 1,
					searchType: 1,
					searchCopy: '',
					searchText: '',
					warehouseState: '',
					associatedType: '',
					signTimeStart_signTimeEnd: [],
					purchaseType: '',//新增采购单类型
				},
				status: [
					{ id: 1, value: '完好无损' },
					{ id: 2, value: '轻度破损' },
					{ id: 3, value: '中度破损' },
					{ id: 4, value: '严重破损' },
				],
				selectGoodsId: [],
				//采购单
				showSelectPurase: false,
				exportMsg: false,//打开导出弹框
				command: '0',
				//进度条
				showProgress: false,
				percent: 0, //进度条进度
        remarks:''

			})
			const erpTableOpts = erpElTable(getSignRecord, state.form, {
				pagination: {
					pageSizes: [30, 100, 300, 500],
					pageSize: 30
				}
			}
			)
			//日期选择
			//表格的勾选
			function handleSelectionChange(selection) {
				state.selectGoodsId = []
				selection.forEach(v => {
					state.selectGoodsId.push(v.id)
				})
			}
			//导出
			function exportList() {
				// state.form.uuid = getuuid()
				state.command = '0'
				state.exportMsg = true
			}
			//导出确定
			function handleCommand() {
				if (state.command === '0' && !state.selectGoodsId.length) {
					ElMessage.error('请先勾选记录')
					return
				}
				let params;
				if (state.command === '1') {
					params = Object.assign({}, state.form)
				} else {
					params = {
						ids: state.selectGoodsId
					}
				}
				params.exportType = state.command
				exportSignRecord(params).then(res => {
					window.open(res.data)
				})
			}
			function reset() {
				state.form.searchType = 1,
					state.form.searchCopy = '',
					state.form.searchText = '',
					state.form.warehouseState = '',
					state.form.associatedType = '',
					state.form.signTimeStart_signTimeEnd = []
          state.form.purchaseType=''
				erpTableOpts.search()
			}
			function searchHandler() {
				let str = state.form.searchCopy.trim()
				state.form.searchText = str.replace(/\s+|，+/g, ',').replace(/\,+/g, ',')
				erpTableOpts.search()
			}
			/////////////////
			function test(row) {
				state.rows = row
				state.showSelectPurase = true
			}
			function closeSelectPurase(type) {
				state.showSelectPurase = false
				if (type) {
					erpTableOpts.search()
				}
			}
			//关闭导出弹框
			function closeDialogExport() {
				state.exportMsg = false
			}
			//备注
			function remark() {
        if(!state.selectGoodsId.length){
        return ElMessage.error('请选择签收数据')
       }
				state.dialogRemark = true
			}
			function closeRemark() {
				state.dialogRemark = false
			}
			function submit() {
       let params = {
         ids:state.selectGoodsId,
         content:state.remarks
       }
       SignBatchRemark(params).then(res=>{
         ElMessage.success('操作成功')
         closeRemark()
         erpTableOpts.search()
       })
			}
			return {
				...toRefs(state),
				...erpTableOpts,
				exportList,
				handleSelectionChange,
				reset,
				searchHandler,
				test,
				closeSelectPurase,
				closeDialogExport,
				handleCommand,
				remark,
				closeRemark,
				submit
			}
		}
	}
</script>

<style lang="scss">
.headSignRecord {
	.headContet {
		background: #fff;
		padding: 24px;
		padding-bottom: 1px;
		.line {
			margin-bottom: 16px;
			border: 1px dashed #e9e9e9;
		}
	}
	.buttonClass {
		padding: 24px 0;
		display: flex;
		justify-content: space-between;
	}
	.pageClass {
		background: #fff;
		margin-bottom: 60px;
		padding: 24px;
		.remarkClass {
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}
		.skuFonts {
			// width: 250px;
			overflow: hidden;
			white-space: nowrap; //表示不换
			text-overflow: ellipsis; //加省略号;
		}
	}
}
</style>