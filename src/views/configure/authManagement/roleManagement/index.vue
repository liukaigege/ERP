<!--
 * @Descripttion: 角色管理
 * @version: 1.0
 * @Author: 王新国
 * @Date: 2021-07-07 11:28:27
 * @LastEditors: 王新国
 * @LastEditTime: 2021-07-14 20:07:44
-->
<template>
	<div class="common-layout">
		<el-container>
			<el-header style="padding:0 20px;height:55px;">
				<!-- <router-link to="/configure/authManagement/addRole"> -->
				<el-button icon="el-icon-plus"  type="primary" @click="changeRoleFn()" v-if="menuAuthPathStatus">新增</el-button>
				<!-- </router-link> -->
				<el-button icon="el-icon-delete"  type="danger" :disabled="chooseArr.length>0?false:true" @click="deleteFn(false)" v-if="authPath('/v1/role/drByIds')">删除</el-button>
			</el-header>
			<el-main style="background-color: #fff;
        box-sizing: border-box;
        padding: 20px;">
				<!-- 表单内容 -->
				<el-table ref="multipleTable" :data="tableData"  style="width: 100%" @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55" align="center" :selectable="selectable"> </el-table-column>
					<el-table-column prop="roleName" label="角色名称" width="150" align="center"> </el-table-column>
					<el-table-column prop="createByUser" label="创建人" width="150" align="center"> </el-table-column>
					<el-table-column prop="roleDataScope" label="数据权限" width="200" align="center">
						<template #default='{row}'>
							<div>
								<el-tooltip class="item" append-to-body effect="light" :content="row.dataScopeDesc" placement="right">
                                    <template #content >
                                        <ul class="scope-data-box" v-if="row.dataScopeDesc"> 
                                            <li v-for="item in row.dataScopeDesc?.split('\n')" :key= 'item'>
                                                {{item}}
                                            </li>
                                        </ul>
                                        <div v-else>无</div>
                                    </template>
									<div class='look-content'>查看</div>
								</el-tooltip>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="remark" label="角色描述" align="center" show-overflow-tooltip :min-width="250"></el-table-column>
					<el-table-column prop="createTime" label="创建日期" width="200" align="center"> </el-table-column>
					<el-table-column prop="status" label="操作" width="300" align="center">
						<template #default="scope">
							<el-button type="primary" icon="el-icon-edit" :data-id="scope.row.status" size="small"  @click="changeRoleFn(scope.row.roleId)" :disabled="!scope.row.canChange" v-if="menuAuthPathStatus"></el-button>
							<el-button type="danger" icon="el-icon-delete" :data-id="scope.row.status" size="small" :disabled="!scope.row.canChange" @click="deleteFn(scope.row.roleId)" v-if="authPath('/v1/role/drByIds')"></el-button>
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页器 -->
				<el-pagination class="rightBottom" style="margin-top: 15px" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="paginationArr" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
				</el-pagination>
			</el-main>
		</el-container>
		<!-- 删除提示 -->
		<el-dialog :title="deleteTitle" v-model="deleteTipsShow" width="30%" :before-close="closeDeleteTipsFn">
			<div class="tipsContent">
				<el-form ref="form">
					<el-form-item label="备注:">
						<el-input type="textarea" maxlength="140" show-word-limit v-model="deleteTipsMessage"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="closeDeleteTipsFn" >取 消</el-button>
					<el-button type="primary"  @click="sureDeleteFn">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
<script>
	import { reactive, toRefs, ref, toRaw, getCurrentInstance, computed } from 'vue'
	import { ElMessageBox, ElMessage } from 'element-plus';
	import { useRouter } from 'vue-router'
	import { useStore } from 'vuex'
	import { checkRoleInfo, deleteRole, checkIsDelete } from '@/api/user.js'
	import { authPath, menuAuthPath } from '@/utils/hooks'
	export default {
		components: {},
    name: 'Rolemanagement',
		setup(props) {
			const { proxy } = getCurrentInstance()
			let menuAuthPathStatus = menuAuthPath('/configure/authManagement/addRole')
			let router = useRouter()
			let store = useStore()
			let userInfo = computed(() => store.state.user.userInfo)
			const sideBarWidth = computed(() => store.state.menu.sideBarWidth)
			const state = reactive({
				menuAuthPathStatus,
				tableData: [],
				chooseArr: [],//选择的列表选项
				deleteTitle: '提示',//删除提示弹框
				deleteTipsShow: false,//删除提示框显示/隐藏
				deleteSingleId: '',//删除单条数据标识
				deleteTipsMessage: '',//删除角色的备注
				currentPage: 1,//当前页
				pageSize: 10,//每页条数
				paginationArr: [10, 20, 30, 50], //分页每页选择条数默认数据
				totalNum: 0,//总条数
				roleDataScope: [{
					id: 1,
					title: '全部数据权限'
				}, {
					id: 2,
					title: '自定义数据权限'
				}, {
					id: 3,
					title: '本部门及以下数据权限'
				}, {
					id: 4,
					title: '本部门数据权限'
				}, {
					id: 5,
					title: '仅本人数据权限'
				}]
			})
			const changeRoleFn = (roleId) => {
				if (roleId == 1) return ElMessage.warning({ message: '无法操作超级管理员角色' })
				router.push({
					path: '/configure/authManagement/addRole',
					query: {
						roleId
					}
				})
			}
			// 查询角色列表
			function checkRoleInfoFn() {
				checkRoleInfo({
					page: {
						pageNo: state.currentPage,
						pageSize: state.pageSize
					}
				}).then(res => {
					res.data.dataList.forEach(v => {
						v.roleDataScope = state.roleDataScope.filter(item => item.id == v.dataScope)[0].title
						if (userInfo.value.roleIds && userInfo.value.roleIds.length) {
							if (userInfo.value.roleIds.filter(item => item == v.roleId).length) {
								v.canChange = false
							} else {
								v.canChange = true
							}
						} else {
							v.canChange = true
						}
					})
					state.tableData = res.data.dataList
					state.totalNum = res.data.page.totalCount || 0
				})
			}
			checkRoleInfoFn()

			//复选框禁用
			function selectable(row, index) {
				return row.canChange
			}

			// 选择
			const handleSelectionChange = val => {
				state.chooseArr = val
			}
			// 删除选择项
			const deleteFn = id => {
				//校验能否删除
				let data = {}
				if (id) {
					data.roleIds = [id]
					if (id == 1) return ElMessage.warning({ message: '无法操作超级管理员角色' })
				} else {
					data.roleIds = []
					state.chooseArr.forEach(v => data.roleIds.push(v.roleId))
				}
				checkIsDelete(data)
					.then(res => {
						if (res.code == 200) {
							if (res.data) {
								if (id) {
									// 删除单条数据
									state.deleteSingleId = id
									state.deleteTitle = '此操作将删除该角色，是否继续？'
								} else {
									state.deleteTitle = '此操作将删除所选中的角色，是否继续？'
								}
								state.deleteTipsMessage = ''
								state.deleteTipsShow = true
							} else {
								ElMessage.warning({ message: res.message });
							}
						} else {
							ElMessage.warning({ message: res.message });
						}
					})
					.catch(res => {
						if (res.code == 100008) {
							ElMessageBox.confirm('当前所选中的角色下还有未处理的数据，请处理后再进行删除操作', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning',
							})
						} else {
							ElMessage.error({ message: res.message })
						}
					})

			}
			//关闭提示框
			const closeDeleteTipsFn = () => {
				state.deleteTipsShow = false
				state.deleteSingleId = ''
			}
			// 确定删除
			const sureDeleteFn = () => {
				let data = { remark: state.deleteTipsMessage }
				if (state.deleteSingleId) {
					data.roleIds = [state.deleteSingleId]
				} else {
					data.roleIds = []
					state.chooseArr.forEach(v => data.roleIds.push(v.roleId))
				}
				deleteRole(data).then(res => {
					if (res.code == 200) {
						checkRoleInfoFn()
						ElMessage.success({
							message: '删除成功',
						});
						state.deleteTipsShow = false
					} else {
						ElMessage.warning({
							message: res.message,
						});
					}
				})
			}
			// 分页器 选择页面函数
			const handleSizeChange = val => {
				// console.log(`每页 ${val} 条`)
				state.pageSize = val
				state.currentPage = 1
				checkRoleInfoFn()
			}
			// 分页当前页函数
			const handleCurrentChange = val => {
				// console.log(`当前页: ${val}`)
				state.currentPage = val
				checkRoleInfoFn()
			}
			return {
				...toRefs(state),
				handleSelectionChange,
				closeDeleteTipsFn,// 关闭提示框
				sureDeleteFn,// 确定删除
				deleteFn,// 删除选择项
				handleSizeChange,// 分页器 选择页面函数
				handleCurrentChange,// 分页当前页函数
				changeRoleFn,
				selectable,
				sideBarWidth
			}
		},
	}
</script>
<style lang="scss" scoped>
	:deep(.el-main) {
		padding: 0;
	}
	:deep(.el-pagination__total) {
		margin-left: 15px;
	}
	:deep(.el-table) {
		height: 68vh;
		overflow: auto;
	}
	:deep(.el-pagination) {
		text-align: right;
	}
	
	:deep(.el-table::before) {
		height: 0;
	}
    .look-content {
        cursor: pointer;
        color: #409eff;
    }
    .scope-data-box {
        li{
            line-height: 2;
        }
    }
	.rightBottom {
		position: fixed;
		bottom: 0;
		box-sizing: border-box;
		padding: 10px;
		background-color: #fff;
    justify-content: flex-end;
		left: v-bind(sideBarWidth);
		width: calc(100% - v-bind(sideBarWidth));
	}
	.box {
		width: 400px;

		.top {
			text-align: center;
		}

		.left {
			float: left;
			width: 60px;
		}

		.right {
			float: right;
			width: 60px;
		}

		.bottom {
			clear: both;
			text-align: center;
		}

		.item {
			margin: 4px;
		}

		.left .el-tooltip__popper,
		.right .el-tooltip__popper {
			padding: 8px 10px;
		}
	}
</style>
