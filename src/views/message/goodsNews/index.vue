<template>
	<div class="headMessage">
		<!-- 第一部分 -->
		<div class="contentMessage">
			<el-form :model="form" :inline="true">
				<el-form-item label="消息状态：" class="messageStatus">
					<el-select v-model="form.isRead" placeholder="消息状态" style="width: 140px" clearable>
						<el-option label="未读" :value="0"></el-option>
						<el-option label="已读" :value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="时间范围：" style="margin-left:8px">
					<el-date-picker unlink-panels v-model="createTime" type="daterange" style="width: 280px; " range-separator="→" value-format="YYYY-MM-DD" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeDate">
					</el-date-picker>
					<el-button style="margin-left: 16px" type="primary" @click="search">查询</el-button>
					<el-button style="margin-left: 14px" type="primary" @click="reset">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!-- 第二部分 -->
		<div style="margin-top:10px">
			<span class="sortClass">排序: </span>
			<el-button type="text" @click="sortClick" style="margin-left:8px">时间<i :class="form.sortType=='desc'?'el-icon-caret-bottom':'el-icon-caret-top'"></i></el-button>
			<br />
			<el-button type="primary" @click="batchRead">批量标为已读</el-button>
			<el-button type="primary" style="margin-left: 16px" @click="delList">批量删除</el-button>
		</div>
		<!-- 表格部分 -->
		<div class="headTable">
			<el-table :data="tableData" :header-cell-style="{
          background: '#FAFAFA',
          color: '#606266'
        }" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="100" align="center" />
				<el-table-column label="内容" width="600">
					<template #default="scope">
						<div :style="{background:scope.row.isRead?'rgba(0, 0, 0, 0.25)':'#1890FF'}" class="pointClass"></div>
						<span style="margin-left:5px" @click="contentTex(scope.row.id)"> {{scope.row.title}}</span>
						<el-alert type="warning" show-icon :closable="false" class="msg" v-if="scope.row.alert">
							<template #default>
								<div class="alertClass">
                  <!-- {{scope.row.content}} -->
									<div>{{scope.row.content}}</div>
									<div class="el-icon-close" style="color:rgba(0, 0, 0, 0.65);cursor: pointer;" @click="scope.row.alert=false"></div>
								</div>

							</template>
						</el-alert>
					</template>
				</el-table-column>
				<el-table-column label="类型" align="center" prop="type" width="300">
					<template #default="scope">
						<div v-for="(item,index) in typeList" :key="index">
							<p v-if="scope.row.type==index+1">{{item}}</p>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="时间" align="center" prop="createTime" width="300">
					<template #default="scope">{{scope.row.createTime && scope.row.createTime.substring(0,scope.row.createTime.length-3)}}</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template #default="scope">
						<el-popconfirm icon="el-icon-info" iconColor="red" title="是否删除消息？" @confirm="del(scope.row.id)">
							<template #reference>
								<el-button type="text" :disabled="scope.row.isRead===0" :style="{color:!scope.row.isRead?'rgba(0, 0, 0, 0.25)':'#FD4C60'}">删除</el-button>
								<!-- <a style="color: #FD4C60;" :disabled="true">删除</a> -->
							</template>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 分页器 -->
		<div class="flex-pagination page-fixed">
			<div>
				<el-checkbox v-model="checkedList">
					已选 <span style="color: #1890ff">{{selectGoodsId?selectGoodsId.length:0}}</span>条
				</el-checkbox>
			</div>
			<div>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import { ElMessage, ElMessageBox } from 'element-plus'
	import { useStore } from 'vuex'
	import { erpElTable } from 'hooks'
	import { reactive, toRefs, onMounted, watch, toRef } from 'vue'
	import {
		getMessageList, //消息列表
		readyAll, //批量标记为已读
		delALL, // 消息批量删除
	} from '@/api/goods/shop.js'
	export default {
		setup(props, { emit }) {
			const store = useStore()
			const state = reactive({
				checkedList: false,
				createTime: [],
				form: {
					isRead: 0,
					start: '',
					end: '',
					sortType: 'desc'
				},
				selectGoodsId: [],
				typeList: ['申请报价', '修改报价', '报价结果', '搁置/还原', '商品信息', '商品渠道', '商品合并', '商品侵权', '财务消息', '采购消息', '收货异常', '店铺消息']
			})

			//点击内容条的前面的蓝色点变色事件
			function contentTex(id) {
				readyAll({ ids: [id] }).then(res => {
					erpTableOpts.tableData.value.forEach(item => {
						if (item.id == id) {
							item.isRead = 1
							item.alert = true
						} else {
							item.alert = false
						}
					})
					store.dispatch('menu/getMsgNum')
				})

			}
			//选择框事件
			function handleSelectionChange(selection) {
				state.selectGoodsId = []
				// selection=selection.filter(item=>{
				//     return item.isRead!=0
				// })
				selection.forEach(v => {
					state.selectGoodsId.push(v.id)
				})
				state.checkedList = state.selectGoodsId && state.selectGoodsId.length ? true : false
			}
			/////
			//   初始的事件获取列表
			const erpTableOpts = erpElTable(getMessageList, state.form, {
				dataFilter: res => {
					res.forEach(item => {
						item.alert = false
					})
					return res
				}
			})
			//日期选择
			function changeDate(data) {
				if (data) {
					state.form.start = data[0] + ' 00:00:00'
					state.form.end = data[1] + ' 23:59:59'
				} else {
					state.form.start = state.form.end = ''
				}
			}
			//排序
			function sortClick() {
				state.form.sortType = state.form.sortType == 'desc' ? 'asc' : 'desc'
				erpTableOpts.search()
			}
			//批量标记为已读
			function batchRead() {
				if (!state.selectGoodsId.length) {
					return ElMessage.error('请选择消息')
				}
				ElMessageBox.confirm('是否批量标记为已读?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					closeOnClickModal: false,
					closeOnPressEscape: false,
					type: 'warning',
				}).then(() => {
					readyAll({ ids: state.selectGoodsId }).then(res => {
						ElMessage.success('修改成功')
						erpTableOpts.search()
					})
				})

			}
			//单选删除
			function del(val) {
				delALL({ ids: [val] }).then(res => {
					ElMessage.success('删除成功')
					erpTableOpts.search()
				})
			}
			//批量删除
			function delList() {
				if (!state.selectGoodsId.length) {
					return ElMessage.error('请选择消息')
				}
				ElMessageBox.confirm('是否批量删除消息?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					closeOnClickModal: false,
					closeOnPressEscape: false,
					type: 'warning',
				}).then(() => {
					delALL({ ids: state.selectGoodsId }).then(res => {
						ElMessage.success('删除成功')
						erpTableOpts.search()
					})

				})
			}
			//重置按钮
			function reset() {
				state.form.isRead = 0
				state.form.start = ''
				state.form.end = ''
				state.createTime = []
				erpTableOpts.search()
			}
			return {
				...toRefs(state),
				...erpTableOpts,
				contentTex,
				handleSelectionChange,
				changeDate,
				sortClick,
				batchRead,
				del,
				delList,
				reset
			}
		}
	}
</script>

<style lang="scss">
.aaaa {
	display: none !important;
}
</style><style lang="scss" scoped>
.headMessage {
	///////////////////
	.sortClass {
		color: #606266;
	}
	.dropdownMenu {
		:deep(.el-popper.is-pure) {
			display: none !important;
		}

		:deep(.el-input__suffix) {
			display: none !important;
		}
	}

	///////////////////
	.contentMessage {
		padding: 24px 30px;
		padding-bottom: 1px;
		background: #fff;

		:deep(.el-input--suffix .el-input__inner) {
			height: 32px;
		}

		:deep(.el-form-item__label) {
			padding: 0;
		}

		:deep(.el-range-editor--small .el-range-separator) {
			width: 38px;
		}
		.messageStatus {
			:deep(.el-input__icon) {
				position: relative;
				top: -4px;
			}
		}
	}

	.headTable {
		padding: 24px 30px;
		background: #fff;
		margin-top: 16px;
		margin-bottom: 60px;
  //  padding-bottom: 80px;
		.pointClass {
			width: 6px;
			height: 6px;
			display: inline-block;
			border-radius: 50px;
			// background: #1890FF;
			margin-bottom: 2px;
		}
		.alertClass {
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #1890ff;
      z-index: 9999;
		}
		:deep(.el-alert__content) {
			width: 100%;
		}
    
		:deep(.el-table__row:hover > td) {
			background-color: transparent !important;
		}
		:deep(.el-alert--warning.is-light) {
			background-color: #e6f7ff;
			color: rgba(0, 0, 0, 0.65);
		}

		:deep(.el-alert--warning.is-light) {
			color: #1890ff;
		}
		:deep(.el-icon-warning.el-alert__icon) {
			font-size: 16px;
			width: 16px;
			margin-top: 4px;
		}
		:deep(.el-table) {
			overflow: visible;
      
		}
   :deep(.el-table .el-table__cell){
     z-index: auto;
   }
		:deep(.el-table__body-wrapper) {
			overflow: visible;
		}

		// :deep(.el-button){
		//     color: #FD4C60;
		// }
	}
}

.msg {
	position: absolute;
	z-index: 99999;
	top: 50%;
	:deep(.el-icon-close:before) {
		font-size: 16px;
	}
}
</style>
