
<template>
	<div class="headDepartment">
		<div class="headContainer">
			<div class="headContent">
				<!-- 表头输入框 -->
				<el-input v-model="query.keyword" class="head-input" clearable placeholder="请输入部门名称" style="width: 200px" />
        <span class="statusClass">状态：</span>
        <el-select v-model="query.status" clearable style="width:150px">
          <el-option value="0" label="开启"></el-option>
          <el-option value="1" label="关闭"></el-option>
        </el-select>
				<!-- 搜索和重置 -->
				<el-button style="margin-left: 10px" type="success" icon="el-icon-search" size="small" @click="search()">搜索</el-button>
				<el-button type="warning" icon="el-icon-refresh" size="small" @click="reset">重置</el-button>
			</div>
		</div>
		<!-- 按钮 -->
		<div style="display: flex; margin-bottom: 20px" class="buttonStyle">
			<slot name="left" />
			<el-button size="small" type="primary" icon="el-icon-plus" @click="add" v-if="authPath('/v1/dept/inDept')">
				新增
			</el-button>
			<el-button size="small" type="danger" icon="el-icon-delete" :disabled="multipleSelection.length == 0" @click="deleteList" v-if="authPath('/v1/dept/ddByIds')">
				删除
			</el-button>
		</div>
		<!-- 表格渲染 -->
		<div class="pageTable">
			<el-table :ref="formRef" row-key="deptId" :data="data" default-expand-all :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" @select-all="selectAll" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" :selectable="selectable" />
				<el-table-column :show-overflow-tooltip="true" label="部门名称" width="400px" prop="deptName" />
				<el-table-column prop="status" label="状态" align="center">
					<template #default="scope">
						<div class="switchStatus">
							<el-switch :disabled="scope.row.disable" v-model="scope.row.status" active-color="#1890FF" inactive-color="#C0C0C0"></el-switch>
							<div class="statusMasker" v-show="!scope.row.parentId == 0" @click="
                changeStatus(
                  scope.row.deptId,
                  scope.row.deptName,
                  scope.row.status,
                  scope
                )
              "></div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="managerName" label="部门负责人" width="200px" align="center" />
				<el-table-column prop="createTime" label="创建日期" width="200px" align="center" />
				<el-table-column label="操作" align="center">
					<template #default="scope">
						<el-button size="small" type="primary" icon="el-icon-edit" :disabled="scope.row.disable" v-if="authPath('/v1/dept/upDept')" @click="edit(scope,scope.row.deptId)" />
						<el-button type="danger" icon="el-icon-delete" size="small" :disabled="scope.row.disable" v-if="authPath('/v1/dept/ddByIds')" @click="del(scope.row.deptId, scope)" />
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 状态修改 -->
		<div class="dialogStatus">
			<el-dialog title="提示" v-model="statusChangeShow" width="30%" :before-close="closeFormStatusChangeFn" :close-on-click-modal="false">
				<div style="margin-bottom:10px">
					<span class="el-icon-warning"></span>
					<span>{{statusChangeUserTitle}}</span>
				</div>
				<div class="tipsContent" v-if="showInput">
					<el-form ref="form">
						<el-form-item label="备注:">
							<el-input type="textarea" maxlength="140" show-word-limit v-model="statusChangeMessage" />
						</el-form-item>
					</el-form>
				</div>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="closeFormStatusChangeFn">取 消</el-button>
						<el-button type="primary" @click="sureChangeStatusFn">确 定</el-button>
					</span>
				</template>
			</el-dialog>
		</div>
		<!-- 删除的弹框 -->
		<CancelModel v-if="dialogRemarks" @closeDialog="closeRemarks" @handOkRemarks="handOkRemark" :message="message" :cancelList="cancelList" />
		<!-- 弹框 -->
		<EditDpartment v-if="show" :editStatus="editStatus" :routerType="routerType" :row="row" @close="close" />

	</div>
</template>
<script>
	import { ElMessage, ElMessageBox } from 'element-plus'
	import { resetForm } from '@/utils/tool.js'
	import { reactive, toRefs, ref, toRaw } from 'vue'
	import EditDpartment from '@/views/configure/systemManagement/department/components/aditDepartment.vue'
	import CancelModel from '@/views/configure/systemManagement/menu/components/cancelModel.vue'
	import { TableTools, toTree, treeToArr } from '@/utils/tool.js'
	import {
		getDepartment, //查询部门信息列表
		getDepartmentList,//查询部门列表(tree)
		deleteDepartment, //删除部门
		updataDepartment, //修改部门
		checkDepartment,//部门删除的校验
		checkDeptStuts,//部门状态关闭校验
		updateDepartmentStatus,// 修改部门状态
	} from '@/api/user.js'
	import { onMounted, watch } from 'vue'
	export default {
		name: 'Department',
		components: {
			EditDpartment,
			CancelModel
		},
		setup() {
			const routerType = ref('')
			const state = reactive({
				check: '', //用于校验是否有用户的标识
				checkStatus: '1',//开关标识
				editStatus: '1',//点击编辑时候带过去判断有没有用户的标识
				statusTexts: '',//保存校验状态的提示文字
				statusButton: false,
				showInput: false,
				buttonDisabled: false,
				selectionAll: [],
				message: '此操作将删除当前所选中的部门，是否继续?',
				cancelList: false, //点击删除时候判断删除输入框是否显示
				show: false,
				statusList: '', //存储点击的对象用于下一步确认时候校验弹框
				statusChangeShow: false, //确认是否开启关闭列表状态提示框显示/隐藏
				statusChangeUserTitle: '', //选择修改状态的用户
				statusChangeUser: '', //选择修改状态的用户(flag)
				statusChangeMessage: '', //列表状态提示框备注
				row: {}, //编辑带过去的数据
				cancelShow: false,
				dialogRemarks: false,
				cancelId: '',
				checkedKeys: false, //是否全部选中
				data: [],
				multipleSelection: [],
				query: {
					keyword: '',
          status:'0'
				},
				cancelType: '', //控制点的是批量还是单选
				isCheckedAll: false,
				select: null
			})
			// 取消 列表中 修改 状态的提示弹框
			const closeFormStatusChangeFn = () => {
				state.statusChangeShow = false
				state.statusChangeMessage = ''
			}
			////开关状态
			const changeStatus = (id, name, status, scope) => {
				state.statusChangeMessage = ''
				state.statusList = scope
				state.statusButton = status
				state.statusChangeShow = true
				state.statusChangeUser = id
				let params = {
					deptIds: [state.statusChangeUser]
				}

				// 开启时不校验
				if (status) {
					checkDeptStuts(params).then(res => {
						state.showInput = true
						state.checkStatus = '1'
						let statusText = status ? '停用' : '启用'
						state.statusTexts = statusText
						state.statusChangeUserTitle =
							'此操作将' + statusText + '“' + name + '”，是否继续?'
					}).catch(err => {
						clearTimeout(err.timeId)
						state.checkStatus = '2'
						state.showInput = false
						state.statusChangeUserTitle =
							name + '部门下还存在未处理数据，请处理后再进行操作'
					})
				} else {
					state.showInput = true
					let statusText = status ? '停用' : '启用'
					state.checkStatus = '1'
					state.statusTexts = statusText
					state.statusChangeUserTitle =
						'此操作将' + statusText + '“' + name + '”，是否继续?'
				}
			}
			//弹框确定修改状态
			const sureChangeStatusFn = () => {
				if (
					state.checkStatus == '2'
				) {
					state.statusChangeShow = false
				} else {
					console.log('修改开关状态');
					loopStatus(state.data, state.statusChangeUser)
					function loopStatus(data, id) {
						data.forEach((item, index) => {
							if (item.deptId == id) {
								if (item.status) {
									item.status = false
								} else {
									item.status = true
								}
								return (state.statusChangeShow = false)
							}
							if (item.children) {
								loopStatus(item.children, id)
							}
						})
					}
					//调接口
					let params = {
						deptId: state.statusList.row.deptId,
						deptName: state.statusList.row.deptName,
						status: state.statusList.row.status ? '0' : '1',
						parentId: state.statusList.row.parentId,
						remark: state.statusChangeMessage
					}
					console.log(params, 'params')
					updateDepartmentStatus(params).then(res => {
						ElMessage.success(`${state.statusTexts}成功`)
						init()
					})
					/////////
				}
			}
			//页面初始进入的时候
			const init = () => {
				formR.clearSelection()
				let params = {
					keyword: state.query.keyword,
          status:state.query.status
				}
				getDepartment(params).then(res => {
					console.log(res.data, 5656)
					if (res.data) {
						loop(res.data)
						function loop(data) {
							data.forEach(item => {
								if (item.parentId == 0) {
									item.disable = true
								}
								if (item.status == '0') {
									item.status = true
								} else {
									item.status = false
								}
								if (item.children && item.children.length) {
									loop(item.children)
								}
							})
						}
					}
					state.data = res.data
				})
			}
			const close = val => {
				console.log(val)
				state.show = false
				if (val) {
					init()
				}

			}
			//表格的多选框
			const handleSelectionChange = selection => {
				state.selectionAll = selection
				console.log(selection, 'selection123')
				state.multipleSelection = []
				selection.forEach(v => {
					state.multipleSelection.push(v.deptId)
				})
			}

			let formR = ''
			const formRef = el => {
				formR = el
			}
			watch(state.selectionAll, value => {
				console.log(value, '监听')
			})

			//选择全部
			function selectAll(selection) {
				console.log(selection, 666)
				state.selectionAll = selection
				state.isCheckedAll = !state.isCheckedAll
				// console.log(state.isCheckedAll)
				if (state.isCheckedAll) {
					loop(state.data)
					function loop(data) {
						data.forEach((item, index) => {
							state.multipleSelection.push(item.deptId)
							if (item.children) {
								loop(item.children)
							}
						})
					}
				} else {
					console.log('清空')
					state.multipleSelection = []
					state.selectionAll = []
				}
				state.select.selectTableAll(state.data, state.isCheckedAll)
			}

			// 批量删除
			const deleteList = () => {
				state.cancelType = '1'
				// let flag=false
				console.log(state.selectionAll, '898989')
				// if ( state.selectionAll.length) {
				for (let i = 0; i < state.selectionAll.length; i++) {
					const item = state.selectionAll[i]
					if (item.children && item.children.length && item.deptId !== 100) {
						ElMessageBox({
							title: '提示',
							message: '当前所选中的部门下还有未处理的数据，请处理后再进行删除操作',
							type: 'warning'
						})
						break
					} else if (item.deptId !== 100) {
						//校验
						let params = {
							deptIds: state.multipleSelection
						}
						checkDepartment(params)
							.then(res => {
								if (res.code == 200) {
									state.check = '1'
									state.cancelList = false
									state.message = '此操作将删除当前所选中的部门，是否继续?'
									state.dialogRemarks = true
								}
							}).catch(err => {
								clearTimeout(err.timeId)
								ElMessageBox({
									title: '提示',
									message: err.message,
									type: 'warning'
								})

							})

					}
				}
			}
			//表格的删除
			const del = (val, scope) => {
				state.cancelType = '2'
				state.cancelId = val
				console.log(state.cancelId, '删除id');
				let params = {
					deptIds: [state.cancelId]
				}
				checkDepartment(params)
					.then(res => {
						if (res.code == 200) {
							state.cancelList = false
							state.message = '此操作将删除当前所选中部门，是否继续?'
							state.dialogRemarks = true
						}
					}).catch((err) => {
						clearTimeout(err.timeId)
						ElMessageBox({
							title: '提示',
							message: err.message,
							type: 'warning'
						})

					})


			}
			///点击弹框确定
			const handOkRemark = val => {
				//如果有子级就关闭弹框
				let deptIds = []
				if (state.cancelType == '2') {
					deptIds = [state.cancelId]
				} else {
					deptIds = state.multipleSelection
				}
				deleteDepartment({ deptIds, remark: val })
					.then(res => {
						//   deptIds.forEach((item, index) => {
						//     loop(state.data, item)
						//   })
						init()
						state.dialogRemarks = false
						ElMessage.success('删除成功')
					})

			}
			//递归开始
			function loop(data, id) {
				data.forEach((item, index) => {
					if (item.deptId == id) {
						data.splice(index, 1)
						return
					}
					if (item.children) {
						loop(item.children, id)
					}
				})
			}
			// 递归结束
			//关闭备注的弹框事件(子传父)
			const closeRemarks = () => {
				state.dialogRemarks = false
			}
			//点击编辑按钮
			const edit = async (val, id) => {
				state.row = val.row

				routerType.value = 1
				let params = {
					deptIds: [id]
				}
				await checkDepartment(params).then(res => {
					state.editStatus = '1'
				}).catch(err => {
					clearTimeout(err.timeId)
					state.editStatus = '2'
				})
				state.show = true
			}
			//点击新增按钮
			const add = () => {
				state.show = true
				routerType.value = 2
			}
			//点击搜索时候
			const search = () => {
				init()
			}
			//重置方法
			const reset = () => {
				state.query.keyword = ''
        state.query.status = '0'
				init()
			}
			//是否可选
			const selectable = e => {
				return !e.disable
			}
			onMounted(() => {
				state.select = new TableTools(formR)
				init()
			})
			return {
				...toRefs(state),
				handleSelectionChange,
				del,
				search,
				edit,
				add,
				close,
				selectAll,
				routerType,
				formRef,
				handOkRemark,
				closeRemarks,
				deleteList,
				selectable,
				reset, //重置
				changeStatus, //开关状态
				sureChangeStatusFn, // 确定修改状态
				closeFormStatusChangeFn // 取消 列表中 修改 状态的提示弹框
			}
		}
	}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
	.headDepartment {
		.dialogStatus {
			.el-icon-warning {
				color: #f5b70d;
				font-size: 20px;
			}
			:deep(.el-dialog__body) {
				padding: 16px 24px;
				padding-top: 0px;
			}
		}
		.headContainer {
			.head-input {
				margin-top: -1px;
			}
			.headContent {
				display: flex;
				background: #fff;
				padding: 20px 30px;
        .statusClass{
          line-height: 32px;
          margin-left: 19px;

        }
			}
		}
		.pageTable {
			background-color: #fff;
			border-radius: 2px 2px 2px 2px;
			padding: 20px 25px;
		}
		.el-button {
			height: 32px;
		}
		.buttonStyle {
			margin-top: 20px;
			.el-button {
				height: 32px;
			}
		}
	}
	.switchStatus {
		position: relative;
		.statusMasker {
			position: absolute;
			width: 30%;
			height: 100%;
			top: 0;
			right: 35%;
			cursor: pointer;
		}
	}
</style>


