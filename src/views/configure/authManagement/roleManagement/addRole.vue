<template>
	<div class="role-warpper">
		<div class="box">

			<div class="content">
				<el-form :model="commitParams" :rules="rules" ref="formRef" :label-width="100">
					<el-row>
						<el-col :span="12">
							<el-form-item label="角色名称：" prop="roleName">
								<el-input v-model="commitParams.roleName" maxlength="16" placeholder="请输入角色名称"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="描述信息：">
								<el-input type="textarea" v-model="commitParams.remark" placeholder="请输入描述信息" :autosize="{ minRows: 4, maxRows: 4 }" maxlength="140" show-word-limit></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>

		</div>
		<div class="box">
			<div class="title">权限设置</div>
			<div class="content">
				<div class="item-box">
					<div class="left-content">
						<div class="content-title">菜单选择</div>
						<div class="last-content">
							<el-tree :data="menuData" ref="menuTree" :props="{label: 'label',children: 'children'}" show-checkbox node-key="menuId" check-strictly default-expand-all :expand-on-click-node="false" @check-change="handleMenuClick">
								<template #default="{ data }">
									<div>
										<div>{{data.menuName}}</div>
										<btn-box :id='data.menuId' :btnList='btnList' :ids='commitParams.menuIds' @getBtnIds='getIds' @setScope="setScope"></btn-box>
									</div>
								</template>
							</el-tree>
						</div>
					</div>
					<div class="mid-content">
						<div class="content-title">数据范围设置</div>
						<div class="last-content">
							<el-form ref="dataScopeRef" label-width="0" :model="commitParams.menuDs">
								<div class="last-top">
									<el-checkbox v-model="isCheckAll" @change="checkAll">全选</el-checkbox>
									<el-button type="primary" @click="openDialog">批量设置</el-button>
								</div>
								<div v-for="(item,index) in commitParams.menuDs" :key='item.menuId'>
									<el-form-item style="margin-bottom: 0">
										<el-checkbox v-model="item.isChecked" :true-label="item.menuId">{{item.title}}</el-checkbox>
									</el-form-item>
									<div class="grey-box">
										<el-form-item :prop="index+ '.dataScope'" :rules="{  required: true,message: '请选择数据范围',trigger: 'change'}">
											<el-select v-model="item.dataScope" placeholder="请选择数据范围" style="width: 100%" clearable>
												<el-option v-for="item in scopeList" :key="item.dataScope" :label="item.dataScopeName" :value="item.dataScope">
												</el-option>
											</el-select>
										</el-form-item>
										<el-form-item v-if="item.dataScope ==2" :prop="index+ '.deptIds'" :rules="{required: true, message: '请选择范围',trigger: 'change'}">
											<el-select-tree class="my-select" :treeProps="{value: 'deptId',  label: 'deptName',children: 'children'}" :data="deptData" checkStrictly @ok="item.deptIds= $event" :multiple="true" :defaultCheckedKeys="item.deptIds" defaultExpandAll></el-select-tree>
										</el-form-item>
									</div>
								</div>
							</el-form>
						</div>
					</div>
					<div class="right-content">
						<div class="content-title">列表展示字段选择</div>
						<div class="last-content">
							<ul>
								<li v-for="item in wordList" :key="item.menuId">
									<field-box :scopeItem="item" @getBtnIds='getIds' :id="item.menuId" :ids="commitParams.menuIds"></field-box>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
		<erp-footer>
			<template #default>
				<div class="footer">
					<el-button @click="cancel">取消</el-button>
					<el-button type="primary" @click="commit">提交</el-button>
				</div>
			</template>
		</erp-footer>
		<batch-set-dialog :scopeList="scopeList" :deptData="deptData" v-if="showBatchSetDialog" @close="showBatchSetDialog = false" @batchSetting="batchSetting"></batch-set-dialog>
	</div>
</template>


<script>
	import { toRefs, reactive, ref, computed, nextTick } from 'vue'
	import { useRouter, useRoute } from 'vue-router'
	import { useStore } from 'vuex'
	import { toTree } from 'tool'
	import erpFooter from '@/components/erpFooter/index.vue'
	import { getMenus, addRole, changeRole, getDepartmentList, selectDataScope } from '@/api/user.js'
	import fieldBox from './components/FieldBox.vue'
	import btnBox from './components/BtnBox.vue'
	import ElSelectTree from '@/components/elSelectTree/index.vue'
	import BatchSetDialog from './components/BatchSetDialog.vue'
	export default {
		components: { erpFooter, fieldBox, btnBox, ElSelectTree, BatchSetDialog },
		setup(props) {
			const store = useStore()
			const router = useRouter()
			const route = useRoute()
			let menuTree = ref(null)
			let formRef = ref(null)
			let dataScopeRef = ref(null)
			let treeIds = []  // 菜单id
			let MFids = []  // 按钮和字段id
			let rules = {
				roleName: { required: true, message: '请输入角色名称', trigger: 'blur' },
			}
			let state = reactive({
				showBatchSetDialog: false,
				dataScope: '',
				menuData: [],
				deptData: [],
				wordList: [],
				isCheckAll: false,
				checkedIds: [],
				commitParams: {
					menuIds: [],
					menuDs: [],
					roleName: '',
					remark: ''
				}
			})

			let scopeList = [
				{
					dataScope: '1',
					dataScopeName: '全部数据权限'
				},
				{
					dataScope: '2',
					dataScopeName: '自定义数据权限'
				},
				{
					dataScope: '3',
					dataScopeName: '本部门及以下数据权限'
				},
				{
					dataScope: '4',
					dataScopeName: '本部门数据权限'
				},
				{
					dataScope: '5',
					dataScopeName: '仅本人数据权限'
				}
			]
			let fieldList = ref([])
			let btnList = ref([])
			let DsList = []
			let menuList = []
			let userInfo = computed(() => store.state.user.userInfo)
			scopeList = scopeList.filter(v => v.dataScope >= userInfo.value.dataScope)
			let roleId = route.query.roleId
			getMenus({ keyword: '', start: '', end: '', menuType: '' }).then(res => {
				res.data.forEach(item => {
					if (userInfo.value.menus.every(menu => menu.menuId !== item.menuId)) item.disabled = true
					if (item.menuType == 'F') btnList.value.push(item)
					if (item.menuType == 'D') fieldList.value.push(item)
				})
				if (roleId) { // 编辑
					selectDataScope({ roleId: route.query.roleId }).then(({ data }) => {
						let { menuIds, roleName, remark } = data
						state.commitParams = { menuIds, roleName, remark }
						state.commitParams.menuDs = []
						DsList = data.menuDs || []
						state.menuData = toTree(res.data.filter(item => item.menuType == 'M' || item.menuType == 'C'), 'menuId')
						nextTick(() => {
							menuTree.value.setCheckedKeys(data.menuIds)
							setTimeout(() => {  // 回显
								state.commitParams.menuDs.sort((a, b) => b.menuId - a.menuId)
								DsList.forEach(ds => {
									let obj = state.commitParams.menuDs.find(item => ds.menuId == item.menuId)
									if (obj) obj.dataScope = ds.dataScope, obj.deptIds = ds.deptIds?.map(item => Number(item)) || []
								})
							})
						})
					})
				} else {
					state.menuData = toTree(res.data.filter(item => item.menuType == 'M' || item.menuType == 'C'), 'menuId')
				}
				menuList = res.data
			})

			// 获取部门下拉框
			getDepartmentList().then(res => {
				state.deptData = res.data
			})
			function checkAll(v) {
				state.commitParams.menuDs.forEach(item => item.isChecked = v)
			}
			function openDialog() {
				state.showBatchSetDialog = true
			}
			function batchSetting(obj) {
				let arr = state.commitParams.menuDs.filter(item => item.isChecked)
				arr.forEach(item => {
					item.dataScope = obj.dataScope
					item.deptIds = obj.deptIds
				})
			}
			function getIds(v) {   // 接收btn和字段 选中id
				let index = MFids.findIndex(item => item.parentId == v.parentId && item.type == v.type)
				if (index > -1) { // 如果 parentId 命中，则说明该菜单下的按钮或者字段已经 存在MFids中，则需要讲ids 全量替换
					MFids[index].ids = v.ids
				} else {
					MFids.push(v)
				}
				if (v.type == 'btn' && v.ids?.length > 0) {  // 如果是btn，则勾选上级菜单
					menuTree.value.setChecked(v.parentId, true, false)
				}
			}
			function cancel() {
				router.push('/configure/authManagement/roleManagement')
			}
			function getName(id) {
				let strArr = []
				let menu = menuList.find(item => item.menuId == id)
				if (menu) {
					strArr.unshift(menu.menuName)
					strArr.unshift(getName(menu.parentId))
				}
				return strArr.filter(item => item).join(' / ')
			}
			function commit() {
				Promise.all([dataScopeRef.value.validate(), formRef.value.validate()]).then(res => {
					let arr = [...treeIds, ...(MFids.map(item => item.ids).flat())]
					if (roleId) {
						changeRole(Object.assign({ roleId }, state.commitParams, { menuIds: arr }, {
							menuDs: state.commitParams.menuDs.map(item => {
								return {
									menuId: item.menuId,
									deptIds: item.deptIds,
									dataScope: item.dataScope
								}
							})
						})).then(res => {
							router.push({
								path: '/configure/authManagement/roleManagement'
							})
						})
					} else {
						addRole(Object.assign({}, state.commitParams, { menuIds: arr }, {
							menuDs: state.commitParams.menuDs.map(item => {
								return {
									menuId: item.menuId,
									deptIds: item.deptIds,
									dataScope: item.dataScope
								}
							})
						})).then(res => {
							router.push({
								path: '/configure/authManagement/roleManagement'
							})
						})
					}
				})
			}
			function setScope(data) {
				data.forEach(menu => {
					if (menu.checked ) {
						// 判断按钮选中，且不存在state.commitParams.menuDs中 则 添加
						if(state.commitParams.menuDs.every(item => item.menuId !==  menu.menuId)) setDataScope(menu)
					} else state.commitParams.menuDs = state.commitParams.menuDs.filter(item => item.menuId != menu.menuId)
				})
			}
			function setDataScope(data) {
				state.commitParams.menuDs.push({ // 显示数据范围设置
					title: getName(data.parentId) ? getName(data.parentId) + ' / ' + data.menuName : data.menuName,
					menuId: data.menuId,
					deptIds: [],
					dataScope: '',
					isChecked: false
				})
			}
			function handleMenuClick(data, status) {
				if (status) { // 选中
					treeIds.push(data.menuId)
					let list = fieldList.value.filter(field => field.parentId == data.menuId)
					if (list?.length > 0) {
						state.wordList.push({ // 显示字段
							parentTitle: getName(data.parentId),
							title: data.menuName,
							menuId: data.menuId,
							list: list
						})
					}
					if (data.dsFlag == 1) {
						setDataScope(data)
					}
				} else { // 不选中，则移除
					treeIds = treeIds.filter(item => item != data.menuId)
					state.wordList = state.wordList.filter(item => item.menuId != data.menuId)
					state.commitParams.menuDs = state.commitParams.menuDs.filter(item => item.menuId != data.menuId)
				}
				let node = menuTree.value.getNode(data.menuId)
				if (node.checked) { // 向上勾选
					node.parent.checked = true
				}
			}
			return {
				...toRefs(state),
				commit,
				cancel,
				handleMenuClick,
				menuTree,
				scopeList,
				btnList,
				fieldList,
				getIds,
				batchSetting,
				checkAll,
				rules,
				formRef,
				dataScopeRef,
				openDialog,
				setScope
			}
		}

	}
</script>

<style lang="scss" scoped>
	.box {
		background-color: #fff;
		.title {
			height: 55px;
			line-height: 55px;
			font-size: 16px;
			font-weight: 500;
			color: rgba(0, 0, 0, 0.85);
			padding: 0 30px;
			border-bottom: 1px #d9d9d9 solid;
		}
		.content {
			padding: 25px 30px 0;
		}
		.content-title {
			color: #1890ff;
			font-size: 16px;
		}
		.item-box {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
		}
		.last-content {
			margin-top: 15px;
			height: 490px;
			overflow: auto;
			padding-right: 15px;
		}
		.last-top {
			display: flex;
			justify-content: space-between;
			margin-bottom: 15px;
		}

		.left-content {
			:deep(.el-tree-node__content) {
				height: auto;
				align-items: flex-start;
				.el-checkbox {
					bottom: 2px;
				}
			}
		}
		.mid-content {
			padding: 0 30px;
		}
		.right-content {
			padding: 0 30px;
		}
		.grey-box {
			padding: 20px 25px 1px;
			background-color: #fafafa;
			margin-bottom: 15px;
		}
	}
	.my-select {
		:deep(.el-select) {
			width: 100% !important;
		}
	}
	.box + .box {
		margin-top: 25px;
	}
	.footer {
		text-align: right;
		padding-right: 25px;
	}
</style>
