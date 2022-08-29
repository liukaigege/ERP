<template>
	<div class="headQuotationSetting">
		<!-- 头部 -->
		<div class="box">
			<erpNav title="权限设置" routeOpt="/goods/ruleSettings/categoryManagement/index" />
		</div>
		<!-- 内容 -->
		<div class="content">
			<el-row :gutter="20">
				<!-- 左侧 -->
				<el-col :span="11">
					<div class="catagroyClass">
						<el-tabs style="padding:20px 0 0 20px">
							<el-tab-pane label="品类" name="catagory">
							</el-tab-pane>
						</el-tabs>
						<div class="treeClass">
							<el-tree class="disable-item" highlight-current :expand-on-click-node="false" default-expand-all :data="categoryList" :props="defaultCategory" check-strictly @node-click="handleCategory" />
						</div>
					</div>
				</el-col>
				<!-- 右侧 -->
				<el-col :span="13">
					<div class="rightClass">
						<el-tabs v-model="activedPartement" @tab-click="handleClick">
							<!-- 按部门 -->
							<el-tab-pane label="按部门" name='1'>
								<span>
									<el-input placeholder="请输入部门名称" v-model="keywordDepartment" style="width:90%" />
								</span>
								<span class="buttonClass" @click="search">
									搜索
								</span>
								<div style="height:580px;overflow: auto;padding-bottom:24px">
									<div style="margin:16px 0 14px 24px" v-if="dataDepartment&&dataDepartment.length">
										<el-checkbox v-model="checked1" class="checkboxClass" label="部门名称" @change="checkedAll" :indeterminate="isIndeterminate"></el-checkbox>
									</div>
									<div class="treeRightClass">
										<el-tree show-checkbox :data="dataDepartment" :node-key="defaultProps.value" check-on-click-node :props="defaultProps" default-expand-all check-strictly @check-change="handleDepartmentClick" ref="treeDepartment">
										</el-tree>
									</div>
								</div>

							</el-tab-pane>
							<el-tab-pane label="按员工" name='2'>
								<span>
									<el-input placeholder="请输入部门名称或员工姓名" v-model="keywordUser" style="width:90%" />
								</span>
								<span class="buttonClass" @click="searchUser">
									搜索
								</span>
								<div style="height:580px;overflow: auto;padding-bottom:24px">
									<div class="treeRightClass">
										<el-tree show-checkbox :data="userDate" :node-key="defaultPropsUser.value" :props="defaultPropsUser" default-expand-all @check-change="handleUserClick" ref="tree">
										</el-tree>
									</div>
								</div>
							</el-tab-pane>
						</el-tabs>
					</div>
				</el-col>
			</el-row>
		</div>
		<!-- 底部 -->
		<div class="flex-pagination page-fixed">
			<div></div>
			<div>
				<el-button  @click="back">取消</el-button>
				<el-button type="primary"  @click="submit">确定</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import erpNav from '@/components/erpNav/index.vue'
	import { nextTick, onMounted, reactive, toRefs, watch } from 'vue'
	import { useRouter } from 'vue-router'
	import { toTree, deepCopy, treeToArr } from '@/utils/tool.js'
	import {
		shopUserList, //查询品类列表
	} from '@/api/goods/shop.js'
	import {
		getDepartment, //查询部门信息列表
	} from '@/api/user.js'
	import {
		selectCategory, //查询品类列表
		categoryConfig //品类设置
	} from '@/api/goods/rules.js'
	import { ElMessage } from 'element-plus'
	export default {
		name: 'limitSetting',
		components: {
			erpNav
		},
		setup() {
			const router = useRouter()
			const state = reactive({
				actived: '0',
				activedPartement: '1',
				checked1: false,
				treeLength: 0,
				isIndeterminate: false,//复选框选择状态
				tree: null,
				treeDepartment: null,
				orgAllList: [], //
				keywordDepartment: '', //按部门的关键词
				keywordUser: '', //按员工的关键词
				categoryList: [], //品类的下拉数据
				dataDepartment: [], //部门数据
				userDate: [], //员工数据
				defaultPartment: [], //默认部门的回显
				defaultUser: [], //员工的回显
				defaultProps: {
					value: 'deptId', // ID字段名
					children: 'children',
					label: 'deptName',

				},
				defaultPropsUser: { //员工
					value: 'deptId', // ID字段名
					children: 'children',
					label: 'deptName',
				},
				defaultCategory: {
					value: 'id', // ID字段名
					children: 'children',
					label: 'name',
					disabled: 'disabled'

				},
				categoryId: [], //存储品类的id
				departmentId: [], //部门或者员工的id集合
			})
			onMounted(() => {
				initDepartment()
				initUser()
			})
			//搜索时候
			function search() {
				initDepartment()
				state.treeDepartment.setCheckedKeys(obj.goodsDeptIdList) //处理可选择的方法
			}
			function searchUser() {
				initUser()
				state.tree.setCheckedKeys(obj.goodsUserIdList.map(item => item+ 'user')) //处理可选择的方法
			}
			//部门的接口
			function initDepartment() {
				getDepartment({ keyword: state.keywordDepartment }).then(res => {
					state.treeLength = [...treeToArr(res.data, 'children', true)].length
					state.dataDepartment = res.data
				})
			}
			//员工的接口
			function initUser() {
				shopUserList({ keyword: state.keywordUser ? state.keywordUser : 'back' }).then(res => {
					loop(res.data)
					state.userDate = res.data
          console.log(state.userDate);
				})
			}

			//处理员工接口数据
			function loop(data) {
				data.forEach(item => {
					if (item.children && item.children.length) loop(item.children)
					let arr = []
					if (item.userVos && item.userVos.length) {
						item.userVos.forEach(val => {
							arr.push({ deptId: val.userId + 'user', deptName: val.fullName })  // user 为了避免和部门id 重复
						})
					}
					item.children = arr.concat(item.children)
				})

			}
			//1.右边的框员工选择事件
			function handleUserClick(data, checkd) {
				if (!obj.goodsUserIdList) return
				if (checkd && !data.children) {
          if(!obj.goodsUserIdList.includes(data.deptId.split('user')[0])) {
            	obj.goodsUserIdList.push(data.deptId.split('user')[0])
          }
				} else if (!checkd && !data.children) {
					obj.goodsUserIdList = obj.goodsUserIdList.filter(item => item != data.deptId.split('user')[0])
				}
			}
			//1.1右边的部门选择事件
			function handleDepartmentClick(data, checkd) {
				let checkeds = state.treeDepartment.getCheckedNodes()
				checkeds = checkeds.map(item => item.deptId)
				state.checked1 = state.treeLength == checkeds.length;
				state.isIndeterminate = checkeds.length > 0 && checkeds.length < state.treeLength
				if (!obj.goodsDeptIdList) return
				if (checkd && !obj.goodsDeptIdList.includes(data.deptId)) {
					obj.goodsDeptIdList.push(data.deptId)
				} else if(!checkd) {
					obj.goodsDeptIdList = obj.goodsDeptIdList.filter(item => item != data.deptId)
				}
			}
			//2.全选按钮
			function checkedAll() {
				state.departmentId = []
				if (state.checked1) {
					loop(state.dataDepartment)
					function loop(data) {
						data.forEach(item => {
							state.departmentId.push(item.deptId)
							if (item.children && item.children.length) {
								loop(item.children)
							}
						})
					}
					state.treeDepartment.setCheckedKeys(state.departmentId)
				} else {
					state.departmentId = []
					state.treeDepartment.setCheckedKeys([])
				}
				obj.goodsDeptIdList = state.departmentId
				// console.log(state.departmentId, 'state.departmentId');
			}
			//3.品类的接口
			selectCategory().then(res => {
				res.data = res.data.filter(item => item.status === 1)
				state.categoryList = toTree(res.data, 'id')
				//处理子类可选
				loopcatagoryList(state.categoryList)

				function loopcatagoryList(data) {
					data.forEach(item => {
						if (item.children.length > 0) {
							item.disabled = true
						}
						if (item.children && item.children.length) {
							loopcatagoryList(item.children)
						}
					})
				}
				console.log(state.categoryList, 'state.categoryList');
			})
			let obj = {}
			//3.1品类选择时候事件
			function handleCategory(data) {
				if (data.disabled) return
				obj = data
				if (data.goodsDeptIdList?.length) {
					state.activedPartement = '1'
					state.defaultPartment = data.goodsDeptIdList
					state.treeDepartment.setCheckedKeys(data.goodsDeptIdList) //处理可选择的方法
					state.tree.setCheckedKeys([])
				} else if (data.goodsUserIdList?.length) {
					state.activedPartement = '2'
					state.defaultUser = data.goodsUserIdList
					state.tree.setCheckedKeys(data.goodsUserIdList?.map(item=> item+ 'user')) //处理可选择的方法
					state.treeDepartment.setCheckedKeys([])
				} else {
					//如果两个都没有值得情况
					state.treeDepartment.setCheckedKeys([])
					state.tree.setCheckedKeys([])
				}
			}
			//退回到首页
			function back() {
				router.push({
					path: '/goods/ruleSettings/categoryManagement/index'
				})
			}
			//tabs切换清空事件
			function handleClick(tab, event) {
				state.departmentId = []
				state.keywordDepartment = ''
				state.keywordUser = ''
				state.checked1 = false
				console.log(state.activedPartement, '');
				if (state.activedPartement === '1') { // 部门
					state.tree.setCheckedKeys([])
				} else {
					state.treeDepartment.setCheckedKeys([])
				}
			}
			//确定提交事件
			function submit() {
				//1.查找子级品类
				let checkArr = []
				loopcatagoryCheck(state.categoryList)

				function loopcatagoryCheck(data) {
					data.forEach(item => {
						if (!item.children.length > 0) {
							checkArr.push(item)
						}
						if (item.children && item.children.length) {
							loopcatagoryCheck(item.children)
						}
					})
				}
				//2.校验没有填的
				let flag = checkArr.some(item => {
					if (!(item.goodsDeptIdList?.length > 0 || item.goodsUserIdList?.length > 0)) {
						ElMessage.error(`请设置${item.name}的权限`)
						return true
					} else {

					}
				})
				if (flag) return
				//封装参数
				let subArr = checkArr.map(item => {
					return {
						idList: [item.id],
						type: 3,
						rightType: item.goodsDeptIdList?.length > 0 ? 1 : 2,
						rightIdList: item.goodsDeptIdList?.length > 0 ? item.goodsDeptIdList : item.goodsUserIdList
					}
				})
				categoryConfig({ configList: subArr }).then(res => {
					ElMessage.success('设置成功，品类权限变更，请及时更新报价设置')
					setTimeout(function () {
						router.push({ name: 'categoryManagement' })
					}, 1000)
				})
			}
			return {
				...toRefs(state),
				handleUserClick, //员工
				handleDepartmentClick, //部门
				checkedAll,
				search,
				back,
				searchUser,
				handleCategory,
				submit,
				handleClick
			}
		}
	}
</script>

<style scoped>
	.disable-item >>> [aria-disabled='true'] > .el-tree-node__content {
		cursor: not-allowed;
		background: #fff !important;
	}
</style><style lang="scss" scoped>
	.headQuotationSetting {
		.box {
			:deep(.el-tabs__nav-wrap::after) {
				display: none;
			}
		}

		padding-top: 20px;
		// :deep([aria-disabled="true"]>.el-tree-node__content) {
		//     // pointer-events: none;
		//     cursor: not-allowed;
		//     background: #fff !important;

		// }

		.headtabs {
			:deep(.el-tabs__item) {
				font-size: 16px;
			}
		}

		.content {
			.catagroyClass {
				height: 700px;
				overflow: auto;
				background: #fff;
				// border: 1px solid #eee;
				padding-bottom: 24px;
				margin-bottom: 50px;
				:deep(.el-tabs__item) {
					font-size: 16px;
				}
			}

			.rightClass {
				height: 700px;
				background: #fff;
				// border: 1px solid #eee;
				padding: 20px 0px 34px 24px;
				margin-bottom: 50px;

				:deep(.el-tabs__item) {
					font-size: 16px;
				}
				.checkboxClass {
					:deep(.el-checkbox__label) {
						font-weight: 600;
					}
				}
			}

			p {
				padding: 20px 24px;
				font-size: 16px;
				font-weight: 500;
			}

			.treeClass {
				padding: 0 24px 34px 24px;
			}

			.treeRightClass {
				padding: 0px 0px 34px 0px;
			}

			:deep(.el-input__inner) {
				height: 32px;
			}

			.buttonClass {
				width: 70px;
				height: 28px;
				background: #1890ff;
				color: #fff;
				padding: 6px 14px;
				border-radius: 3px;
				cursor: pointer;
			}
		}
	}
</style>
